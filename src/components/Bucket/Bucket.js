import React from 'react';
import PropTypes from 'prop-types';
import BucketIndicator from '../BucketIndicator/BucketIndicator';
import '../../styles/common.css';

const Bucket = ({
  name,
  items,
  isEditing,
  editName,
  onStartEdit,
  onEditNameChange,
  onRenameBucket,
  onDeleteBucket,
  onDragOver,
  onDragLeave,
  onDrop,
  onItemDragStart,
  onDeleteItem
}) => {
  return (
    <div
      className="bucket"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, name)}
    >
      <div className="bucket-header">
        {isEditing ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onRenameBucket(name);
            }}
            className="bucket-edit-form"
          >
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              onBlur={() => onRenameBucket(name)}
              autoFocus
              className="bucket-edit-input"
            />
          </form>
        ) : (
          <h3>
            <div className="bucket-icon-section">
              <BucketIndicator bucketName={name} />
            </div>
            <div className="bucket-name" onClick={() => onStartEdit(name)}>
              {name}
            </div>
            <div className="bucket-delete-section">
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBucket(name);
                }}
                title="Delete bucket"
              >
                ×
              </button>
            </div>
          </h3>
        )}
      </div>
      {items.map((item, index) => (
        <div
          key={`${name}-${index}`}
          className="bucket-item"
          draggable
          onDragStart={(e) => onItemDragStart(e, name, index)}
        >
          <span className="item-text">{item}</span>
          <button 
            className="delete-button"
            onClick={() => onDeleteItem(name, index)}
            title="Remove from bucket"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

Bucket.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  isEditing: PropTypes.bool.isRequired,
  editName: PropTypes.string.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onEditNameChange: PropTypes.func.isRequired,
  onRenameBucket: PropTypes.func.isRequired,
  onDeleteBucket: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onItemDragStart: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};

export default Bucket;
