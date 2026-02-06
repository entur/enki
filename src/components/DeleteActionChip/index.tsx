import Delete from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import React from 'react';
import './DeleteButton.scss';

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
  />
);

export default DeleteButton;
