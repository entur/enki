import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import { render, screen, waitFor } from '../../utils/test-utils';
import Lines from './index';
import { GET_LINES } from '../../api/uttu/queries';
import { mockLines, mockOrganisations } from '../../mocks/mockData';

const mocks = [
  {
    request: {
      query: GET_LINES,
    },
    result: {
      data: {
        lines: mockLines.map(
          ({ id, name, privateCode, publicCode, operatorRef }) => ({
            id,
            name,
            privateCode,
            publicCode,
            operatorRef,
          }),
        ),
      },
    },
  },
];

function createMockClient() {
  return new ApolloClient({
    link: new MockLink(mocks, false),
    cache: new InMemoryCache(),
  });
}

describe('Lines listing', () => {
  const preloadedState = {
    organisations: mockOrganisations as any,
  };

  it('renders the page header', () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders line names after loading', async () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText('Linje 201 Majorstuen - Tøyen'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('Linje 202 Jernbanetorget - Lysaker'),
    ).toBeInTheDocument();
  });

  it('renders public codes', async () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(screen.getByText('201')).toBeInTheDocument();
    });
    expect(screen.getByText('202')).toBeInTheDocument();
  });

  it('renders private codes', async () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(screen.getByText('L201')).toBeInTheDocument();
    });
    expect(screen.getByText('L202')).toBeInTheDocument();
  });

  it('resolves operator names from organisations', async () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );

    await waitFor(() => {
      // Both lines have the same operator (TST:Operator:1 = Vy Buss AS)
      const cells = screen.getAllByText('Vy Buss AS');
      expect(cells.length).toBe(2);
    });
  });

  it('renders a create button linking to /lines/create', () => {
    render(
      <ApolloProvider client={createMockClient()}>
        <Lines />
      </ApolloProvider>,
      {
        routerProps: { initialEntries: ['/lines'] },
        preloadedState,
      },
    );
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/lines/create');
  });
});
