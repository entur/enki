import React, { Component } from 'react';

class TableRow extends Component {
  render() {
    const { children, ...rest } = this.props;
    const Cells = React.Children.toArray(children).filter(
      child => child.type.displayName === 'TableRowCell'
    );

    return <tr {...rest}>{Cells}</tr>;
  }
}

TableRow.displayName = 'TableRow';

export default TableRow;
