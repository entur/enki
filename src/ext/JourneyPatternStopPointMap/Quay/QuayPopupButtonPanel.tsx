import { Button, SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import React from 'react';
import { useIntl } from 'react-intl';

interface QuayPopupButtonPanelProps {
  quayId: string;
  quaysTotalCount: number;
  hasSelectedQuay: boolean;
  hasNonSelectedQuays: boolean;
  hideNonSelectedQuaysState: boolean;
  hideNonSelectedQuaysCallback: (hideNonSelected: boolean) => void;
  showQuaysCallback: (showAll: boolean) => void;
  addStopPointCallback: (quayId: string) => void;
}

const QuayPopupButtonPanel = ({
  quayId,
  quaysTotalCount,
  addStopPointCallback,
  hasSelectedQuay,
  hasNonSelectedQuays,
  hideNonSelectedQuaysState,
  hideNonSelectedQuaysCallback,
  showQuaysCallback,
}: QuayPopupButtonPanelProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={'popup-button-panel'}>
      <Button
        className={'popup-button'}
        onClick={() => {
          addStopPointCallback(quayId);
        }}
        width="auto"
        variant="primary"
        size="small"
      >
        <AddIcon />
        {formatMessage({ id: 'addToJourneyPattern' })}
      </Button>
      {hasSelectedQuay && hasNonSelectedQuays ? (
        <SecondaryButton
          className={'popup-button'}
          style={{
            marginLeft: '0.5rem',
          }}
          onClick={() =>
            hideNonSelectedQuaysCallback(!hideNonSelectedQuaysState)
          }
          width="auto"
          size="small"
        >
          {hideNonSelectedQuaysState
            ? formatMessage({ id: 'showNonSelectedQuays' })
            : formatMessage({ id: 'hideNonSelectedQuays' })}
        </SecondaryButton>
      ) : (
        ''
      )}
      {!hasSelectedQuay && quaysTotalCount > 1 ? (
        <SecondaryButton
          className={'popup-button'}
          style={{
            marginLeft: '0.5rem',
          }}
          onClick={() => showQuaysCallback(false)}
          width="auto"
          size="small"
        >
          {formatMessage({ id: 'hideQuays' })}
        </SecondaryButton>
      ) : (
        ''
      )}
    </div>
  );
};

export default QuayPopupButtonPanel;