import { Export } from 'model/Export';

/**
 * Sorts exports by their created date in descending order (newest first).
 * Returns a new array without mutating the original.
 * Exports with undefined/null created dates are sorted to the end.
 */
export const sortExportsByDate = (exports: Export[]): Export[] => {
  return [...exports].sort((a, b) => {
    // Handle undefined/null created dates - sort them to the end
    if (!a.created && !b.created) return 0;
    if (!a.created) return 1;
    if (!b.created) return -1;

    const aDate = new Date(a.created);
    const bDate = new Date(b.created);
    return bDate.getTime() - aDate.getTime();
  });
};
