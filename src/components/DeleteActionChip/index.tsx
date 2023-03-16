import React from 'react';
import { DeleteIcon } from '@entur/icons';
import { ActionChip } from '@entur/chip';
import './DeleteButton.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  className?: string;
};

const DeleteButton = (props: Props) => (
  <ActionChip
    className={props.className}
    onClick={(event) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <DeleteIcon inline /> {props.title}
  </ActionChip>
);

export default DeleteButton;
