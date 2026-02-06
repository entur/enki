import { Button, TextField, Autocomplete } from '@mui/material';
import { NormalizedDropdownItemType } from 'helpers/dropdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export enum TimeUnitPickerPosition {
  ABOVE = 'above',
  BELOW = 'below',
}

type Props = {
  onUnitChange: (unit: string, value: number) => void;
  onReset: () => void;
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  showYears?: boolean;
  showMonths?: boolean;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  textValue?: string;
  position?: TimeUnitPickerPosition;
  disabled?: boolean;
  className?: string;
};

export default (props: Props) => {
  const {
    onUnitChange,
    onReset,
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    textValue = '',
    position = TimeUnitPickerPosition.ABOVE,
    className,
    showYears = true,
    showMonths = true,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = false,
    disabled = false,
  } = props;

  const classNames = className || '';

  const { formatMessage } = useIntl();

  const [isOpen, setOpen] = useState(false);

  const triggerEl = useRef<HTMLDivElement>(null);
  const pickerEl = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      if (!disabled) {
        if (ev.button === 0) {
          if (
            triggerEl.current &&
            triggerEl.current.contains(ev.target as Node)
          ) {
            setOpen(!isOpen);
          } else if (
            pickerEl.current &&
            !pickerEl.current.contains(ev.target as Node)
          ) {
            setOpen(false);
          }
        }
      }
    },
    [triggerEl, pickerEl, isOpen, disabled],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return (
    <div className={classNames} style={{ position: 'relative' }}>
      <div ref={triggerEl}>
        <TextField
          label=""
          value={textValue}
          slotProps={{ input: { readOnly: true } }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            width: 400,
            padding: 25,
            backgroundColor: '#ebebf1',
            textAlign: 'center',
            ...(position === 'above' ? { bottom: 60 } : { marginTop: 15 }),
          }}
          ref={pickerEl}
        >
          <div>
            {showYears && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerYearsLabel' })}
                value={years}
                onChange={(value) => onUnitChange('years', value)}
                nrOfOptions={10}
              />
            )}

            {showMonths && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerMonthsLabel' })}
                value={months}
                onChange={(value) => onUnitChange('months', value)}
                nrOfOptions={12}
              />
            )}

            {showDays && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerDaysLabel' })}
                value={days}
                onChange={(value) => onUnitChange('days', value)}
                nrOfOptions={31}
              />
            )}

            {showHours && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerHoursLabel' })}
                value={hours}
                onChange={(value) => onUnitChange('hours', value)}
                nrOfOptions={24}
              />
            )}

            {showMinutes && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerMinutesLabel' })}
                value={minutes}
                onChange={(value) => onUnitChange('minutes', value)}
                nrOfOptions={60}
              />
            )}

            {showSeconds && (
              <Picker
                label={formatMessage({ id: 'timeUnitPickerSecondsLabel' })}
                value={seconds}
                onChange={(value) => onUnitChange('seconds', value)}
                nrOfOptions={60}
              />
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 35,
              gap: 12,
            }}
          >
            {onReset && (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
              >
                {formatMessage({ id: 'timeUnitPickerResetLabel' })}
              </Button>
            )}

            <Button
              variant="contained"
              color="success"
              onClick={() => setOpen(false)}
            >
              {formatMessage({ id: 'timeUnitPickerDoneLabel' })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

type PickerProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  nrOfOptions: number;
};

const Picker = ({ label, value, onChange, nrOfOptions }: PickerProps) => {
  const options = [...Array(nrOfOptions).keys()].map((i) => ({
    value: `${i}`,
    label: `${i < 10 ? '0' + i : i}`,
  }));

  return (
    <div style={{ marginBottom: 20, fontWeight: 500 }}>
      <Autocomplete
        options={options}
        getOptionLabel={(option: NormalizedDropdownItemType) => option.label}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        value={{
          value: `${value}`,
          label: `${value < 10 ? '0' + value : value}`,
        }}
        onChange={(_e, item) => onChange(parseInt(item?.value || '0'))}
        disableClearable
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </div>
  );
};
