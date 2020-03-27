import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';

const Home = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="home">
      <header>
        <h4 className="tagline color-blue">
          {formatMessage('navBarIntroduction')}
        </h4>
        <h1>{formatMessage('homeHeader')}</h1>
        <p className="lead">{formatMessage('headerParagraph')}</p>
      </header>
      <main>
        <section>
          <h3>{formatMessage('intropageTitle')}</h3>
          <p className="point">{formatMessage('item1')}</p>
          <p className="point">{formatMessage('item2')}</p>
          <p className="point">{formatMessage('item3')}</p>
        </section>
      </main>
    </div>
  );
};

export default Home;
