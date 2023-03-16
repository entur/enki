import React, { useState, useRef, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { NegativeButton, SuccessButton } from '@entur/button';
import { useSelector } from 'react-redux';
import { selectIntl, AppIntlState } from 'i18n';
import { GlobalState } from 'reducers';
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

  const { formatMessage } = useSelector<GlobalState, AppIntlState>(selectIntl);

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
    [triggerEl, pickerEl, isOpen, disabled]
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
        <TextField value={textValue} readOnly={true} label="" />
      </div>

      {isOpen && (
        <div className={containerClassNames} ref={pickerEl}>
          <div className="pickers">
            {showYears && (
              <Picker
                label={formatMessage('timeUnitPickerYearsLabel')}
                value={years}
                onChange={(value) => onUnitChange('years', value)}
                nrOfOptions={10}
              />
            )}

            {showMonths && (
              <Picker
                label={formatMessage('timeUnitPickerMonthsLabel')}
                value={months}
                onChange={(value) => onUnitChange('months', value)}
                nrOfOptions={12}
              />
            )}

            {showDays && (
              <Picker
                label={formatMessage('timeUnitPickerDaysLabel')}
                value={days}
                onChange={(value) => onUnitChange('days', value)}
                nrOfOptions={31}
              />
            )}

            {showHours && (
              <Picker
                label={formatMessage('timeUnitPickerHoursLabel')}
                value={hours}
                onChange={(value) => onUnitChange('hours', value)}
                nrOfOptions={24}
              />
            )}

            {showMinutes && (
              <Picker
                label={formatMessage('timeUnitPickerMinutesLabel')}
                value={minutes}
                onChange={(value) => onUnitChange('minutes', value)}
                nrOfOptions={60}
              />
            )}

            {showSeconds && (
              <Picker
                label={formatMessage('timeUnitPickerSecondsLabel')}
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
                {formatMessage('timeUnitPickerResetLabel')}
              </NegativeButton>
            )}

            <SuccessButton onClick={() => setOpen(false)}>
              {formatMessage('timeUnitPickerDoneLabel')}
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
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e?.value || ''))}
        placeholder={value.toString()}
      />
    </div>
  );
};
