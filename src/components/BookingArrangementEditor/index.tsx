import React, { useState, useCallback, useEffect } from 'react';
import { Contrast } from '@entur/layout';
import { Heading3, Paragraph, Heading4 } from '@entur/typography';
import { ButtonGroup, Button } from '@entur/button';
import { Modal } from '@entur/modal';
import BookingArrangementEditor from './editor';
import { BookingInfoAttachment, bookingInfoAttachmentLabel } from './constants';
import BookingArrangement from 'model/BookingArrangement';
import { clone } from 'ramda';

type Props = {
  bookingArrangement?: BookingArrangement;
  bookingInfoAttachment: BookingInfoAttachment;
  onChange: (bookingArrangement: BookingArrangement) => void;
  onRemove: () => void;
  spoilPristine: boolean;
};

export default ({
  bookingArrangement,
  bookingInfoAttachment,
  spoilPristine,
  onChange,
  onRemove,
}: Props) => {
  const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false);
  const [bookingArrangementDraft, setBookingArrangementDraft] = useState<
    BookingArrangement
  >({});

  useEffect(() => {
    setBookingArrangementDraft(clone(bookingArrangement || {}));
  }, [setBookingArrangementDraft, bookingArrangement]);

  const saveChanges = useCallback(() => {
    onChange(bookingArrangementDraft);
    setShowBookingInfo(false);
  }, [onChange, bookingArrangementDraft, setShowBookingInfo]);

  // switch to useReducer
  const cancel = useCallback(() => {
    setBookingArrangementDraft(clone(bookingArrangement || {}));
    setShowBookingInfo(false);
  }, [setBookingArrangementDraft, setShowBookingInfo, bookingArrangement]);

  return (
    <div className="booking">
      <Contrast>
        <section className="booking-info">
          <Heading3>Booking information</Heading3>
          <Paragraph>
            Booking information can be added to the whole line, or to an
            individual stop point in journey pattern or service journey (or all
            of the above).
          </Paragraph>
          {bookingArrangement ? (
            <>
              <Heading4>
                This {bookingInfoAttachmentLabel(bookingInfoAttachment.type)}{' '}
                has booking information.
              </Heading4>
              <ButtonGroup className="booking-info-buttons">
                <Button
                  variant="secondary"
                  onClick={() => setShowBookingInfo(true)}
                >
                  Show / edit
                </Button>
                <Button variant="negative" onClick={() => onRemove()}>
                  Remove
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Heading4>
                This {bookingInfoAttachmentLabel(bookingInfoAttachment.type)}{' '}
                has no booking information.
              </Heading4>
              <ButtonGroup className="booking-info-buttons">
                <Button
                  variant="secondary"
                  onClick={() => setShowBookingInfo(true)}
                >
                  Add
                </Button>
              </ButtonGroup>
            </>
          )}
        </section>
      </Contrast>

      <Modal
        title="Booking info"
        size="large"
        open={showBookingInfo}
        onDismiss={cancel}
      >
        <BookingArrangementEditor
          onChange={(ba) =>
            setBookingArrangementDraft({
              ...ba,
            })
          }
          bookingArrangement={bookingArrangementDraft}
          spoilPristine={spoilPristine}
          bookingInfoAttachment={bookingInfoAttachment}
        />
        <div className="booking-modal-buttons">
          <ButtonGroup>
            <Button onClick={saveChanges} variant="primary">
              Save
            </Button>
            <Button onClick={cancel} variant="negative">
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </div>
  );
};
