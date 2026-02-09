import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent, fireEvent } from 'utils/test-utils';
import { CoordinatesInputField } from './CoordinatesInputField';
import { Coordinate } from 'model/GeoJSON';

describe('CoordinatesInputField', () => {
  const validCoordinates: Coordinate[] = [
    [10.0, 59.9],
    [10.1, 59.9],
    [10.1, 60.0],
    [10.0, 60.0],
    [10.0, 59.9],
  ];

  const defaultProps = {
    coordinates: validCoordinates,
    changeCoordinates: vi.fn(),
  };

  it('renders the text field with label', () => {
    render(<CoordinatesInputField {...defaultProps} />);
    expect(
      screen.getByLabelText('Coordinates in GeoJson order [Long, Lat]'),
    ).toBeInTheDocument();
  });

  it('displays serialized coordinates as initial value', () => {
    render(<CoordinatesInputField {...defaultProps} />);
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    expect(textField).toHaveValue(JSON.stringify(validCoordinates));
  });

  it('displays empty string for empty coordinates', () => {
    render(<CoordinatesInputField {...defaultProps} coordinates={[]} />);
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    expect(textField).toHaveValue('[]');
  });

  it('shows error for invalid coordinate format', async () => {
    const user = userEvent.setup();
    render(<CoordinatesInputField {...defaultProps} coordinates={[]} />);
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    await user.clear(textField);
    await user.type(textField, 'not valid json');
    expect(
      screen.getByText('The coordinates are in an invalid format'),
    ).toBeInTheDocument();
  });

  it('calls changeCoordinates on blur with valid input', () => {
    const changeCoordinates = vi.fn();
    render(
      <CoordinatesInputField
        coordinates={[]}
        changeCoordinates={changeCoordinates}
      />,
    );
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    // Use fireEvent.change to avoid userEvent parsing brackets as keyboard modifiers
    fireEvent.change(textField, {
      target: {
        value: '[[10,59.9],[10.1,59.9],[10.1,60],[10,60],[10,59.9]]',
      },
    });
    fireEvent.blur(textField);
    expect(changeCoordinates).toHaveBeenCalled();
  });

  it('does not call changeCoordinates on blur with invalid input', () => {
    const changeCoordinates = vi.fn();
    render(
      <CoordinatesInputField
        coordinates={[]}
        changeCoordinates={changeCoordinates}
      />,
    );
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    fireEvent.change(textField, { target: { value: 'invalid' } });
    fireEvent.blur(textField);
    expect(changeCoordinates).not.toHaveBeenCalled();
  });

  it('shows no error when the input is empty', async () => {
    const user = userEvent.setup();
    render(<CoordinatesInputField {...defaultProps} coordinates={[]} />);
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    await user.clear(textField);
    // Empty input should be valid (optional field)
    expect(
      screen.queryByText('The coordinates are in an invalid format'),
    ).not.toBeInTheDocument();
  });

  it('renders as a multiline text field', () => {
    render(<CoordinatesInputField {...defaultProps} />);
    const textField = screen.getByLabelText(
      'Coordinates in GeoJson order [Long, Lat]',
    );
    expect(textField.tagName).toBe('TEXTAREA');
  });
});
