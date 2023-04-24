import { ActionChip } from '@entur/chip';
import { DeleteIcon } from '@entur/icons';
import React from 'react';
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
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <DeleteIcon inline /> {props.title}
  </ActionChip>
);

export default DeleteButton;
