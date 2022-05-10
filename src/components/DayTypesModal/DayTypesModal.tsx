import React from 'react';
import { Modal } from '@entur/modal';
import DayType from 'model/DayType';
import { DayTypesModalContent } from './DayTypesModalContent';

export const DayTypesModal = ({
  open,
  setOpen,
  dayTypes,
}: {
  open: boolean;
  setOpen: Function;
  dayTypes: DayType[];
}) => {
  return (
    <Modal
      open={open}
      size="large"
      title={'Select day types'}
      onDismiss={() => setOpen(false)}
      className="copy-dialog"
    >
      <DayTypesModalContent dayTypes={dayTypes} />
    </Modal>
  );
};
