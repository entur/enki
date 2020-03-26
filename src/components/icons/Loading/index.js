import React from 'react';

const Loading = (props) => {
  return (
    <svg
      width="100px"
      height="100px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-double-ring"
      style={{ background: 'none' }}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        strokeLinecap="round"
        r="40"
        strokeWidth="4"
        stroke="#181c56"
        strokeDasharray="62.83185307179586 62.83185307179586"
        transform="rotate(122.5 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="2.4s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="50"
        cy="50"
        fill="none"
        strokeLinecap="round"
        r="35"
        strokeWidth="4"
        stroke="#ff5959"
        strokeDasharray="54.97787143782138 54.97787143782138"
        strokeDashoffset="54.97787143782138"
        transform="rotate(-122.5 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;-360 50 50"
          keyTimes="0;1"
          dur="2.4s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Loading;
