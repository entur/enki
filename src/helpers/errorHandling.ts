export type VariantType =
  | 'success'
  | 'negative'
  | 'warning'
  | 'information'
  | 'error'
  | 'info';

export type ErrorHandling = {
  variant: VariantType | undefined;
  feedback: string | undefined;
};

export const getErrorFeedback = (
  feedback: string,
  isValid: boolean,
  isPristine: boolean,
): ErrorHandling => {
  return isPristine || isValid
    ? { variant: undefined, feedback: undefined }
    : { feedback, variant: 'error' };
};
