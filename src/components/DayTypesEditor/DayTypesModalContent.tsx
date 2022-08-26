import { useMutation } from '@apollo/client';
import { BannerAlertBox } from '@entur/alert';
import { ButtonGroup, SecondaryButton } from '@entur/button';
import { Checkbox } from '@entur/form';
import { Pagination } from '@entur/menu';
import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { DELETE_DAY_TYPES } from 'api/uttu/mutations';
import { selectIntl } from 'i18n';
import DayType, { createNewDayType } from 'model/DayType';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
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

  const numberOfResults = useMemo(() => dayTypes.length, [dayTypes.length]);
  const pageCount = useMemo(
    () => Math.ceil(numberOfResults / results),
    [numberOfResults, results]
  );

  const addNewDayType = useCallback(() => {
    setNewDayType(createNewDayType());
  }, []);

  const preparedDayTypes = usePreparedDayTypes(dayTypes, currentPage, results);
  const serviceJourneysPerDayType =
    useServiceJourneysPerDayType(preparedDayTypes);

  const { formatMessage } = useSelector(selectIntl);

  const [deleteDayTypes] = useMutation(DELETE_DAY_TYPES, {
    onCompleted: () => refetchDayTypes(),
    onError: (e) =>
      setError({
        title: formatMessage('deleteDayTypesErrorTitle'),
        message: e.message,
      }),
  });

  const onDeleteDayTypes = useCallback(
    async (ids) => {
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
    [deleteDayTypes]
  );

  return (
    <>
      {error && (
        <BannerAlertBox
          title={error.title}
          variant="error"
          closable
          onClose={() => setError(null)}
        >
          {error.message}
        </BannerAlertBox>
      )}
      <div className="day-types-modal_new-day-type-button">
        <ButtonGroup>
          <SecondaryButton onClick={() => addNewDayType()}>
            {formatMessage('dayTypesModalAddNewButtonLabel')}
          </SecondaryButton>
          <SecondaryButton
            loading={loading}
            disabled={selectedIds.length === 0}
            onClick={() => onDeleteDayTypes(selectedIds)}
          >
            {formatMessage('deleteSelectedDayTypesButtonLabel')}
          </SecondaryButton>
        </ButtonGroup>
      </div>
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={(page) => setPage(page)}
        resultsPerPage={results}
        numberOfResults={numberOfResults}
        onResultsPerPageChange={(e) => setResults(e)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell padding="checkbox">
              <Checkbox
                name="all"
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length < preparedDayTypes.length
                    ? 'indeterminate'
                    : selectedIds.length > 0
                }
                onChange={() =>
                  selectedIds.length > 0
                    ? setSelectedIds([])
                    : setSelectedIds(preparedDayTypes.map((dt) => dt.id!))
                }
              />
            </HeaderCell>
            <HeaderCell padding="radio">{''}</HeaderCell>
            <HeaderCell>{formatMessage('dayTypesModalIdHeader')}</HeaderCell>
            <HeaderCell>{formatMessage('dayTypesModalNameHeader')}</HeaderCell>
            <HeaderCell>
              {formatMessage('dayTypesModalUsedByHeader')}
            </HeaderCell>
            <HeaderCell padding="radio">{''}</HeaderCell>
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
                  ? setSelectedIds((old) => [...old, dayType.id!])
                  : setSelectedIds((old) => [
                      ...old.filter((id) => id !== dayType.id!),
                    ])
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
