import { showErrorNotification } from 'actions/notification';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { MessagesKey } from 'i18n/translationKeys';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAppDispatch } from 'store/hooks';

export default (
  headerKey: keyof MessagesKey,
  messageKey: keyof MessagesKey,
  error?: Error,
  callback?: () => void,
) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (error) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({ id: headerKey }),
          intl.formatMessage(
            {
              id: messageKey,
            },
            {
              details: getInternationalizedUttuError(intl, error),
            },
          ),
        ),
      );
      if (callback) {
        callback();
      }
    }
    // eslint-disable-next-line
  }, [error]);
};
