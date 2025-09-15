import { useState, useCallback, useEffect } from 'react';

export const useBuckets = (initialBuckets = {}) => {
  // Load saved data from localStorage or use defaults
  const savedBuckets = JSON.parse(localStorage.getItem('buckets'));
  const savedColors = JSON.parse(localStorage.getItem('bucketColors'));

  const [buckets, setBuckets] = useState(savedBuckets || initialBuckets);
  const [bucketColors, setBucketColors] = useState(savedColors || {});
  const [newBucketName, setNewBucketName] = useState('');

  // Save buckets and colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('buckets', JSON.stringify(buckets));
  }, [buckets]);

  useEffect(() => {
    localStorage.setItem('bucketColors', JSON.stringify(bucketColors));
  }, [bucketColors]);
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
