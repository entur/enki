import { Modal } from '@entur/modal';
import DayType from 'model/DayType';
import { useIntl } from 'react-intl';
import { DayTypesModalContent } from './DayTypesModalContent';
import './styles.scss';

export const DayTypesModal = ({
  open,
  setOpen,
  dayTypes,
  refetchDayTypes,
}: {
  open: boolean;
  setOpen: Function;
  dayTypes: DayType[];
  refetchDayTypes: Function;
}) => {
  const { formatMessage } = useIntl();
  return (
    <Modal
      open={open}
      size="extraLarge"
      title={formatMessage({ id: 'dayTypesModalTitle' })}
      onDismiss={() => setOpen(false)}
      className="copy-dialog"
    >
      <DayTypesModalContent
        dayTypes={dayTypes}
        refetchDayTypes={refetchDayTypes}
      />
    </Modal>
  );
};
