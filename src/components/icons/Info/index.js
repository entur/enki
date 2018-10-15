import React from 'react';

const Info = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g>
          <g transform="translate(8.089888, 8.000000) rotate(-180.000000) translate(-8.089888, -8.000000) ">
            <path
              d="M0,8 C0,12.4 3.64044944,16 8.08988764,16 C12.5393258,16 16.1797753,12.4 16.1797753,8 C16.1797753,3.6 12.5393258,0 8.08988764,0 C3.64044944,0 0,3.6 0,8 Z"
              id="Path"
              fill="#656782"
            />
            <polygon
              id="Path"
              fill="#FFFFFF"
              points="9.1011236 9 7.07865169 9 7.07865169 4 9.1011236 4"
            />
            <path
              d="M8.08988764,12 C7.48314607,12 7.07865169,11.6 7.07865169,11 C7.07865169,10.4 7.48314607,10 8.08988764,10 C8.69662921,10 9.1011236,10.4 9.1011236,11 C9.1011236,11.6 8.69662921,12 8.08988764,12 L8.08988764,12 Z"
              id="Path"
              fill="#FFFFFF"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Info;
