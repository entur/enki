import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { STOP_PLACE_BY_QUAY_REF_QUERY } from 'api/uttu/queries';
import {
  RenderResult,
  act,
  getAllByRole,
  getByText,
  render,
  userEvent,
} from 'utils/test-utils';
import { Mock } from 'vitest';
import { QuayRefField } from './QuayRefField';

const mocks = [
  {
    request: {
      query: STOP_PLACE_BY_QUAY_REF_QUERY,
      variables: { id: undefined },
    },
    result: {
      data: {
        stopPlaceByQuayRef: null,
      },
    },
  },
  {
    request: {
      query: STOP_PLACE_BY_QUAY_REF_QUERY,
      variables: { id: 'TST:Quay:1' },
    },
    result: {
      data: {
        stopPlaceByQuayRef: {
          id: 'TST:StopPlace:1',
          name: {
            value: 'Test stop place',
          },
          quays: [
            {
              id: 'TST:Quay:1',
              publicCode: '1',
            },
          ],
        },
      },
    },
  },
];

describe('QuayRefField', () => {
  let renderResult: RenderResult;
  let mockedOnChange: Mock;

  it('renders without crashing', async () => {
    mockedOnChange = vi.fn();
    renderResult = render(
      <MockedProvider
        mocks={mocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <QuayRefField
          errorFeedback={{ variant: undefined, feedback: undefined }}
          onChange={mockedOnChange}
        />
      </MockedProvider>,
    );

    expect(
      getByText(renderResult.container, 'Quay not found'),
    ).toBeInTheDocument();

    await act(async () => {
      const inputField = getAllByRole(renderResult.container, 'textbox')[0];
      await userEvent.type(inputField, 'TST:Quay:1');
      inputField.blur();
    });

    expect(mockedOnChange).toHaveBeenCalled();

    // TODO: this does not work in vitest
    //expect(getByText(renderResult.container, 'Test stop place 1')).toBeInTheDocument();
  });
});
