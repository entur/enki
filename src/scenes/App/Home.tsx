import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import {
  Heading1,
  LeadParagraph,
  Heading2,
  NumberedList,
  ListItem,
} from '@entur/typography';

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
        <section>
          <Heading2>{formatMessage('intropageTitle')}</Heading2>
          <NumberedList>
            <ListItem>{formatMessage('item1')}</ListItem>
            <ListItem>{formatMessage('item2')}</ListItem>
            <ListItem>{formatMessage('item3')}</ListItem>
          </NumberedList>
        </section>
      </main>
    </div>
  );
};

export default Home;
