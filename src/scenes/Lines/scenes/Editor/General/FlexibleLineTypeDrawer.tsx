import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@entur/modal';
import { selectIntl } from 'i18n';

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
        <h4>fixed</h4>
        {formatMessage('drawerFixed')}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>mainRouteWithFlexibleEnds</h4>
        {formatMessage('drawerMainRouteWithFlexibleEnds')}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>fixedStopAreaWide</h4>
        {formatMessage('drawerFixedStopAreaWide')}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>flexibleAreasOnly</h4>
        {formatMessage('drawerFlexibleAreasOnly')}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>hailAndRideSections</h4>
        {formatMessage('drawerHailAndRideSections')}
      </section>
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
