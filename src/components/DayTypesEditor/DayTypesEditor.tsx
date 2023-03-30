import { useQuery } from '@apollo/client';
import { SecondaryButton } from '@entur/button';
import { MultiSelect } from '@entur/dropdown';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import { selectIntl } from 'i18n';
import DayType from 'model/DayType';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
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
  const { formatMessage } = useSelector(selectIntl);

  const onOpenDayTypeModal = useCallback(
    (open: boolean) => {
      refetch();
      setOpenDayTypeModal(open);
    },
    [refetch]
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <MultiSelect
          clearable
          style={{ minWidth: '20rem' }}
          label={formatMessage('dayTypesEditorSelectLabel')}
          items={() =>
            allDayTypesData?.dayTypes.map((dt: DayType) => ({
              label: `${dt.name || dt.id!}`,
              value: `${dt.id!}`,
            })) || []
          }
          initialSelectedItems={
            dayTypes?.map((dt) => ({
              label: dt.name || dt.id!,
              value: dt.id!,
            })) || []
          }
          onChange={(items: any) => {
            const selectedIds = items?.map((item: any) => item.value);
            onChange(
              allDayTypesData?.dayTypes.filter((dt) =>
                selectedIds?.includes(dt.id!)
              ) || []
            );
          }}
        />

        <div style={{ marginLeft: '1rem' }}>
          <SecondaryButton onClick={() => onOpenDayTypeModal(true)}>
            {formatMessage('dayTypesEditButton')}
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
