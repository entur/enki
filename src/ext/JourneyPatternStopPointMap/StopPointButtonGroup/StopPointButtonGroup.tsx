import { FlexibleLineType } from '../../../model/FlexibleLine';
import DeleteButton from '../../../components/DeleteButton/DeleteButton';
import { Button } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import React from 'react';
import { useIntl } from 'react-intl';
import { StopPointButtonGroupProps } from './types';
import { FeatureComponent } from '@entur/react-component-toggle';

export const StopPointButtonGroup: FeatureComponent<
  StopPointButtonGroupProps
> = ({
  flexibleLineType,
  canDelete,
  stopPoint,
  onFocusedQuayIdUpdate,
  onDeleteDialogOpen,
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const isLocateButtonAvailable =
    !flexibleLineType || flexibleLineType === FlexibleLineType.FIXED;

  return (
    <div className={'action-buttons-group'}>
      <DeleteButton
        thin={true}
        disabled={!canDelete}
        onClick={() => {
          onDeleteDialogOpen(true);
        }}
        title={formatMessage({ id: 'editorDeleteButtonText' })}
      />

      {isLocateButtonAvailable && (
        <Button
          id={'locate-button'}
          variant="text"
          title={formatMessage({ id: 'locateStopPointTooltip' })}
          onClick={() => {
            if (onFocusedQuayIdUpdate) {
              onFocusedQuayIdUpdate(stopPoint.quayRef);
            }
          }}
          startIcon={<MyLocationIcon />}
        >
          {formatMessage({ id: 'locateStopPoint' })}
        </Button>
      )}
    </div>
  );
};
