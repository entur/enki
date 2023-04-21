import { SmallAlertBox } from '@entur/alert';
import { Button, ButtonGroup } from '@entur/button';
import { Contrast } from '@entur/layout';
import { Modal } from '@entur/modal';
import { Heading3, Heading4, Paragraph } from '@entur/typography';
import classNames from 'classnames';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateBookingArrangement } from 'helpers/validation';
import usePristine from 'hooks/usePristine';
import cloneDeep from 'lodash.clonedeep';
import BookingArrangement from 'model/BookingArrangement';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { BookingInfoAttachment } from './constants';
import Editor from './editor';

type Props = {
  bookingArrangement?: BookingArrangement | null;
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
  const [bookingArrangementDraft, setBookingArrangementDraft] =
    useState<BookingArrangement>({});

  const { formatMessage } = useIntl();

  useEffect(() => {
    setBookingArrangementDraft(cloneDeep(bookingArrangement || {}));
  }, [setBookingArrangementDraft, bookingArrangement]);

  const saveChanges = useCallback(() => {
    onChange(bookingArrangementDraft);
    setshowModal(false);
  }, [onChange, bookingArrangementDraft, setshowModal]);

  // switch to useReducer
  const cancel = useCallback(() => {
    setBookingArrangementDraft(cloneDeep(bookingArrangement || {}));
    setshowModal(false);
  }, [setBookingArrangementDraft, setshowModal, bookingArrangement]);

  const validationMessage = useMemo(() => {
    return formatMessage({ id: 'bookingValidationError' });
  }, [formatMessage]);
  const bookingArrangementPristine = usePristine(
    bookingArrangementDraft,
    false
  );
  const bookingArrangementFeedback = useMemo(
    () =>
      getErrorFeedback(
        validationMessage,
        validateBookingArrangement(bookingArrangementDraft),
        bookingArrangementPristine
      ),
    [bookingArrangementDraft, bookingArrangementPristine, validationMessage]
  );

  return (
    <div className="booking">
      <section
        className={classNames('booking-info', { 'booking-info-trim': trim })}
      >
        {trim && (
          <Heading4>{formatMessage({ id: 'bookingInfoHeader' })}</Heading4>
        )}
        {!trim && (
          <>
            <Heading3>{formatMessage({ id: 'bookingInfoHeader' })}</Heading3>
            <Paragraph>
              {formatMessage({ id: 'bookingInfoHelpText' })}
            </Paragraph>
          </>
        )}
        {bookingArrangement ? (
          <ButtonGroup className="booking-info-buttons">
            <Button variant="secondary" onClick={() => setshowModal(true)}>
              {formatMessage({ id: 'bookingInfoShowEditButtonText' })}
            </Button>
            <Button variant="negative" onClick={() => onRemove()}>
              {formatMessage({ id: 'bookingInfoRemoveButtonText' })}
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup className="booking-info-buttons">
            <Button variant="secondary" onClick={() => setshowModal(true)}>
              {formatMessage({ id: 'bookingInfoAddButtonText' })}
            </Button>
          </ButtonGroup>
        )}
      </section>

      <Modal
        title={formatMessage({ id: 'bookingInfoHeader' })}
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

        {bookingArrangementFeedback?.feedback && (
          <div className="booking-modal-buttons">
            <SmallAlertBox variant="error">
              {bookingArrangementFeedback.feedback}
            </SmallAlertBox>
          </div>
        )}
        <div className="booking-modal-buttons">
          <ButtonGroup>
            <Button
              onClick={saveChanges}
              variant="primary"
              disabled={!!bookingArrangementFeedback?.feedback}
            >
              {formatMessage({ id: 'bookingInfoSaveButtonText' })}
            </Button>
            <Button onClick={cancel} variant="negative">
              {formatMessage({ id: 'bookingInfoCancelButtonText' })}
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </div>
  );
};

const withContrast =
  (Component: React.ComponentType<Props>) =>
  ({ trim = false, ...rest }: Props) =>
    trim ? (
      <Component trim={trim} {...(rest as Props)} />
    ) : (
      <Contrast>
        <Component trim={trim} {...(rest as Props)} />
      </Contrast>
    );

export default withContrast(BookingArrangementEditor);
