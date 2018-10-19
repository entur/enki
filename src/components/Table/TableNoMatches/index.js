import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@entur/component-library';

import './styles.css';

const TableNoMatches = ({
  when,
  message,
  onClearFiltersClick,
  ...restProps
}) => {
  if (!when) {
    return null;
  }

  const renderButton = typeof onClearFiltersClick === 'function';

  return (
    <div {...restProps} className="table-no-matches">
      <div className="no-matches-text">{message}</div>
      {renderButton && (
        <Button onClick={onClearFiltersClick} width="md">
          Fjern alle filtre
        </Button>
      )}
    </div>
  );
};

TableNoMatches.displayName = 'TableNoMatches';

TableNoMatches.propTypes = {
  when: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClearFiltersClick: PropTypes.func
};
TableNoMatches.defaultProps = {
  when: false
};

export default TableNoMatches;
