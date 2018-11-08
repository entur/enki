import React from 'react';
import propTypes from 'prop-types';
import Modal from 'react-modal';
import cx from 'classnames';

import { Close } from '../icons';

import './styles.css';

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
    <div className="title">{title}</div>
    <div className="content">{content}</div>
    <div className="buttons">{buttons}</div>
  </Modal>
);

Dialog.propTypes = {
  content: propTypes.node.isRequired,
  onClose: propTypes.func.isRequired,
  isOpen: propTypes.bool,
  title: propTypes.string,
  buttons: propTypes.array
};

export default Dialog;
