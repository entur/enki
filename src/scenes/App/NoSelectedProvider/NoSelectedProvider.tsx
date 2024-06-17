import React from 'react';
import { NavigationCard } from '@entur/layout';
import { AdjustmentsIcon } from '@entur/icons';
import { SelectProvider } from '../SelectProvider/SelectProvider';
import { useIntl } from 'react-intl';

export const NoSelectedProvider = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <NavigationCard
        title={formatMessage({ id: 'navBarDataProvider' })}
        titleIcon={<AdjustmentsIcon />}
      >
        <div style={{ width: '400px', textAlign: 'left' }}>
          <SelectProvider />
        </div>
      </NavigationCard>
    </div>
  );
};
