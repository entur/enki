import { Button, SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import React, { MutableRefObject } from 'react';
import { useIntl } from 'react-intl';

interface QuayPopupButtonPanelProps {
  quayId: string;
  quaysTotalCount: number;
  hasSelectedQuay: boolean;
  hasNonSelectedQuays: boolean;
  hideNonSelectedQuaysState: boolean;
  hideNonSelectedQuays: (hideNonSelected: boolean) => void;
  showQuays: (showAll: boolean) => void;
  addStopPoint: (quayId: string) => void;
  markerRef: MutableRefObject<any>;
}

const QuayPopupButtonPanel = ({
  quayId,
  quaysTotalCount,
  addStopPoint,
  hasSelectedQuay,
  hasNonSelectedQuays,
  hideNonSelectedQuaysState,
  hideNonSelectedQuays,
  showQuays,
  markerRef,
}: QuayPopupButtonPanelProps) => {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={'popup-button-panel'}>
      <Button
        className={'popup-button'}
        onClick={() => {
          markerRef.current.closePopup();
          addStopPoint(quayId);
          // To avoid grey area on the map once the container gets bigger in the height:
          window.dispatchEvent(new Event('resize'));
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
          onClick={() => {
            markerRef.current.closePopup();
            hideNonSelectedQuays(!hideNonSelectedQuaysState);
          }}
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
          onClick={() => showQuays(false)}
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
