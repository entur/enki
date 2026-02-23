import { Box } from '@mui/material';
import { StopPointBookingArrangement } from '../common/StopPointBookingArrangement';
import { getErrorFeedback } from 'helpers/errorHandling';
import { validateFlexibleAreasOnlyStopPoint } from 'validation';
import usePristine from 'hooks/usePristine';
import { useIntl } from 'react-intl';
import {
  FrontTextTextField,
  useOnFrontTextChange,
} from '../common/FrontTextTextField';
import { FlexibleStopPlaceSelector } from '../common/FlexibleStopPlaceSelector';
import { StopPointEditorProps } from '../common/StopPointEditorProps';

export const FlexibleAreasOnlyStopPointEditor = ({
  stopPoint,
  onChange,
  spoilPristine,
}: StopPointEditorProps) => {
  const { stopPlace: stopPlaceError, frontText: frontTextError } =
    validateFlexibleAreasOnlyStopPoint(stopPoint);
  const { formatMessage } = useIntl();
  const onFrontTextChange = useOnFrontTextChange(stopPoint, onChange);
  const frontTextPristine = usePristine(
    stopPoint.destinationDisplay?.frontText,
    spoilPristine,
  );

  return (
    <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: '50rem',
            flexBasis: '100%',
          }}
        >
          <FlexibleStopPlaceSelector
            stopPoint={stopPoint}
            spoilPristine={spoilPristine}
            stopPlaceError={stopPlaceError}
            onChange={onChange}
          />

          <Box sx={{ flex: 2, minWidth: 200 }}>
            <FrontTextTextField
              value={stopPoint.destinationDisplay?.frontText}
              onChange={onFrontTextChange}
              spoilPristine={spoilPristine}
              isFirst={true}
              {...getErrorFeedback(
                frontTextError ? formatMessage({ id: frontTextError }) : '',
                !frontTextError,
                frontTextPristine,
              )}
            />
          </Box>
        </Box>
      </Box>
      <StopPointBookingArrangement
        stopPoint={stopPoint}
        spoilPristine={spoilPristine}
        onChange={onChange}
      />
    </Box>
  );
};
