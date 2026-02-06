import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddButton from 'components/AddButton/AddButton';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import {
  getJourneyPatternNames,
  JourneyPatternNameValidationError,
  validateJourneyPatternName as validateJourneyPatternNameUtil,
} from 'validation';
import useUniqueKeys from 'hooks/useUniqueKeys';
import JourneyPattern, { initJourneyPattern } from 'model/JourneyPattern';
import { ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import './styles.scss';
import StopPoint from '../../model/StopPoint';
import { createUuid } from '../../helpers/generators';
import NewJourneyPatternModal from './NewJourneyPatternModal';

type Props = {
  journeyPatterns: JourneyPattern[];
  onChange: (journeyPatterns: JourneyPattern[]) => void;
  children: (
    journeyPattern: JourneyPattern,
    validateJourneyPatternName: (
      newJourneyPatternName: string | null,
    ) => JourneyPatternNameValidationError,
    handleUpdate: (journeyPattern: JourneyPattern) => void,
    handleCopy: (jpName: string) => void,
    handleDelete?: () => void,
  ) => ReactElement;
};

// Re-export for backwards compatibility
export type { JourneyPatternNameValidationError } from 'validation';

const JourneyPatterns = ({ journeyPatterns, onChange, children }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  const keys = useUniqueKeys(journeyPatterns);

  const updateJourneyPattern = (index: number) => {
    return (journeyPattern: JourneyPattern) => {
      onChange(replaceElement(journeyPatterns, index, journeyPattern));
    };
  };

  const deleteJourneyPattern = (index: number) => {
    return () => {
      if (journeyPatterns.length > 1) {
        onChange(removeElementByIndex(journeyPatterns, index));
      }
    };
  };

  const addNewJourneyPattern = (name: string) => {
    const newJourneyPatterns = [
      ...journeyPatterns,
      {
        ...initJourneyPattern(),
        name,
      },
    ];
    onChange(newJourneyPatterns);
    setShowModal(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100,
    );
  };

  const copyJourneyPattern = (
    journeyPatterns: JourneyPattern[],
    journeyPatternIndex: number,
    name: string,
  ) => {
    const journeyPatternToCopy = journeyPatterns[journeyPatternIndex];
    const newJourneyPattern: JourneyPattern = {
      ...journeyPatternToCopy,
      id: undefined,
      name: name,
    };
    newJourneyPattern.pointsInSequence =
      journeyPatternToCopy.pointsInSequence.map((point: StopPoint) => ({
        ...point,
        id: undefined,
        key: createUuid(),
      }));
    newJourneyPattern.serviceJourneys = [
      {
        id: `new_${createUuid()}`,
        passingTimes: journeyPatternToCopy.pointsInSequence.map((_) => ({})),
      },
    ];
    const newJourneyPatterns: JourneyPattern[] = [
      ...journeyPatterns,
      newJourneyPattern,
    ];
    onChange(newJourneyPatterns);
  };

  const validateJourneyPatternName = (
    newJourneyPatternName: string | null,
  ): JourneyPatternNameValidationError => {
    return validateJourneyPatternNameUtil(
      newJourneyPatternName,
      getJourneyPatternNames(journeyPatterns),
      formatMessage({ id: 'nameIsRequired' }),
      formatMessage({ id: 'journeyPatternDuplicateNameValidationError' }),
    );
  };

  return (
    <>
      <NewJourneyPatternModal
        open={showModal}
        onSave={addNewJourneyPattern}
        onDismiss={() => setShowModal(false)}
        validateJourneyPatternName={validateJourneyPatternName}
      />

      <div className="journey-patterns-editor">
        <Typography variant="h1">
          {formatMessage({ id: 'editorJourneyPatternsTabLabel' })}
        </Typography>
        <Typography variant="body1">
          {formatMessage({ id: 'editorFillInformation' })}
        </Typography>
        {journeyPatterns.length === 1 ? (
          children(
            journeyPatterns[0],
            validateJourneyPatternName,
            updateJourneyPattern(0),
            (name: string) => copyJourneyPattern(journeyPatterns, 0, name),
            undefined,
          )
        ) : (
          <>
            {journeyPatterns.map((jp: JourneyPattern, index: number) => (
              <Accordion
                key={jp.id ?? keys[index]}
                defaultExpanded={!jp.id || index === journeyPatterns.length - 1}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {jp.name}
                </AccordionSummary>
                <AccordionDetails>
                  {children(
                    jp,
                    validateJourneyPatternName,
                    updateJourneyPattern(index),
                    (name: string) =>
                      copyJourneyPattern(journeyPatterns, index, name),
                    deleteJourneyPattern(index),
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}

        <AddButton
          onClick={() => setShowModal(true)}
          buttonTitle={formatMessage({ id: 'editorAddJourneyPatterns' })}
        />
      </div>
    </>
  );
};

export default JourneyPatterns;
