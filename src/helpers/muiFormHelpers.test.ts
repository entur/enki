import { getMuiErrorProps } from './muiFormHelpers';

describe('getMuiErrorProps', () => {
  const errorMsg = 'This field is required';

  it('returns error=false and empty helperText when field is valid', () => {
    const result = getMuiErrorProps(errorMsg, true, false);
    expect(result).toEqual({ error: false, helperText: '' });
  });

  it('returns error=false and empty helperText when field is pristine', () => {
    const result = getMuiErrorProps(errorMsg, false, true);
    expect(result).toEqual({ error: false, helperText: '' });
  });

  it('returns error=false and empty helperText when field is valid and pristine', () => {
    const result = getMuiErrorProps(errorMsg, true, true);
    expect(result).toEqual({ error: false, helperText: '' });
  });

  it('returns error=true and errorMsg when field is invalid and not pristine', () => {
    const result = getMuiErrorProps(errorMsg, false, false);
    expect(result).toEqual({
      error: true,
      helperText: 'This field is required',
    });
  });

  it('uses the provided error message string', () => {
    const customMsg = 'Must be at least 3 characters';
    const result = getMuiErrorProps(customMsg, false, false);
    expect(result.helperText).toBe(customMsg);
  });
});
