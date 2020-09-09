import { TertiaryButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import React from 'react';
import './DeleteButton.scss';
import { ActionChip } from '@entur/chip';

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
