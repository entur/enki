import {
  SideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
} from '@entur/menu';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ExternalIcon } from '@entur/icons';

type NavBarExternalLinkProps = {
  text: string;
  path: string;
  className?: string;
};

const NavBarExternalLinkItem = ({
  text,
  path,
  className,
}: NavBarExternalLinkProps) => {
  const handleOnClick = (e: React.MouseEvent) => {};

  return (
    <SideNavigationItem
      onClick={handleOnClick}
      active={false}
      as={Link}
      to={path}
      className={className}
      icon={<ExternalIcon />}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </SideNavigationItem>
  );
};

export const NavbarAdditionalItems = () => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const selectedLocaleCode: string = intl.locale;

  return (
    <>
      <SideNavigationGroup
        title={formatMessage({
          id: 'about',
        })}
      >
        <SideNavigation>
          <NavBarExternalLinkItem
            text={formatMessage({
              id: 'instructions',
            })}
            path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
          />
          <NavBarExternalLinkItem
            text={formatMessage({
              id: 'terms',
            })}
            path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'privacy' })}
            path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
          />
        </SideNavigation>
      </SideNavigationGroup>
      <SideNavigationGroup
        title={formatMessage({
          id: 'support',
        })}
      >
        <SideNavigation>
          <NavBarExternalLinkItem
            text={formatMessage({
              id: 'channels',
            })}
            path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
          />
        </SideNavigation>
      </SideNavigationGroup>
      <SideNavigationGroup title={'Fintraffic'}>
        <SideNavigation>
          <NavBarExternalLinkItem
            text={'Fintraffic'}
            path={'https://www.fintraffic.fi/' + selectedLocaleCode}
          />
          <NavBarExternalLinkItem
            text={formatMessage({
              id: 'traffic',
            })}
            path={
              'https://liikennetilanne.fintraffic.fi/pulssi/?lang=' +
              selectedLocaleCode
            }
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'feedback' })}
            path={
              'https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa?lang=' +
              selectedLocaleCode
            }
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'train' })}
            path={
              'https://junalahdot.fintraffic.fi/?lang=' +
              (selectedLocaleCode === 'sv' ? 'se' : selectedLocaleCode)
            }
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'fintrafficApp' })}
            path="https://www.digitraffic.fi/"
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'digitraffic' })}
            path="https://www.digitraffic.fi/"
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'digitransit' })}
            path="https://digitransit.fi/"
          />
          <NavBarExternalLinkItem
            text={formatMessage({ id: 'nap' })}
            path="https://finap.fi/#/"
          />
        </SideNavigation>
      </SideNavigationGroup>
    </>
  );
};
