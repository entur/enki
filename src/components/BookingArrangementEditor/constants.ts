export enum BookingInfoAttachmentType {
  LINE = 'LINE',
  STOP_POINT_IN_JOURNEYPATTERN = 'STOP_POINT_IN_JOURNEYPATTERN',
  SERVICE_JOURNEY = 'SERVICE_JOURNEY',
}

export type BookingInfoAttachment = {
  type: BookingInfoAttachmentType;
  name: string;
};

export const bookingInfoAttachmentLabel = (
  bookingInfoAttachmentType: BookingInfoAttachmentType,
) => {
  switch (bookingInfoAttachmentType) {
    case BookingInfoAttachmentType.LINE:
      return 'Line';
    case BookingInfoAttachmentType.STOP_POINT_IN_JOURNEYPATTERN:
      return 'Stop Point in Journey Pattern';
    case BookingInfoAttachmentType.SERVICE_JOURNEY:
      return 'Service Journey';
    default:
      return '';
  }
};
