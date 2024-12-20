import { useQuery } from '@apollo/client';
import { SecondaryButton } from '@entur/button';
import { MultiSelect } from '@entur/dropdown';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import DayType from 'model/DayType';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { DayTypesModal } from './DayTypesModal';

type DayTypesData = {
  dayTypes: DayType[];
};

export const DayTypesEditor = ({
  dayTypes,
  onChange,
}: {
  dayTypes: DayType[];
  onChange: (dayTypes: DayType[]) => void;
}) => {
  const {
    data: allDayTypesData,
    refetch,
    loading,
  } = useQuery<DayTypesData>(GET_DAY_TYPES);

  const [openDayTypeModal, setOpenDayTypeModal] = useState(false);
  const { formatMessage } = useIntl();

  const onOpenDayTypeModal = useCallback(
    (open: boolean) => {
      refetch();
      setOpenDayTypeModal(open);
    },
    [refetch],
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <MultiSelect
          disabled={loading}
          clearable
          style={{ minWidth: '20rem' }}
          label={formatMessage({ id: 'dayTypesEditorSelectLabel' })}
          items={() =>
            allDayTypesData?.dayTypes.map((dt: DayType) => ({
              label: `${dt.name || dt.id!}`,
              value: `${dt.id!}`,
            })) || []
          }
          selectedItems={
            dayTypes?.map((dt) => ({
              label: dt.name || dt.id!,
              value: dt.id!,
            })) || []
          }
          labelSelectAll={formatMessage({ id: 'selectAll' })}
          labelClearAllItems={formatMessage({ id: 'clearAll' })}
          noMatchesText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
          onChange={(items: any) => {
            const selectedIds = items?.map((item: any) => item.value);
            onChange(
              allDayTypesData?.dayTypes.filter((dt) =>
                selectedIds?.includes(dt.id!),
              ) || [],
            );
          }}
        />

        <div style={{ marginLeft: '1rem' }}>
          <SecondaryButton
            onClick={() => onOpenDayTypeModal(true)}
            disabled={loading}
          >
            {formatMessage({ id: 'dayTypesEditButton' })}
          </SecondaryButton>
        </div>
      </div>
      <DayTypesModal
        open={openDayTypeModal}
        setOpen={(open: boolean) => onOpenDayTypeModal(open)}
        dayTypes={allDayTypesData?.dayTypes!}
        refetchDayTypes={refetch}
      />
    </>
  );
};
