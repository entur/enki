import reducer, { setSavedChanges } from './editorSlice';

describe('editorSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ isSaved: true });
  });

  it('setSavedChanges(false) sets isSaved to false', () => {
    const result = reducer({ isSaved: true }, setSavedChanges(false));
    expect(result.isSaved).toBe(false);
  });

  it('setSavedChanges(true) sets isSaved to true', () => {
    const result = reducer({ isSaved: false }, setSavedChanges(true));
    expect(result.isSaved).toBe(true);
  });
});
