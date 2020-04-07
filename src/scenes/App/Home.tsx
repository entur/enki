import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link } from 'react-router-dom';
import { Heading1, LeadParagraph, Heading2 } from '@entur/typography';
import { NavigationCard } from '@entur/layout';
import { ChannelsIcon, RulesIcon, MapIcon, BusIcon } from '@entur/icons';
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
          <Link to="get-started" className="card-link">
            <NavigationCard
              title={formatMessage('homeCardsGetStarted')}
              titleIcon={<RulesIcon />}
            >
              {formatMessage('homeCardsGetStartedDescription')}
            </NavigationCard>
          </Link>

          <Link to="/lines" className="card-link">
            <NavigationCard
              title={formatMessage('navBarLinesMenuItemLabel')}
              titleIcon={<BusIcon className="bus-icon" />}
            >
              {formatMessage('homeCardsLinesDescription')}
            </NavigationCard>
          </Link>

          <Link to="/networks" className="card-link">
            <NavigationCard
              title={formatMessage('navBarNetworksMenuItemLabel')}
              titleIcon={<ChannelsIcon />}
            >
              {formatMessage('homeCardsNetworkDescription')}
            </NavigationCard>
          </Link>

          <Link to="/stop-places" className="card-link">
            <NavigationCard
              title={formatMessage('navBarStopPlacesMenuItemLabel')}
              titleIcon={<MapIcon />}
            >
              {formatMessage('homeCardsStopPlacesDescription')}
            </NavigationCard>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
