import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import { FlexibleStopPlaceSelector } from './FlexibleStopPlaceSelector';
import {
  createFlexibleStopPlace,
  createFlexibleStopPoint,
} from 'test/factories';

const stopPlace1 = createFlexibleStopPlace({
  id: 'FSP:1',
  name: 'Flex Stop Alpha',
});
const stopPlace2 = createFlexibleStopPlace({
  id: 'FSP:2',
  name: 'Flex Stop Beta',
});

const defaultStopPoint = createFlexibleStopPoint({
  flexibleStopPlaceRef: 'FSP:1',
});

const renderSelector = (
  props: Partial<React.ComponentProps<typeof FlexibleStopPlaceSelector>> = {},
  stateOverrides = {},
) => {
  const defaultProps = {
    stopPoint: defaultStopPoint,
    spoilPristine: false,
    stopPlaceError: undefined as any,
    onChange: vi.fn(),
    ...props,
  };
  return render(<FlexibleStopPlaceSelector {...defaultProps} />, {
    preloadedState: {
      flexibleStopPlaces: [stopPlace1, stopPlace2],
      ...stateOverrides,
    },
  });
};

describe('FlexibleStopPlaceSelector', () => {
  it('renders with matching stop place selected', () => {
    renderSelector();
    expect(screen.getByLabelText('Flexible stop place *')).toBeInTheDocument();
    // The input should display the label of the matched stop place
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Flex Stop Alpha');
  });

  it('renders with null flexibleStopPlaces (empty dropdown)', () => {
    renderSelector({}, { flexibleStopPlaces: null });
    expect(screen.getByLabelText('Flexible stop place *')).toBeInTheDocument();
  });

  it('shows error when spoilPristine is true and stopPlaceError is set', () => {
    renderSelector({
      spoilPristine: true,
      stopPlaceError: 'flexibleStopPlaceRefAndQuayRefNoValues',
    });
    const input = screen.getByLabelText('Flexible stop place *');
    expect(input.closest('.MuiInputBase-root')).toHaveClass('Mui-error');
    expect(screen.getByText('You must select a place')).toBeInTheDocument();
  });

  it('does not show error when pristine even with error key', () => {
    renderSelector({
      spoilPristine: false,
      stopPlaceError: 'flexibleStopPlaceRefAndQuayRefNoValues',
    });
    const input = screen.getByLabelText('Flexible stop place *');
    expect(input.closest('.MuiInputBase-root')).not.toHaveClass('Mui-error');
  });

  it('does not show error when no error key', () => {
    renderSelector({
      spoilPristine: true,
      stopPlaceError: undefined,
    });
    const input = screen.getByLabelText('Flexible stop place *');
    expect(input.closest('.MuiInputBase-root')).not.toHaveClass('Mui-error');
  });

  it('calls onChange when selecting a different option', async () => {
    const onChange = vi.fn();
    renderSelector({ onChange });
    const user = userEvent.setup();

    // Open the autocomplete dropdown
    const input = screen.getByRole('combobox');
    await user.clear(input);
    await user.type(input, 'Beta');

    // Select the option
    const option = await screen.findByText('Flex Stop Beta');
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ flexibleStopPlaceRef: 'FSP:2' }),
    );
  });
});
