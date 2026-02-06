import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from 'react';
import { useIntl } from 'react-intl';

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
  return (
    <ListItem disablePadding className={className}>
      <ListItemButton
        component="a"
        href={path}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <OpenInNewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export const NavbarAdditionalItems = () => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const selectedLocaleCode: string = intl.locale;

  return (
    <>
      <List
        subheader={
          <ListSubheader>{formatMessage({ id: 'about' })}</ListSubheader>
        }
      >
        <NavBarExternalLinkItem
          text={formatMessage({ id: 'instructions' })}
          path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
        />
        <NavBarExternalLinkItem
          text={formatMessage({ id: 'terms' })}
          path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
        />
        <NavBarExternalLinkItem
          text={formatMessage({ id: 'privacy' })}
          path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
        />
      </List>
      <List
        subheader={
          <ListSubheader>{formatMessage({ id: 'support' })}</ListSubheader>
        }
      >
        <NavBarExternalLinkItem
          text={formatMessage({ id: 'channels' })}
          path="https://www.fintraffic.fi/fi/digitaalisetpalvelut/fintrafficin-datapalvelut/liikkumisen-tietopalvelut/joukkoliikenteen-tietopalvelut/rae"
        />
      </List>
      <List subheader={<ListSubheader>Fintraffic</ListSubheader>}>
        <NavBarExternalLinkItem
          text={'Fintraffic'}
          path={'https://www.fintraffic.fi/' + selectedLocaleCode}
        />
        <NavBarExternalLinkItem
          text={formatMessage({ id: 'traffic' })}
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
          path={`https://www.fintraffic.fi/${selectedLocaleCode}/${formatMessage({ id: 'fintrafficAppLink' })}`}
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
      </List>
    </>
  );
};
