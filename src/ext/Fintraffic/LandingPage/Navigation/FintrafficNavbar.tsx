import MyImageSvg from '../../../static/svg/fintraffic_logo.svg';
//import FintrafficLogo from '../../static/svg/fintraffic_logo.svg'
import Navbar from './Navbar';
import { useIntl } from 'react-intl';
import {
  FdsNavigationItem,
  FdsNavigationVariant,
} from '../../Fds/fds-navigation';

const FintrafficNavbar = () => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const selectedLocaleCode: string = intl.locale;

  const items: FdsNavigationItem[] = [
    {
      label: formatMessage({ id: 'traffic' }),
      value:
        'https://liikennetilanne.fintraffic.fi/pulssi/?lang=' +
        selectedLocaleCode,
    },
    {
      label: formatMessage({ id: 'feedback' }),
      value:
        'https://www.palautevayla.fi/aspa/en/liikenteen-asiakaspalvelu-etsi-tietoa?lang=' +
        selectedLocaleCode,
    },
    {
      label: formatMessage({ id: 'train' }),
      value:
        'https://junalahdot.fintraffic.fi/?lang=' +
        (selectedLocaleCode === 'sv' ? 'se' : selectedLocaleCode),
    },
    {
      label: 'Digitraffic',
      value: 'https://www.digitraffic.fi/',
    },
    {
      label: 'Digitransit',
      value: 'https://digitransit.fi/',
    },
    {
      label: formatMessage({ id: 'nap' }),
      value: 'https://finap.fi/#/',
    },
    {
      label: 'VACO',
      value: '/',
    },
  ];
  return (
    <Navbar
      variant={FdsNavigationVariant.primary}
      items={items}
      barIndex={0}
      selectedItem={items[items.length - 1]}
      isSelectedItemStatic={true}
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={'https://www.fintraffic.fi/' + selectedLocaleCode}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100px',
            flexShrink: 0,
          }}
        ></div>
      </a>
    </Navbar>
  );
};

export default FintrafficNavbar;
