import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { FlexibleLineTypeSelector } from './FlexibleLineTypeSelector';
import { FlexibleLineType } from 'model/FlexibleLine';

describe('FlexibleLineTypeSelector', () => {
  const defaultProps = {
    flexibleLineType: undefined as FlexibleLineType | undefined,
    onChange: vi.fn(),
    spoilPristine: false,
  };

  const allFlexibleTypes: FlexibleLineType[] = [
    FlexibleLineType.FLEXIBLE_AREAS_ONLY,
    FlexibleLineType.MIXED_FLEXIBLE,
    FlexibleLineType.FIXED,
  ];

  it('renders the type dropdown', () => {
    render(<FlexibleLineTypeSelector {...defaultProps} />, {
      config: { supportedFlexibleLineTypes: allFlexibleTypes },
    });
    expect(screen.getByLabelText('Flexible line type *')).toBeInTheDocument();
  });

  it('renders the help link', () => {
    render(<FlexibleLineTypeSelector {...defaultProps} />, {
      config: { supportedFlexibleLineTypes: allFlexibleTypes },
    });
    expect(
      screen.getByText('Read more about the line types'),
    ).toBeInTheDocument();
  });

  it('shows selected flexible line type', () => {
    render(
      <FlexibleLineTypeSelector
        {...defaultProps}
        flexibleLineType={FlexibleLineType.FLEXIBLE_AREAS_ONLY}
      />,
      { config: { supportedFlexibleLineTypes: allFlexibleTypes } },
    );
    expect(screen.getByDisplayValue('Flexible areas only')).toBeInTheDocument();
  });

  it('opens drawer when help link is clicked', async () => {
    render(<FlexibleLineTypeSelector {...defaultProps} />, {
      config: { supportedFlexibleLineTypes: allFlexibleTypes },
    });
    await userEvent.click(screen.getByText('Read more about the line types'));
    await waitFor(() => {
      expect(screen.getByText('Flexible line types.')).toBeInTheDocument();
    });
  });

  it('calls onChange when a type is selected', async () => {
    const onChange = vi.fn();
    render(<FlexibleLineTypeSelector {...defaultProps} onChange={onChange} />, {
      config: { supportedFlexibleLineTypes: allFlexibleTypes },
    });
    const input = screen.getByLabelText('Flexible line type *');
    await userEvent.click(input);
    const option = await screen.findByText('Flexible areas only');
    await userEvent.click(option);
    expect(onChange).toHaveBeenCalledWith(FlexibleLineType.FLEXIBLE_AREAS_ONLY);
  });
});
