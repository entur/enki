import React from 'react';
import propTypes from 'prop-types';
import Modal from 'react-modal';
import cx from 'classnames';

import { CloseIcon } from '@entur/component-library';

import './styles.css';

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    zIndex: 1001
  }
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  buttons = [],
  className,
  onClose,
  color
}) => {
  const colorClass =
    color === 'dark' ? 'confirmation-dialog-dark' : 'confirmation-dialog-light';
  const classNames = cx('confirmation-dialog', colorClass, className);
  const buttonClasses = cx('buttons', {
    'single-button': buttons.length === 1
  });
  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
      onRequestClose={onClose}
      className={classNames}
    >
      <div className="close" onClick={onClose}>
        <CloseIcon color="#fff" />
      </div>
      <div className="title">{title}</div>
      <div className="message">{message}</div>
      <div className={buttonClasses}>{buttons}</div>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: propTypes.bool,
  title: propTypes.string,
  message: propTypes.node.isRequired,
  buttons: propTypes.array,
  onClose: propTypes.func.isRequired,
  color: propTypes.string
};

ConfirmDialog.defaultProps = {
  isOpen: false,
  color: 'dark'
};

export default ConfirmDialog;
