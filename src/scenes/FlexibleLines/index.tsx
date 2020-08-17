import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AddIcon } from '@entur/icons';
import { SecondaryButton, SuccessButton } from '@entur/button';
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
import { deleteLine, loadFlexibleLines } from 'actions/flexibleLines';
import { RouteComponentProps } from 'react-router';
import './styles.scss';
import { selectIntl } from 'i18n';
import { GlobalState } from 'reducers';
import { OrganisationState } from 'reducers/organisations';
import { FlexibleLinesState } from 'reducers/flexibleLines';
import ConfirmDialog from 'components/ConfirmDialog';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import FlexibleLine from 'model/FlexibleLine';

const Lines = ({ history }: RouteComponentProps) => {
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedLine, setSelectedLine] = useState<FlexibleLine | undefined>(
    undefined
  );
  const { formatMessage } = useSelector(selectIntl);
  const lines = useSelector<GlobalState, FlexibleLinesState>(
    (state) => state.flexibleLines
  );
  const operator = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );
  const dispatch = useDispatch<any>();

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
            <DataCell>
              {line.flexibleLineType && formatMessage('linesFlexibleDataCell')}
            </DataCell>
            <DataCell className="delete-row-cell">
              <DeleteButton
                onClick={() => {
                  setSelectedLine(line);
                  setShowDeleteDialogue(true);
                }}
                title=""
                thin
              />
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

      <section className="buttons">
        <SecondaryButton
          as={Link}
          to="/flexible-lines/create"
          className="new-line-button"
        >
          <AddIcon />
          {formatMessage('linesCreateFlexibleLineIconButtonLabel')}
        </SecondaryButton>
        <SecondaryButton
          as={Link}
          to="/lines/create"
          className="new-line-button"
        >
          <AddIcon />
          {formatMessage('linesCreateLineIconButtonLabel')}
        </SecondaryButton>
      </section>

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
            <HeaderCell>{''}</HeaderCell>
            <HeaderCell>{''}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>

      {showDeleteDialogue && selectedLine && (
        <ConfirmDialog
          isOpen
          onDismiss={() => {
            setSelectedLine(undefined);
            setShowDeleteDialogue(false);
          }}
          title={formatMessage('editorDeleteLineConfirmationDialogTitle')}
          message={formatMessage('editorDeleteLineConfirmationDialogMessage')}
          buttons={[
            <SecondaryButton
              key="no"
              onClick={() => {
                setSelectedLine(undefined);
                setShowDeleteDialogue(false);
              }}
            >
              {formatMessage('tableNo')}
            </SecondaryButton>,
            <SuccessButton
              key="yes"
              onClick={() => {
                dispatch(deleteLine(selectedLine))
                  .then(() => {
                    setSelectedLine(undefined);
                    setShowDeleteDialogue(false);
                  })
                  .then(() => dispatch(loadFlexibleLines()));
              }}
            >
              {formatMessage('tableYes')}
            </SuccessButton>,
          ]}
        />
      )}
    </div>
  );
};

export default withRouter(Lines);
