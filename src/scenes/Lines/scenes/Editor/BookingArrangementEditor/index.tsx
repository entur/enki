import React, { useCallback } from 'react';
import ContactFields from 'scenes/Lines/scenes/Editor/BookingArrangementEditor/contactFields';
import BookingLimitFields from './bookingLimitFields';
import BookingMethodSelection from 'scenes/Lines/scenes/Editor/BookingArrangementEditor/bookingMethodSelection';
import BookingTimeSelection from 'scenes/Lines/scenes/Editor/BookingArrangementEditor/bookingTimeSelection';
import PaymentTimeSelection from 'scenes/Lines/scenes/Editor/BookingArrangementEditor/paymentTimeSelection';
import BookingAccessSelection from './bookingAccessSelection';
import BookingNoteField from './bookingNoteField';
import ScrollToTop from 'components/ScrollToTop';
import './styles.scss';
import BookingArrangement, {
  bookingArrangementIsEmpty,
} from 'model/BookingArrangement';
import { addOrRemove } from 'helpers/arrays';
import { BOOKING_METHOD, PURCHASE_MOMENT } from 'model/enums';

type Props = {
  onChange: (bookingArrangement: BookingArrangement | undefined) => void;
  bookingArrangement: BookingArrangement;
};

const BookingArrangementEditor = (props: Props) => {
  const { bookingArrangement, onChange } = props;

  const onFieldChange = useCallback(
    (bookingArrangement: BookingArrangement) => {
      onChange(
        bookingArrangementIsEmpty(bookingArrangement)
          ? undefined
          : bookingArrangement
      );
    },
    [onChange]
  );

  const {
    bookingContact = {},
    bookingMethods,
    bookWhen,
    latestBookingTime = null,
    minimumBookingPeriod = null,
    buyWhen,
    bookingAccess,
    bookingNote,
  } = bookingArrangement;

  return (
    <ScrollToTop>
      <div className="booking-editor tab-style">
        <ContactFields
          contact={bookingContact}
          onContactChange={(contact) =>
            onFieldChange({ ...bookingArrangement, bookingContact: contact })
          }
        />

        <BookingMethodSelection
          bookingMethods={bookingMethods ?? []}
          onChange={(bookingMethod: BOOKING_METHOD) =>
            onFieldChange({
              ...bookingArrangement,
              bookingMethods: addOrRemove(bookingMethod, bookingMethods ?? []),
            })
          }
        />

        <BookingTimeSelection
          bookWhen={bookWhen}
          onChange={(bookWhen: any) =>
            onFieldChange({ ...bookingArrangement, bookWhen })
          }
        />

        <BookingLimitFields
          latestBookingTime={latestBookingTime}
          minimumBookingPeriod={minimumBookingPeriod}
          onLatestBookingTimeChange={(latestBookingTime: any) =>
            onFieldChange({ ...bookingArrangement, latestBookingTime })
          }
          onMinimumBookingPeriodChange={(minimumBookingPeriod: any) =>
            onFieldChange({ ...bookingArrangement, minimumBookingPeriod })
          }
          resetBookingLimit={() => ({
            ...bookingArrangement,
            minimumBookingPeriod: undefined,
            latestBookingTime: undefined,
          })}
        />

        <PaymentTimeSelection
          buyWhen={buyWhen ?? []}
          onChange={(purchaseMoment: PURCHASE_MOMENT) =>
            onFieldChange({
              ...bookingArrangement,
              buyWhen: addOrRemove(purchaseMoment, buyWhen ?? []),
            })
          }
        />

        <BookingAccessSelection
          bookingAccess={bookingAccess}
          onChange={(bookingAccess: any) =>
            onFieldChange({ ...bookingArrangement, bookingAccess })
          }
        />

        <BookingNoteField
          bookingNote={bookingNote}
          onChange={(bookingNote: any) =>
            onFieldChange({ ...bookingArrangement, bookingNote })
          }
        />
      </div>
    </ScrollToTop>
  );
};

export default BookingArrangementEditor;
