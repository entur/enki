import { NegativeButton, SuccessButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import './styles.scss';

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

  const classNames = cx(className, 'time-unit-picker');
  const containerClassNames = cx('pickers-container', position);

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
    <div className={classNames}>
      <div ref={triggerEl}>
        <TextField label="" value={textValue} readOnly={true} />
      </div>

      {isOpen && (
        <div className={containerClassNames} ref={pickerEl}>
          <div className="pickers">
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

          <div className="buttons">
            {onReset && (
              <NegativeButton
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
              >
                {formatMessage({ id: 'timeUnitPickerResetLabel' })}
              </NegativeButton>
            )}

            <SuccessButton onClick={() => setOpen(false)}>
              {formatMessage({ id: 'timeUnitPickerDoneLabel' })}
            </SuccessButton>
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
    <div className="picker">
      <Dropdown
        items={options}
        label={label}
        selectedItem={{
          value: `${value}`,
          label: `${value < 10 ? '0' + value : value}`,
        }}
        onChange={(e) => onChange(parseInt(e?.value || ''))}
        placeholder={value.toString()}
      />
    </div>
  );
};
