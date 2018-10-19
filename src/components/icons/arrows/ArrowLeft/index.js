import React from 'react';

import ArrowRight from '../ArrowRight';

const ArrowLeft = props => {
  return <ArrowRight transform="rotate(180)" {...props} />;
};

export default ArrowLeft;
