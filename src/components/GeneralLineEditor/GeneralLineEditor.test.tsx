import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import GeneralLineEditor from './index';
import Line from 'model/Line';
import { VEHICLE_MODE } from 'model/enums';

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
        name: { value: 'Test Operator' },
        legalName: { value: 'Test Legal' },
        contactDetails: {},
      },
    ],
    networks: [{ id: 'net-1', name: 'Test Network' }],
    brandings: [{ id: 'br-1', name: 'Test Branding' }],
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
    expect(screen.queryByLabelText('Type *')).not.toBeInTheDocument();
  });
});
