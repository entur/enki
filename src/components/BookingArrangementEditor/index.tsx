import React, { useState, useCallback, useEffect } from 'react';
import { Contrast } from '@entur/layout';
import { Heading3, Paragraph, Heading4 } from '@entur/typography';
import { ButtonGroup, Button } from '@entur/button';
import { Modal } from '@entur/modal';
import Editor from './editor';
import { BookingInfoAttachment, bookingInfoAttachmentLabel } from './constants';
import BookingArrangement from 'model/BookingArrangement';
import { clone } from 'ramda';
import classNames from 'classnames';

type Props = {
  bookingArrangement?: BookingArrangement;
  bookingInfoAttachment: BookingInfoAttachment;
  onChange: (bookingArrangement: BookingArrangement) => void;
  onRemove: () => void;
  spoilPristine: boolean;
  trim?: boolean;
};

const BookingArrangementEditor = ({
  bookingArrangement,
  bookingInfoAttachment,
  spoilPristine,
  onChange,
  onRemove,
  trim,
}: Props) => {
  const [showModal, setshowModal] = useState<boolean>(false);
  const [bookingArrangementDraft, setBookingArrangementDraft] = useState<
    BookingArrangement
  >({});

  useEffect(() => {
    setBookingArrangementDraft(clone(bookingArrangement || {}));
  }, [setBookingArrangementDraft, bookingArrangement]);

  const saveChanges = useCallback(() => {
    onChange(bookingArrangementDraft);
    setshowModal(false);
  }, [onChange, bookingArrangementDraft, setshowModal]);

  // switch to useReducer
  const cancel = useCallback(() => {
    setBookingArrangementDraft(clone(bookingArrangement || {}));
    setshowModal(false);
  }, [setBookingArrangementDraft, setshowModal, bookingArrangement]);

  return (
    <div className="booking">
      <section
        className={classNames('booking-info', { 'booking-info-trim': trim })}
      >
        {trim && <Heading4>Booking information</Heading4>}
        {!trim && (
          <>
            <Heading3>Booking information</Heading3>
            <Paragraph>
              Booking information can be added to the whole line, or to an
              individual stop point in journey pattern or service journey (or
              all of the above).
            </Paragraph>
          </>
        )}
        {bookingArrangement ? (
          <>
            {!trim && (
              <Heading4>
                This {bookingInfoAttachmentLabel(bookingInfoAttachment.type)}{' '}
                has booking information.
              </Heading4>
            )}
            <ButtonGroup className="booking-info-buttons">
              <Button variant="secondary" onClick={() => setshowModal(true)}>
                Show / edit
              </Button>
              <Button variant="negative" onClick={() => onRemove()}>
                Remove
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            {!trim && (
              <Heading4>
                This {bookingInfoAttachmentLabel(bookingInfoAttachment.type)}{' '}
                has no booking information.
              </Heading4>
            )}
            <ButtonGroup className="booking-info-buttons">
              <Button variant="secondary" onClick={() => setshowModal(true)}>
                Add
              </Button>
            </ButtonGroup>
          </>
        )}
      </section>

      <Modal
        title="Booking info"
        size="large"
        open={showModal}
        onDismiss={cancel}
      >
        <Editor
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

const withContrast = (Component: React.ComponentType<Props>) => ({
  trim = false,
  ...rest
}: Props) =>
  trim ? (
    <Component trim={trim} {...(rest as Props)} />
  ) : (
    <Contrast>
      <Component trim={trim} {...(rest as Props)} />
    </Contrast>
  );

export default withContrast(BookingArrangementEditor);
