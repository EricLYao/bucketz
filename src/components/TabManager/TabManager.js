import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TabManager.css';

const TabManager = ({ 
  tabs, 
  activeTabId, 
  onTabSelect, 
  onAddTab, 
  onRemoveTab, 
  onRenameTab 
}) => {
  const [editingTab, setEditingTab] = useState(null);
  const [editTabName, setEditTabName] = useState('');

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
      <div className="tabs-list">
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
  onRenameTab: PropTypes.func.isRequired
};

export default TabManager;