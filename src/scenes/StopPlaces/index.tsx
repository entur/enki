import { SecondaryButton, SuccessButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Heading1 } from '@entur/typography';
import {
  deleteFlexibleStopPlaceById,
  loadFlexibleStopPlaces,
} from 'actions/flexibleStopPlaces';
import Loading from 'components/Loading';
import { selectIntl } from 'i18n';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { FlexibleStopPlacesState } from 'reducers/flexibleStopPlaces';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

const StopPlaces = ({ history }: RouteComponentProps) => {
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedStopPlace, setSelectedStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);
  const stopPlaces = useSelector<GlobalState, FlexibleStopPlacesState>(
    (state) => state.flexibleStopPlaces
  );
  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadFlexibleStopPlaces());
  }, [dispatch]);

  const handleOnRowClick = useCallback(
    (id) => {
      history.push(`/stop-places/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = (stopPlaces: FlexibleStopPlace[]) => (
    <>
      {stopPlaces.map((sp) => (
        <TableRow
          key={sp.id}
          onClick={() => handleOnRowClick(sp.id)}
          title={sp.description}
        >
          <DataCell>{sp.name}</DataCell>
          <DataCell>{sp.privateCode}</DataCell>
          <DataCell>
            {(sp.flexibleArea?.polygon?.coordinates?.length ?? 1) - 1}
          </DataCell>
          <DataCell className="delete-row-cell">
            <DeleteButton
              onClick={() => {
                setSelectedStopPlace(sp);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
          </DataCell>
        </TableRow>
      ))}
      {stopPlaces.length === 0 && (
        <TableRow className="row-no-stop-places disabled">
          <DataCell colSpan={3}>
            {formatMessage('stopPlacesNoStopPlacesFoundText')}
          </DataCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="stop-places">
      <Heading1>{formatMessage('stopPlacesHeader')}</Heading1>

      <SecondaryButton
        as={Link}
        to="/stop-places/create"
        className="new-stopplace-button"
      >
        <AddIcon />
        {formatMessage('stopPlacesCreateStopPlaceLinkIconLabelText')}
      </SecondaryButton>
      <Loading
        text={formatMessage('stopPlacesLoadingStopPlacesText')}
        isLoading={!stopPlaces}
      >
        {() => (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell>
                    {formatMessage('stopPlacesNameTableHeaderLabelText')}
                  </HeaderCell>
                  <HeaderCell>
                    {formatMessage('stopPlacesPrivateCodeTableHeaderLabelText')}
                  </HeaderCell>
                  <HeaderCell>
                    {formatMessage(
                      'stopPlacesNumberOfPointsTableHeaderLabelText'
                    )}
                  </HeaderCell>
                  <HeaderCell>{''}</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableRows(stopPlaces!)}</TableBody>
            </Table>
            {showDeleteDialogue && selectedStopPlace && (
              <ConfirmDialog
                isOpen
                onDismiss={() => {
                  setSelectedStopPlace(undefined);
                  setShowDeleteDialogue(false);
                }}
                title={formatMessage(
                  'editorDeleteStopPlaceConfirmationDialogTitle'
                )}
                message={formatMessage(
                  'editorDeleteStopPlaceConfirmationDialogMessage'
                )}
                buttons={[
                  <SecondaryButton
                    key="no"
                    onClick={() => {
                      setSelectedStopPlace(undefined);
                      setShowDeleteDialogue(false);
                    }}
                  >
                    {formatMessage('tableNo')}
                  </SecondaryButton>,
                  <SuccessButton
                    key="yes"
                    onClick={() => {
                      dispatch(
                        deleteFlexibleStopPlaceById(selectedStopPlace.id ?? '')
                      )
                        .then(() => {
                          setSelectedStopPlace(undefined);
                          setShowDeleteDialogue(false);
                        })
                        .then(() => dispatch(loadFlexibleStopPlaces()));
                    }}
                  >
                    {formatMessage('tableYes')}
                  </SuccessButton>,
                ]}
              />
            )}
          </>
        )}
      </Loading>
    </div>
  );
};

export default withRouter(StopPlaces);
