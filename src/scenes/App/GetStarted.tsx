import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIntl } from 'i18n';
import { PrimaryButton } from '@entur/button';
import {
  Heading1,
  LeadParagraph,
  Heading2,
  NumberedList,
  ListItem,
  Paragraph,
} from '@entur/typography';

const GetStarted = () => {
  const { formatMessage } = useSelector(selectIntl);

  return (
    <div className="get-started">
      <header>
        <h4 className="tagline color-blue">
          {formatMessage('navBarIntroduction')}
        </h4>
        <Heading1>{formatMessage('navBarIntroduction')}</Heading1>
        <LeadParagraph>
          {formatMessage('getStartedLeadParagraph')}
        </LeadParagraph>
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
        <Link to="/stop-places">
          <PrimaryButton className="stop-place-button" size="large">
            {formatMessage('getStartedRedirectButton')}
          </PrimaryButton>
        </Link>
        <Paragraph className="platform-id-text">
          {formatMessage('getStartedPlatformIDText')}
        </Paragraph>
      </main>
    </div>
  );
};

export default GetStarted;
