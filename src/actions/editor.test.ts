import { describe, it, expect } from 'vitest';
import { setSavedChanges } from './editor';

describe('editor actions', () => {
  it('re-exports setSavedChanges from editorSlice', () => {
    expect(setSavedChanges).toBeDefined();
    expect(typeof setSavedChanges).toBe('function');
  });

  it('creates correct action for setSavedChanges(true)', () => {
    const action = setSavedChanges(true);
    expect(action).toEqual({
      type: 'editor/setSavedChanges',
      payload: true,
    });
  });

  it('creates correct action for setSavedChanges(false)', () => {
    const action = setSavedChanges(false);
    expect(action).toEqual({
      type: 'editor/setSavedChanges',
      payload: false,
    });
  });
});
