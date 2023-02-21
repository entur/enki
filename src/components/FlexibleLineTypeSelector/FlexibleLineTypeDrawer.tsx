import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@entur/modal';
import { selectIntl } from 'i18n';
import { Heading4 } from '@entur/typography';
import { useConfig } from 'config/ConfigContext';
import { MessagesKey } from 'i18n/translations/translationKeys';

type Props = {
  open: boolean;
  title: string;
  onDismiss: () => void;
};
const FlexibleLineTypeDrawer = ({ open, onDismiss, title }: Props) => {
  const { formatMessage } = useSelector(selectIntl);
  const { supportedFlexibleLineTypes } = useConfig();

  return (
    <Drawer title={title} onDismiss={onDismiss} open={open}>
      <header className="flexible-line-type-drawer">
        {formatMessage('generalDrawer')}
      </header>

      {supportedFlexibleLineTypes?.map((flexibleLineType) => (
        <section className="flexible-line-type-drawer">
          <Heading4>
            {formatMessage(
              `flexibleLineType_${flexibleLineType}` as keyof MessagesKey
            )}
          </Heading4>
          {formatMessage(
            `flexibleLineTypeDrawer_${flexibleLineType}` as keyof MessagesKey
          )}
        </section>
      ))}
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
