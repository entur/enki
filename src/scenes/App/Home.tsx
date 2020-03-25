import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import messages from './messages';

const Home = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="home">
      <header>
        <h4 className="tagline color-blue">{formatMessage(messages.home)}</h4>
        <h1>{formatMessage(messages.homeHeader)}</h1>
        <p className="lead">{formatMessage(messages.leadParagraph)}</p>
      </header>
      <main>
        <section>
          <h3>{formatMessage(messages.introductionTitle)}</h3>
          <p className="point">{formatMessage(messages.summaryNetwork)}</p>
          <p className="point">{formatMessage(messages.summaryStopPoints)}</p>
          <p className="point">{formatMessage(messages.summaryLine)}</p>
        </section>
      </main>
    </div>
  );
};

export default Home;
