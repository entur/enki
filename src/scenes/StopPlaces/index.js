import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import { SecondaryButton } from '@entur/button';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { selectIntl } from 'i18n';
import './styles.scss';

const StopPlaces = ({ history }) => {
  const stopPlaces = useSelector(
    ({ flexibleStopPlaces }) => flexibleStopPlaces
  );
  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFlexibleStopPlaces());
  }, [dispatch]);

  const handleOnRowClick = useCallback(
    (id) => {
      history.push(`/stop-places/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = () => {
    if (stopPlaces) {
      return stopPlaces.length > 0 ? (
        stopPlaces.map((sp) => (
          <TableRow
            key={sp.id}
            onClick={() => handleOnRowClick(sp.id)}
            title={sp.description}
          >
            <DataCell>{sp.name}</DataCell>
            <DataCell>{sp.privateCode}</DataCell>
            <DataCell>
              {sp.flexibleArea.polygon.coordinates.length - 1}
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-stop-places disabled">
          <DataCell colSpan={3}>
            {formatMessage('stopPlacesNoStopPlacesFoundText')}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={3}>
            <Loading text={formatMessage('stopPlacesLoadingStopPlacesText')} />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="stop-places">
      <PageHeader title={formatMessage('stopPlacesHeader')} />

      <SecondaryButton
        as={Link}
        to="/stop-places/create"
        className="new-stopplace-button"
      >
        <AddIcon />
        {formatMessage('stopPlacesCreateStopPlaceLinkIconLabelText')}
      </SecondaryButton>

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
              {formatMessage('stopPlacesNumberOfPointsTableHeaderLabelText')}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(StopPlaces);
