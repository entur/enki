import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import DayType from 'model/DayType';
import { useIntl } from 'react-intl';
import { DayTypesModalContent } from './DayTypesModalContent';

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
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
      <DialogTitle>{formatMessage({ id: 'dayTypesModalTitle' })}</DialogTitle>
      <DialogContent>
        <DayTypesModalContent
          dayTypes={dayTypes}
          refetchDayTypes={refetchDayTypes}
        />
      </DialogContent>
    </Dialog>
  );
};
