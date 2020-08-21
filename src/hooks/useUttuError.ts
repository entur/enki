import { useSelector, useDispatch } from 'react-redux';
import { selectIntl } from 'i18n';
import { ApolloError } from '@apollo/client';
import { showErrorNotification } from 'actions/notification';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { useEffect } from 'react';

export default (
  headerKey: keyof MessagesKey,
  messageKey: keyof MessagesKey,
  error?: ApolloError,
  callback?: () => void
) => {
  const intl = useSelector(selectIntl);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      dispatch(
        showErrorNotification(
          intl.formatMessage(headerKey),
          intl.formatMessage(
            messageKey,
            getInternationalizedUttuError(intl, error)
          )
        )
      );
      if (callback) {
        callback();
      }
    }
  }, [headerKey, messageKey, error, callback, intl, dispatch]);
};
