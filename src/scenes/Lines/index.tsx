import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import Loading from 'components/Loading';
import { Heading1 } from '@entur/typography';
import { loadFlexibleLines } from 'actions/flexibleLines';
import { RouteComponentProps } from 'react-router';
import './styles.scss';
import { selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';

const Lines = ({ history }: RouteComponentProps) => {
  const { formatMessage } = useSelector(selectIntl);
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    (state) => state.flexibleLines
  );
  const operator = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFlexibleLines());
  }, [dispatch]);

  const handleOnRowClick = (id: string) => history.push(`/lines/edit/${id}`);

  const renderTableRows = () => {
    if (lines) {
      return lines.length > 0 ? (
        lines.map((line) => (
          <TableRow
            key={line.id}
            onClick={() => handleOnRowClick(line.id ?? '')}
          >
            <DataCell title={line.description}>{line.name}</DataCell>
            <DataCell>{line.privateCode}</DataCell>
            <DataCell>
              {operator?.find((op) => op.id === line.operatorRef)?.name ?? '-'}
            </DataCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="row-no-lines disabled">
          <DataCell colSpan={3}>
            {formatMessage('linesNoLinesFoundText')}
          </DataCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="disabled">
          <DataCell colSpan={3}>
            <Loading
              className=""
              text={formatMessage('linesLoadingText')}
              children={null}
            />
          </DataCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="lines">
      <Heading1>{formatMessage('linesHeader')}</Heading1>

      <SecondaryButton
        as={Link}
        to="/lines/create/flexible"
        className="new-line-button"
      >
        <AddIcon />
        {formatMessage('linesCreateLineIconButtonLabel')}
      </SecondaryButton>
      <SecondaryButton
        as={Link}
        to="/lines/create/fixed"
        className="new-line-button"
      >
        <AddIcon />
        {'Create fixed line'}
      </SecondaryButton>

      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>
              {formatMessage('linesNameTableHeaderLabel')}
            </HeaderCell>
            <HeaderCell>
              {formatMessage('linesPrivateCodeTableHeaderLabel')}
            </HeaderCell>
            <HeaderCell>{formatMessage('linesOperatorTableHeader')}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </div>
  );
};

export default withRouter(Lines);
