import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Button,
  TextField,
  Label,
  FormGroup,
  DropDown,
  DropDownOptions
} from '@entur/component-library';

import './styles.scss';

class TimeUnitPicker extends React.Component {
  state = { open: false };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick(e) {
    if (this.props.disabled) {
      return;
    }

    if (e.button === 0) {
      if (this.trigger && this.trigger.contains(e.target)) {
        this.showPickers(!this.state.open);
      } else if (this.picker && !this.picker.contains(e.target)) {
        this.showPickers(false);
      }
    }
  }

  showPickers(open) {
    this.setState({ open });
  }

  render() {
    const {
      onUnitChange,
      onReset,
      label,
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      showYears,
      showMonths,
      showDays,
      showHours,
      showMinutes,
      showSeconds,
      textValue,
      position,
      className
    } = this.props;
    const { open } = this.state;

    const classNames = cx(className, 'time-unit-picker');
    const containerClassNames = cx('pickers-container', position);

    return (
      <div className={classNames}>
        {label && <Label>{label}</Label>}

        <div ref={div => (this.trigger = div)}>
          <TextField value={textValue} readOnly={true} />
        </div>

        {open && (
          <div className={containerClassNames} ref={div => (this.picker = div)}>
            <div className="pickers">
              {showYears && (
                <Picker
                  label="År"
                  value={years}
                  onChange={value => onUnitChange('years', value)}
                  nrOfOptions={10}
                />
              )}

              {showMonths && (
                <Picker
                  label="Måneder"
                  value={months}
                  onChange={value => onUnitChange('months', value)}
                  nrOfOptions={12}
                />
              )}

              {showDays && (
                <Picker
                  label="Dager"
                  value={days}
                  onChange={value => onUnitChange('days', value)}
                  nrOfOptions={31}
                />
              )}

              {showHours && (
                <Picker
                  label="Timer"
                  value={hours}
                  onChange={value => onUnitChange('hours', value)}
                  nrOfOptions={24}
                />
              )}

              {showMinutes && (
                <Picker
                  label="Minutter"
                  value={minutes}
                  onChange={value => onUnitChange('minutes', value)}
                  nrOfOptions={60}
                />
              )}

              {showSeconds && (
                <Picker
                  label="Sekunder"
                  value={seconds}
                  onChange={value => onUnitChange('seconds', value)}
                  nrOfOptions={60}
                />
              )}
            </div>

            <div className="buttons">
              {onReset && (
                <Button
                  variant="negative"
                  onClick={() => {
                    onReset();
                    this.showPickers(false);
                  }}
                >
                  Nullstill
                </Button>
              )}

              <Button variant="success" onClick={() => this.showPickers(false)}>
                Ferdig
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

TimeUnitPicker.propTypes = {
  onUnitChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string,
  years: PropTypes.number,
  months: PropTypes.number,
  days: PropTypes.number,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  seconds: PropTypes.number,
  showYears: PropTypes.bool,
  showMonths: PropTypes.bool,
  showDays: PropTypes.bool,
  showHours: PropTypes.bool,
  showMinutes: PropTypes.bool,
  showSeconds: PropTypes.bool,
  textValue: PropTypes.string,
  position: PropTypes.oneOf(['above', 'below']),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

TimeUnitPicker.defaultProps = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  textValue: '',
  position: 'below'
};

const Picker = ({ label, value, onChange, nrOfOptions }) => {
  const getOptions = () => {
    const options = [];
    for (let i = 0; i < nrOfOptions; i++) {
      options.push(
        <DropDownOptions
          value={i}
          key={'option-' + i}
          label={i < 10 ? '0' + i : i}
        />
      );
    }
    return options;
  };

  return (
    <div className="picker">
      <FormGroup inputId="TimeUnitPicker" title={label}>
        <DropDown
          value={value.toString()}
          onChange={e => onChange(e.target.value)}
        >
          {getOptions()}
        </DropDown>
      </FormGroup>
    </div>
  );
};

Picker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  nrOfOptions: PropTypes.number.isRequired
};

export default TimeUnitPicker;
