import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
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
  markerRef: React.Ref<any>;
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
          if (
            markerRef &&
            typeof markerRef === 'object' &&
            'current' in markerRef
          ) {
            markerRef.current?.closePopup();
          }
          addStopPoint(quayId);
          // To avoid grey area on the map once the container gets bigger in the height:
          window.dispatchEvent(new Event('resize'));
        }}
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
      >
        {formatMessage({ id: 'addToJourneyPattern' })}
      </Button>
      {hasSelectedQuay && hasNonSelectedQuays ? (
        <Button
          className={'popup-button'}
          style={{
            marginLeft: '0.5rem',
          }}
          onClick={() => {
            if (
              markerRef &&
              typeof markerRef === 'object' &&
              'current' in markerRef
            ) {
              markerRef.current?.closePopup();
            }
            hideNonSelectedQuays(!hideNonSelectedQuaysState);
          }}
          variant="outlined"
          size="small"
        >
          {hideNonSelectedQuaysState
            ? formatMessage({ id: 'showNonSelectedQuays' })
            : formatMessage({ id: 'hideNonSelectedQuays' })}
        </Button>
      ) : (
        ''
      )}
      {!hasSelectedQuay && quaysTotalCount > 1 ? (
        <Button
          className={'popup-button'}
          style={{
            marginLeft: '0.5rem',
          }}
          onClick={() => showQuays(false)}
          variant="outlined"
          size="small"
        >
          {formatMessage({ id: 'hideQuays' })}
        </Button>
      ) : (
        ''
      )}
    </div>
  );
};

export default QuayPopupButtonPanel;
