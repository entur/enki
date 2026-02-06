import Delete from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import React from 'react';
import './DeleteButton.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  disabled?: boolean;
};

const DeleteButton = (props: Props) => (
  <Button
    id="delete-button"
    variant="text"
    className={props.thin ? 'thin' : ''}
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
    disabled={props.disabled}
    startIcon={<Delete />}
  >
    {props.title}
  </Button>
);

export default DeleteButton;
