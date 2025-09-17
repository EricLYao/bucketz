import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BucketIndicator from '../BucketIndicator/BucketIndicator';

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
  buckets,
  bucketColors,
  onRenameName
}) => {
  const [expandedNames, setExpandedNames] = useState([]);
  const [editingName, setEditingName] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Effect to collapse names that no longer have buckets
  useEffect(() => {
    setExpandedNames(prev => 
      prev.filter(name => {
        // Check if this name has any buckets
        return Object.values(buckets).some(items => Array.isArray(items) && items.includes(name));
      })
    );
  }, [buckets]);

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
      {names.map(name => {
        const assignedBuckets = Object.entries(buckets)
          .filter(([_, items]) => Array.isArray(items) && items.includes(name))
          .map(([bucketName]) => bucketName);
        const isExpanded = expandedNames.includes(name);
        const hasAssignments = assignedBuckets.length > 0;

        const toggleExpand = () => {
          if (!hasAssignments) return;
          setExpandedNames(prev => 
            isExpanded 
              ? prev.filter(n => n !== name)
              : [...prev, name]
          );
        };
        
        return (
          <div 
            key={name} 
            className={`name-item-container ${isExpanded ? 'expanded' : ''} ${hasAssignments ? 'has-assignments' : ''}`}
            data-bucket-count={assignedBuckets.length}
            draggable
            onDragStart={(e) => {
              // Create a clone of just the name-item for the drag image
              const nameItem = e.currentTarget.querySelector('.name-item');
              const dragEl = nameItem.cloneNode(true);
              // Find and update the expand button in the clone
              const expandButton = dragEl.querySelector('.expand-button');
              if (expandButton) {
                expandButton.textContent = '▶';
              }
              // Set the clone as the drag image
              dragEl.style.width = `${nameItem.offsetWidth}px`;
              document.body.appendChild(dragEl);
              // Calculate the mouse position relative to the drag element
              const rect = nameItem.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              // Set the drag image with the correct offset
              e.dataTransfer.setDragImage(dragEl, offsetX, offsetY);
              // Clean up the clone after it's no longer needed
              requestAnimationFrame(() => dragEl.remove());
              
              onDragStart(e, name, names.indexOf(name));
            }}
          >
            <div
              className="name-item"
            >
              <button 
                className="expand-button"
                onClick={toggleExpand}
                title={hasAssignments ? (isExpanded ? "Collapse" : "Expand") : "No assignments"}
                disabled={!hasAssignments}
              >
                {isExpanded ? "▼" : "▶"}
              </button>
              {editingName === name ? (
                <form 
                  className="name-edit-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editNameValue && editNameValue !== name) {
                      onRenameName(name, editNameValue);
                    }
                    setEditingName(null);
                  }}
                >
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    onBlur={() => {
                      if (editNameValue && editNameValue !== name) {
                        onRenameName(name, editNameValue);
                      }
                      setEditingName(null);
                    }}
                    className="name-edit-input"
                    autoFocus
                  />
                </form>
              ) : (
                <>
                  <span 
                    className="item-text" 
                    onDoubleClick={() => {
                      setEditingName(name);
                      setEditNameValue(name);
                    }}
                  >
                    {name}
                  </span>
                  <span className="bucket-count">
                    {assignedBuckets.length > 0 && `(${assignedBuckets.length})`}
                  </span>
                  <button 
                    className="delete-button"
                    onClick={() => onRemoveName(name)}
                    title="Remove name"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
            {isExpanded && assignedBuckets.length > 0 && (
              <div className="bucket-list">
                <div className="bucket-icons-container">
                  {assignedBuckets.map(bucketName => (
                    <div key={bucketName} className="bucket-icon-wrapper" title={bucketName}>
                      <BucketIndicator bucketName={bucketName} color={bucketColors?.[bucketName]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
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
  buckets: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  bucketColors: PropTypes.objectOf(PropTypes.string),
  onRenameName: PropTypes.func.isRequired
};

export default NamesList;
