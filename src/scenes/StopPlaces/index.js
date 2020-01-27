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
  DataCell
} from '@entur/table';
import Loading from 'components/Loading';
import { SecondaryButton } from '@entur/button';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { selectIntl } from 'i18n';
import './styles.scss';
import messages from './messages';

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
    id => {
      history.push(`/stop-places/edit/${id}`);
    },
    [history]
  );

  const renderTableRows = () => {
    if (stopPlaces) {
      return stopPlaces.length > 0 ? (
        stopPlaces.map(sp => (
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
            {formatMessage(messages.noStopPlacesFoundText)}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={3}>
            <Loading text={formatMessage(messages.loadingStopPlacesText)} />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="stop-places">
      <h2>{formatMessage(messages.header)}</h2>

      <SecondaryButton
        as={Link}
        to="/stop-places/create"
        className="new-stopplace-button"
      >
        <AddIcon />
        {formatMessage(messages.createStopPlaceLinkIconLabelText)}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage(messages.nameTableHeaderLabelText)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.privateCodeTableHeaderLabelText)}
            </HeaderCell>
            <HeaderCell>
              {formatMessage(messages.numberOfPointsTableHeaderLabelText)}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(StopPlaces);
