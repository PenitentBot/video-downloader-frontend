import React, { useEffect, useState } from 'react';

function DownloadProgress({ isLoading, progress, error, success, downloadedSize, totalSize, onCancel }) {
  const [displaySize, setDisplaySize] = useState('0 Bytes');
  const [displayTotal, setDisplayTotal] = useState('0 Bytes');

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Update display values whenever props change
  useEffect(() => {
    console.log(`📊 DownloadProgress received: downloaded=${downloadedSize}, total=${totalSize}`);
    setDisplaySize(formatBytes(downloadedSize));
    setDisplayTotal(formatBytes(totalSize));
  }, [downloadedSize, totalSize]);

  return (
    <div className="download-progress">
      {isLoading && (
        <div>
          <div className="spinner"></div>
          
          <p className="loading-text">⏳ Downloading... {progress}%</p>
          
          <div className="size-info">
            <span className="downloaded-size">
              {displaySize} / {displayTotal}
            </span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <button className="cancel-btn" onClick={onCancel}>
            ❌ Cancel Download
          </button>
        </div>
      )}
      
      {error && !isLoading && <p className="error-message">{error}</p>}
      {success && !isLoading && <p className="success-message">{success}</p>}
    </div>
  );
}

export default DownloadProgress;
