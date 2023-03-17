import { TertiaryButton } from '@entur/button';
import { DeleteIcon } from '@entur/icons';
import React from 'react';
import './DeleteButton.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  disabled?: boolean;
};

const DeleteButton = (props: Props) => (
  <TertiaryButton
    id="delete-button"
    className={props.thin ? 'thin' : ''}
    onClick={(event: Event) => {
      props.onClick();
      event.stopPropagation();
    }}
    disabled={props.disabled}
  >
    <DeleteIcon inline /> {props.title}
  </TertiaryButton>
);

export default DeleteButton;
