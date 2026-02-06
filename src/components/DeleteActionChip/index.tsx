import Delete from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import React from 'react';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  className?: string;
};

const DeleteButton = (props: Props) => (
  <Chip
    className={props.className}
    label={props.title}
    icon={<Delete />}
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
    sx={{
      m: props.thin ? 0 : 'auto 0 auto auto',
      px: 0.5,
      minWidth: 'fit-content',
      width: props.thin ? 'fit-content' : undefined,
    }}
  />
);

export default DeleteButton;
