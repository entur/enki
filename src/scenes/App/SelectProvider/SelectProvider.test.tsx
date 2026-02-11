import { render, userEvent, waitFor, screen } from '../../../utils/test-utils';
import { SelectProvider } from './SelectProvider';
import { MemoryRouter } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { useEffect } from 'react';
import { fetchUserContext } from '../../../auth/userContextSlice';
import { store } from '../../../utils/test-utils';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchUserContext({
        uttuApiUrl: 'https://example.com/api',
        getAccessToken: () => Promise.resolve(''),
      }),
    );
  }, []);

  return children;
};

describe('SelectProvider', () => {
  it('should render and allow selecting a provider', async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <MemoryRouter>
          <SelectProvider />
        </MemoryRouter>
      </Wrapper>,
    );

    // Wait for fetchUserContext thunk to populate the store with providers
    await waitFor(() => {
      expect(store.getState().userContext.providers.length).toBeGreaterThan(0);
    });

    // Now the combobox should be rendered with options available
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    // Open the dropdown by clicking the input
    await user.click(input);

    // Wait for the provider option to appear in the dropdown
    const providerOption = await screen.findByText('Test provider');
    expect(providerOption).toBeInTheDocument();

    // Click on the provider option
    await user.click(providerOption);

    // Check if the selected item is displayed in the input
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('Test provider');
    });
  });
});
