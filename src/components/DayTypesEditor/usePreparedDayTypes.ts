import DayType from 'model/DayType';
import { useMemo } from 'react';

export const usePreparedDayTypes = (
  dayTypes: DayType[],
  currentPage: number,
  results: number,
) => {
  const sortedDayTypes = useMemo(() => {
    return [...dayTypes]?.sort((a, b) => {
      if (new Date(a.changed!).getTime() > new Date(b.changed!).getTime()) {
        return -1;
      } else if (
        new Date(a.changed!).getTime() < new Date(b.changed!).getTime()
      ) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [dayTypes]);

  const filteredDayTypes = useMemo(() => {
    return sortedDayTypes?.filter(
      (_, index) =>
        index + 1 >= (currentPage - 1) * results + 1 &&
        index + 1 <= currentPage * results,
    );
  }, [sortedDayTypes, currentPage, results]);

  return filteredDayTypes;
};
