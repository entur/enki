import React, { useMemo } from 'react';
import { ErrorHandling, getErrorFeedback } from 'helpers/errorHandling';
import { validateTimes } from 'helpers/validation';
import { selectIntl } from 'i18n';
import PassingTime from 'model/PassingTime';
import { useSelector } from 'react-redux';
import { SmallAlertBox } from '@entur/alert';

export const usePassingTimesError = ({
  passingTimes,
  spoilPristine,
}: {
  passingTimes: PassingTime[];
  spoilPristine: boolean;
}): ErrorHandling => {
  const intl = useSelector(selectIntl);
  const { isValid, errorMessage } = useMemo(() => {
    return validateTimes(passingTimes, intl);
  }, [passingTimes, intl]);

  const error = useMemo(() => {
    return getErrorFeedback(errorMessage, isValid, !spoilPristine);
  }, [errorMessage, isValid, spoilPristine]);

  return error;
};

export const PassingTimesError = ({
  passingTimes,
  spoilPristine,
}: {
  passingTimes: PassingTime[];
  spoilPristine: boolean;
}) => {
  const error = usePassingTimesError({ passingTimes, spoilPristine });

  if (error.feedback) {
    return <SmallAlertBox variant="error">{error.feedback}</SmallAlertBox>;
  } else {
    return null;
  }
};
