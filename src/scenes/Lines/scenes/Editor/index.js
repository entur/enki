import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SuccessButton,
  PrimaryButton,
  NegativeButton,
  SecondaryButton
} from '@entur/button';
import { Stepper } from '@entur/menu';
import { FlexibleLine } from 'model';
import { ValidationErrorIcon } from '@entur/icons';
import {
  ORGANISATION_TYPE,
  FLEXIBLE_LINE_TYPE,
  VEHICLE_MODE,
  VEHICLE_SUBMODE
} from 'model/enums';
import {
  deleteFlexibleLineById,
  loadFlexibleLineById,
  saveFlexibleLine
} from 'actions/flexibleLines';
import { loadNetworks } from 'actions/networks';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import OverlayLoader from 'components/OverlayLoader';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import {
  DEFAULT_SELECT_VALUE,
  FLEXIBLE_LINE_STEPS,
  NUM_OF_LAST_STEP
} from './constants';
import validateForm from './validateForm';
import './styles.scss';
import General from './General';
import { setSavedChanges } from 'actions/editor';
import { withRouter } from 'react-router-dom';
import { selectIntl } from 'i18n';
import { createSelector } from 'reselect';
import messages from './messages';

const ErrorIcon = ({ visible }) => {
  return (
    <ValidationErrorIcon
      className={`error-icon ${visible ? '' : 'no-error'}`}
    />
  );
};

const NextStepButton = ({ onClick, isDisabled }) => (
  <PrimaryButton onClick={onClick} disabled={isDisabled}>
    Lagre og gå videre
  </PrimaryButton>
);
const selectFlexibleLine = createSelector(
  state => state.flexibleLines,
  (_, match) => match,
  (flexibleLines, match) =>
    (match.params.id && flexibleLines?.find(l => l.id === match.params.id)) ||
    new FlexibleLine({
      transportMode: VEHICLE_MODE.BUS,
      transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS,
      flexibleLineType: FLEXIBLE_LINE_TYPE.FLEXIBLE_AREAS_ONLY
    })
);

function useLoadDependencies(match, history) {
  const [networksIsLoading, setNetworksIsLoading] = useState(true);
  const [flexibleLineIsLoading, setFlexibleLineIsLoading] = useState(true);
  const [
    flexibleStopPlacesIsLoading,
    setFlexibleStopPlacesIsLoading
  ] = useState(true);

  const dispatch = useDispatch();

  const dispatchLoadFlexibleStopPlaces = useCallback(
    () =>
      dispatch(loadFlexibleStopPlaces()).then(() =>
        setFlexibleStopPlacesIsLoading(false)
      ),
    [dispatch]
  );

  const dispatchLoadNetworks = useCallback(
    () => dispatch(loadNetworks()).then(() => setNetworksIsLoading(false)),
    [dispatch]
  );

  const dispatchLoadFlexibleLineById = useCallback(() => {
    if (match.params.id) {
      dispatch(loadFlexibleLineById(match.params.id))
        .catch(() => history.push('/lines'))
        .then(() => setFlexibleLineIsLoading(false));
    } else {
      setFlexibleLineIsLoading(false);
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadFlexibleLineById();
    dispatchLoadFlexibleStopPlaces();
  }, [
    dispatchLoadNetworks,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById
  ]);
  return (
    networksIsLoading || flexibleLineIsLoading || flexibleStopPlacesIsLoading
  );
}

const useFlexibleLine = match => {
  const savedLine = useSelector(state => selectFlexibleLine(state, match));
  const [flexibleLine, setFlexibleLine] = useState(null);
  useEffect(() => {
    setFlexibleLine(savedLine);
  }, [savedLine]);

  const handleNetworkSelectionChange = networkSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange(
        'networkRef',
        networkSelection !== DEFAULT_SELECT_VALUE ? networkSelection : undefined
      )
    );
  };

  const handleOperatorSelectionChange = operatorSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange(
        'operatorRef',
        operatorSelection !== DEFAULT_SELECT_VALUE
          ? operatorSelection
          : undefined
      )
    );
  };

  const onFieldChange = useCallback(
    (field, value, multi = false) => {
      setFlexibleLine(flexibleLine.withFieldChange(field, value, multi));
    },
    [flexibleLine]
  );

  return {
    handleNetworkSelectionChange,
    handleOperatorSelectionChange,
    onFieldChange,
    flexibleLine
  };
};

const FlexibleLineEditor = ({ match, history }) => {
  const { formatMessage } = useSelector(selectIntl);
  const organisations = useSelector(({ organisations }) => organisations);
  const networks = useSelector(({ networks }) => networks);
  const [activeStepperIndex, setActiveStepperIndex] = useState(0);

  const {
    handleNetworkSelectionChange,
    handleOperatorSelectionChange,
    onFieldChange,
    flexibleLine
  } = useFlexibleLine(match);

  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState(validateForm(flexibleLine));
  const [isValidServiceJourney, setIsValidServiceJourney] = useState(true);
  const [isValidStopPoints, setIsValidStopPoints] = useState(true);

  useEffect(() => {
    setErrors(validateForm(flexibleLine));
  }, [flexibleLine]);

  const dispatch = useDispatch();
  const isLoadingDependencies = useLoadDependencies(match, history);

  const handleOnSaveClick = () => {
    const valid = validateForm(flexibleLine).isValid;

    if (valid && isValidServiceJourney) {
      setSaving(true);
      dispatch(saveFlexibleLine(flexibleLine))
        .then(() => history.push('/lines'))
        .finally(() => setSaving(false));
      dispatch(setSavedChanges(true));
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteFlexibleLineById(flexibleLine.id)).then(() =>
      history.push('/lines')
    );
  };

  const operators = organisations.filter(
    org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR) &&
      org.references.netexOperatorId
  );
  const isLoadingLine = !flexibleLine;

  const isDeleteDisabled = isLoadingLine || isLoadingDependencies || isDeleting;

  return (
    <div className="line-editor">
      <div className="header">
        <PageHeader
          withBackButton
          title={
            match.params.id
              ? formatMessage(messages.editLineHeader)
              : formatMessage(messages.createLineHeader)
          }
        />
        <Stepper
          steps={FLEXIBLE_LINE_STEPS}
          activeIndex={activeStepperIndex}
          onStepClick={() => undefined}
        />
      </div>

      {!isLoadingLine && !isLoadingDependencies ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={
            isSaving
              ? formatMessage(messages.saveLineLoadingText)
              : formatMessage(messages.deleteLineLoadingText)
          }
        >
          {/* <Tabs>
            <TabList>
              <Tab>
                {formatMessage(messages.generalTabLabel)}
                <ErrorIcon visible={!errors.isValid} />
              </Tab>
              <Tab>{formatMessage(messages.journeyPatternsTabLabel)}</Tab>
              <Tab>{formatMessage(messages.bookingTabLabel)}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel> */}
          {activeStepperIndex === 0 && (
            <section>
              <General
                flexibleLine={flexibleLine}
                networks={networks}
                operators={operators}
                errors={errors}
                networkSelection={
                  flexibleLine.networkRef || DEFAULT_SELECT_VALUE
                }
                operatorSelection={
                  flexibleLine.operatorRef || DEFAULT_SELECT_VALUE
                }
                handleFieldChange={onFieldChange}
                handleNetworkSelectionChange={handleNetworkSelectionChange}
                handleOperatorSelectionChange={handleOperatorSelectionChange}
              />

              <NextStepButton
                onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                isDisabled={!errors.isValid}
              />
            </section>
          )}

          {activeStepperIndex === 1 && (
            <section>
              <JourneyPatternsEditor
                journeyPatterns={flexibleLine.journeyPatterns}
                onChange={jps => onFieldChange('journeyPatterns', jps)}
                setIsValidServiceJourney={setIsValidServiceJourney}
                setIsValidStopPoints={setIsValidStopPoints}
              />

              <NextStepButton
                onClick={() => setActiveStepperIndex(activeStepperIndex + 1)}
                isDisabled={!isValidStopPoints || !isValidServiceJourney}
              />
            </section>
          )}

          {activeStepperIndex === 2 && (
            <section>
              <BookingArrangementEditor
                bookingArrangement={flexibleLine.bookingArrangement}
                onChange={b => onFieldChange('bookingArrangement', b)}
              />
            </section>
          )}

          {activeStepperIndex === NUM_OF_LAST_STEP - 1 && (
            <div className="buttons">
              {match.params.id && (
                <NegativeButton
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleteDisabled}
                >
                  {formatMessage(messages.deleteButtonText)}
                </NegativeButton>
              )}
              <PrimaryButton
                onClick={handleOnSaveClick}
                disabled={!isValidServiceJourney || !isValidStopPoints}
              >
                {formatMessage(messages.saveButtonText)}
              </PrimaryButton>
            </div>
          )}
        </OverlayLoader>
      ) : (
        <Loading
          text={
            isLoadingLine
              ? formatMessage(messages.loadingLineText)
              : formatMessage(messages.loadingNetworkAndStopsText)
          }
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={formatMessage(messages.deleteConfirmationDialogTitle)}
        message={formatMessage(messages.deleteConfirmationDialogMessage)}
        buttons={[
          <SecondaryButton key={2} onClick={() => setDeleteDialogOpen(false)}>
            {formatMessage(messages.deleteConfirmationDialogCancelButtonText)}
          </SecondaryButton>,
          <SuccessButton key={1} onClick={handleDelete}>
            {formatMessage(messages.deleteConfirmationDialogConfirmButtonText)}
          </SuccessButton>
        ]}
        onDismiss={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
