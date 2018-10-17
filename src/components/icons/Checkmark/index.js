import React from 'react';

const Checkmark = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 7" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill="#181C56">
          <g>
            <polygon points="2.8002 4.3756 1.2002 2.6246 0.0002 3.9386 2.8002 6.9996 8.0002 1.3126 6.8002 0.0006" />
          </g>
        </g>
      </g>
    </svg>
  );
};
Checkmark.defaultProps = {
  height: 8,
  width: 7
};

export default Checkmark;
