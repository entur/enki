import { useMutation } from '@apollo/client';
import { DELETE_LINE } from 'api/uttu/mutations';
import { useCallback } from 'react';

export const useConfirmDeleteLine = (id: string, callback: () => void) => {
  const [deleteLine] = useMutation(DELETE_LINE, {
    variables: { id },
  });

  const confirmDeleteLine = useCallback(async () => {
    await deleteLine();
    callback();
  }, [callback, deleteLine]);
  return [confirmDeleteLine];
};
