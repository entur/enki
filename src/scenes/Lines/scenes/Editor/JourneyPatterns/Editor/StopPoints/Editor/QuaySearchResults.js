import React, { Fragment } from 'react';

let style = {marginTop: '-1em', marginBottom: '1em'};
export default function QuaySearchResults ({quaySearch}) {
  return (
    <Fragment>
      {quaySearch.stopPlace && quaySearch.stopPlace !== 'not-found' && <div style={style}>
        <span>{quaySearch.stopPlace.name.value}</span> <span>{quaySearch.quay.publicCode}</span>
      </div>}

      {
        quaySearch.stopPlace === 'not-found' && <div style={style}>
          Fant ikke plattform
        </div>
      }
    </Fragment>
  );
}