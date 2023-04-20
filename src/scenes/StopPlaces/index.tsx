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
import { useIntl } from 'react-intl';
import {
  flexibleStopAreaTypeMessages,
  FLEXIBLE_STOP_AREA_TYPE,
} from 'model/enums';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { FlexibleStopPlacesState } from 'reducers/flexibleStopPlaces';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

const StopPlaces = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedStopPlace, setSelectedStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);
  const stopPlaces = useSelector<GlobalState, FlexibleStopPlacesState>(
    (state) => state.flexibleStopPlaces
  );
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadFlexibleStopPlaces(intl));
  }, [dispatch]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/stop-places/edit/${id}`);
    },
    [navigate]
  );

  const getStopAreaTypeMessageKey = (stopPlace: FlexibleStopPlace) => {
    const type = stopPlace.keyValues?.find(
      (v) => v.key === 'FlexibleStopAreaType'
    )?.values[0];
    if (type !== undefined) {
      return flexibleStopAreaTypeMessages[type as FLEXIBLE_STOP_AREA_TYPE];
    } else {
      return 'flexibleStopAreaTypeNotSet';
    }
  };

  const renderTableRows = (stopPlaces: FlexibleStopPlace[]) => (
    <>
      {stopPlaces.map((sp) => (
        <TableRow
          key={sp.id}
          onClick={() => handleOnRowClick(sp.id!)}
          title={sp.description}
        >
          <DataCell>{sp.name}</DataCell>
          <DataCell>
            {formatMessage({ id: getStopAreaTypeMessageKey(sp) })}
          </DataCell>
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
            {formatMessage({ id: 'stopPlacesNoStopPlacesFoundText' })}
          </DataCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="stop-places">
      <Heading1>{formatMessage({ id: 'stopPlacesHeader' })}</Heading1>

      <SecondaryButton
        as={Link}
        to="/stop-places/create"
        className="new-stopplace-button"
      >
        <AddIcon />
        {formatMessage({ id: 'stopPlacesCreateStopPlaceLinkIconLabelText' })}
      </SecondaryButton>
      <Loading
        text={formatMessage({ id: 'stopPlacesLoadingStopPlacesText' })}
        isLoading={!stopPlaces}
      >
        {() => (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell>
                    {formatMessage({
                      id: 'stopPlacesNameTableHeaderLabelText',
                    })}
                  </HeaderCell>
                  <HeaderCell>
                    {formatMessage({ id: 'flexibleStopAreaType' })}
                  </HeaderCell>
                  <HeaderCell>
                    {formatMessage({
                      id: 'stopPlacesPrivateCodeTableHeaderLabelText',
                    })}
                  </HeaderCell>
                  <HeaderCell>
                    {formatMessage({
                      id: 'stopPlacesNumberOfPointsTableHeaderLabelText',
                    })}
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
                title={formatMessage({
                  id: 'editorDeleteStopPlaceConfirmationDialogTitle',
                })}
                message={formatMessage({
                  id: 'editorDeleteStopPlaceConfirmationDialogMessage',
                })}
                buttons={[
                  <SecondaryButton
                    key="no"
                    onClick={() => {
                      setSelectedStopPlace(undefined);
                      setShowDeleteDialogue(false);
                    }}
                  >
                    {formatMessage({ id: 'no' })}
                  </SecondaryButton>,
                  <SuccessButton
                    key="yes"
                    onClick={() => {
                      dispatch(
                        deleteFlexibleStopPlaceById(
                          selectedStopPlace.id ?? '',
                          intl
                        )
                      )
                        .then(() => {
                          setSelectedStopPlace(undefined);
                          setShowDeleteDialogue(false);
                        })
                        .then(() => dispatch(loadFlexibleStopPlaces(intl)));
                    }}
                  >
                    {formatMessage({ id: 'yes' })}
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

export default StopPlaces;
