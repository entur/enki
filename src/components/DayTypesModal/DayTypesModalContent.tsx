import { ButtonGroup, SecondaryButton } from '@entur/button';
import { Pagination } from '@entur/menu';
import {
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import DayType, { createNewDayType } from 'model/DayType';
import React, { useCallback, useMemo } from 'react';
import { DayTypeEditor } from './DayTypeEditor';
import { DayTypesTableExpRow } from './DayTypesTableExpRow';

export const DayTypesModalContent = ({ dayTypes }: { dayTypes: DayType[] }) => {
  const [currentPage, setPage] = React.useState(1);
  const [results, setResults] = React.useState(10);
  const [newDayType, setNewDayType] = React.useState<DayType | null>(null);

  const numberOfResults = dayTypes.length;
  const pageCount = Math.ceil(numberOfResults / results);

  const addNewDayType = useCallback(() => {
    setNewDayType(createNewDayType());
  }, []);

  const processed = useMemo<DayType[]>(() => {
    console.log('process');
    return [...dayTypes]
      ?.sort((a, b) => {
        if (new Date(a.changed!).getTime() > new Date(b.changed!).getTime()) {
          return -1;
        } else if (
          new Date(a.changed!).getTime() < new Date(b.changed!).getTime()
        ) {
          return 1;
        } else {
          return 0;
        }
      })
      ?.filter(
        (_, index) =>
          index + 1 >= (currentPage - 1) * results + 1 &&
          index + 1 <= currentPage * results
      );
  }, [dayTypes, currentPage, results]);

  return (
    <>
      <ButtonGroup>
        <SecondaryButton onClick={() => addNewDayType()}>
          New day type
        </SecondaryButton>
      </ButtonGroup>
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
            <HeaderCell padding="radio">{''}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newDayType && (
            <DayTypesTableExpRow dayType={newDayType} key="_new">
              <DayTypeEditor
                onSave={() => setNewDayType(null)}
                dayType={newDayType}
              />
            </DayTypesTableExpRow>
          )}
          {processed?.map((dayType: DayType) => (
            <DayTypesTableExpRow dayType={dayType} key={dayType.id}>
              <DayTypeEditor onSave={() => {}} dayType={dayType} />
            </DayTypesTableExpRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
