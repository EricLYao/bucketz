import { useState, useEffect } from 'react';
import BatchInputOverlay from './components/Overlays/BatchInputOverlay';
import { v4 as uuidv4 } from 'uuid';
import NamesList from './components/Names/NamesList';
import Bucket from './components/Bucket/Bucket';
import TabManager from './components/TabManager/TabManager';
import ImportExportOverlay from './components/Overlays/ImportExportOverlay';
import './App.css';

// Predefined set of distinct colors for buckets
export const BUCKET_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#f59e0b', // Yellow/Orange
  '#10b981', // Green
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

function App() {
  // Batch input overlay state
  const [batchOverlayOpen, setBatchOverlayOpen] = useState(false);
  const [batchType, setBatchType] = useState(null); // 'names' or 'buckets'
  const [batchInput, setBatchInput] = useState('');
  // Import/Export overlay state
  const [importExportOverlayOpen, setImportExportOverlayOpen] = useState(false);
  // Default data for a new tab
  const defaultTabData = {
    names: [
      'John Smith',
      'Emma Wilson',
      'Michael Brown',
      'Sarah Davis',
      'James Miller',
    ],
    buckets: {
      'Bucket 1': [],
      'Bucket 2': [],
      'Bucket 3': [],
    },
    bucketColors: {
      'Bucket 1': BUCKET_COLORS[0],
      'Bucket 2': BUCKET_COLORS[1],
      'Bucket 3': BUCKET_COLORS[2],
    },
  };

  // Load saved tabs and activeTabId from localStorage or create a default tab
  const loadSavedTabsAndActiveTab = () => {
    try {
      const savedTabs = JSON.parse(localStorage.getItem('tabs'));
      const savedActiveTabId = localStorage.getItem('activeTabId');
      if (savedTabs && Object.keys(savedTabs).length > 0) {
        // Ensure each tab has its own deep copy of the data
        const restoredTabs = {};
        Object.entries(savedTabs).forEach(([tabId, tabData]) => {
          // Validate and sanitize the tab data
          const validatedBuckets = {};
          Object.entries(tabData.buckets || {}).forEach(([bucketName, items]) => {
            // Ensure bucket items are arrays and contain only strings
            validatedBuckets[bucketName] = Array.isArray(items) ? 
              items.filter(item => typeof item === 'string') : [];
          });
          // Validate colors
          const validatedColors = {};
          Object.entries(tabData.bucketColors || {}).forEach(([bucketName, color]) => {
            if (typeof color === 'string' && /^#[0-9A-F]{6}$/i.test(color)) {
              validatedColors[bucketName] = color;
            } else {
              // Assign a default color if invalid
              const index = Object.keys(validatedColors).length % BUCKET_COLORS.length;
              validatedColors[bucketName] = BUCKET_COLORS[index];
            }
          });
          // Ensure all buckets have corresponding colors
          Object.keys(validatedBuckets).forEach(bucketName => {
            if (!validatedColors[bucketName]) {
              const index = Object.keys(validatedColors).length % BUCKET_COLORS.length;
              validatedColors[bucketName] = BUCKET_COLORS[index];
            }
          });
          restoredTabs[tabId] = {
            label: typeof tabData.label === 'string' ? tabData.label : `Tab ${Object.keys(restoredTabs).length + 1}`,
            names: Array.isArray(tabData.names) ? 
              tabData.names.filter(name => typeof name === 'string') : 
              [...defaultTabData.names],
            buckets: validatedBuckets,
            bucketColors: validatedColors
          };
        });
        if (Object.keys(restoredTabs).length > 0) {
          // If savedActiveTabId is missing or deleted, fallback to first tab
          const firstTabId = Object.keys(restoredTabs)[0];
          const activeTabId = (savedActiveTabId && restoredTabs[savedActiveTabId]) ? savedActiveTabId : firstTabId;
          return { tabs: restoredTabs, activeTabId };
        }
      }
    } catch (error) {
      console.error('Error loading saved tabs:', error);
    }
    // Create default tab if no saved tabs exist or on error
    const defaultTabId = uuidv4();
    const defaultTabs = {
      [defaultTabId]: {
        label: 'Tab 1',
        names: [...defaultTabData.names],
        buckets: JSON.parse(JSON.stringify(defaultTabData.buckets)),
        bucketColors: { ...defaultTabData.bucketColors }
      }
    };
    return { tabs: defaultTabs, activeTabId: defaultTabId };
  };


  // --- State Management ---
  // Tabs and active tab
  const { tabs: initialTabs, activeTabId: initialTabId } = loadSavedTabsAndActiveTab();
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const [newName, setNewName] = useState('');

  // Persist tabs to localStorage on change
  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);

  // Persist activeTabId to localStorage on change
  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('activeTabId', activeTabId);
    }
  }, [activeTabId]);

  // --- Tab Management Functions ---
  // Add a new tab with default data
  const handleAddTab = () => {
    const newTabId = uuidv4();
    // Find the highest tab number and increment by 1
    const existingNumbers = Object.values(tabs).map(tab => {
      const match = tab.label.match(/Tab (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNumber = Math.max(0, ...existingNumbers) + 1;
    const newTabData = {
      label: `Tab ${nextNumber}`,
      names: [...defaultTabData.names],
      buckets: JSON.parse(JSON.stringify(defaultTabData.buckets)),
      bucketColors: { ...defaultTabData.bucketColors },
    };
    setTabs(prev => ({
      ...prev,
      [newTabId]: newTabData,
    }));
    setActiveTabId(newTabId);
  };

  // Remove a tab (if more than one exists)
  const handleRemoveTab = (tabId) => {
    if (Object.keys(tabs).length <= 1) return;
    setTabs(prev => {
      const newTabs = { ...prev };
      delete newTabs[tabId];
      return newTabs;
    });
    if (activeTabId === tabId) {
      setActiveTabId(Object.keys(tabs).find(id => id !== tabId));
    }
  };

  // Rename a tab
  const handleRenameTab = (tabId, newLabel) => {
    setTabs(prev => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        label: newLabel,
      },
    }));
  };

  // --- Names and Buckets State ---
  // Get active tab data
  const activeTab = tabs[activeTabId] || defaultTabData;
  const names = activeTab?.names || [];
  // Set names for the active tab
  const setNames = (newNames) => {
    setTabs(prev => ({
      ...prev,
      [activeTabId]: {
        ...prev[activeTabId],
        names: typeof newNames === 'function' ? newNames(prev[activeTabId].names) : newNames,
      },
    }));
  };

  const handleRenameName = (oldName, newName) => {
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      // Update name in names list
      updatedTab.names = updatedTab.names.map(n => n === oldName ? newName : n);
      // Update name in all buckets
      const newBuckets = {};
      Object.entries(updatedTab.buckets).forEach(([bucketName, items]) => {
        newBuckets[bucketName] = items.map(item => item === oldName ? newName : item);
      });
      updatedTab.buckets = newBuckets;
      
      return {
        ...prev,
        [activeTabId]: updatedTab
      };
    });
  };


  // --- Local UI State for Buckets ---
  const [buckets, setBuckets] = useState(activeTab?.buckets || defaultTabData.buckets);
  const [bucketColors, setBucketColors] = useState(activeTab?.bucketColors || defaultTabData.bucketColors);
  const [newBucketName, setNewBucketName] = useState('');
  const [editingBucket, setEditingBucket] = useState(null);
  const [bucketEditName, setBucketEditName] = useState('');

  // Start editing a bucket name
  const startEditingBucket = (bucketName) => {
    setEditingBucket(bucketName);
    setBucketEditName(bucketName);
  };

  // Add a new bucket to the active tab
  const handleAddBucket = (e) => {
    e.preventDefault();
    const name = newBucketName.trim();
    if (!name || name in buckets) return;
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      updatedTab.buckets = {
        ...updatedTab.buckets,
        [name]: [],
      };
      updatedTab.bucketColors = {
        ...updatedTab.bucketColors,
        [name]: BUCKET_COLORS[Object.keys(updatedTab.buckets).length % BUCKET_COLORS.length],
      };
      return {
        ...prev,
        [activeTabId]: updatedTab,
      };
    });
    setNewBucketName('');
  };

  // Rename a bucket in the active tab
  const handleRenameBucket = (oldName) => {
    const newName = bucketEditName.trim();
    if (newName && newName !== oldName && !(newName in buckets)) {
      setTabs(prev => {
        const updatedTab = { ...prev[activeTabId] };
        const { [oldName]: items, ...restBuckets } = updatedTab.buckets;
        const { [oldName]: color, ...restColors } = updatedTab.bucketColors;
        updatedTab.buckets = {
          ...restBuckets,
          [newName]: items,
        };
        updatedTab.bucketColors = {
          ...restColors,
          [newName]: color,
        };
        return {
          ...prev,
          [activeTabId]: updatedTab,
        };
      });
    }
    setEditingBucket(null);
    setBucketEditName('');
  };

  // Delete a bucket from the active tab
  const handleDeleteBucket = (bucketName) => {
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      const { [bucketName]: _, ...restBuckets } = updatedTab.buckets;
      const { [bucketName]: __, ...restColors } = updatedTab.bucketColors;
      updatedTab.buckets = restBuckets;
      updatedTab.bucketColors = restColors;
      return {
        ...prev,
        [activeTabId]: updatedTab,
      };
    });
  };

  // Remove a name from a specific bucket
  const handleDeleteFromBucket = (bucketName, index) => {
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      const bucket = updatedTab.buckets[bucketName];
      if (!bucket) return prev;
      updatedTab.buckets = {
        ...updatedTab.buckets,
        [bucketName]: bucket.filter((_, i) => i !== index),
      };
      return {
        ...prev,
        [activeTabId]: updatedTab,
      };
    });
  };

  // Set the color for a specific bucket
  const handleSetBucketColor = (bucketName, color) => {
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      updatedTab.bucketColors = {
        ...updatedTab.bucketColors,
        [bucketName]: color,
      };
      return {
        ...prev,
        [activeTabId]: updatedTab,
      };
    });
  };

  // Update local UI state when switching tabs
  useEffect(() => {
    if (!activeTabId || !activeTab) return;
    
    // Update the local UI state with the active tab's data
    setBuckets(activeTab.buckets);
    setBucketColors(activeTab.bucketColors);
    setNewBucketName('');
    setEditingBucket(null);
    setBucketEditName('');
  }, [activeTabId, activeTab, setBuckets, setBucketColors, setNewBucketName, setEditingBucket, setBucketEditName]);

  // Initialize drag and drop handlers with tab-aware state updates
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleNameDragStart = (e, name, index) => {
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.setData('source-type', 'names-list');
    e.dataTransfer.setData('source-index', index.toString());
  };

  const handleBucketDragStart = (e, bucketName, index) => {
    const item = buckets[bucketName][index];
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.setData('source-type', 'bucket');
    e.dataTransfer.setData('source-bucket', bucketName);
    e.dataTransfer.setData('source-index', index.toString());
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offset-y', offsetY.toString());
  };

  const handleDrop = (e, targetBucket) => {
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

    let dropIndex = -1;
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

    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      if (sourceType === 'bucket') {
        const sourceBucket = e.dataTransfer.getData('source-bucket');
        if (sourceBucket !== targetBucket && updatedTab.buckets[targetBucket].includes(name)) {
          return prev;
        }
        // Remove from source bucket
        let items = [...updatedTab.buckets[sourceBucket]];
        const [movedItem] = items.splice(sourceIndex, 1);
        updatedTab.buckets = {
          ...updatedTab.buckets,
          [sourceBucket]: items
        };
        if (sourceBucket === targetBucket) {
          // Reordering within the same bucket
          let targetItems = [...items];
          // If dropIndex is after removal point, decrement
          let insertIndex = dropIndex;
          if (insertIndex === -1) insertIndex = targetItems.length;
          if (insertIndex > sourceIndex) insertIndex--;
          targetItems.splice(insertIndex, 0, movedItem);
          updatedTab.buckets[targetBucket] = targetItems;
        } else {
          // Moving to a different bucket
          let targetItems = [...updatedTab.buckets[targetBucket]];
          let insertIndex = dropIndex === -1 ? targetItems.length : dropIndex;
          targetItems.splice(insertIndex, 0, name);
          updatedTab.buckets[targetBucket] = targetItems;
        }
      } else {
        // From names list
        if (updatedTab.buckets[targetBucket].includes(name)) {
          return prev;
        }
        let targetItems = [...updatedTab.buckets[targetBucket]];
        let insertIndex = dropIndex === -1 ? targetItems.length : dropIndex;
        targetItems.splice(insertIndex, 0, name);
        updatedTab.buckets[targetBucket] = targetItems;
      }
      return {
        ...prev,
        [activeTabId]: updatedTab
      };
    });
  };

  const handleNamesListDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const name = e.dataTransfer.getData('text/plain');
    const sourceType = e.dataTransfer.getData('source-type');
    const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));

    const nameItems = e.currentTarget.querySelectorAll('.name-item');
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    let dropIndex = names.length;
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

    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      
      if (sourceType === 'bucket') {
        const sourceBucket = e.dataTransfer.getData('source-bucket');
        if (!updatedTab.names.includes(name)) {
          // Remove from bucket and add to names list
          updatedTab.buckets = {
            ...updatedTab.buckets,
            [sourceBucket]: updatedTab.buckets[sourceBucket].filter((_, i) => i !== sourceIndex)
          };
          const newNames = [...updatedTab.names];
          newNames.splice(dropIndex, 0, name);
          updatedTab.names = newNames;
        } else {
          // If name already exists, just remove from bucket
          updatedTab.buckets = {
            ...updatedTab.buckets,
            [sourceBucket]: updatedTab.buckets[sourceBucket].filter((_, i) => i !== sourceIndex)
          };
        }
      } else if (sourceType === 'names-list') {
        // Reordering within names list
        const newNames = [...updatedTab.names];
        const [movedName] = newNames.splice(sourceIndex, 1);
        newNames.splice(dropIndex > sourceIndex ? dropIndex - 1 : dropIndex, 0, movedName);
        updatedTab.names = newNames;
      }
      
      return {
        ...prev,
        [activeTabId]: updatedTab
      };
    });

    // Update local UI state
    if (sourceType === 'bucket') {
      const sourceBucket = e.dataTransfer.getData('source-bucket');
      setBuckets(prev => {
        const newBuckets = { ...prev };
        newBuckets[sourceBucket] = prev[sourceBucket].filter((_, i) => i !== sourceIndex);
        return newBuckets;
      });
    }
  };


  // Names list handlers
  const handleAddName = (e) => {
    e.preventDefault();
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames(prev => [...prev, newName.trim()]);
      setNewName('');
    }
  };

  // Batch add logic
  const closeBatchOverlay = () => {
    setBatchOverlayOpen(false);
    setBatchType(null);
    setBatchInput('');
  };

  const handleBatchConfirm = () => {
    const lines = batchInput
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    if (batchType === 'names') {
      // Only add names that are not already present
      setNames(prev => {
        const existing = new Set(prev);
        return [...prev, ...lines.filter(name => !existing.has(name))];
      });
    } else if (batchType === 'buckets') {
      setTabs(prev => {
        const updatedTab = { ...prev[activeTabId] };
        const existingBuckets = new Set(Object.keys(updatedTab.buckets));
        let colorIndex = Object.keys(updatedTab.bucketColors).length;
        lines.forEach(bucketName => {
          if (!existingBuckets.has(bucketName)) {
            updatedTab.buckets[bucketName] = [];
            updatedTab.bucketColors[bucketName] = BUCKET_COLORS[colorIndex % BUCKET_COLORS.length];
            colorIndex++;
          }
        });
        return {
          ...prev,
          [activeTabId]: updatedTab
        };
      });
    }
    closeBatchOverlay();
  };

  const handleRemoveName = (nameToRemove) => {
    setTabs(prev => {
      const updatedTab = { ...prev[activeTabId] };
      // Remove from names list
      updatedTab.names = updatedTab.names.filter(name => name !== nameToRemove);
      // Remove from all buckets
      Object.keys(updatedTab.buckets).forEach(bucketName => {
        updatedTab.buckets[bucketName] = updatedTab.buckets[bucketName].filter(name => name !== nameToRemove);
      });
      return {
        ...prev,
        [activeTabId]: updatedTab
      };
    });

    // Update local UI state
    setBuckets(prev => {
      const newBuckets = {};
      Object.keys(prev).forEach(bucketName => {
        newBuckets[bucketName] = prev[bucketName].filter(name => name !== nameToRemove);
      });
      return newBuckets;
    });
  };

  // Import/Export handlers
  const handleExport = (scope) => {
    let exportData, filename;
    if (scope === 'current') {
      exportData = JSON.stringify(tabs[activeTabId], null, 2);
      filename = `${tabs[activeTabId].label.replace(/\s+/g, '_')}_data.txt`;
    } else {
      exportData = JSON.stringify(tabs, null, 2);
      filename = `all_tabs_data.txt`;
    }
    const blob = new Blob([exportData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && typeof imported === 'object' && !Array.isArray(imported) && Object.values(imported)[0]?.names) {
          // Importing multiple tabs: merge, avoid duplicate labels
          setTabs(prev => {
            const newTabs = { ...prev };
            Object.entries(imported).forEach(([tabId, tabData]) => {
              // Avoid duplicate tab labels
              const labelExists = Object.values(newTabs).some(tab => tab.label === tabData.label);
              if (!labelExists) {
                newTabs[tabId] = tabData;
              }
            });
            return newTabs;
          });
        } else if (imported && imported.names) {
          // Importing a single tab: avoid duplicate label
          setTabs(prev => {
            const labelExists = Object.values(prev).some(tab => tab.label === imported.label);
            if (labelExists) return prev;
            const newTabId = uuidv4();
            return { ...prev, [newTabId]: imported };
          });
        }
      } catch (err) {
        alert('Invalid file format.');
      }
    };
    reader.readAsText(file);
  };


  // State synchronization is handled by the effect above

  return (
    <div className="app">
      <TabManager
        tabs={Object.entries(tabs).map(([id, tab]) => ({ id, label: tab.label }))}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onAddTab={handleAddTab}
        onRemoveTab={handleRemoveTab}
        onRenameTab={handleRenameTab}
        onBatchAddNames={() => {
          setBatchType('names');
          setBatchOverlayOpen(true);
        }}
        onBatchAddBuckets={() => {
          setBatchType('buckets');
          setBatchOverlayOpen(true);
        }}
        onExport={handleExport}
        onImport={handleImport}
        onOpenImportExport={() => setImportExportOverlayOpen(true)}
      />
      <BatchInputOverlay
        open={batchOverlayOpen}
        title={batchType === 'names' ? 'Batch Add Names' : batchType === 'buckets' ? 'Batch Add Buckets' : ''}
        placeholder={batchType === 'names' ? 'Enter one name per line...' : 'Enter one bucket name per line...'}
        value={batchInput}
        onChange={setBatchInput}
        onConfirm={handleBatchConfirm}
        onCancel={closeBatchOverlay}
      />
      <ImportExportOverlay
        open={importExportOverlayOpen}
        onExportCurrent={() => { handleExport('current'); setImportExportOverlayOpen(false); }}
        onExportAll={() => { handleExport('all'); setImportExportOverlayOpen(false); }}
        onImport={e => { handleImport(e); setImportExportOverlayOpen(false); }}
        onCancel={() => setImportExportOverlayOpen(false)}
      />
      {activeTab && (
        <div className="tab-content">
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
            bucketColors={bucketColors}
            onRenameName={handleRenameName}
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
                  color={bucketColors[bucketName]}
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
                  onColorChange={handleSetBucketColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        accept=".txt"
        onChange={handleImport}
        style={{ display: 'none' }}
        id="file-input"
      />
    </div>
  );
}

export default App;
