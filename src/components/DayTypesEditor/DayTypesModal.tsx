import React from 'react';
import { Modal } from '@entur/modal';
import DayType from 'model/DayType';
import { DayTypesModalContent } from './DayTypesModalContent';
import './styles.scss';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

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
  const { formatMessage } = useSelector(selectIntl);
  return (
    <Modal
      open={open}
      size="extraLarge"
      title={formatMessage('dayTypesModalTitle')}
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
