import React from 'react';
import Modal from 'react-modal';
import cx from 'classnames';

import { CloseIcon } from '@entur/icons';

import './styles.scss';

Modal.setAppElement('#root');

const customStyles = {
  overlay: { zIndex: 1001 }
};

type Props = {
  isOpen: boolean;
  title?: string;
  content: React.ReactNode;
  className?: string;
  onClose: () => void;
};

const Dialog = ({ isOpen, title, content, className, onClose }: Props) => (
  <Modal
    isOpen={isOpen}
    style={customStyles}
    onRequestClose={onClose}
    className={cx('dialog', className)}
  >
    <div className="close" onClick={onClose}>
      <CloseIcon className="close-icon" />
    </div>
    {title && <div className="title">{title}</div>}
    <div className="content">{content}</div>
  </Modal>
);

export default Dialog;
