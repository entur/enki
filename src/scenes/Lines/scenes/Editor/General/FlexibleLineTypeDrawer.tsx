import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@entur/modal';
import { selectIntl } from 'i18n';
import messages from './messages';

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
        {formatMessage(messages.drawerSubTitle)}
      </header>

      <section className="flexible-line-type-drawer">
        <h4>fixed</h4>
        {formatMessage(messages.fixed)}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>mainRouteWithFlexibleEnds</h4>
        {formatMessage(messages.mainRouteWithFlexibleEnds)}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>fixedStopAreaWide</h4>
        {formatMessage(messages.fixedStopAreaWide)}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>flexibleAreasOnly</h4>
        {formatMessage(messages.flexibleAreasOnly)}
      </section>

      <section className="flexible-line-type-drawer">
        <h4>hailAndRideSections</h4>
        {formatMessage(messages.hailAndRideSections)}
      </section>
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
