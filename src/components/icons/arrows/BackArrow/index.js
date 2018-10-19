import React from 'react';

import './styles.css';

const BackArrow = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="#fff"
      width={35}
      height={21}
      className="back-arrow"
      {...props}
    >
      <path d="M42.7,82.9l7-7L28.2,54.4h61v-10h-61l21.5-21.5l-7-7L9.2,49.4L42.7,82.9z" />
    </svg>
  );
};

export default BackArrow;
