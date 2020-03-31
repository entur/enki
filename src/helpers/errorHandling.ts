import { InputGroupProps } from '@entur/form';

type ErrorHandling = Pick<InputGroupProps, 'variant' | 'feedback'>;
export const getErrorFeedback = (
  feedback: string,
  isValid: boolean,
  isPristine: boolean
): ErrorHandling => {
  return isPristine || isValid ? {} : { feedback, variant: 'error' };
};
