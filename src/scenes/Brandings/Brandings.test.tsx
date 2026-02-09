import { render, screen } from '../../utils/test-utils';
import Brandings from './index';
import { mockBrandings, mockOrganisations } from '../../mocks/mockData';

describe('Brandings listing', () => {
  const preloadedState = {
    brandings: mockBrandings as any,
    organisations: mockOrganisations as any,
    userContext: { activeProviderCode: 'TST' } as any,
  };

  it('renders the page header', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders branding names', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('Ruter Flex')).toBeInTheDocument();
    expect(screen.getByText('AtB Flex')).toBeInTheDocument();
  });

  it('renders short names', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('RFlex')).toBeInTheDocument();
    expect(screen.getByText('AFlex')).toBeInTheDocument();
  });

  it('renders URLs', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    expect(screen.getByText('https://ruter.no/flex')).toBeInTheDocument();
    expect(screen.getByText('https://atb.no/flex')).toBeInTheDocument();
  });

  it('shows empty state when no brandings', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState: {
        ...preloadedState,
        brandings: [],
      },
    });
    expect(screen.getByText(/no brandings/i)).toBeInTheDocument();
  });

  it('renders a create button linking to /brandings/create', () => {
    render(<Brandings />, {
      routerProps: { initialEntries: ['/brandings'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/brandings/create');
  });
});
