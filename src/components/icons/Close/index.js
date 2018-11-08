import React from 'react';

const Close = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      height={18}
      width={18}
      {...props}
    >
      <path
        id="path-1_18_"
        d="M69.7,61.8l-7.9,7.9L50,57.9L38.2,69.7l-7.9-7.9L42.1,50L30.3,38.2l7.9-7.9L50,42.1l11.8-11.8l7.9,7.9
					L57.9,50L69.7,61.8z M50,5C25.2,5,5,25.2,5,50s20.2,45,45,45s45-20.2,45-45S74.7,5,50,5L50,5z"
      />
    </svg>
  );
};

export default Close;
