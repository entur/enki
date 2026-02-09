import { render, screen } from '../../utils/test-utils';
import FlexibleLines from './index';
import { mockFlexibleLines, mockOrganisations } from '../../mocks/mockData';

describe('FlexibleLines listing', () => {
  const preloadedState = {
    flexibleLines: mockFlexibleLines as any,
    organisations: mockOrganisations as any,
  };

  it('renders the page header', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders flexible line names', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('Fleksirute Oslo Sentrum')).toBeInTheDocument();
    expect(screen.getByText('Bygdøy Ferge Flex')).toBeInTheDocument();
  });

  it('renders public codes', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('F101')).toBeInTheDocument();
    expect(screen.getByText('F102')).toBeInTheDocument();
  });

  it('renders private codes', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('FLEX101')).toBeInTheDocument();
    expect(screen.getByText('FLEX102')).toBeInTheDocument();
  });

  it('resolves operator names from organisations', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    expect(screen.getByText('Vy Buss AS')).toBeInTheDocument();
    expect(screen.getByText('Boreal Transport')).toBeInTheDocument();
  });

  it('renders a create button linking to /flexible-lines/create', () => {
    render(<FlexibleLines />, {
      routerProps: { initialEntries: ['/flexible-lines'] },
      preloadedState,
    });
    const createLink = screen.getByRole('link');
    expect(createLink).toHaveAttribute('href', '/flexible-lines/create');
  });
});
