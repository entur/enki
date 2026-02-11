import { Autocomplete, Link, TextField } from '@mui/material';
import { useConfig } from 'config/ConfigContext';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import { isBlank } from 'helpers/forms';
import { getMuiErrorProps } from 'helpers/muiFormHelpers';
import usePristine from 'hooks/usePristine';
import { FlexibleLineType } from 'model/FlexibleLine';
import { MessagesKey } from 'i18n/translationKeys';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import FlexibleLineTypeDrawer from './FlexibleLineTypeDrawer';

interface Props {
  flexibleLineType: FlexibleLineType | undefined;
  onChange: (flexibleLineType: FlexibleLineType) => void;
  spoilPristine: boolean;
}

export const FlexibleLineTypeSelector = ({
  flexibleLineType,
  onChange,
  spoilPristine,
}: Props) => {
  const [showDrawer, setDrawer] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const flexibleLineTypePristine = usePristine(flexibleLineType, spoilPristine);
  const { supportedFlexibleLineTypes } = useConfig();

  const getDropdownItems = useCallback((): NormalizedDropdownItemType[] => {
    const mappedFlexibleLineTypes = (
      Object.values(FlexibleLineType) as Array<FlexibleLineType>
    ).filter((e) => supportedFlexibleLineTypes?.includes(e));

    return mappedFlexibleLineTypes.map((type) => ({
      value: type,
      label: formatMessage({
        id: `flexibleLineType_${type}` as keyof MessagesKey,
      }),
    }));
  }, [supportedFlexibleLineTypes, formatMessage]);

  const items = getDropdownItems();
  const selectedItem =
    items.find((item) => item.value === flexibleLineType) || null;
  const errorProps = getMuiErrorProps(
    formatMessage({ id: 'flexibleLineTypeEmpty' }),
    !isBlank(flexibleLineType),
    flexibleLineTypePristine,
  );

  return (
    <>
      <Link
        component="button"
        type="button"
        sx={{ mb: 0.75 }}
        aria-label={formatMessage({ id: 'drawerAria' })}
        onClick={() => setDrawer(true)}
      >
        {formatMessage({ id: 'typeFormGroupTitleTooltip' })}
      </Link>
      <Autocomplete
        options={items}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        value={selectedItem}
        onChange={(_event, newValue) => {
          if (newValue) {
            onChange(newValue.value as FlexibleLineType);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: 'generalTypeFormGroupTitle' })}
            placeholder={formatMessage({ id: 'defaultOption' })}
            {...errorProps}
          />
        )}
      />

      <FlexibleLineTypeDrawer
        open={showDrawer}
        onDismiss={() => setDrawer(false)}
        title={formatMessage({ id: 'generalDrawerTitle' })}
      />
    </>
  );
};
