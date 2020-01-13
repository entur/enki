import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import cx from 'classnames';

import { Close } from '../icons';

import './styles.scss';

Modal.setAppElement('#root');

const customStyles = {
  overlay: { zIndex: 1001 }
};

const Dialog = ({ isOpen, title, content, buttons, className, onClose }) => (
  <Modal
    isOpen={isOpen}
    style={customStyles}
    onRequestClose={onClose}
    className={cx('dialog', className)}
  >
    <div className="close" onClick={onClose}>
      <Close className="close-icon" />
    </div>
    {title && <div className="title">{title}</div>}
    <div className="content">{content}</div>
    {buttons && <div className="dialog-buttons">{buttons}</div>}
  </Modal>
);

Dialog.propTypes = {
  content: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  buttons: PropTypes.array
};

export default Dialog;
