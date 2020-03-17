import { SecondarySquareButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import { Paragraph } from '@entur/typography';
import React from 'react';

type Props = {
  onClick: () => void;
  buttonTitle: string;
};

const AddButton = (props: Props) => (
  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '3rem' }}>
    <SecondarySquareButton
      onClick={props.onClick}
      style={{ marginRight: '1rem' }}
    >
      <AddIcon />
    </SecondarySquareButton>
    <Paragraph>{props.buttonTitle}</Paragraph>
  </div>
);

export default AddButton;
