import React from 'react';
import PropTypes from 'prop-types';
import BucketIndicator from '../BucketIndicator/BucketIndicator';
import './Bucket.css';

const Bucket = ({
  name,
  items,
  color,
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
  onDeleteItem,
  onColorChange
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
              <div 
                className="bucket-indicator-wrapper" 
                onClick={(e) => {
                  e.stopPropagation();
                  const colorInput = e.currentTarget.querySelector('.color-picker');
                  colorInput.click();
                }}
                title="Click to change color"
              >
                <BucketIndicator bucketName={name} color={color} />
                <input
                  type="color"
                  ref={(input) => {
                    if (input) {
                      const currentColor = color || (() => {
                        const colors = [
                          '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
                          '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
                        ];
                        let hash = 0;
                        for (let i = 0; i < name.length; i++) {
                          hash = name.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        return colors[Math.abs(hash) % colors.length];
                      })();
                      input.value = currentColor;
                    }
                  }}
                  onChange={(e) => onColorChange(name, e.target.value)}
                  className="color-picker"
                  aria-label="Change bucket color"
                />
              </div>
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
  color: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  editName: PropTypes.string.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onEditNameChange: PropTypes.func.isRequired,
  onRenameBucket: PropTypes.func.isRequired,
  onDeleteBucket: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onItemDragStart: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};

export default Bucket;
