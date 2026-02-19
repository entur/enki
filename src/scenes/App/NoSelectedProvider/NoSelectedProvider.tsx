import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import { SelectProvider } from '../SelectProvider/SelectProvider';
import { useIntl } from 'react-intl';

export const NoSelectedProvider = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Card>
        <CardHeader
          title={formatMessage({ id: 'navBarDataProvider' })}
          avatar={<TuneOutlined />}
        />
        <CardContent>
          <div
            style={{ width: '400px', textAlign: 'left', marginTop: '1.5rem' }}
          >
            <SelectProvider />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
