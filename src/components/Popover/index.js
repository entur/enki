import React from 'react';
import propTypes from 'prop-types';

class Popover extends React.Component {
  componentDidMount() {
    document.addEventListener('mousedown', ::this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', ::this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      const { onRequestClose } = this.props;
      if (typeof onRequestClose === 'function') {
        onRequestClose.call();
      }
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    const { children, open, className, style } = this.props;

    if (!open) {
      return null;
    }

    return (
      <div style={style} className={className} ref={::this.setWrapperRef}>
        {children}
      </div>
    );
  }
}

Popover.propTypes = {
  open: propTypes.bool.isRequired,
  onRequestClose: propTypes.func,
  style: propTypes.object,
  className: propTypes.string
};

export default Popover;
