import { useCallback } from 'react';

export const useDragAndDrop = (buckets, setBuckets, names, setNames) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleNameDragStart = useCallback((e, name, index) => {
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.setData('source-type', 'names-list');
    e.dataTransfer.setData('source-index', index.toString());
  }, []);

  const handleBucketDragStart = useCallback((e, bucketName, index) => {
    const item = buckets[bucketName][index];
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.setData('source-type', 'bucket');
    e.dataTransfer.setData('source-bucket', bucketName);
    e.dataTransfer.setData('source-index', index.toString());
    
    // Get mouse position relative to the dragged element
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offset-y', offsetY.toString());
  }, [buckets]);

  const handleDrop = useCallback((e, targetBucket) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    e.currentTarget.querySelectorAll('.drop-indicator').forEach(el => el.remove());

    const name = e.dataTransfer.getData('text/plain');
    const sourceType = e.dataTransfer.getData('source-type');
    const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));
    
    // Get drop position
    const bucketItems = e.currentTarget.querySelectorAll('.bucket-item');
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Find the closest bucket item to drop position
    let dropIndex = -1; // Default to end of list
    let minDistance = Number.MAX_VALUE;
    
    bucketItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = (itemRect.top + itemRect.bottom) / 2 - rect.top;
      const distance = Math.abs(mouseY - itemCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        dropIndex = mouseY < itemCenter ? index : index + 1;
      }
    });
    
    if (sourceType === 'bucket') {
      const sourceBucket = e.dataTransfer.getData('source-bucket');

      setBuckets(prev => {
        if (sourceBucket !== targetBucket && prev[targetBucket].includes(name)) {
          return prev;
        }

        const newBuckets = { ...prev };
        // Remove from source bucket
        newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
        
        if (sourceBucket === targetBucket) {
          // Reordering within the same bucket
          const items = [...prev[targetBucket]];
          const [movedItem] = items.splice(sourceIndex, 1);
          const adjustedDropIndex = dropIndex === -1 ? items.length : 
                                  dropIndex > sourceIndex ? dropIndex - 1 : dropIndex;
          items.splice(adjustedDropIndex, 0, movedItem);
          newBuckets[targetBucket] = items;
        } else {
          // Moving to a different bucket
          const targetItems = [...prev[targetBucket]];
          if (dropIndex === -1) {
            targetItems.push(name);
          } else {
            targetItems.splice(dropIndex, 0, name);
          }
          newBuckets[targetBucket] = targetItems;
        }
        
        return newBuckets;
      });
    } else {
      setBuckets(prev => {
        if (prev[targetBucket].includes(name)) {
          return prev;
        }
        const targetItems = [...prev[targetBucket]];
        if (dropIndex === -1) {
          targetItems.push(name);
        } else {
          targetItems.splice(dropIndex, 0, name);
        }
        return {
          ...prev,
          [targetBucket]: targetItems
        };
      });
    }
  }, [setBuckets]);

  const handleNamesListDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const name = e.dataTransfer.getData('text/plain');
    const sourceType = e.dataTransfer.getData('source-type');
    const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));

    // Get drop position
    const nameItems = e.currentTarget.querySelectorAll('.name-item');
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Find the closest name item to drop position
    let dropIndex = names.length; // Default to end of list
    let minDistance = Number.MAX_VALUE;
    
    nameItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = (itemRect.top + itemRect.bottom) / 2 - rect.top;
      const distance = Math.abs(mouseY - itemCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        dropIndex = mouseY < itemCenter ? index : index + 1;
      }
    });

    if (sourceType === 'bucket') {
      const sourceBucket = e.dataTransfer.getData('source-bucket');
      // Only proceed if the name isn't already in the names list
      if (!names.includes(name)) {
        // Remove from bucket and add to names list
        setBuckets(prev => {
          const newBuckets = { ...prev };
          newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
          return newBuckets;
        });
        setNames(prev => {
          const newNames = [...prev];
          newNames.splice(dropIndex, 0, name);
          return newNames;
        });
      } else {
        // If name already exists, just remove from bucket
        setBuckets(prev => {
          const newBuckets = { ...prev };
          newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
          return newBuckets;
        });
      }
    } else if (sourceType === 'names-list') {
      // Reordering within names list
      setNames(prev => {
        const newNames = [...prev];
        const [movedName] = newNames.splice(sourceIndex, 1);
        newNames.splice(dropIndex > sourceIndex ? dropIndex - 1 : dropIndex, 0, movedName);
        return newNames;
      });
    }
  }, [setBuckets, setNames, names]);

  return {
    handleDragOver,
    handleDragLeave,
    handleNameDragStart,
    handleBucketDragStart,
    handleDrop,
    handleNamesListDrop
  };
};
