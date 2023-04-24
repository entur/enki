import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { TextField } from '@entur/form';
import { Modal } from '@entur/modal';
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
    journeyPatternIndex: number
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

  return (
    <Modal
      size="small"
      open={open}
      title={formatMessage({ id: 'newServiceJourneyModalTitle' })}
      onDismiss={() => setOpen(false)}
      className="modal"
    >
      {formatMessage({ id: 'newServiceJourneyModalSubTitle' })}
      <div className="modal-content">
        <TextField
          label={formatMessage({ id: 'newServiceJourneyModalNameLabel' })}
          className="modal-input"
          placeholder={formatMessage({
            id: 'newServiceJourneyModalPlaceholder',
          })}
          ref={textFieldRef}
        />
        <Dropdown
          label={formatMessage({
            id: 'newServiceJourneyModalJourneyPatternLabel',
          })}
          className="modal-input"
          items={journeyPatterns?.map((jp, i) => ({
            value: keys[i],
            label: jp.name || '',
          }))}
          value={keys[selectedJourneyPatternIndex]}
          onChange={(selected) =>
            setSelectedJourneyPatternIndex(keys.indexOf(selected?.value!))
          }
        />
        <div>
          <SecondaryButton
            onClick={() => setOpen(false)}
            className="margin-right"
          >
            {formatMessage({ id: 'newServiceJourneyModalCancel' })}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              const jp = journeyPatterns[selectedJourneyPatternIndex];
              addNewServiceJourney(
                textFieldRef?.current?.value ?? '',
                jp.serviceJourneys,
                jp.pointsInSequence,
                selectedJourneyPatternIndex
              );
            }}
          >
            {formatMessage({ id: 'newServiceJourneyModalCreate' })}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};
