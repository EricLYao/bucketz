import React from 'react';
import PropTypes from 'prop-types';
import './BatchInputOverlay.css';

const BatchInputOverlay = ({
  open,
  title,
  placeholder,
  value,
  onChange,
  onConfirm,
  onCancel
}) => {
  if (!open) return null;
  return (
    <div className="batch-overlay">
      <div className="batch-modal">
        <h2>{title}</h2>
        <textarea
          className="batch-textarea"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus
        />
        <div className="batch-actions">
          <button className="batch-confirm" onClick={onConfirm}>Add</button>
          <button className="batch-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

BatchInputOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default BatchInputOverlay;
