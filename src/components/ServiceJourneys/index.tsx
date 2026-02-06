import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddButton from 'components/AddButton/AddButton';
import {
  changeElementAtIndex,
  removeElementByIndex,
  replaceElement,
} from 'helpers/arrays';
import { createUuid } from 'helpers/generators';
import { isBefore } from 'validation';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern from 'model/JourneyPattern';
import ServiceJourney from 'model/ServiceJourney';
import StopPoint from 'model/StopPoint';
import { Fragment, ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import BulkDeleteDialog from './BulkDeleteDialog';
import NewServiceJourneyDialog from './NewServiceJourneyDialog';
import Box from '@mui/material/Box';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    serviceJourney: ServiceJourney,
    stopPoints: StopPoint[],
    handleUpdate: (serviceJourney: ServiceJourney) => void,
    handleDelete?: () => void,
    handleCopy?: (newServiceJourneys: ServiceJourney[]) => void,
  ) => ReactElement;
};

type Sortable = {
  sj: ServiceJourney;
  render: any;
};

export const sortByDepartureTime = (sortable: Sortable[]): Sortable[] => {
  return sortable
    .slice()
    .sort((a, b) =>
      isBefore(
        a.sj.passingTimes[0].departureTime ||
          a.sj.passingTimes[0].earliestDepartureTime!,
        a.sj.passingTimes[0].departureDayOffset ||
          a.sj.passingTimes[0].earliestDepartureDayOffset!,
        b.sj.passingTimes[0].departureTime ||
          b.sj.passingTimes[0].earliestDepartureTime!,
        b.sj.passingTimes[0].departureDayOffset ||
          b.sj.passingTimes[0].earliestDepartureDayOffset!,
      )
        ? -1
        : 1,
    );
};

export default ({ journeyPatterns, onChange, children }: Props) => {
  const [showNewServiceJourneyDialog, setShowNewServiceJourneyDialog] =
    useState<boolean>(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<number>(-1);
  const { formatMessage } = useIntl();

  const [selectedJourneyPatternIndex, setSelectedJourneyPatternIndex] =
    useState<number>(0);

  const keys = useUniqueKeys(journeyPatterns);

  const updateServiceJourney = (
    index: number,
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number,
  ) => {
    return (serviceJourney: ServiceJourney) => {
      onChange(
        changeElementAtIndex(
          journeyPatterns,
          {
            ...journeyPatterns[journeyPatternIndex],
            serviceJourneys: replaceElement(
              serviceJourneys,
              index,
              serviceJourney,
            ),
          },
          journeyPatternIndex,
        ),
      );
    };
  };

  const deleteServiceJourney = (
    index: number,
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number,
  ) => {
    return () => {
      if (serviceJourneys.length > 1) {
        onChange(
          changeElementAtIndex(
            journeyPatterns,
            {
              ...journeyPatterns[journeyPatternIndex],
              serviceJourneys: removeElementByIndex(serviceJourneys, index),
            },
            journeyPatternIndex,
          ),
        );
      }
    };
  };

  const bulkDeleteServiceJourneys = (
    ids: string[],
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number,
  ) => {
    if (serviceJourneys.length > 1) {
      setShowBulkDeleteDialog(-1);
      onChange(
        changeElementAtIndex(
          journeyPatterns,
          {
            ...journeyPatterns[journeyPatternIndex],
            serviceJourneys: serviceJourneys.filter(
              (sj) => !ids.includes(sj.id!),
            ),
          },
          journeyPatternIndex,
        ),
      );
    }
  };

  const addNewServiceJourney = (
    name: string,
    serviceJourneys: ServiceJourney[],
    stopPoints: StopPoint[],
    journeyPatternIndex: number,
  ) => {
    const newServiceJourneys = [
      ...serviceJourneys,
      {
        id: `new_${createUuid()}`,
        name,
        passingTimes: stopPoints.map((_) => ({})),
      },
    ];
    onChange(
      changeElementAtIndex(
        journeyPatterns,
        {
          ...journeyPatterns[journeyPatternIndex],
          serviceJourneys: newServiceJourneys,
        },
        journeyPatternIndex,
      ),
    );
    setShowNewServiceJourneyDialog(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100,
    );
  };

  const copyServiceJourney = (
    serviceJourneys: ServiceJourney[],
    journeyPatternIndex: number,
  ) => {
    return (newServiceJourneys: ServiceJourney[]) => {
      onChange(
        changeElementAtIndex(
          journeyPatterns,
          {
            ...journeyPatterns[journeyPatternIndex],
            serviceJourneys: serviceJourneys.concat(newServiceJourneys),
          },
          journeyPatternIndex,
        ),
      );
    };
  };

  const renderServiceJourneys = (jp: JourneyPattern, jpIndex: number) => {
    const mappedServiceJourneys = jp.serviceJourneys.map((sj, sjIndex) => ({
      sj,
      render: () => (
        <Accordion
          key={keys[jpIndex] + sjIndex}
          defaultExpanded={
            jpIndex === selectedJourneyPatternIndex &&
            (!sj.id || sjIndex === jp.serviceJourneys.length - 1)
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {sj.name}
          </AccordionSummary>
          <AccordionDetails>
            {children(
              sj,
              journeyPatterns[jpIndex].pointsInSequence,
              updateServiceJourney(
                sjIndex,
                journeyPatterns[jpIndex].serviceJourneys,
                jpIndex,
              ),
              jp.serviceJourneys.length > 1
                ? deleteServiceJourney(
                    sjIndex,
                    journeyPatterns[jpIndex].serviceJourneys,
                    jpIndex,
                  )
                : undefined,
              sj.id
                ? copyServiceJourney(
                    journeyPatterns[jpIndex].serviceJourneys,
                    jpIndex,
                  )
                : undefined,
            )}
          </AccordionDetails>
        </Accordion>
      ),
    }));

    return sortByDepartureTime(mappedServiceJourneys).map((mapped) =>
      mapped.render(),
    );
  };

  return (
    <>
      <NewServiceJourneyDialog
        open={showNewServiceJourneyDialog}
        setOpen={setShowNewServiceJourneyDialog}
        journeyPatterns={journeyPatterns}
        keys={keys}
        selectedJourneyPatternIndex={selectedJourneyPatternIndex}
        setSelectedJourneyPatternIndex={setSelectedJourneyPatternIndex}
        addNewServiceJourney={addNewServiceJourney}
      />

      {showBulkDeleteDialog > -1 && (
        <BulkDeleteDialog
          open={showBulkDeleteDialog > -1}
          dismiss={() => setShowBulkDeleteDialog(-1)}
          serviceJourneys={
            journeyPatterns[showBulkDeleteDialog].serviceJourneys
          }
          journeyPatternIndex={showBulkDeleteDialog}
          onConfirm={bulkDeleteServiceJourneys}
        />
      )}

      <Box>
        <Typography variant="h1">
          {formatMessage({ id: 'editorServiceJourneys' })}
        </Typography>
        <Typography variant="body1">
          {formatMessage({ id: 'serviceJourneysInfo' })}
        </Typography>
        {journeyPatterns.length === 1 &&
        journeyPatterns.flatMap((jp) => jp.serviceJourneys).length === 1
          ? children(
              journeyPatterns[0].serviceJourneys[0],
              journeyPatterns[0].pointsInSequence,
              updateServiceJourney(0, journeyPatterns[0].serviceJourneys, 0),
              undefined,
              copyServiceJourney(journeyPatterns[0].serviceJourneys, 0),
            )
          : journeyPatterns.map((jp, jpIndex) => (
              <Fragment key={keys[jpIndex]}>
                {jpIndex > 0 && <Divider sx={{ my: 3 }} />}
                <ServiceJourneyPerJourneyPatternWrapper>
                  {journeyPatterns.length > 1 && (
                    <Typography variant="h3">{jp.name}</Typography>
                  )}
                  {jp.serviceJourneys.length > 1 && (
                    <ServiceJourneyBulkDeleteHeader>
                      <Button
                        variant="text"
                        onClick={() => setShowBulkDeleteDialog(jpIndex)}
                      >
                        {formatMessage({
                          id: 'openBulkDeleteDialogButtonLabel',
                        })}
                      </Button>
                    </ServiceJourneyBulkDeleteHeader>
                  )}
                </ServiceJourneyPerJourneyPatternWrapper>
                {renderServiceJourneys(jp, jpIndex)}
              </Fragment>
            ))}
        <AddButton
          onClick={() => setShowNewServiceJourneyDialog(true)}
          buttonTitle={formatMessage({ id: 'editorAddServiceJourneys' })}
        />
      </Box>
    </>
  );
};

const ServiceJourneyPerJourneyPatternWrapper = ({ children }: any) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2,
    }}
  >
    {children}
  </Box>
);

const ServiceJourneyBulkDeleteHeader = ({ children }: any) => (
  <Box sx={{ alignContent: 'flex-end' }}>{children}</Box>
);
