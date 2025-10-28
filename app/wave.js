'use client';
import React from 'react';

const Wave = () => {
  return (
    <div style={{  overflow: 'hidden', lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <defs>
          <linearGradient id="creamToBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff8dc" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
        </defs>
        {/* <path
          fill="url(#creamToBlack)"
          fillOpacity="1"
          d="M0,192 C360,320 1080,80 1440,240 L1440,320 L0,320 Z"
        ></path> */}
      </svg>
    </div>
  );
};

export default Wave;
