import React from 'react';

const TableRowCell = ({ children, ...rest }) => <td {...rest}>{children}</td>;

TableRowCell.displayName = 'TableRowCell';

export default TableRowCell;
