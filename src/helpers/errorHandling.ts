import { FeedbackTextProps } from '@entur/form';

type ErrorHandling = Pick<FeedbackTextProps, 'variant' | 'feedback'> | {};
export const getErrorFeedback = (
  feedback: string,
  isValid: boolean,
  isPristine: boolean
): ErrorHandling => {
  return isPristine || isValid ? {} : { feedback, variant: 'error' };
};
