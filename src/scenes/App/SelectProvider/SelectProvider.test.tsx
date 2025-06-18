import { render, userEvent } from '../../../utils/test-utils';
import { SelectProvider } from './SelectProvider';
import { MemoryRouter } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { useEffect } from 'react';
import { fetchUserContext } from '../../../auth/userContextSlice';
import { waitFor } from '@testing-library/react';

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
  it('should render without crashing', async () => {
    const user = userEvent.setup();

    const container = render(
      <Wrapper>
        <MemoryRouter>
          <SelectProvider />
        </MemoryRouter>
      </Wrapper>,
    );

    // Wait for the dropdown to be rendered with the provider data
    await waitFor(() => {
      expect(container.getByRole('combobox')).toBeInTheDocument();
    });

    // Open the dropdown
    const toggleButton = container.getByRole('button', {
      name: /Åpne liste med valg/i,
    });
    await user.click(toggleButton);

    // Wait for the dropdown list to appear
    await waitFor(async () => {
      const providerOption = await container.findByText('Test provider');
      expect(providerOption).toBeInTheDocument();
    });

    // Click on the provider option
    await user.click(await container.findByText('Test provider'));

    // Check if the selected item is displayed in the dropdown
    await waitFor(() => {
      expect(container.getByRole('combobox')).toHaveTextContent(
        'Test provider',
      );
    });
  });
});
