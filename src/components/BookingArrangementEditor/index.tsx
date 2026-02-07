import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateBookingArrangement } from 'validation';
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
    false,
  );
  const bookingArrangementFeedback = useMemo(
    () =>
      getErrorFeedback(
        validationMessage,
        validateBookingArrangement(bookingArrangementDraft),
        bookingArrangementPristine,
      ),
    [bookingArrangementDraft, bookingArrangementPristine, validationMessage],
  );

  return (
    <Box>
      <Box sx={{ mt: trim ? 0 : 4, pl: trim ? 0 : 4, pr: 4, pb: 4 }}>
        {trim && (
          <Typography variant="h4">
            {formatMessage({ id: 'bookingInfoHeader' })}
          </Typography>
        )}
        {!trim && (
          <>
            <Typography variant="h3">
              {formatMessage({ id: 'bookingInfoHeader' })}
            </Typography>
            <Typography variant="body1">
              {formatMessage({ id: 'bookingInfoHelpText' })}
            </Typography>
          </>
        )}
        {bookingArrangement ? (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setshowModal(true)}>
              {formatMessage({ id: 'bookingInfoShowEditButtonText' })}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => onRemove()}
            >
              {formatMessage({ id: 'bookingInfoRemoveButtonText' })}
            </Button>
          </Stack>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setshowModal(true)}>
              {formatMessage({ id: 'bookingInfoAddButtonText' })}
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={showModal} onClose={cancel} maxWidth="lg" fullWidth>
        <DialogTitle>{formatMessage({ id: 'bookingInfoHeader' })}</DialogTitle>
        <DialogContent>
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
            <Alert severity="error" sx={{ mt: 2 }}>
              {bookingArrangementFeedback.feedback}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} variant="outlined">
            {formatMessage({ id: 'bookingInfoCancelButtonText' })}
          </Button>
          <Button
            onClick={saveChanges}
            variant="contained"
            disabled={!!bookingArrangementFeedback?.feedback}
          >
            {formatMessage({ id: 'bookingInfoSaveButtonText' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const withContrast =
  (Component: React.ComponentType<Props>) =>
  ({ trim = false, ...rest }: Props) =>
    trim ? (
      <Component trim={trim} {...(rest as Props)} />
    ) : (
      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
        <Component trim={trim} {...(rest as Props)} />
      </Box>
    );

export default withContrast(BookingArrangementEditor);
