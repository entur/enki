import { ActionChip } from '@entur/chip';
import { CopyIcon } from '@entur/icons';
import React from 'react';
import './styles.scss';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  className?: string;
};

const CopyButton = (props: Props) => (
  <ActionChip
    className={props.className}
    onClick={(event: React.MouseEvent) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <CopyIcon inline /> {props.title}
  </ActionChip>
);

export default CopyButton;
