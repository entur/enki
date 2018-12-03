import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, withRouter, matchPath } from 'react-router-dom';

import './styles.css';

class NavBarMenuItem extends Component {
  state = { active: false };

  subItems = React.createRef();

  componentDidMount() {
    this.evaluateActive(this.props.location);
  }

  UNSAFE_componentWillReceiveProps({ location: newLocation }) {
    const { location } = this.props;
    if (location.pathname !== newLocation.pathname) {
      this.evaluateActive(newLocation);
    }
  }

  evaluateActive(location) {
    const { path } = this.props;
    const { active } = this.state;
    const newActive = matchPath(location.pathname, { path });
    if (active !== newActive) {
      this.setState({ active: newActive });
      this.showSubItems(newActive);
    }
  }

  showSubItems(show) {
    const el = this.subItems.current;
    el.style.height = show ? el.scrollHeight + 'px' : null;
  }

  render() {
    const { label, path, Icon, disabled, children, className } = this.props;
    const { active } = this.state;

    const content = (
      <div className="content">
        {Icon && (
          <div className="icon">
            <Icon />
          </div>
        )}
        <div className="label">{label}</div>
      </div>
    );

    const classNames = cx(
      'nav-bar-menu-item',
      { active },
      { disabled },
      className
    );

    const fullPathedChildren = React.Children.map(
      children,
      child => React.cloneElement(child, { path: path + child.props.path }),
      this
    );

    return (
      <Fragment>
        <div className={classNames}>
          <div className="border">
            {!disabled ? <Link to={path}>{content}</Link> : content}
          </div>
        </div>

        <div className="sub-items" ref={this.subItems}>
          {fullPathedChildren}
        </div>
      </Fragment>
    );
  }
}

NavBarMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  currentPath: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default withRouter(NavBarMenuItem);
