import JourneyPattern from '../../model/JourneyPattern';
import { ChangeEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextField } from '@entur/form';
import { Button, ButtonGroup } from '@entur/button';
import { Modal } from '@entur/modal';

type CopyDialogProps = {
  open: boolean;
  journeyPattern: JourneyPattern;
  onSave: (jpName: string) => void;
  onDismiss: () => void;
};

const CopyDialog = ({
  open,
  journeyPattern,
  onSave,
  onDismiss,
}: CopyDialogProps) => {
  const { formatMessage } = useIntl();
  const [nameTemplate, setNameTemplate] = useState<string>(
    `${journeyPattern.name || 'New'} (${formatMessage({ id: 'copyInstance' })})`,
  );

  const save = () => {
    onSave(nameTemplate);
  };

  return (
    <Modal
      open={open}
      size="medium"
      title={formatMessage({ id: 'copyJourneyPatternDialogTitle' })}
      onDismiss={onDismiss}
      className="copy-dialog"
    >
      <TextField
        label={formatMessage({
          id: 'copyJourneyPatternDialogNameTemplateLabel',
        })}
        className="copy-dialog-wide-element"
        value={nameTemplate}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNameTemplate(e.target.value)
        }
      />

      <div className="copy-dialog-section">
        <ButtonGroup>
          <Button variant="negative" onClick={() => onDismiss()}>
            {formatMessage({ id: 'copyJourneyPatternDialogCancelButtonText' })}
          </Button>
          <Button variant="success" onClick={() => save()}>
            {formatMessage({ id: 'copyJourneyPatternDialogSaveButtonText' })}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default CopyDialog;
