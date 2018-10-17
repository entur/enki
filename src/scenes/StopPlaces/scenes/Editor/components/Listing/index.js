import React from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

const Listing = () => {
  const columns = [
    {
      Header: 'Navn',
      accessor: 'name'
    },{
      Header: 'Gyldighet',
      accessor: 'validity'
    },{
      Header: 'Punkter i polygon',
      accessor: 'points'
    }
  ];
  const data = [
    {
      name: 'Oslo',
      validity: 'Alltid',
      points: 5
    },
    {
      name: 'Buskerud',
      validity: 'Mandager',
      points: 23
    },
    {
      name: 'Akershus',
      validity: 'Helger',
      points: 11
    }
  ];

  return data.length > 0 ? (
    <ReactTable
      className="flexible-stop-place-listing"
      columns={columns}
      data={data}
      minRows={0}
      showPagination={false}
    />
  ) : null;
};

export default Listing;
