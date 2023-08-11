import { act, renderHook } from '@testing-library/react';
import * as actions from 'actions/flexibleStopPlaces';
import { store } from 'app/store';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useHandleOnSaveClick } from './useHandleOnSaveClick';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('useHandleOnSaveClick', () => {
  it('with errors it should not attempt to save', () => {
    const onCall = jest.fn();
    const onSaveStart = jest.fn();
    const onSaveEnd = jest.fn();
    const testSubject: FlexibleStopPlace = {};
    const errors = {
      name: ['validateFormErrorNameEmpty'],
      flexibleArea: ['validateFormErrorFlexibleAreaNotEnoughPolygons'],
    };

    const { result } = renderHook(
      () =>
        useHandleOnSaveClick(
          testSubject,
          onCall,
          onSaveStart,
          onSaveEnd,
          errors
        ),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>
            <MemoryRouter>
              <IntlProvider locale="en">{children}</IntlProvider>
            </MemoryRouter>
          </Provider>
        ),
      }
    );

    result.current();

    expect(onCall).toBeCalledTimes(1);
    expect(onSaveStart).toBeCalledTimes(0);
    expect(onSaveEnd).toBeCalledTimes(0);
  });

  it('without errors works', async () => {
    // @ts-ignore
    actions.saveFlexibleStopPlace = jest
      .fn()
      .mockReturnValueOnce(() => Promise.resolve());

    const onCall = jest.fn();
    const onSaveStart = jest.fn();
    const onSaveEnd = jest.fn();
    const testSubject: FlexibleStopPlace = {};
    const errors = {
      name: [],
      flexibleArea: [],
    };

    const { result } = renderHook(
      () =>
        useHandleOnSaveClick(
          testSubject,
          onCall,
          onSaveStart,
          onSaveEnd,
          errors
        ),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>
            <MemoryRouter>
              <IntlProvider locale="en">{children}</IntlProvider>
            </MemoryRouter>
          </Provider>
        ),
      }
    );

    result.current();

    expect(onCall).toBeCalledTimes(1);
    expect(onSaveStart).toBeCalledTimes(1);

    // Is there a better way?
    await act(() => sleep(0));
    expect(onSaveEnd).toBeCalledTimes(1);
  });
});
