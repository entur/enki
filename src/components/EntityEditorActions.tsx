import { Button, Stack } from '@mui/material';
import ConfirmDialog from 'components/ConfirmDialog';
import { useIntl } from 'react-intl';

type Props = {
  isEditing: boolean;
  isDeleteDisabled: boolean;
  onDeleteClick: () => void;
  onSaveClick: () => void;
  isDeleteDialogOpen: boolean;
  onDeleteDialogClose: () => void;
  onDeleteConfirm: () => void;
  entityName: string;
  deleteConfirmTitleId: string;
  deleteConfirmMessageId: string;
  deleteConfirmCancelId: string;
  deleteConfirmConfirmId: string;
};

export const EntityEditorActions = ({
  isEditing,
  isDeleteDisabled,
  onDeleteClick,
  onSaveClick,
  isDeleteDialogOpen,
  onDeleteDialogClose,
  onDeleteConfirm,
  entityName,
  deleteConfirmTitleId,
  deleteConfirmMessageId,
  deleteConfirmCancelId,
  deleteConfirmConfirmId,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4 }}
      >
        {isEditing && (
          <Button
            variant="contained"
            color="error"
            onClick={onDeleteClick}
            disabled={isDeleteDisabled}
          >
            {formatMessage({ id: 'editorDeleteButtonText' })}
          </Button>
        )}

        <Button variant="contained" color="success" onClick={onSaveClick}>
          {isEditing
            ? formatMessage({ id: 'editorSaveButtonText' })
            : formatMessage(
                { id: 'editorDetailedCreate' },
                { details: formatMessage({ id: entityName }) },
              )}
        </Button>
      </Stack>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage({ id: deleteConfirmTitleId })}
        message={formatMessage({ id: deleteConfirmMessageId })}
        buttons={[
          <Button variant="outlined" key={2} onClick={onDeleteDialogClose}>
            {formatMessage({ id: deleteConfirmCancelId })}
          </Button>,
          <Button
            variant="contained"
            color="error"
            key={1}
            onClick={onDeleteConfirm}
          >
            {formatMessage({ id: deleteConfirmConfirmId })}
          </Button>,
        ]}
        onDismiss={onDeleteDialogClose}
      />
    </>
  );
};
