import { FlexibleLineType } from '../../../model/FlexibleLine';
import DeleteButton from '../../../components/DeleteButton/DeleteButton';
import { TertiaryButton } from '@entur/button';
import { PositionIcon } from '@entur/icons';
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
        <TertiaryButton
          id={'locate-button'}
          title={formatMessage({ id: 'locateStopPointTooltip' })}
          onClick={() => {
            if (onFocusedQuayIdUpdate) {
              onFocusedQuayIdUpdate(stopPoint.quayRef);
            }
          }}
        >
          <PositionIcon inline /> {formatMessage({ id: 'locateStopPoint' })}
        </TertiaryButton>
      )}
    </div>
  );
};
