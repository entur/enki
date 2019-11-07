import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tabs, Tab } from '@entur/component-library';

import { FlexibleLine } from 'model';
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
import OverlayLoader from 'components/OverlayLoader';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import { DEFAULT_SELECT_VALUE } from './constants';
import validateForm from './validateForm';
import './styles.css';
import General from './General';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';

const TABS = Object.freeze({
  GENERAL: 'general',
  BOOKING: 'booking',
  JOURNEY_PATTERNS: 'journeyPatterns'
});

const selectFlexibleLine = createSelector(
  state => state.flexibleLines,
  (_, match) => match,
  (flexibleLines, match) =>
    match.params.id
      ? flexibleLines
        ? flexibleLines.find(l => l.id === match.params.id)
        : null
      : new FlexibleLine({
          transportMode: VEHICLE_MODE.BUS,
          transportSubmode: VEHICLE_SUBMODE.LOCAL_BUS,
          flexibleLineType: FLEXIBLE_LINE_TYPE.FLEXIBLE_AREAS_ONLY
        })
);

const FlexibleLineEditor = ({ match, history }) => {
  const organisations = useSelector(({ organisations }) => organisations);
  const networks = useSelector(({ networks }) => networks);
  const flexibleStopPlaces = useSelector(
    ({ flexibleStopPlaces }) => flexibleStopPlaces
  );
  const currentFlexibleLine = useSelector(state =>
    selectFlexibleLine(state, match)
  );

  const [flexibleLine, setFlexibleLine] = useState(null);
  const [operatorSelection, setOperatorSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const [networkSelection, setNetworkSelection] = useState(
    DEFAULT_SELECT_VALUE
  );
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  const [isSaving, setSaving] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({
    networkRef: []
  });

  const dispatch = useDispatch();

  const dispatchLoadNetworks = useCallback(() => dispatch(loadNetworks()), [
    dispatch
  ]);

  const dispatchLoadFlexibleStopPlaces = useCallback(
    () => dispatch(loadFlexibleStopPlaces()),
    [dispatch]
  );

  const dispatchLoadFlexibleLineById = useCallback(() => {
    if (match.params.id) {
      dispatch(loadFlexibleLineById(match.params.id)).catch(() =>
        history.push('/lines')
      );
    }
  }, [dispatch, match.params.id, history]);

  useEffect(() => {
    dispatchLoadNetworks();
    dispatchLoadFlexibleStopPlaces();
    dispatchLoadFlexibleLineById();
  }, [
    dispatchLoadNetworks,
    dispatchLoadFlexibleStopPlaces,
    dispatchLoadFlexibleLineById
  ]);

  useEffect(() => {
    setOperatorSelection(
      currentFlexibleLine
        ? currentFlexibleLine.operatorRef
        : DEFAULT_SELECT_VALUE
    );
    setNetworkSelection(
      currentFlexibleLine
        ? currentFlexibleLine.networkRef
        : DEFAULT_SELECT_VALUE
    );
    setFlexibleLine(currentFlexibleLine);
  }, [currentFlexibleLine]);

  const handleOnSaveClick = () => {
    let [valid, errors] = validateForm(flexibleLine);

    setErrors(errors);

    if (valid) {
      setSaving(true);
      dispatch(saveFlexibleLine(flexibleLine))
        .then(() => history.push('/lines'))
        .finally(() => setSaving(false));
    }
  };

  const onFieldChange = useCallback(
    (field, value, multi = false) => {
      setFlexibleLine(flexibleLine.withFieldChange(field, value, multi));
    },
    [flexibleLine]
  );

  const handleOperatorSelectionChange = operatorSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange(
        'operatorRef',
        operatorSelection !== DEFAULT_SELECT_VALUE
          ? operatorSelection
          : undefined
      )
    );
    setOperatorSelection(operatorSelection);
  };

  const handleNetworkSelectionChange = networkSelection => {
    setFlexibleLine(
      flexibleLine.withFieldChange(
        'networkRef',
        networkSelection !== DEFAULT_SELECT_VALUE ? networkSelection : undefined
      )
    );
    setNetworkSelection(networkSelection);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteFlexibleLineById(flexibleLine.id)).then(() =>
      history.push('/lines')
    );
  };

  const operators = organisations.filter(org =>
    org.types.includes(ORGANISATION_TYPE.OPERATOR)
  );

  const isLoadingLine = !flexibleLine;
  const isLoadingDependencies = !networks || !flexibleStopPlaces;

  const isDeleteDisabled = isLoadingLine || isLoadingDependencies || isDeleting;

  return (
    <div className="line-editor">
      <div className="header">
        <h2>{match.params.id ? 'Rediger' : 'Opprett'} linje</h2>

        <div className="buttons">
          <Button variant="success" onClick={handleOnSaveClick}>
            Lagre
          </Button>

          {match.params.id && (
            <Button
              variant="negative"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleteDisabled}
            >
              Slett
            </Button>
          )}
        </div>
      </div>

      {!isLoadingLine && !isLoadingDependencies ? (
        <OverlayLoader
          isLoading={isSaving || isDeleting}
          text={(isSaving ? 'Lagrer' : 'Sletter') + ' linjen...'}
        >
          <Tabs
            selected={activeTab}
            onChange={activeTab => setActiveTab(activeTab)}
          >
            <Tab value={TABS.GENERAL} label="Generelt" className="general-tab">
              <General
                flexibleLine={flexibleLine}
                networks={networks}
                operators={operators}
                errors={errors}
                networkSelection={networkSelection}
                operatorSelection={operatorSelection}
                handleFieldChange={onFieldChange}
                handleNetworkSelectionChange={handleNetworkSelectionChange}
                handleOperatorSelectionChange={handleOperatorSelectionChange}
              />
            </Tab>

            <Tab value={TABS.JOURNEY_PATTERNS} label="Journey Patterns">
              <JourneyPatternsEditor
                journeyPatterns={flexibleLine.journeyPatterns}
                onChange={jps => onFieldChange('journeyPatterns', jps)}
              />
            </Tab>

            <Tab
              value={TABS.BOOKING}
              label="Bestilling"
              className="booking-tab"
            >
              <BookingArrangementEditor
                bookingArrangement={flexibleLine.bookingArrangement}
                onChange={b => onFieldChange('bookingArrangement', b)}
              />
            </Tab>
          </Tabs>
        </OverlayLoader>
      ) : (
        <Loading
          text={`Laster inn ${
            isLoadingLine ? 'linje' : 'nettverk og stoppesteder'
          }...`}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Slette linje"
        message="Er du sikker på at du ønsker å slette denne linjen?"
        buttons={[
          <Button
            key={2}
            onClick={() => setDeleteDialogOpen(false)}
            variant="secondary"
            width="md"
            className="action-button"
          >
            Nei
          </Button>,
          <Button
            key={1}
            onClick={handleDelete}
            variant="success"
            width="md"
            className="action-button"
          >
            Ja
          </Button>
        ]}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
