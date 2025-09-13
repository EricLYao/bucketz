import { useState, useCallback } from 'react';

export const useBuckets = (initialBuckets = {}) => {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [bucketColors, setBucketColors] = useState({});
  const [newBucketName, setNewBucketName] = useState('');
  const [editingBucket, setEditingBucket] = useState(null);
  const [bucketEditName, setBucketEditName] = useState('');

  const handleAddBucket = useCallback((e) => {
    e.preventDefault();
    const name = newBucketName.trim();
    if (name && !(name in buckets)) {
      setBuckets(prev => ({
        ...prev,
        [name]: []
      }));
      setNewBucketName('');
    }
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
    }
    setEditingBucket(null);
    setBucketEditName('');
  }, [bucketEditName, buckets]);

  const handleDeleteBucket = useCallback((bucketName) => {
    setBuckets(prev => {
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
      const newBuckets = { ...prev };
      newBuckets[bucketName] = prev[bucketName].filter((_, i) => i !== index);
      return newBuckets;
    });
  }, []);

  return {
    buckets,
    setBuckets,
    bucketColors,
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
