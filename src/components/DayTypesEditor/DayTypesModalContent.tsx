import { useMutation } from '@apollo/client/react';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { DELETE_DAY_TYPES } from 'api/uttu/mutations';
import DayType, { createNewDayType } from 'model/DayType';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { DayTypeEditor } from './DayTypeEditor';
import { DayTypesTableExpRow } from './DayTypesTableExpRow';
import { usePreparedDayTypes } from './usePreparedDayTypes';
import { useServiceJourneysPerDayType } from './useServiceJourneysPerDayType';

type DayTypeFetchError = {
  title: string;
  message: string;
};

export const DayTypesModalContent = ({
  dayTypes,
  refetchDayTypes,
}: {
  dayTypes: DayType[];
  refetchDayTypes: Function;
}) => {
  const [currentPage, setPage] = React.useState(1);
  const [results, setResults] = React.useState(10);
  const [newDayType, setNewDayType] = React.useState<DayType | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<DayTypeFetchError | null>(null);

  const addSelectedId = (id: string) => {
    setSelectedIds((old) => [...old, id]);
  };

  const removeSelectedId = (id: string) => {
    setSelectedIds((old) => old.filter((v) => v !== id));
  };

  const numberOfResults = useMemo(() => dayTypes.length, [dayTypes.length]);
  const pageCount = useMemo(
    () => Math.ceil(numberOfResults / results),
    [numberOfResults, results],
  );

  const addNewDayType = useCallback(() => {
    setNewDayType(createNewDayType());
  }, []);

  const preparedDayTypes = usePreparedDayTypes(dayTypes, currentPage, results);
  const serviceJourneysPerDayType =
    useServiceJourneysPerDayType(preparedDayTypes);

  const { formatMessage } = useIntl();

  const [deleteDayTypes] = useMutation(DELETE_DAY_TYPES, {
    onCompleted: () => refetchDayTypes(),
    onError: (e) =>
      setError({
        title: formatMessage({ id: 'deleteDayTypesErrorTitle' }),
        message: e.message,
      }),
  });

  const onDeleteDayTypes = useCallback(
    async (ids: string[]) => {
      setLoading(true);
      setError(null);
      await deleteDayTypes({
        variables: {
          ids: ids,
        },
      });
      setSelectedIds([]);
      setLoading(false);
    },
    [deleteDayTypes],
  );

  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          <strong>{error.title}</strong> {error.message}
        </Alert>
      )}
      <div className="day-types-modal_new-day-type-button">
        <ButtonGroup>
          <Button variant="outlined" onClick={() => addNewDayType()}>
            {formatMessage({ id: 'dayTypesModalAddNewButtonLabel' })}
          </Button>
          <Button
            variant="outlined"
            disabled={loading || selectedIds.length === 0}
            onClick={() => onDeleteDayTypes(selectedIds)}
          >
            {formatMessage({ id: 'deleteSelectedDayTypesButtonLabel' })}
          </Button>
        </ButtonGroup>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(_event, page) => setPage(page)}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < preparedDayTypes.length
                }
                checked={selectedIds.length > 0}
                onChange={() =>
                  selectedIds.length > 0
                    ? setSelectedIds([])
                    : setSelectedIds(preparedDayTypes.map((dt) => dt.id!))
                }
              />
            </TableCell>
            <TableCell padding="checkbox">{''}</TableCell>
            <TableCell>
              {formatMessage({ id: 'dayTypesModalIdHeader' })}
            </TableCell>
            <TableCell>
              {formatMessage({ id: 'dayTypesModalNameHeader' })}
            </TableCell>
            <TableCell>
              {formatMessage({ id: 'dayTypesModalUsedByHeader' })}
            </TableCell>
            <TableCell padding="checkbox">{''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newDayType && (
            <DayTypesTableExpRow
              selected={false}
              onSelect={() => {}}
              dayType={newDayType}
              key="_new"
              numberOfServiceJourneys={0}
              openInitial
            >
              <DayTypeEditor
                refetchDayTypes={() => {
                  refetchDayTypes();
                  setNewDayType(null);
                }}
                canDelete
                dayType={newDayType}
              />
            </DayTypesTableExpRow>
          )}
          {preparedDayTypes?.map((dayType: DayType) => (
            <DayTypesTableExpRow
              dayType={dayType}
              selected={selectedIds.includes(dayType.id!)}
              onSelect={(selected) =>
                selected
                  ? addSelectedId(dayType.id!)
                  : removeSelectedId(dayType.id!)
              }
              key={dayType.id}
              numberOfServiceJourneys={serviceJourneysPerDayType[dayType.id!]}
            >
              <DayTypeEditor
                refetchDayTypes={refetchDayTypes}
                canDelete={serviceJourneysPerDayType[dayType.id!] === 0}
                dayType={dayType}
              />
            </DayTypesTableExpRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
