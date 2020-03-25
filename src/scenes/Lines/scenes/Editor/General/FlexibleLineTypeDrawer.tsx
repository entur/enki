import React, { useState } from 'react';
import { Drawer } from '@entur/modal';

type Props = {
  open: boolean;
  title: string;
};
const FlexibleLineTypeDrawer = ({ open, title }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(open);
  return (
    <Drawer title={title} onDismiss={() => setOpen(false)} open={isOpen}>
      <header className="flexible-line-type-drawer">
        Her er en kort beskrivelse av de ulike linjetypene.
      </header>

      <section className="flexible-line-type-drawer">
        <h4>fixed</h4>
        Fast rute til faste tider, men må forhåndsbestilles for at ruten skal
        kjøres.
      </section>

      <section className="flexible-line-type-drawer">
        <h4>mainRouteWithFlexibleEnds</h4>
        Fast rute til faste tider, med mulighet for på-/avstigning på
        stoppesteder utenfor oppsatt kjøremønster ved bestilling.
      </section>

      <section className="flexible-line-type-drawer">
        <h4>fixedStopAreaWide</h4>
        Fleksibel rute definert av ett eller flere områder, der hvert område kan
        ha ulike forhåndsbestemte stopp (møteplass, knutepunkt, kommune-senter,
        holdeplasser).
      </section>

      <section className="flexible-line-type-drawer">
        <h4>flexibleAreasOnly</h4>
        Hentes og kjøres til/fra valgfritt sted innenfor et definert område og
        gitte åpningstider.
      </section>

      <section className="flexible-line-type-drawer">
        <h4>hailAndRideSections</h4>
        Ruten er definert og har noen faste holdeplasser. Langs bestemte
        strekninger på ruten kan på-/avstigning skje hvor som helst ved signal
        til sjåfør.
      </section>
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
