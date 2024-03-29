import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom/extend-expect';
import { STOP_PLACE_BY_QUAY_REF_QUERY } from 'api/uttu/queries';
import { RenderResult, act, getByText, render } from 'utils/test-utils';
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
  let mockedOnChange: jest.Mock<any, any>;
  beforeEach(() => {
    mockedOnChange = jest.fn();
    renderResult = render(
      <MockedProvider
        mocks={mocks}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <QuayRefField
          initialQuayRef={'TST:Quay:1'}
          errorFeedback={{ variant: undefined, feedback: undefined }}
          onChange={mockedOnChange}
        />
      </MockedProvider>
    );
  });

  it('renders without crashing', async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      getByText(renderResult.container, 'Test stop place 1')
    ).toBeInTheDocument();

    // The tech stack is too old for this:
    // expect(getByText(renderResult.container, 'Fant ikke plattform.')).toBeInTheDocument();

    // await act(async () => {
    //   const inputField = getAllByRole(renderResult.container, 'textbox')[0];
    //   await userEvent.type(inputField, 'TST:Quay:1');
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // });

    // expect(getByText(renderResult.container, 'Test stop place 1')).toBeInTheDocument();
  });
});
