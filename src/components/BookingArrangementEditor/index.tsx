import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Contrast } from '@entur/layout';
import { Heading3, Paragraph, Heading4 } from '@entur/typography';
import { ButtonGroup, Button } from '@entur/button';
import { Modal } from '@entur/modal';
import Editor from './editor';
import { BookingInfoAttachment } from './constants';
import BookingArrangement from 'model/BookingArrangement';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectIntl, AppIntlState } from 'i18n';
import { GlobalState } from 'reducers';
import { validateBookingArrangement } from 'helpers/validation';
import { getErrorFeedback } from 'helpers/errorHandling';
import usePristine from 'hooks/usePristine';
import { SmallAlertBox } from '@entur/alert';
import cloneDeep from 'lodash.clonedeep';

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

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

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
    return formatMessage('bookingValidationError');
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
        {trim && <Heading4>{formatMessage('bookingInfoHeader')}</Heading4>}
        {!trim && (
          <>
            <Heading3>{formatMessage('bookingInfoHeader')}</Heading3>
            <Paragraph>{formatMessage('bookingInfoHelpText')}</Paragraph>
          </>
        )}
        {bookingArrangement ? (
          <ButtonGroup className="booking-info-buttons">
            <Button variant="secondary" onClick={() => setshowModal(true)}>
              {formatMessage('bookingInfoShowEditButtonText')}
            </Button>
            <Button variant="negative" onClick={() => onRemove()}>
              {formatMessage('bookingInfoRemoveButtonText')}
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup className="booking-info-buttons">
            <Button variant="secondary" onClick={() => setshowModal(true)}>
              {formatMessage('bookingInfoAddButtonText')}
            </Button>
          </ButtonGroup>
        )}
      </section>

      <Modal
        title={formatMessage('bookingInfoHeader')}
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
              {formatMessage('bookingInfoSaveButtonText')}
            </Button>
            <Button onClick={cancel} variant="negative">
              {formatMessage('bookingInfoCancelButtonText')}
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
