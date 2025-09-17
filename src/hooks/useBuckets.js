import { useState, useCallback } from 'react';
import { BUCKET_COLORS } from '../App';

export const useBuckets = (initialBuckets = {}, initialColors = {}) => {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [bucketColors, setBucketColors] = useState(initialColors);
  const [newBucketName, setNewBucketName] = useState('');
  const [editingBucket, setEditingBucket] = useState(null);
  const [bucketEditName, setBucketEditName] = useState('');

  const getNextColor = (currentColors) => {
    const colorCount = Object.keys(currentColors).length;
    return BUCKET_COLORS[colorCount % BUCKET_COLORS.length];
  };

  const handleAddBucket = useCallback((e) => {
    e.preventDefault();
    const name = newBucketName.trim();
    if (!name || name in buckets) {
      return;
    }
    
    // Update buckets and colors in a single batch
    setBuckets(prev => {
      const newBuckets = {
        ...prev,
        [name]: []
      };
      // Update colors right after buckets
      setBucketColors(prevColors => ({
        ...prevColors,
        [name]: getNextColor(prevColors)
      }));
      return newBuckets;
    });
    
    setNewBucketName('');
  }, [buckets, newBucketName]);

  const startEditingBucket = useCallback((bucketName) => {
    setEditingBucket(bucketName);
    setBucketEditName(bucketName);
  }, []);

  const handleRenameBucket = useCallback((oldName) => {
    const newName = bucketEditName.trim();
    if (newName && newName !== oldName && !(newName in buckets)) {
      setBuckets(prev => {
        const { [oldName]: items, ...rest } = prev;
        return {
          ...rest,
          [newName]: items
        };
      });
      setBucketColors(prev => {
        const { [oldName]: color, ...rest } = prev;
        return {
          ...rest,
          [newName]: color
        };
      });
    }
    setEditingBucket(null);
    setBucketEditName('');
  }, [bucketEditName, buckets]);

  const handleDeleteBucket = useCallback((bucketName) => {
    setBuckets(prev => {
      const { [bucketName]: _, ...rest } = prev;
      return rest;
    });
    setBucketColors(prev => {
      const { [bucketName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSetBucketColor = useCallback((bucketName, color) => {
    setBucketColors(prev => ({
      ...prev,
      [bucketName]: color
    }));
  }, []);

  const handleDeleteFromBucket = useCallback((bucketName, index) => {
    setBuckets(prev => {
      const bucket = prev[bucketName];
      if (!bucket) return prev;
      return {
        ...prev,
        [bucketName]: bucket.filter((_, i) => i !== index)
      };
    });
  }, []);

  return {
    buckets,
    setBuckets,
    bucketColors,
    setBucketColors,
    newBucketName,
    setNewBucketName,
    editingBucket,
    bucketEditName,
    setBucketEditName,
    handleAddBucket,
    startEditingBucket,
    handleRenameBucket,
    handleDeleteBucket,
    handleDeleteFromBucket,
    handleSetBucketColor
  };
};
