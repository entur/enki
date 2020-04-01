import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Heading1, LeadParagraph, Heading2 } from '@entur/typography';
import { NavigationCard } from '@entur/layout';
import { DesktopIcon } from '@entur/icons';
import './styles.scss';

const Home = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="home">
      <header>
        <h4 className="tagline color-blue">
          {formatMessage('navBarIntroduction')}
        </h4>
        <Heading1>{formatMessage('homeHeader')}</Heading1>
        <LeadParagraph>{formatMessage('headerParagraph')}</LeadParagraph>
      </header>
      <main>
        <Heading2>Snarveier</Heading2>
        <section className="cards">
          <NavigationCard
            title="Kom i gang"
            titleIcon={<DesktopIcon />}
            href="#"
          >
            Se all dataen vår
          </NavigationCard>
          <NavigationCard title="Linjer" titleIcon={<DesktopIcon />} href="#">
            Se all dataen vår
          </NavigationCard>
          <NavigationCard title="Data" titleIcon={<DesktopIcon />} href="#">
            Se all dataen vår
          </NavigationCard>
          <NavigationCard title="Data" titleIcon={<DesktopIcon />} href="#">
            Se all dataen vår
          </NavigationCard>
        </section>
      </main>
    </div>
  );
};

export default Home;
