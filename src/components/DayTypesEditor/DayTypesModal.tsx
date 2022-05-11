import React from 'react';
import { Modal } from '@entur/modal';
import DayType from 'model/DayType';
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
  return (
    <Modal
      open={open}
      size="extraLarge"
      title={'Select day types'}
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
