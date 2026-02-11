import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import { StopPlaceTypeDropdown } from './StopPlaceTypeDropdown';
import { FLEXIBLE_STOP_AREA_TYPE } from 'model/enums';

describe('StopPlaceTypeDropdown', () => {
  const defaultProps = {
    label: 'Stop place type',
    keyValues: undefined as any,
    keyValuesUpdate: vi.fn(),
  };

  it('renders the autocomplete with label', () => {
    render(<StopPlaceTypeDropdown {...defaultProps} />);
    expect(screen.getByLabelText('Stop place type')).toBeInTheDocument();
  });

  it('shows no value when keyValues is undefined', () => {
    render(<StopPlaceTypeDropdown {...defaultProps} />);
    const input = screen.getByLabelText('Stop place type') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('shows selected value when keyValues contains FlexibleStopAreaType', () => {
    render(
      <StopPlaceTypeDropdown
        {...defaultProps}
        keyValues={[
          {
            key: 'FlexibleStopAreaType',
            values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
          },
        ]}
      />,
    );
    const input = screen.getByLabelText('Stop place type') as HTMLInputElement;
    expect(input.value).toBe('Anywhere within polygon');
  });

  it('shows options when clicking the dropdown', async () => {
    const user = userEvent.setup();
    render(<StopPlaceTypeDropdown {...defaultProps} />);
    const input = screen.getByLabelText('Stop place type');
    await user.click(input);

    expect(screen.getByText('Anywhere within polygon')).toBeInTheDocument();
    expect(
      screen.getByText('Only on stop places within polygon'),
    ).toBeInTheDocument();
  });

  it('calls keyValuesUpdate when selecting an option', async () => {
    const keyValuesUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <StopPlaceTypeDropdown
        {...defaultProps}
        keyValuesUpdate={keyValuesUpdate}
      />,
    );

    const input = screen.getByLabelText('Stop place type');
    await user.click(input);
    await user.click(screen.getByText('Anywhere within polygon'));

    expect(keyValuesUpdate).toHaveBeenCalledWith([
      {
        key: 'FlexibleStopAreaType',
        values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
      },
    ]);
  });

  it('calls keyValuesUpdate with empty array when clearing selection', async () => {
    const keyValuesUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <StopPlaceTypeDropdown
        {...defaultProps}
        keyValues={[
          {
            key: 'FlexibleStopAreaType',
            values: [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK],
          },
        ]}
        keyValuesUpdate={keyValuesUpdate}
      />,
    );

    // Click the clear button (MUI Autocomplete renders it as a button with "Clear")
    const clearButton = screen.getByTitle('Clear');
    await user.click(clearButton);

    expect(keyValuesUpdate).toHaveBeenCalledWith([]);
  });
});
