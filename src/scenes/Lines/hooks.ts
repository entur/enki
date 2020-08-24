import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_LINE } from 'api/uttu/mutations';

export const useConfirmDeleteLine = (id: string, callback: () => void) => {
  const [deleteLine] = useMutation(DELETE_LINE, {
    variables: { id },
  });

  const confirmDeleteLine = useCallback(() => {
    deleteLine();
    callback();
  }, [callback, deleteLine]);
  return [confirmDeleteLine];
};
