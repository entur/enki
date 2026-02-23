import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'utils/test-utils';
import { DayTypesModal } from './DayTypesModal';
import { MockedProvider } from '@apollo/client/testing/react';
import { GET_DAY_TYPES_BY_IDS } from 'api/uttu/queries';

const dayTypeByIdsMock = {
  request: {
    query: GET_DAY_TYPES_BY_IDS,
    variables: (() => true) as any,
  },
  result: { data: { dayTypesByIds: [] } },
  maxUsageCount: Number.MAX_SAFE_INTEGER,
};

describe('DayTypesModal', () => {
  it('renders dialog title when open', () => {
    render(
      <MockedProvider mocks={[dayTypeByIdsMock]}>
        <DayTypesModal
          open={true}
          setOpen={vi.fn()}
          dayTypes={[]}
          refetchDayTypes={vi.fn()}
        />
      </MockedProvider>,
    );
    expect(screen.getByText('Edit day types')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(
      <MockedProvider mocks={[dayTypeByIdsMock]}>
        <DayTypesModal
          open={false}
          setOpen={vi.fn()}
          dayTypes={[]}
          refetchDayTypes={vi.fn()}
        />
      </MockedProvider>,
    );
    expect(screen.queryByText('Edit day types')).not.toBeInTheDocument();
  });
});
