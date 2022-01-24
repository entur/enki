import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@entur/modal';
import { selectIntl } from 'i18n';
import {
  Heading4,
  ListItem,
  Paragraph,
  SubParagraph,
  UnorderedList,
} from '@entur/typography';

type Props = {
  open: boolean;
  title: string;
  onDismiss: () => void;
};
export const PassingTimeTypeDrawer = ({ open, onDismiss, title }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Drawer
      title={formatMessage('passingTimeTypeDrawerTitle')}
      onDismiss={onDismiss}
      open={open}
    >
      <SubParagraph>
        {formatMessage('passingTimeTypeDrawerSubTitle')}
      </SubParagraph>
      <Heading4>{formatMessage('passingTimesTypeFixed')}</Heading4>
      <Paragraph>{formatMessage('passingTimeTypeDrawerFixedText')}</Paragraph>
      <Heading4>{formatMessage('passingTimesTypeFlexible')}</Heading4>
      <Paragraph>
        {formatMessage('passingTimeTypeDrawerFlexibleText1')}
      </Paragraph>
      <Paragraph>
        {formatMessage('passingTimeTypeDrawerFlexibleText2')}
      </Paragraph>
      <UnorderedList>
        <ListItem title={formatMessage('passingTimesEarliestDepartureTime')}>
          {formatMessage('passingTimeTypeDrawerEarliestDepartureText')}
        </ListItem>
        <ListItem title={formatMessage('passingTimesLatestArrivalTime')}>
          {formatMessage('passingTimeTypeDrawerLatestARrivalText')}
        </ListItem>
      </UnorderedList>
    </Drawer>
  );
};
