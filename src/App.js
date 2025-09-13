import { useState } from 'react';
import NamesList from './components/Names/NamesList';
import Bucket from './components/Bucket/Bucket';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useBuckets } from './hooks/useBuckets';
import './App.css';

function App() {
  // Names state
  const [names, setNames] = useState([
    'John Smith',
    'Emma Wilson',
    'Michael Brown',
    'Sarah Davis',
    'James Miller'
  ]);
  const [newName, setNewName] = useState('');

  // Initialize buckets with custom hook
  const {
    buckets,
    setBuckets,
    newBucketName,
    setNewBucketName,
    editingBucket,
    bucketEditName,
    setBucketEditName,
    handleAddBucket,
    startEditingBucket,
    handleRenameBucket,
    handleDeleteBucket,
    handleDeleteFromBucket
  } = useBuckets({
    'Bucket 1': [],
    'Bucket 2': [],
    'Bucket 3': []
  });

  // Initialize drag and drop handlers
  const {
    handleDragOver,
    handleDragLeave,
    handleNameDragStart,
    handleBucketDragStart,
    handleDrop,
    handleNamesListDrop
  } = useDragAndDrop(buckets, setBuckets);

  // Names list handlers
  const handleAddName = (e) => {
    e.preventDefault();
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames(prev => [...prev, newName.trim()]);
      setNewName('');
    }
  };

  const handleRemoveName = (nameToRemove) => {
    setNames(prev => prev.filter(name => name !== nameToRemove));
    setBuckets(prev => {
      const newBuckets = {};
      Object.keys(prev).forEach(bucketName => {
        newBuckets[bucketName] = prev[bucketName].filter(name => name !== nameToRemove);
      });
      return newBuckets;
    });
  };

  return (
    <div className="app">
      <NamesList
        names={names}
        newName={newName}
        onNewNameChange={setNewName}
        onAddName={handleAddName}
        onRemoveName={handleRemoveName}
        onDragStart={handleNameDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleNamesListDrop}
        buckets={buckets}
      />
      <div className="buckets-section">
        <div className="add-bucket-form">
          <form onSubmit={handleAddBucket}>
            <input
              type="text"
              value={newBucketName}
              onChange={(e) => setNewBucketName(e.target.value)}
              placeholder="Enter bucket name"
              className="bucket-input"
            />
            <button type="submit" className="add-button" title="Add bucket">
              +
            </button>
          </form>
        </div>
        <div className="buckets-container">
          {Object.keys(buckets).map(bucketName => (
            <Bucket
              key={bucketName}
              name={bucketName}
              items={buckets[bucketName]}
              isEditing={editingBucket === bucketName}
              editName={bucketEditName}
              onStartEdit={startEditingBucket}
              onEditNameChange={setBucketEditName}
              onRenameBucket={handleRenameBucket}
              onDeleteBucket={handleDeleteBucket}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onItemDragStart={handleBucketDragStart}
              onDeleteItem={handleDeleteFromBucket}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
