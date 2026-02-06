import Delete from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import React from 'react';

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
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
    disabled={props.disabled}
    startIcon={<Delete />}
    sx={{
      m: props.thin ? 0 : 'auto 0 auto auto',
      px: 0.5,
      minWidth: 'fit-content',
      width: props.thin ? 'fit-content' : undefined,
      whiteSpace: 'nowrap',
    }}
  >
    {props.title}
  </Button>
);

export default DeleteButton;
