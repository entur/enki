import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SuccessButton, NegativeButton, SecondaryButton } from '@entur/button';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@entur/tab';

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
import PageHeader from 'components/PageHeader';
import OverlayLoader from 'components/OverlayLoader';
import ConfirmDialog from 'components/ConfirmDialog';
import BookingArrangementEditor from './BookingArrangementEditor';
import JourneyPatternsEditor from './JourneyPatterns';
import { DEFAULT_SELECT_VALUE } from './constants';
import validateForm from './validateForm';
import './styles.scss';
import General from './General';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';
import { selectIntl } from 'i18n';
import messages from './messages';

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
  const { formatMessage } = useSelector(selectIntl);
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

  const operators = organisations.filter(
    org =>
      org.types.includes(ORGANISATION_TYPE.OPERATOR) &&
      org.references.netexOperatorId
  );

  const isLoadingLine = !flexibleLine;
  const isLoadingDependencies = !networks || !flexibleStopPlaces;

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
          <Tabs>
            <TabList>
              <Tab>{formatMessage(messages.generalTabLabel)}</Tab>
              <Tab>{formatMessage(messages.journeyPatternsTabLabel)}</Tab>
              <Tab>{formatMessage(messages.bookingTabLabel)}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
                <JourneyPatternsEditor
                  journeyPatterns={flexibleLine.journeyPatterns}
                  onChange={jps => onFieldChange('journeyPatterns', jps)}
                />
              </TabPanel>
              <TabPanel>
                <BookingArrangementEditor
                  bookingArrangement={flexibleLine.bookingArrangement}
                  onChange={b => onFieldChange('bookingArrangement', b)}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <div className="buttons">
            <SuccessButton onClick={handleOnSaveClick}>
              {formatMessage(messages.saveButtonText)}
            </SuccessButton>

            {match.params.id && (
              <NegativeButton
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleteDisabled}
              >
                {formatMessage(messages.deleteButtonText)}
              </NegativeButton>
            )}
          </div>
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
        onClose={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default withRouter(FlexibleLineEditor);
