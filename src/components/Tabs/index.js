import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Tab from './Tab/';

import './styles.css';

class Tabs extends Component {
  state = { selectedTabIndex: 0 };

  handleOnChangeTab(selectedTabIndex) {
    this.setState({ selectedTabIndex });
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    const { selectedTabIndex } = this.state;

    const tabs = children.reduce((tabs, child, i) => {
      if (child.type === Tab) {
        const { disabled } = child.props;
        const className = cx(
          { selected: selectedTabIndex === i },
          { disabled }
        );

        tabs.push(
          <div
            key={i}
            onClick={() => !disabled && this.handleOnChangeTab.bind(this)(i)}
            className={className}
          >
            <div>{child.props.label}</div>
          </div>
        );

        return tabs;
      }
    }, []);

    const selectedTab = children.find((child, i) => selectedTabIndex === i);

    return (
      <div className="tabs">
        <div className="tab-list">{tabs}</div>
        {selectedTab && selectedTab}
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool
};
Tabs.defaultProps = {
  className: '',
  disabled: false
};

export default Tabs;
