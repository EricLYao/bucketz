import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TabManager.css';

const TabManager = ({ 
  tabs, 
  activeTabId, 
  onTabSelect, 
  onAddTab, 
  onRemoveTab, 
  onRenameTab, 
  onBatchAddNames,
  onBatchAddBuckets,
  onExport,
  onImport,
  onOpenImportExport
}) => {
  const [editingTab, setEditingTab] = useState(null);
  const [editTabName, setEditTabName] = useState('');

  // Ref for horizontal scroll
  const tabsListRef = React.useRef(null);

  // Optional: Scroll active tab into view on change
  React.useEffect(() => {
    if (!tabsListRef.current) return;
    const activeTab = tabsListRef.current.querySelector('.tab.active');
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTabId, tabs.length]);

  const handleDoubleClick = (tabId) => {
    setEditingTab(tabId);
    setEditTabName(tabs.find(tab => tab.id === tabId).label);
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (editTabName.trim() && editingTab) {
      onRenameTab(editingTab, editTabName.trim());
      setEditingTab(null);
    }
  };

  return (
    <div className="tab-manager">
      <div className="tab-bar-row">
        <div className="tabs-list" style={{ alignItems: 'center' }} ref={tabsListRef}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
            >
              {editingTab === tab.id ? (
                <form onSubmit={handleRename} className="tab-rename-form">
                  <input
                    type="text"
                    value={editTabName}
                    onChange={(e) => {
                      setEditTabName(e.target.value);
                      // Adjust input width to content
                      e.target.style.width = `${e.target.value.length + 2}ch`;
                    }}
                    onBlur={handleRename}
                    autoFocus
                    className="tab-rename-input"
                    style={{ width: `${editTabName.length + 2}ch` }}
                  />
                </form>
              ) : (
                <>
                  <button
                    className="tab-button"
                    onClick={() => onTabSelect(tab.id)}
                    onDoubleClick={() => handleDoubleClick(tab.id)}
                  >
                    {tab.label}
                  </button>
                  {tabs.length > 1 && (
                    <button
                      className="tab-close-button"
                      onClick={() => onRemoveTab(tab.id)}
                      title="Close tab"
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
          <button 
            className="add-tab-button"
            onClick={onAddTab}
            title="Add new tab"
          >
            +
          </button>
        </div>
        <div className="tab-batch-buttons">
          <button
            type="button"
            className="tab-batch-btn tab-batch-names"
            title="Batch add names"
            onClick={onBatchAddNames}
          >
            <span className="tab-batch-icon">👤</span>
            <span className="tab-batch-label">Batch Add Names</span>
          </button>
          <button
            type="button"
            className="tab-batch-btn tab-batch-buckets"
            title="Batch add buckets"
            onClick={onBatchAddBuckets}
          >
            <span className="tab-batch-icon">🗂️</span>
            <span className="tab-batch-label">Batch Add Buckets</span>
          </button>
          <button
            type="button"
            className="tab-batch-btn tab-batch-importexport"
            title="Import/Export"
            onClick={onOpenImportExport}
          >
            <span className="tab-batch-icon">🔄</span>
            <span className="tab-batch-label">Import / Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

TabManager.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  activeTabId: PropTypes.string.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  onAddTab: PropTypes.func.isRequired,
  onRemoveTab: PropTypes.func.isRequired,
  onRenameTab: PropTypes.func.isRequired,
  onBatchAddNames: PropTypes.func.isRequired,
  onBatchAddBuckets: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onOpenImportExport: PropTypes.func.isRequired
};

export default TabManager;