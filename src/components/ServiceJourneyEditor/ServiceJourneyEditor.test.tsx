import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import ServiceJourneyEditor from './index';
import { createServiceJourney, createQuayStopPoint } from 'test/factories';
import { MockedProvider } from '@apollo/client/testing/react';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const dayTypesMock = {
  request: { query: GET_DAY_TYPES },
  result: { data: { dayTypes: [] } },
};

const renderEditor = (props = {}) => {
  const defaultProps = {
    serviceJourney: createServiceJourney({
      name: 'Morning Route',
      description: 'A morning service',
      publicCode: 'M1',
      privateCode: 'PRV-M1',
      passingTimes: [{}, {}],
    }),
    stopPoints: [
      createQuayStopPoint('NSR:Quay:1'),
      createQuayStopPoint('NSR:Quay:2'),
    ],
    spoilPristine: false,
    onChange: vi.fn(),
    ...props,
  };

  return render(
    <MockedProvider mocks={[dayTypesMock]}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ServiceJourneyEditor {...defaultProps} />
      </LocalizationProvider>
    </MockedProvider>,
  );
};

describe('ServiceJourneyEditor', () => {
  it('renders name field with value', () => {
    renderEditor();
    expect(screen.getByLabelText('Name *')).toHaveValue('Morning Route');
  });

  it('renders description field with value', () => {
    renderEditor();
    expect(screen.getByLabelText('Description')).toHaveValue(
      'A morning service',
    );
  });

  it('renders public code and private code fields', () => {
    renderEditor();
    expect(screen.getByLabelText('Public code')).toHaveValue('M1');
    expect(screen.getByLabelText('Private code')).toHaveValue('PRV-M1');
  });

  it('renders operator dropdown', () => {
    renderEditor();
    expect(screen.getByLabelText('Operator')).toBeInTheDocument();
  });

  it('calls onChange when name is changed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const nameInput = screen.getByLabelText('Name *');
    await userEvent.type(nameInput, 'X');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.name).toBe('Morning RouteX');
  });

  it('calls onChange when description is changed', async () => {
    const onChange = vi.fn();
    renderEditor({ onChange });
    const descInput = screen.getByLabelText('Description');
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'New desc');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders delete button when deleteServiceJourney is provided', () => {
    renderEditor({ deleteServiceJourney: vi.fn() });
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render delete button when deleteServiceJourney is not provided', () => {
    renderEditor();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('renders copy button when copyServiceJourney is provided', () => {
    renderEditor({ copyServiceJourney: vi.fn() });
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders with empty optional fields', () => {
    renderEditor({
      serviceJourney: createServiceJourney({
        name: 'Minimal SJ',
        description: null,
        publicCode: null,
        privateCode: null,
        passingTimes: [],
      }),
      stopPoints: [],
    });
    expect(screen.getByLabelText('Name *')).toHaveValue('Minimal SJ');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('Public code')).toHaveValue('');
    expect(screen.getByLabelText('Private code')).toHaveValue('');
  });

  it('opens delete dialog when clicking delete chip', async () => {
    renderEditor({ deleteServiceJourney: vi.fn() });

    await userEvent.click(screen.getByText('Delete'));

    expect(screen.getByText('Delete service journey')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this service journey?'),
    ).toBeInTheDocument();
  });

  it('calls deleteServiceJourney when confirming delete', async () => {
    const deleteServiceJourney = vi.fn();
    renderEditor({ deleteServiceJourney });

    await userEvent.click(screen.getByText('Delete'));

    // Click the confirm button
    await userEvent.click(screen.getByText('Yes'));

    expect(deleteServiceJourney).toHaveBeenCalled();
  });

  it('does not call deleteServiceJourney when cancelling delete', async () => {
    const deleteServiceJourney = vi.fn();
    renderEditor({ deleteServiceJourney });

    await userEvent.click(screen.getByText('Delete'));

    // Click the cancel button
    await userEvent.click(screen.getByText('No'));

    expect(deleteServiceJourney).not.toHaveBeenCalled();
  });

  it('renders booking arrangement editor when flexibleLineType is provided', () => {
    renderEditor({ flexibleLineType: 'flexibleAreasOnly' });
    expect(screen.getByText('Booking information')).toBeInTheDocument();
  });

  it('does not render booking arrangement editor without flexibleLineType', () => {
    renderEditor();
    expect(screen.queryByText('Booking information')).not.toBeInTheDocument();
  });

  it('renders with operatorRef preselected', () => {
    renderEditor({
      serviceJourney: createServiceJourney({
        name: 'Route with Operator',
        operatorRef: 'ORG:1',
        passingTimes: [{}, {}],
      }),
    });
    expect(screen.getByLabelText('Name *')).toHaveValue('Route with Operator');
  });

  it('calls copyServiceJourney when copy dialog is confirmed', async () => {
    const copyServiceJourney = vi.fn();
    renderEditor({ copyServiceJourney });

    await userEvent.click(screen.getByText('Copy'));

    // Copy dialog should open
    expect(screen.getByText('Copy Service Journey')).toBeInTheDocument();
  });
});
