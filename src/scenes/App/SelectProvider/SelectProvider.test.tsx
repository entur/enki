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

    expect(container.getByText('Ingen treff for søket')).toBeInTheDocument();

    await waitFor(async () => {
      await container.findByText('Test provider');
    });

    expect(container.getByRole('combobox')).toHaveTextContent('');

    await user.click(container.getByText('Test provider'));

    expect(container.getByRole('combobox')).toHaveTextContent('Test provider');
  });
});
