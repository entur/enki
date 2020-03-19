import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import messages from './messages';

const Home = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="home">
      <header>
        <h4 className="tagline color-blue"> {formatMessage(messages.home)} </h4>
        <h1> {formatMessage(messages.homeHeader)} </h1>
        <p className="lead"> {formatMessage(messages.leadParagraph)} </p>
      </header>
      <main>
        <section>
          <h3> {formatMessage(messages.introductionTitle)} </h3>
          <p> {formatMessage(messages.introductionText)} </p>
          <p> {formatMessage(messages.linesDescription)} </p>
          {formatMessage(messages.summaryTitle)}
          <ol>
            <li> {formatMessage(messages.summaryNetwork)} </li>
            <li> {formatMessage(messages.summaryStopPoints)} </li>
            <li> {formatMessage(messages.summaryLine)} </li>
          </ol>
        </section>
        <section>
          <h3> {formatMessage(messages.lineTypes)} </h3>
          {formatMessage(messages.lineTypeDescription)}
        </section>
      </main>
    </div>
  );
};

export default Home;
