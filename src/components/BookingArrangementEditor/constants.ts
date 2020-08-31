export enum BookingInfoAttachmentType {
  LINE = 'LINE',
  JOURNEYPATTERN = 'JOURNEYPATTERN',
  SERVICEJOURNEY = 'SERVICEJOURNEY',
}

export type BookingInfoAttachment = {
  type: BookingInfoAttachmentType;
  name: string;
};

export const bookingInfoAttachmentLabel = (
  bookingInfoAttachmentType: BookingInfoAttachmentType
) => {
  switch (bookingInfoAttachmentType) {
    case BookingInfoAttachmentType.LINE:
      return 'Line';
    case BookingInfoAttachmentType.JOURNEYPATTERN:
      return 'Journey Pattern';
    case BookingInfoAttachmentType.SERVICEJOURNEY:
      return 'Service Journey';
    default:
      return '';
  }
};
