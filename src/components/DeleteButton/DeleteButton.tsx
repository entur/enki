import { TertiaryButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import React from 'react';

type Props = {
  onClick: () => void;
  title: string;
};

const DeleteButton = (props: Props) => (
  <TertiaryButton
    className="delete-button"
    onClick={(event: Event) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <DeleteIcon inline /> {props.title}
  </TertiaryButton>
);

export default DeleteButton;
