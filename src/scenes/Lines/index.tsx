import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import { Link } from 'react-router-dom';

import { Heading1 } from '@entur/typography';
import { SecondaryButton } from '@entur/button';
import { AddIcon } from '@entur/icons';

import { GlobalState } from 'reducers';

import LinesTable from 'components/LinesTable';
import { LinesState } from 'reducers/lines';
import { loadLines } from 'actions/lines';
import { OrganisationState } from 'reducers/organisations';

export default () => {
  const { formatMessage } = useSelector(selectIntl);

  const lines = useSelector<GlobalState, LinesState>((state) => state.lines);

  const organisations = useSelector<GlobalState, OrganisationState>(
    (state) => state.organisations
  );

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadLines());
  }, [dispatch]);

  return (
    <div className="lines">
      <Heading1>{formatMessage('linesHeader')}</Heading1>

      <section className="buttons">
        <SecondaryButton
          as={Link}
          to="/lines/create"
          className="new-line-button"
        >
          <AddIcon />
          {formatMessage('linesCreateLineIconButtonLabel')}
        </SecondaryButton>
      </section>

      <LinesTable
        nameTableHeader={formatMessage('linesNameTableHeaderLabel')}
        privateCodeTableHeader={formatMessage(
          'linesPrivateCodeTableHeaderLabel'
        )}
        operatorTableHeader={formatMessage('linesOperatorTableHeader')}
        noLinesFoundText={formatMessage('linesNoLinesFoundText')}
        loadingText={formatMessage('linesLoadingText')}
        lines={lines!}
        organisations={organisations!}
        onRowClick={() => {}}
        onDeleteRowClick={() => {}}
      />
    </div>
  );
};
