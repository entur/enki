import { Box } from '@mui/material';
import BookingArrangementEditor from 'components/BookingArrangementEditor';
import { BookingInfoAttachmentType } from 'components/BookingArrangementEditor/constants';
import StopPoint from 'model/StopPoint';

type Props = {
  stopPoint: StopPoint;
  spoilPristine: boolean;
  onChange: (stopPoint: StopPoint) => void;
};

export const StopPointBookingArrangement = ({
  stopPoint,
  spoilPristine,
  onChange,
}: Props) => (
  <Box>
    <BookingArrangementEditor
      trim
      bookingArrangement={stopPoint.bookingArrangement}
      spoilPristine={spoilPristine}
      bookingInfoAttachment={{
        type: BookingInfoAttachmentType.STOP_POINT_IN_JOURNEYPATTERN,
        name: stopPoint.flexibleStopPlace?.name! || stopPoint.quayRef!,
      }}
      onChange={(bookingArrangement) => {
        onChange({
          ...stopPoint,
          bookingArrangement,
        });
      }}
      onRemove={() => {
        onChange({
          ...stopPoint,
          bookingArrangement: null,
        });
      }}
    />
  </Box>
);
