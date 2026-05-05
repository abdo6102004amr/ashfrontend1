import React from 'react';

const containerStyle = {
  padding: '0.9rem 1rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};

const messageStyle = {
  margin: 0,
  paddingRight: '0.5rem',
  color: '#721c24',
  fontSize: '0.95rem'
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.1rem',
  lineHeight: 1,
  color: '#721c24'
};

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{ ...containerStyle, backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' }} role="alert">
      <p style={messageStyle}>{message}</p>
      <button aria-label="Dismiss error" onClick={onClose} style={closeBtnStyle}>×</button>
    </div>
  );
};

export default ErrorAlert;
