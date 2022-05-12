import { SecondaryButton } from '@entur/button';
import { Pagination } from '@entur/menu';
import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { selectIntl } from 'i18n';
import DayType, { createNewDayType } from 'model/DayType';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DayTypeEditor } from './DayTypeEditor';
import { DayTypesTableExpRow } from './DayTypesTableExpRow';
import { usePreparedDayTypes } from './usePreparedDayTypes';
import { useServiceJourneysPerDayType } from './useServiceJourneysPerDayType';

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

  return (
    <>
      <div className="day-types-modal_new-day-type-button">
        <SecondaryButton onClick={() => addNewDayType()}>
          {formatMessage('dayTypesModalAddNewButtonLabel')}
        </SecondaryButton>
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
