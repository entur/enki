import React from 'react';

import './styles.scss';

const Table = ({ className, children }) => {
  const childrenArray = React.Children.toArray(children);

  const TableHeaderCells = childrenArray.filter(
    child => child.type.displayName === 'TableHeaderCell'
  );
  const TableRows = childrenArray.filter(
    child => child.type.displayName === 'TableRow'
  );

  return (
    <table className={className}>
      <thead>
        <tr>{TableHeaderCells}</tr>
      </thead>
      <tbody>{TableRows}</tbody>
    </table>
  );
};

export default Table;
