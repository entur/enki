import { useQuery } from '@apollo/client/react';
import { Autocomplete, Button, Checkbox, TextField } from '@mui/material';
import { GET_DAY_TYPES } from 'api/uttu/queries';
import DayType from 'model/DayType';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { DayTypesModal } from './DayTypesModal';

type DayTypesData = {
  dayTypes: DayType[];
};

type DayTypeOption = {
  label: string;
  value: string;
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

  const options: DayTypeOption[] = useMemo(
    () =>
      allDayTypesData?.dayTypes.map((dt: DayType) => ({
        label: `${dt.name || dt.id!}`,
        value: `${dt.id!}`,
      })) || [],
    [allDayTypesData],
  );

  const selectedValues: DayTypeOption[] = useMemo(
    () =>
      dayTypes?.map((dt) => ({
        label: dt.name || dt.id!,
        value: dt.id!,
      })) || [],
    [dayTypes],
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <Autocomplete
          multiple
          disabled={loading}
          sx={{ minWidth: '20rem' }}
          value={selectedValues}
          onChange={(_event, newValue: DayTypeOption[]) => {
            const selectedIds = newValue.map((item) => item.value);
            onChange(
              allDayTypesData?.dayTypes.filter((dt) =>
                selectedIds.includes(dt.id!),
              ) || [],
            );
          }}
          options={options}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          noOptionsText={formatMessage({
            id: 'dropdownNoMatchesText',
          })}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} sx={{ mr: 1 }} />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: 'dayTypesEditorSelectLabel' })}
            />
          )}
        />

        <div style={{ marginLeft: '1rem' }}>
          <Button
            variant="outlined"
            onClick={() => onOpenDayTypeModal(true)}
            disabled={loading}
          >
            {formatMessage({ id: 'dayTypesEditButton' })}
          </Button>
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
