import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { STOP_PLACE_BY_QUAY_REF_QUERY } from 'api/uttu/queries';
import { RenderResult, render } from 'utils/test-utils';
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

/**
 * @jest-environment jsdom
 */
describe('QuayRefField', () => {
  let renderResult: RenderResult;
  let mockedOnChange: Mock;

  it('renders without crashing', async () => {
    render(
      <MockedProvider
        mocks={mocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <QuayRefField
          errorFeedback={{ variant: undefined, feedback: undefined }}
          onChange={vi.fn()}
        />
      </MockedProvider>
    );

    // TODO: this does not work in vitest
    //expect(getByText(renderResult.container, 'Fant ikke plattform.')).toBeInTheDocument();
    // await act(async () => {
    //   const inputField = getAllByRole(renderResult.container, 'textbox')[0];
    //   await userEvent.type(inputField, 'TST:Quay:1');
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // });

    // expect(getByText(renderResult.container, 'Test stop place 1')).toBeInTheDocument();
  });
});
