import React from 'react';
import PropTypes from 'prop-types';
import BucketIndicator from '../BucketIndicator/BucketIndicator';
import '../../styles/common.css';

const NamesList = ({ 
  names, 
  newName, 
  onNewNameChange, 
  onAddName, 
  onRemoveName, 
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  buckets
}) => {
  return (
    <div 
      className="names-list"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <h2>Names</h2>
      <form onSubmit={onAddName} className="add-name-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          placeholder="Enter a new name"
          className="name-input"
        />
        <button type="submit" className="add-button" title="Add name">
          +
        </button>
      </form>
      {names.map(name => (
        <div
          key={name}
          className="name-item"
          draggable
          onDragStart={(e) => onDragStart(e, name)}
        >
          <span className="item-text">{name}</span>
          {Object.entries(buckets).map(([bucketName, items]) => (
            items.includes(name) && (
              <BucketIndicator key={bucketName} bucketName={bucketName} />
            )
          ))}
          <button 
            className="delete-button"
            onClick={() => onRemoveName(name)}
            title="Remove name"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

NamesList.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  newName: PropTypes.string.isRequired,
  onNewNameChange: PropTypes.func.isRequired,
  onAddName: PropTypes.func.isRequired,
  onRemoveName: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  buckets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired
};

export default NamesList;
