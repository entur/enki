import ContentCopy from '@mui/icons-material/ContentCopy';
import { Chip } from '@mui/material';
import React from 'react';
import './styles.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  className?: string;
};

const CopyButton = (props: Props) => (
  <Chip
    className={props.className}
    label={props.title}
    icon={<ContentCopy />}
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
  />
);

export default CopyButton;
