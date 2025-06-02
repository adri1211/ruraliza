import React from 'react';

const Spinner = () => (
  <div style={{ display: 'inline-block', width: 60, height: 60 }}>
    <svg
      style={{ display: 'block', margin: 'auto' }}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="30"
        cy="30"
        r="24"
        stroke="#A0B88B"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="110"
        strokeDashoffset="40"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 30 30"
          to="360 30 30"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default Spinner; 