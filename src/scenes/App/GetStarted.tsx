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
        <Heading1>{formatMessage('navBarIntroduction')}</Heading1>
        <LeadParagraph>
          {formatMessage('getStartedLeadParagraph')}
        </LeadParagraph>
      </header>
      <main>
        <section>
          <Heading2>{formatMessage('intropageTitle')}</Heading2>
          <NumberedList>
            <ListItem>
              <>
                {formatMessage('item1pre')}
                <Link to="/stop-places">
                  {formatMessage('navBarStopPlacesMenuItemLabel')}
                </Link>
                {formatMessage('item1post')}
              </>
            </ListItem>
            <ListItem>
              <>
                {formatMessage('item2pre')}
                <Link to="/lines">
                  {formatMessage('navBarLinesMenuItemLabel')}
                </Link>
                {formatMessage('item2post')}
              </>
            </ListItem>
            <ListItem>
              <>
                {formatMessage('item3pre')}
                <Link to="/exports">
                  {formatMessage('navBarExportsMenuItemLabel')}
                </Link>
                {formatMessage('item3post')}
              </>
            </ListItem>
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
