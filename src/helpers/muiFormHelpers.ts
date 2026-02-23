export const getMuiErrorProps = (
  errorMsg: string,
  isValid: boolean,
  pristine: boolean,
) => ({
  error: !isValid && !pristine,
  helperText: !isValid && !pristine ? errorMsg : '',
});
