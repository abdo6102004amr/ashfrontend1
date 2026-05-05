import React from 'react';

const spinnerStyle = {
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  border: '2px solid rgba(0,0,0,0.1)',
  borderTop: '2px solid #333',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginRight: '0.5rem',
};

const containerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
};

const styleSheet = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const LoadingSpinner = ({ size = 16 }) => {
  const s = { ...spinnerStyle, width: `${size}px`, height: `${size}px`, borderTopWidth: `${Math.max(2, size/8)}px` };
  return (
    <span style={containerStyle} aria-hidden>
      <style>{styleSheet}</style>
      <span style={s} />
    </span>
  );
};

export default LoadingSpinner;
