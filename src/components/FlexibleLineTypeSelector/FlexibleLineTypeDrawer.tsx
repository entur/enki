import { Box, Drawer, Typography } from '@mui/material';
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
    <Drawer anchor="right" open={open} onClose={onDismiss}>
      <Box sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <header>{formatMessage({ id: 'generalDrawer' })}</header>

        {supportedFlexibleLineTypes?.map((flexibleLineType) => (
          <section key={flexibleLineType}>
            <Typography variant="h6">
              {formatMessage({
                id: `flexibleLineType_${flexibleLineType}` as keyof MessagesKey,
              })}
            </Typography>
            {formatMessage({
              id: `flexibleLineTypeDrawer_${flexibleLineType}` as keyof MessagesKey,
            })}
          </section>
        ))}
      </Box>
    </Drawer>
  );
};

export default FlexibleLineTypeDrawer;
