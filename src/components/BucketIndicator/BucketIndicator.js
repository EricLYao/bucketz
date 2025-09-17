import React from 'react';
import PropTypes from 'prop-types';
import { BUCKET_COLORS } from '../../App';

const BucketIndicator = ({ bucketName, color }) => {
  // Import BUCKET_COLORS from App.js instead of defining colors here

  return (
    <div 
      className="bucket-indicator" 
      style={{ backgroundColor: color || BUCKET_COLORS[0] }}
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
