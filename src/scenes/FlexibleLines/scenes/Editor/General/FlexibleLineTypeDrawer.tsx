import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@entur/modal';
import { selectIntl } from 'i18n';
import { Heading4 } from '@entur/typography';

type Props = {
  open: boolean;
  title: string;
  onDismiss: () => void;
};
const FlexibleLineTypeDrawer = ({ open, onDismiss, title }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <Drawer title={title} onDismiss={onDismiss} open={open}>
      <header className="flexible-line-type-drawer">
        {formatMessage('generalDrawer')}
      </header>

      <section className="flexible-line-type-drawer">
        <Heading4>fixed</Heading4>
        {formatMessage('drawerFixed')}
      </section>

      <section className="flexible-line-type-drawer">
        <Heading4>mainRouteWithFlexibleEnds</Heading4>
        {formatMessage('drawerMainRouteWithFlexibleEnds')}
      </section>

      <section className="flexible-line-type-drawer">
        <Heading4>fixedStopAreaWide</Heading4>
        {formatMessage('drawerFixedStopAreaWide')}
      </section>

      <section className="flexible-line-type-drawer">
        <Heading4>flexibleAreasOnly</Heading4>
        {formatMessage('drawerFlexibleAreasOnly')}
      </section>

      <section className="flexible-line-type-drawer">
        <Heading4>hailAndRideSections</Heading4>
        {formatMessage('drawerHailAndRideSections')}
      </section>
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
