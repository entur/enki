import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link } from 'react-router-dom';
import { Heading1, LeadParagraph, Heading2 } from '@entur/typography';
import { NavigationCard } from '@entur/layout';
import { RulesIcon, MapIcon, BusIcon } from '@entur/icons';
import './styles.scss';

const Home = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="home">
      <header>
        <Heading1>{formatMessage('homeHeader')}</Heading1>
        <LeadParagraph>{formatMessage('headerParagraph')}</LeadParagraph>
      </header>
      <main>
        <Heading2>{formatMessage('homeShortcut')}</Heading2>
        <section className="cards">
          <NavigationCard
            title={formatMessage('homeCardsGetStarted')}
            titleIcon={<RulesIcon />}
            as={Link}
            to={'get-started'}
            className="card-link"
          >
            {formatMessage('homeCardsGetStartedDescription')}
          </NavigationCard>

          <NavigationCard
            title={formatMessage('navBarLinesMenuItemLabel')}
            titleIcon={<BusIcon className="bus-icon" />}
            as={Link}
            to="/lines"
            className="card-link"
          >
            {formatMessage('homeCardsLinesDescription')}
          </NavigationCard>

          <NavigationCard
            title={formatMessage('navBarStopPlacesMenuItemLabel')}
            titleIcon={<MapIcon />}
            as={Link}
            to="/stop-places"
            className="card-link"
          >
            {formatMessage('homeCardsStopPlacesDescription')}
          </NavigationCard>
        </section>
      </main>
    </div>
  );
};

export default Home;
