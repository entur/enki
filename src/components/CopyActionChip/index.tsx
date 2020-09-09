import React from 'react';
import { CopyIcon } from '@entur/icons';
import './styles.scss';
import { ActionChip } from '@entur/chip';

type Props = {
  onClick: () => void;
  title: string;
  thin?: boolean;
};

const CopyButton = (props: Props) => (
  <ActionChip
    onClick={(event: Event) => {
      props.onClick();
      event.stopPropagation();
    }}
  >
    <CopyIcon inline /> {props.title}
  </ActionChip>
);

export default CopyButton;
