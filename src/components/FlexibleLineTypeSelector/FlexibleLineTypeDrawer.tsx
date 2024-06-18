import { Drawer } from '@entur/modal';
import { Heading4 } from '@entur/typography';
import { useConfig } from 'config/ConfigContext';
import { MessagesKey } from 'i18n/translationKeys';
import { useIntl } from 'react-intl';

type Props = {
  open: boolean;
  title: string;
  onDismiss: () => void;
};
const FlexibleLineTypeDrawer = ({ open, onDismiss, title }: Props) => {
  const { formatMessage } = useIntl();
  const { supportedFlexibleLineTypes } = useConfig();

  return (
    <Drawer title={title} onDismiss={onDismiss} open={open}>
      <header className="flexible-line-type-drawer">
        {formatMessage({ id: 'generalDrawer' })}
      </header>

      {supportedFlexibleLineTypes?.map((flexibleLineType) => (
        <section className="flexible-line-type-drawer" key={flexibleLineType}>
          <Heading4>
            {formatMessage({
              id: `flexibleLineType_${flexibleLineType}` as keyof MessagesKey,
            })}
          </Heading4>
          {formatMessage({
            id: `flexibleLineTypeDrawer_${flexibleLineType}` as keyof MessagesKey,
          })}
        </section>
      ))}
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
