import Add from '@mui/icons-material/Add';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { deleteDayTypeById, loadDayTypes } from 'actions/dayTypes';
import Loading from 'components/Loading';
import DayType from 'model/DayType';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';

const DayTypes = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedDayType, setSelectedDayType] = useState<DayType | undefined>(
    undefined,
  );
  const intl = useIntl();
  const { formatMessage } = intl;
  const activeProviderCode = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const dayTypes = useAppSelector((state) => state.dayTypes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDayTypes(intl));
  }, [dispatch, activeProviderCode, intl]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/day-types/edit/${id}`);
    },
    [navigate],
  );

  const formatWeekdays = (daysOfWeek: string[]) => {
    if (!daysOfWeek || daysOfWeek.length === 0) return '-';
    return daysOfWeek
      .map((day) =>
        formatMessage({
          id: `weekdays${day.charAt(0).toUpperCase() + day.slice(1)}`,
        }),
      )
      .join(', ');
  };

  return (
    <Stack spacing={3} sx={{ flex: 1 }}>
      <Typography variant="h1">
        {formatMessage({ id: 'dayTypesHeaderText' })}
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/day-types/create"
        sx={{ alignSelf: 'flex-start' }}
      >
        <Add />
        {formatMessage({ id: 'dayTypesCreateDayTypeButtonLabel' })}
      </Button>

      <Loading
        text={formatMessage({ id: 'dayTypesLoadingText' })}
        isLoading={!dayTypes}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {formatMessage({ id: 'dayTypesNameTableHeader' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'dayTypesWeekdaysTableHeader' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'dayTypesInUseTableHeader' })}
                </TableCell>
                <TableCell>{''}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dayTypes && dayTypes.length > 0 ? (
                dayTypes.map((dt) => (
                  <TableRow
                    key={dt.id}
                    onClick={() => handleOnRowClick(dt.id!)}
                    title={dt.name}
                  >
                    <TableCell>
                      {dt.name || formatMessage({ id: 'dayTypeNoName' })}
                    </TableCell>
                    <TableCell>{formatWeekdays(dt.daysOfWeek)}</TableCell>
                    <TableCell>
                      {(dt.numberOfServiceJourneys ?? 0) > 0
                        ? formatMessage({ id: 'dayTypeInUse' })
                        : formatMessage({ id: 'dayTypeNotInUse' })}
                    </TableCell>
                    <TableCell sx={{ width: 50, textAlign: 'right' }}>
                      <DeleteButton
                        onClick={() => {
                          setSelectedDayType(dt);
                          setShowDeleteDialogue(true);
                        }}
                        title=""
                        thin
                        disabled={(dt.numberOfServiceJourneys ?? 0) > 0}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="row-no-day-types disabled">
                  <TableCell colSpan={4}>
                    {formatMessage({ id: 'dayTypesNoDayTypesFoundText' })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {showDeleteDialogue && selectedDayType && (
            <ConfirmDialog
              isOpen
              onDismiss={() => {
                setSelectedDayType(undefined);
                setShowDeleteDialogue(false);
              }}
              title={formatMessage({
                id: 'dayTypesDeleteConfirmDialogTitle',
              })}
              message={formatMessage({
                id: 'dayTypesDeleteConfirmDialogMessage',
              })}
              buttons={[
                <Button
                  variant="outlined"
                  key="no"
                  onClick={() => {
                    setSelectedDayType(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage({ id: 'no' })}
                </Button>,
                <Button
                  variant="contained"
                  color="success"
                  key="yes"
                  onClick={() => {
                    dispatch(deleteDayTypeById(selectedDayType?.id, intl))
                      .then(() => {
                        setSelectedDayType(undefined);
                        setShowDeleteDialogue(false);
                      })
                      .then(() => dispatch(loadDayTypes(intl)));
                  }}
                >
                  {formatMessage({ id: 'yes' })}
                </Button>,
              ]}
            />
          )}
        </>
      </Loading>
    </Stack>
  );
};

export default DayTypes;
