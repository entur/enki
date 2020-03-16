import React, { useState } from 'react';
import { connect } from 'react-redux';
import ConfirmDialog from 'components/ConfirmDialog';
import { SecondaryButton, SuccessButton } from '@entur/button';
import { getIntl } from 'i18n';
import { DeleteIcon } from '@entur/icons';
import Form from './Form';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import messages from '../../messages';
import { GlobalState } from 'reducers';
import StopPoint from 'model/StopPoint';
import { IntlState } from 'react-intl-redux';
import './styles.scss';

export type StopPointsFormError = {
  flexibleStopPlaceRefAndQuayRef: any;
  frontText: any;
};

type Props = {
  isFirst: boolean;
  stopPoint: StopPoint;
  onChange: (stopPoint: StopPoint) => void;
  deleteStopPoint?: () => void;
  errors: StopPointsFormError;
  flexibleStopPlaces: FlexibleStopPlace[];
};

type StateProps = {
  intl: IntlState;
};

const StopPointEditor = (props: Props & StateProps) => {
  const {
    flexibleStopPlaces,
    stopPoint,
    isFirst,
    intl,
    onChange,
    errors,
    deleteStopPoint
  } = props;

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const translations = getIntl({ intl });

  return (
    <div className="stop-point-editor" style={{ marginTop: '2rem' }}>
      <Form
        frontTextRequired={isFirst}
        flexibleStopPlaces={flexibleStopPlaces}
        errors={errors}
        onChange={onChange}
        stopPoint={stopPoint}
      />
      {deleteStopPoint && (
        <SecondaryButton
          className="delete-button"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon inline /> {translations.formatMessage(messages.delete)}
        </SecondaryButton>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={translations.formatMessage(messages.stopPointDeleteTitle)}
        message={translations.formatMessage(messages.stopPointDeleteMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {translations.formatMessage(messages.no)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={deleteStopPoint}>
            {translations.formatMessage(messages.yes)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = ({ intl }: GlobalState): StateProps => ({
  intl
});

export default connect(mapStateToProps)(StopPointEditor);
