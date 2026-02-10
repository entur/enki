import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import GeneralLineEditor from './index';
import Line from 'model/Line';
import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import { Organisation } from 'model/Organisation';
import { Network } from 'model/Network';
import { Branding } from 'model/Branding';
import { VEHICLE_MODE } from 'model/enums';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

describe('GeneralLineEditor', () => {
  const mockLine: Line = {
    name: 'Test Line 201',
    description: 'A test line',
    publicCode: '201',
    privateCode: 'PRV-201',
    transportMode: VEHICLE_MODE.BUS,
    networkRef: 'net-1',
    operatorRef: 'op-1',
    journeyPatterns: [],
    notices: [],
  };

  const defaultProps = {
    line: mockLine,
    operators: [
      {
        id: 'op-1',
        name: { lang: 'en', value: 'Test Operator' },
        type: 'operator',
      },
    ] as Organisation[],
    networks: [
      { id: 'net-1', name: 'Test Network', authorityRef: 'auth-1' },
    ] as Network[],
    brandings: [{ id: 'br-1', name: 'Test Branding' }] as Branding[],
    onChange: vi.fn(),
    spoilPristine: false,
  };

  it('renders name, description, public code, and private code fields', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(screen.getByLabelText(/^Name/)).toHaveValue('Test Line 201');
    expect(screen.getByLabelText('Description')).toHaveValue('A test line');
    expect(screen.getByLabelText(/Public code/)).toHaveValue('201');
    expect(screen.getByLabelText('Private code')).toHaveValue('PRV-201');
  });

  it('renders operator, network, and branding dropdowns', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(screen.getByLabelText('Operator *')).toBeInTheDocument();
    expect(screen.getByLabelText('Network *')).toBeInTheDocument();
    expect(screen.getByLabelText('Branding')).toBeInTheDocument();
  });

  it('renders transport mode dropdown', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(screen.getByLabelText('Transport mode *')).toBeInTheDocument();
  });

  it('calls onChange when name is changed', async () => {
    const onChange = vi.fn();
    render(<GeneralLineEditor {...defaultProps} onChange={onChange} />);
    const nameInput = screen.getByLabelText(/^Name/);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows the "About the line" heading', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(screen.getByText('About the line')).toBeInTheDocument();
  });

  it('renders notices section', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(screen.getByText('Notices')).toBeInTheDocument();
  });

  it('does not show flexible line type selector for regular lines', () => {
    render(<GeneralLineEditor {...defaultProps} />);
    expect(
      screen.queryByLabelText('Flexible line type *'),
    ).not.toBeInTheDocument();
  });
});

describe('GeneralLineEditor - flexible line branches', () => {
  const mockFlexibleLine: FlexibleLine = {
    name: 'Test Flex Line',
    description: 'A flexible line',
    publicCode: 'FLEX1',
    privateCode: null,
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: undefined,
    flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
    bookingArrangement: null,
    networkRef: 'net-1',
    operatorRef: 'op-1',
    journeyPatterns: [],
    notices: [],
  };

  const flexibleLineProps = {
    line: mockFlexibleLine,
    operators: [
      {
        id: 'op-1',
        name: { lang: 'en', value: 'Test Operator' },
        type: 'operator',
      },
    ] as Organisation[],
    networks: [
      { id: 'net-1', name: 'Test Network', authorityRef: 'auth-1' },
    ] as Network[],
    brandings: [{ id: 'br-1', name: 'Test Branding' }] as Branding[],
    onChange: vi.fn(),
    spoilPristine: false,
  };

  const renderFlexibleLine = (props = {}) =>
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <GeneralLineEditor {...flexibleLineProps} {...props} />
      </LocalizationProvider>,
      {
        config: {
          supportedFlexibleLineTypes: Object.values(FlexibleLineType),
        },
      },
    );

  it('shows FlexibleLineTypeSelector for flexible lines', () => {
    renderFlexibleLine();
    expect(screen.getByLabelText('Flexible line type *')).toBeInTheDocument();
  });

  it('shows BookingArrangementEditor for flexible lines', () => {
    renderFlexibleLine();
    expect(screen.getByText('Booking information')).toBeInTheDocument();
  });

  it('shows VehicleSubModeDropdown when transportMode is set', () => {
    renderFlexibleLine();
    expect(screen.getByLabelText('Transport submode *')).toBeInTheDocument();
  });

  it('hides VehicleSubModeDropdown when transportMode is undefined', () => {
    renderFlexibleLine({
      line: { ...mockFlexibleLine, transportMode: undefined },
    });
    expect(
      screen.queryByLabelText('Transport submode *'),
    ).not.toBeInTheDocument();
  });

  it('renders with flexibleLineType without crashing', () => {
    renderFlexibleLine({
      line: {
        ...mockFlexibleLine,
        flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
      },
    });
    expect(screen.getByLabelText('Flexible line type *')).toBeInTheDocument();
  });
});

describe('GeneralLineEditor - description/privateCode/publicCode branches', () => {
  const mockLine: Line = {
    name: 'Test Line 201',
    description: 'A test line',
    publicCode: '201',
    privateCode: 'PRV-201',
    transportMode: VEHICLE_MODE.BUS,
    networkRef: 'net-1',
    operatorRef: 'op-1',
    journeyPatterns: [],
    notices: [],
  };

  const defaultProps = {
    line: mockLine,
    operators: [
      {
        id: 'op-1',
        name: { lang: 'en', value: 'Test Operator' },
        type: 'operator',
      },
    ] as Organisation[],
    networks: [
      { id: 'net-1', name: 'Test Network', authorityRef: 'auth-1' },
    ] as Network[],
    brandings: [{ id: 'br-1', name: 'Test Branding' }] as Branding[],
    onChange: vi.fn(),
    spoilPristine: false,
  };

  it('calls onChange with description null when description is cleared', async () => {
    const onChange = vi.fn();
    render(<GeneralLineEditor {...defaultProps} onChange={onChange} />);
    const descInput = screen.getByLabelText('Description');
    await userEvent.clear(descInput);
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0].description).toBeNull();
  });

  it('calls onChange when private code is typed', async () => {
    const onChange = vi.fn();
    render(<GeneralLineEditor {...defaultProps} onChange={onChange} />);
    const privateCodeInput = screen.getByLabelText('Private code');
    await userEvent.type(privateCodeInput, 'X');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0].privateCode).toBe('PRV-201X');
  });

  it('calls onChange with privateCode null when private code is cleared', async () => {
    const onChange = vi.fn();
    render(
      <GeneralLineEditor
        {...defaultProps}
        line={{ ...mockLine, privateCode: 'X' }}
        onChange={onChange}
      />,
    );
    const privateCodeInput = screen.getByLabelText('Private code');
    // Type backspace to clear single-char value
    await userEvent.clear(privateCodeInput);
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0].privateCode).toBeNull();
  });

  it('does not show publicCode error when optionalPublicCodeOnLine is true', () => {
    render(
      <GeneralLineEditor
        {...defaultProps}
        line={{ ...mockLine, publicCode: '' }}
        spoilPristine={true}
      />,
      { config: { optionalPublicCodeOnLine: true } as any },
    );
    expect(
      screen.queryByText('Public code is required.'),
    ).not.toBeInTheDocument();
  });

  it('shows publicCode error when optionalPublicCodeOnLine is not set', () => {
    render(
      <GeneralLineEditor
        {...defaultProps}
        line={{ ...mockLine, publicCode: '' }}
        spoilPristine={true}
      />,
    );
    expect(screen.getByText('Public code is required.')).toBeInTheDocument();
  });

  it('clears transport submode when transport mode changes', async () => {
    const onChange = vi.fn();
    const lineWithSubmode: FlexibleLine = {
      ...mockLine,
      transportSubmode: 'localBus',
      flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
      bookingArrangement: null,
    };
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <GeneralLineEditor
          {...defaultProps}
          line={lineWithSubmode}
          onChange={onChange}
        />
      </LocalizationProvider>,
      {
        config: {
          supportedFlexibleLineTypes: Object.values(FlexibleLineType),
        } as any,
      },
    );
    // Open transport mode dropdown
    const modeInput = screen.getByLabelText('Transport mode *');
    await userEvent.click(modeInput);
    // Pick a different mode from listbox
    const options = await screen.findAllByRole('option');
    const waterOption = options.find((opt) => opt.textContent === 'Water');
    expect(waterOption).toBeDefined();
    await userEvent.click(waterOption!);
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0].transportSubmode).toBeUndefined();
  });
});
