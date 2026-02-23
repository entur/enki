import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import JourneyPattern from 'model/JourneyPattern';
import ServiceJourney from 'model/ServiceJourney';
import StopPoint from 'model/StopPoint';
import { useRef } from 'react';
import { useIntl } from 'react-intl';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  journeyPatterns: JourneyPattern[];
  keys: string[];
  selectedJourneyPatternIndex: number;
  setSelectedJourneyPatternIndex: (selected: number) => void;
  addNewServiceJourney: (
    name: string,
    serviceJourneys: ServiceJourney[],
    stopPoints: StopPoint[],
    journeyPatternIndex: number,
  ) => void;
};

export default (props: Props) => {
  const {
    open,
    setOpen,
    journeyPatterns,
    keys,
    selectedJourneyPatternIndex,
    setSelectedJourneyPatternIndex,
    addNewServiceJourney,
  } = props;

  const { formatMessage } = useIntl();
  const textFieldRef = useRef<HTMLInputElement>(null);

  const jpOptions = journeyPatterns.map((jp, i) => ({
    value: keys[i],
    label: jp.name || '',
  }));

  const selectedJpOption = jpOptions[selectedJourneyPatternIndex] ?? null;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formatMessage({ id: 'newServiceJourneyModalTitle' })}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {formatMessage({ id: 'newServiceJourneyModalSubTitle' })}
        </Typography>
        <TextField
          label={formatMessage({ id: 'newServiceJourneyModalNameLabel' })}
          placeholder={formatMessage({
            id: 'newServiceJourneyModalPlaceholder',
          })}
          inputRef={textFieldRef}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Autocomplete
          options={jpOptions}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={selectedJpOption}
          onChange={(_event, newValue) => {
            if (newValue) {
              setSelectedJourneyPatternIndex(keys.indexOf(newValue.value));
            }
          }}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({
                id: 'newServiceJourneyModalJourneyPatternLabel',
              })}
              variant="outlined"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          {formatMessage({ id: 'newServiceJourneyModalCancel' })}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            const jp = journeyPatterns[selectedJourneyPatternIndex];
            addNewServiceJourney(
              textFieldRef?.current?.value ?? '',
              jp.serviceJourneys,
              jp.pointsInSequence,
              selectedJourneyPatternIndex,
            );
          }}
        >
          {formatMessage({ id: 'newServiceJourneyModalCreate' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
