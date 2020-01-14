import React from 'react';
import PropTypes from 'prop-types';

import ContentCheckbox from '../ContentCheckbox';

import './styles.scss';

class WeekdayPicker extends React.Component {
  handleDayChange(i) {
    const days = this.props.days.slice();
    days[i] = !days[i];
    this.props.onDaysChange(days);
  }

  render() {
    const { days } = this.props;

    return (
      <div className="weekday-picker">
        <div className="checkboxes">
          <ContentCheckbox
            isChecked={days[0]}
            onChange={() => this.handleDayChange(0)}
          >
            M
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[1]}
            onChange={() => this.handleDayChange(1)}
          >
            T
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[2]}
            onChange={() => this.handleDayChange(2)}
          >
            O
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[3]}
            onChange={() => this.handleDayChange(3)}
          >
            T
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[4]}
            onChange={() => this.handleDayChange(4)}
          >
            F
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[5]}
            onChange={() => this.handleDayChange(5)}
          >
            L
          </ContentCheckbox>
          <ContentCheckbox
            isChecked={days[6]}
            onChange={() => this.handleDayChange(6)}
          >
            S
          </ContentCheckbox>
        </div>
      </div>
    );
  }
}

WeekdayPicker.propTypes = {
  days: PropTypes.arrayOf(PropTypes.bool).isRequired,
  onDaysChange: PropTypes.func.isRequired
};

export default WeekdayPicker;
