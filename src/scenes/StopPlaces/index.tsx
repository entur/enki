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
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import {
  FLEXIBLE_STOP_AREA_TYPE,
  flexibleStopAreaTypeMessages,
} from 'model/enums';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { findFlexibleStopAreaType } from './findFlexibleStopAreaType';
import './styles.scss';

const StopPlaces = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedStopPlace, setSelectedStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);
  const stopPlaces = useAppSelector((state) => state.flexibleStopPlaces);
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
    [navigate],
  );

  const getStopAreaTypeMessageKey = (stopPlace: FlexibleStopPlace) => {
    const types = new Set();

    const stopPlaceType = findFlexibleStopAreaType(stopPlace.keyValues);

    if (stopPlaceType) {
      types.add(stopPlaceType);
    }

    stopPlace.flexibleAreas?.map((flexibleArea) => {
      const flexibleAreaType = findFlexibleStopAreaType(flexibleArea.keyValues);
      if (flexibleAreaType) {
        types.add(flexibleAreaType);
      }
    });

    if (types.size > 1) {
      return 'flexibleStopAreaTypeMixed';
    } else if (types.size === 1) {
      return flexibleStopAreaTypeMessages[
        types.values().next().value as FLEXIBLE_STOP_AREA_TYPE
      ];
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
          <DataCell>{sp.flexibleAreas?.length ?? 0}</DataCell>
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
                      id: 'stopPlacesNumberOfAreasTableHeaderLabelText',
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
                          intl,
                        ),
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
