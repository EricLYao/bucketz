import { useCallback } from 'react';

export const useDragAndDrop = (buckets, setBuckets) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleNameDragStart = useCallback((e, name) => {
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.setData('source-type', 'names-list');
  }, []);

  const handleBucketDragStart = useCallback((e, bucketName, index) => {
    const item = buckets[bucketName][index];
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.setData('source-type', 'bucket');
    e.dataTransfer.setData('source-bucket', bucketName);
    e.dataTransfer.setData('source-index', index.toString());
  }, [buckets]);

  const handleDrop = useCallback((e, targetBucket) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const name = e.dataTransfer.getData('text/plain');
    const sourceType = e.dataTransfer.getData('source-type');
    
    if (sourceType === 'bucket') {
      const sourceBucket = e.dataTransfer.getData('source-bucket');
      const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));

      if (sourceBucket !== targetBucket) {
        setBuckets(prev => {
          if (prev[targetBucket].includes(name)) {
            return prev;
          }

          const newBuckets = { ...prev };
          newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
          newBuckets[targetBucket] = [...prev[targetBucket], name];
          return newBuckets;
        });
      }
    } else {
      setBuckets(prev => {
        if (prev[targetBucket].includes(name)) {
          return prev;
        }
        return {
          ...prev,
          [targetBucket]: [...prev[targetBucket], name]
        };
      });
    }
  }, [setBuckets]);

  const handleNamesListDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const sourceType = e.dataTransfer.getData('source-type');
    const sourceBucket = e.dataTransfer.getData('source-bucket');
    const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));

    if (sourceType === 'bucket') {
      setBuckets(prev => {
        const newBuckets = { ...prev };
        newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
        return newBuckets;
      });
    }
  }, [setBuckets]);

  return {
    handleDragOver,
    handleDragLeave,
    handleNameDragStart,
    handleBucketDragStart,
    handleDrop,
    handleNamesListDrop
  };
};
