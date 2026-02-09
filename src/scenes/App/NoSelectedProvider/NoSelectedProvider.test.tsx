import { render, screen } from '../../../utils/test-utils';
import { NoSelectedProvider } from './NoSelectedProvider';

describe('NoSelectedProvider', () => {
  const preloadedState = {
    userContext: {
      activeProviderCode: undefined,
      providers: [],
    } as any,
  };

  it('renders the card with data provider title', () => {
    render(<NoSelectedProvider />, {
      routerProps: { initialEntries: ['/'] },
      preloadedState,
    });
    // The title appears in both CardHeader and Autocomplete label;
    // just verify at least one is present
    const matches = screen.getAllByText('Choose data provider');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the settings icon', () => {
    render(<NoSelectedProvider />, {
      routerProps: { initialEntries: ['/'] },
      preloadedState,
    });
    expect(screen.getByTestId('TuneOutlinedIcon')).toBeInTheDocument();
  });
});
