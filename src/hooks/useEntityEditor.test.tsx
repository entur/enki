import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createTestStore } from '../utils/test-utils';
import { TestIntlProvider } from '../utils/TestIntlProvider';
import { messages } from '../i18n/translations/en';
import { useEntityEditor } from './useEntityEditor';

type TestEntity = {
  id?: string;
  name: string;
  description?: string;
};

const defaultEntity: TestEntity = { name: '', description: '' };

function createTestConfig(overrides = {}) {
  return {
    entitySelector: (_params: Record<string, string | undefined>) => () =>
      undefined as TestEntity | undefined,
    defaultEntity,
    loadById: vi.fn(() => () => Promise.resolve()),
    save: vi.fn(() => () => Promise.resolve()),
    loadAll: vi.fn(() => () => Promise.resolve()),
    deleteById: vi.fn(() => () => Promise.resolve()),
    navigateTo: '/test-entities',
    ...overrides,
  };
}

function createWrapper(initialEntries: string[] = ['/test-entities/create']) {
  const testStore = createTestStore();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={testStore}>
      <TestIntlProvider locale="en" messages={messages}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/test-entities/create" element={children} />
            <Route path="/test-entities/edit/:id" element={children} />
            <Route path="/test-entities" element={<div>List</div>} />
          </Routes>
        </MemoryRouter>
      </TestIntlProvider>
    </Provider>
  );
  return { Wrapper, testStore };
}

describe('useEntityEditor', () => {
  describe('create mode (no :id param)', () => {
    it('returns default entity when no id param', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      expect(result.current.entity).toEqual(defaultEntity);
    });

    it('does not call loadById in create mode', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      renderHook(() => useEntityEditor(config), { wrapper: Wrapper });

      expect(config.loadById).not.toHaveBeenCalled();
    });

    it('provides intl and formatMessage', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      expect(result.current.intl).toBeDefined();
      expect(result.current.formatMessage).toBeInstanceOf(Function);
    });

    it('starts with isSaving=false and isDeleting=false', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      expect(result.current.isSaving).toBe(false);
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.saveClicked).toBe(false);
      expect(result.current.isDeleteDialogOpen).toBe(false);
    });
  });

  describe('field changes', () => {
    it('updates entity field via onFieldChange', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.onFieldChange('name', 'New Name');
      });

      expect(result.current.entity.name).toBe('New Name');
    });

    it('updates entity via setEntity', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.setEntity({
          name: 'Full Update',
          description: 'Updated desc',
        });
      });

      expect(result.current.entity.name).toBe('Full Update');
      expect(result.current.entity.description).toBe('Updated desc');
    });
  });

  describe('save', () => {
    it('sets saveClicked to true when handleSave is called', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.handleSave(false);
      });

      expect(result.current.saveClicked).toBe(true);
    });

    it('does not dispatch save when form is invalid', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.handleSave(false);
      });

      expect(config.save).not.toHaveBeenCalled();
    });

    it('dispatches save when form is valid', async () => {
      const saveAction = vi.fn(() => Promise.resolve());
      const loadAllAction = vi.fn(() => Promise.resolve());
      const config = createTestConfig({
        save: vi.fn(() => saveAction),
        loadAll: vi.fn(() => loadAllAction),
      });
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      await act(async () => {
        result.current.handleSave(true);
      });

      expect(config.save).toHaveBeenCalled();
    });
  });

  describe('delete dialog', () => {
    it('can open and close the delete dialog', () => {
      const config = createTestConfig();
      const { Wrapper } = createWrapper(['/test-entities/create']);
      const { result } = renderHook(() => useEntityEditor(config), {
        wrapper: Wrapper,
      });

      expect(result.current.isDeleteDialogOpen).toBe(false);

      act(() => {
        result.current.setDeleteDialogOpen(true);
      });
      expect(result.current.isDeleteDialogOpen).toBe(true);

      act(() => {
        result.current.setDeleteDialogOpen(false);
      });
      expect(result.current.isDeleteDialogOpen).toBe(false);
    });
  });

  describe('edit mode (with :id param)', () => {
    it('calls loadById when id param is present', () => {
      const loadByIdAction = vi.fn(() => Promise.resolve());
      const config = createTestConfig({
        loadById: vi.fn(() => loadByIdAction),
      });
      const { Wrapper } = createWrapper(['/test-entities/edit/123']);
      renderHook(() => useEntityEditor(config), { wrapper: Wrapper });

      expect(config.loadById).toHaveBeenCalledWith('123', expect.anything());
    });
  });
});
