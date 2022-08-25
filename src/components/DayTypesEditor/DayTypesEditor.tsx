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
  const { data: allDayTypesData, refetch } =
    useQuery<DayTypesData>(GET_DAY_TYPES);

  const [openDayTypeModal, setOpenDayTypeModal] = useState(false);
  const { formatMessage } = useSelector(selectIntl);

  const onOpenDayTypeModal = useCallback(
    (open: boolean) => {
      if (open) {
        refetch();
      }
      setOpenDayTypeModal(open);
    },
    [refetch]
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <MultiSelect
          label={formatMessage('dayTypesEditorSelectLabel')}
          items={() =>
            allDayTypesData?.dayTypes.map((dt) => ({
              label: dt.name || dt.id!,
              value: dt.id!,
            })) || []
          }
          selectedItems={
            dayTypes?.map((dt) => ({
              label: dt.name || dt.id!,
              value: dt.id!,
            })) || []
          }
          onSelectedItemsChange={(items) => {
            const selectedIds = items.selectedItems?.map((item) => item.value);
            onChange(
              allDayTypesData?.dayTypes.filter((dt) =>
                selectedIds?.includes(dt.id!)
              ) || []
            );
          }}
        />
        <div style={{ marginLeft: '1rem' }}>
          <SecondaryButton onClick={() => onOpenDayTypeModal(true)}>
            Edit day types
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
