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
import { deleteDayTypeById, loadDayTypes } from 'actions/dayTypes';
import Loading from 'components/Loading';
import DayType from 'model/DayType';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

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
    <div className="day-types">
      <Heading1>{formatMessage({ id: 'dayTypesHeaderText' })}</Heading1>

      <SecondaryButton className="create" as={Link} to="/day-types/create">
        <AddIcon />
        {formatMessage({ id: 'dayTypesCreateDayTypeButtonLabel' })}
      </SecondaryButton>

      <Loading
        text={formatMessage({ id: 'dayTypesLoadingText' })}
        isLoading={!dayTypes}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>
                  {formatMessage({ id: 'dayTypesNameTableHeader' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'dayTypesWeekdaysTableHeader' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'dayTypesInUseTableHeader' })}
                </HeaderCell>
                <HeaderCell>{''}</HeaderCell>
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
                    <DataCell>
                      {dt.name || formatMessage({ id: 'dayTypeNoName' })}
                    </DataCell>
                    <DataCell>{formatWeekdays(dt.daysOfWeek)}</DataCell>
                    <DataCell>
                      {(dt.numberOfServiceJourneys ?? 0) > 0
                        ? formatMessage({ id: 'dayTypeInUse' })
                        : formatMessage({ id: 'dayTypeNotInUse' })}
                    </DataCell>
                    <DataCell className="delete-row-cell">
                      <DeleteButton
                        onClick={() => {
                          setSelectedDayType(dt);
                          setShowDeleteDialogue(true);
                        }}
                        title=""
                        thin
                        disabled={(dt.numberOfServiceJourneys ?? 0) > 0}
                      />
                    </DataCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="row-no-day-types disabled">
                  <DataCell colSpan={4}>
                    {formatMessage({ id: 'dayTypesNoDayTypesFoundText' })}
                  </DataCell>
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
                <SecondaryButton
                  key="no"
                  onClick={() => {
                    setSelectedDayType(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage({ id: 'no' })}
                </SecondaryButton>,
                <SuccessButton
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
                </SuccessButton>,
              ]}
            />
          )}
        </>
      </Loading>
    </div>
  );
};

export default DayTypes;
