import React from 'react';
import { DeleteIcon } from '@entur/icons';
import { ActionChip } from '@entur/chip';
import './DeleteButton.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
};

const DeleteButton = (props: Props) => (
  <ActionChip
    onClick={(event: Event) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <DeleteIcon inline /> {props.title}
  </ActionChip>
);

export default DeleteButton;
