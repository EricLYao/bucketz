import React from 'react';
import PropTypes from 'prop-types';
import './ImportExportOverlay.css';

const ImportExportOverlay = ({
  open,
  onExportCurrent,
  onExportAll,
  onImport,
  onCancel
}) => {
  if (!open) return null;
  return (
    <div className="batch-overlay">
      <div className="batch-modal">
        <h2>Import / Export</h2>
        <div className="importexport-description">
          <ul>
            <li><b>Export Current Tab</b>: Download a .txt file containing only the data for the tab you are viewing.</li>
            <li><b>Export All Tabs</b>: Download a .txt file containing all your tabs and their data.</li>
            <li><b>Import</b>: Upload a .txt file to add new tabs. Tabs with duplicate names will not be added.</li>
          </ul>
        </div>
        <div className="importexport-actions">
          <button className="importexport-btn" onClick={onExportCurrent}>
            <span role="img" aria-label="Export Tab">⬇️</span> Export Current Tab
          </button>
          <button className="importexport-btn" onClick={onExportAll}>
            <span role="img" aria-label="Export All">📦</span> Export All Tabs
          </button>
          <label className="importexport-btn" style={{cursor:'pointer',margin:0}}>
            <span role="img" aria-label="Import">⬆️</span> Import
            <input type="file" accept=".txt,.json" style={{display:'none'}} onChange={onImport} />
          </label>
        </div>
        <div className="batch-actions">
          <button className="batch-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

ImportExportOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  onExportCurrent: PropTypes.func.isRequired,
  onExportAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ImportExportOverlay;
