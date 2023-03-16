import React from 'react';
import { CopyIcon } from '@entur/icons';
import './styles.scss';
import { ActionChip } from '@entur/chip';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
  className?: string;
};

const CopyButton = (props: Props) => (
  <ActionChip
    className={props.className}
    onClick={(event) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <CopyIcon inline /> {props.title}
  </ActionChip>
);

export default CopyButton;
