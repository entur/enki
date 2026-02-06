import Add from '@mui/icons-material/Add';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
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
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { findFlexibleStopAreaType } from './findFlexibleStopAreaType';

const StopPlaces = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedStopPlace, setSelectedStopPlace] = useState<
    FlexibleStopPlace | undefined
  >(undefined);
  const stopPlaces = useAppSelector((state) => state.flexibleStopPlaces);
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useAppDispatch();

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
          <TableCell>{sp.name}</TableCell>
          <TableCell>
            {formatMessage({ id: getStopAreaTypeMessageKey(sp) })}
          </TableCell>
          <TableCell>{sp.privateCode}</TableCell>
          <TableCell>{sp.flexibleAreas?.length ?? 0}</TableCell>
          <TableCell sx={{ width: 50, textAlign: 'right' }}>
            <DeleteButton
              onClick={() => {
                setSelectedStopPlace(sp);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
          </TableCell>
        </TableRow>
      ))}
      {stopPlaces.length === 0 && (
        <TableRow>
          <TableCell colSpan={3}>
            {formatMessage({ id: 'stopPlacesNoStopPlacesFoundText' })}
          </TableCell>
        </TableRow>
      )}
    </>
  );

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'stopPlacesHeader' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/stop-places/create"
        sx={{ alignSelf: 'flex-start' }}
      >
        <Add />
        {formatMessage({ id: 'stopPlacesCreateStopPlaceLinkIconLabelText' })}
      </Button>
      <Loading
        text={formatMessage({ id: 'stopPlacesLoadingStopPlacesText' })}
        isLoading={!stopPlaces}
      >
        {() => (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '50%' }}>
                      {formatMessage({
                        id: 'stopPlacesNameTableHeaderLabelText',
                      })}
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      {formatMessage({ id: 'flexibleStopAreaType' })}
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      {formatMessage({
                        id: 'stopPlacesPrivateCodeTableHeaderLabelText',
                      })}
                    </TableCell>
                    <TableCell>
                      {formatMessage({
                        id: 'stopPlacesNumberOfAreasTableHeaderLabelText',
                      })}
                    </TableCell>
                    <TableCell>{''}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderTableRows(stopPlaces!)}</TableBody>
              </Table>
            </TableContainer>
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
                  <Button
                    variant="outlined"
                    key="no"
                    onClick={() => {
                      setSelectedStopPlace(undefined);
                      setShowDeleteDialogue(false);
                    }}
                  >
                    {formatMessage({ id: 'no' })}
                  </Button>,
                  <Button
                    variant="contained"
                    color="error"
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
                  </Button>,
                ]}
              />
            )}
          </>
        )}
      </Loading>
    </Stack>
  );
};

export default StopPlaces;
