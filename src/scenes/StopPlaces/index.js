import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';

import {
  Table,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'components/Table';
import Loading from 'components/Loading';
import IconButton from 'components/IconButton';
import { loadFlexibleStopPlaces } from 'actions/flexibleStopPlaces';
import { selectIntl } from 'i18n';
import './styles.css';
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
            <TableRowCell>{sp.name}</TableRowCell>
            <TableRowCell>{sp.privateCode}</TableRowCell>
            <TableRowCell>
              {sp.flexibleArea.polygon.coordinates.length - 1}
            </TableRowCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-stop-places disabled">
          <TableRowCell colSpan={3}>
            {formatMessage(messages.noStopPlacesFoundText)}
          </TableRowCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <TableRowCell colSpan={3}>
            <Loading text={formatMessage(messages.loadingStopPlacesText)} />
          </TableRowCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="stop-places">
      <h2>{formatMessage(messages.header)}</h2>

      <Link to="/stop-places/create">
        <IconButton
          icon={<AddIcon />}
          label={formatMessage(messages.createStopPlaceLinkIconLabelText)}
          labelPosition="right"
        />
      </Link>

      <Table>
        <TableHeaderCell
          label={formatMessage(messages.nameTableHeaderLabelText)}
        />
        <TableHeaderCell
          label={formatMessage(messages.privateCodeTableHeaderLabelText)}
        />
        <TableHeaderCell
          label={formatMessage(messages.numberOfPointsTableHeaderLabelText)}
        />

        {renderTableRows()}
      </Table>
    </div>
  );
};

export default withRouter(StopPlaces);
