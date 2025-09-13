import React from 'react';
import PropTypes from 'prop-types';

const BucketIndicator = ({ bucketName, color }) => {
  // Generate a consistent color based on bucket name
  const getColor = () => {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ];
    
    let hash = 0;
    for (let i = 0; i < bucketName.length; i++) {
      hash = bucketName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
      className="bucket-indicator" 
      style={{ backgroundColor: color || getColor() }}
      title={bucketName}
    >
      {bucketName.charAt(0).toUpperCase()}
    </div>
  );
};

BucketIndicator.propTypes = {
  bucketName: PropTypes.string.isRequired,
  color: PropTypes.string
};

export default BucketIndicator;
