import React from 'react';

const Warning = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      fill="#fff"
      height={25}
      width={25}
      {...props}
    >
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Artboard">
          <g id="Group" fill="#EFD358">
            <circle id="Oval" cx="12.5" cy="12.5" r="12.5" />
          </g>
          <g
            id="Group"
            transform="translate(11.000000, 6.000000)"
            fill="#FFFFFF"
          >
            <polygon id="Path" points="3 8 0 8 0 0 3 0" />
            <path
              d="M1.5,13 C0.6,13 0,12.4 0,11.5 C0,10.6 0.6,10 1.5,10 C2.4,10 3,10.6 3,11.5 C3,12.4 2.4,13 1.5,13 L1.5,13 Z"
              id="Path"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Warning;
