import { getErrorFeedback } from './errorHandling';

describe('errorHandling', () => {
  describe('getErrorFeedback', () => {
    const feedbackMessage = 'This field is required';

    it('should return undefined variant and feedback when isValid is true and isPristine is true', () => {
      expect(getErrorFeedback(feedbackMessage, true, true)).toEqual({
        variant: undefined,
        feedback: undefined,
      });
    });

    it('should return undefined variant and feedback when isValid is false and isPristine is true', () => {
      expect(getErrorFeedback(feedbackMessage, false, true)).toEqual({
        variant: undefined,
        feedback: undefined,
      });
    });

    it('should return undefined variant and feedback when isValid is true and isPristine is false', () => {
      expect(getErrorFeedback(feedbackMessage, true, false)).toEqual({
        variant: undefined,
        feedback: undefined,
      });
    });

    it('should return error variant and feedback when isValid is false and isPristine is false', () => {
      expect(getErrorFeedback(feedbackMessage, false, false)).toEqual({
        feedback: feedbackMessage,
        variant: 'error',
      });
    });
  });
});
