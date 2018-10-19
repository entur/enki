import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderFilter from '../TableHeaderFilter';
import { sortConfigProps, filterConfigProps } from './headerPropTypes';
import cx from 'classnames';

const TableHeaderCell = ({
  label,
  filterConfig,
  sortConfig,
  mini,
  ...rest
}) => {
  const allowsUserInteraction = !!(sortConfig || filterConfig);
  const wrapperClassNames = cx({ mini });

  if (allowsUserInteraction) {
    return (
      <th className={wrapperClassNames} {...rest}>
        <div className="sortable">
          {label}
          <TableHeaderFilter
            filterConfig={filterConfig}
            sortConfig={sortConfig}
          />
        </div>
      </th>
    );
  }

  return (
    <th className={wrapperClassNames} {...rest}>
      {label}
    </th>
  );
};

TableHeaderCell.displayName = 'TableHeaderCell';

TableHeaderCell.propTypes = {
  label: PropTypes.node.isRequired,
  sortConfig: sortConfigProps,
  filterConfig: filterConfigProps,
  mini: PropTypes.bool
};

export default TableHeaderCell;
