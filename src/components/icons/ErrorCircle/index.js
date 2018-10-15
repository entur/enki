import React from 'react';

const ErrorCircle = props => {
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
        id="Artboard"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Group">
          <circle id="Oval" fill="#FF5959" cx="12.5" cy="12.5" r="12.5" />
          <polygon
            id="Fill-5"
            fill="#FEFEFE"
            points="12.5 14.3406269 16.0736041 18 18 16.0737362 14.3403759 12.5003773 18 8.9262638 16.0736041 7 12.5 10.6593731 8.92639594 7 7 8.9262638 10.6596241 12.5003773 7 16.0737362 8.92639594 18"
          />
        </g>
      </g>
    </svg>
  );
};

export default ErrorCircle;
