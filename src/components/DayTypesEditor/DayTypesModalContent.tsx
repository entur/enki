import { SecondaryButton } from '@entur/button';
import { Pagination } from '@entur/menu';
import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import DayType, { createNewDayType } from 'model/DayType';
import React, { useCallback } from 'react';
import { DayTypeEditor } from './DayTypeEditor';
import { DayTypesTableExpRow } from './DayTypesTableExpRow';
import { usePreparedDayTypes } from './usePreparedDayTypes';
import { useServiceJourneysPerDayType } from './useServiceJourneysPerDayType';

export const DayTypesModalContent = ({ dayTypes }: { dayTypes: DayType[] }) => {
  const [currentPage, setPage] = React.useState(1);
  const [results, setResults] = React.useState(10);
  const [newDayType, setNewDayType] = React.useState<DayType | null>(null);

  const numberOfResults = dayTypes.length;
  const pageCount = Math.ceil(numberOfResults / results);

  const addNewDayType = useCallback(() => {
    setNewDayType(createNewDayType());
  }, []);

  const preparedDayTypes = usePreparedDayTypes(dayTypes, currentPage, results);
  const serviceJourneysPerDayType =
    useServiceJourneysPerDayType(preparedDayTypes);

  return (
    <>
      <div className="day-types-modal_new-day-type-button">
        <SecondaryButton onClick={() => addNewDayType()}>
          New day type
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
            <HeaderCell>Id</HeaderCell>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Used by # service journeys</HeaderCell>
            <HeaderCell padding="radio">{''}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newDayType && (
            <DayTypesTableExpRow
              dayType={newDayType}
              key="_new"
              numberOfServiceJourneys={0}
            >
              <DayTypeEditor
                onSave={() => setNewDayType(null)}
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
              <DayTypeEditor onSave={() => {}} dayType={dayType} />
            </DayTypesTableExpRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
