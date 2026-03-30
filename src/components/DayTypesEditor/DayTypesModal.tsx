import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
      <DialogTitle>
        {formatMessage({ id: 'dayTypesModalTitle' })}
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DayTypesModalContent
          dayTypes={dayTypes}
          refetchDayTypes={refetchDayTypes}
        />
      </DialogContent>
    </Dialog>
  );
};
