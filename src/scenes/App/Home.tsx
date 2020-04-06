import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
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
          <NavigationCard
            title={formatMessage('homeCardsGetStarted')}
            titleIcon={<RulesIcon />}
            href="/get-started"
          >
            {formatMessage('homeCardsGetStartedDescription')}
          </NavigationCard>

          <NavigationCard
            title={formatMessage('navBarLinesMenuItemLabel')}
            titleIcon={<BusIcon className="bus-icon" />}
            href="/lines"
          >
            {formatMessage('homeCardsLinesDescription')}
          </NavigationCard>
          <NavigationCard
            title={formatMessage('navBarNetworksMenuItemLabel')}
            titleIcon={<ChannelsIcon />}
            href="/networks"
          >
            {formatMessage('homeCardsNetworkDescription')}
          </NavigationCard>
          <NavigationCard
            title={formatMessage('navBarStopPlacesMenuItemLabel')}
            titleIcon={<MapIcon />}
            href="/stop-places"
          >
            {formatMessage('homeCardsStopPlacesDescription')}
          </NavigationCard>
        </section>
      </main>
    </div>
  );
};

export default Home;
