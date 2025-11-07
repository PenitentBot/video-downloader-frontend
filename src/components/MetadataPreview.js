import React from 'react';

function MetadataPreview({ metadata, loading, error }) {
  if (!metadata && !loading && !error) return null;

  if (loading) {
    return (
      <div className="metadata-preview loading">
        <div className="spinner-small"></div>
        <p>Loading video info...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metadata-preview error">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!metadata) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr.slice(0, 4) + '-' + dateStr.slice(4, 6) + '-' + dateStr.slice(6, 8)).toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (!views) return 'No data';
    if (views > 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views > 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  return (
    <div className="metadata-preview">
      <div className="metadata-container">
        {metadata.thumbnail && (
          <div className="thumbnail-wrapper">
            <img src={metadata.thumbnail} alt="Video thumbnail" className="thumbnail" />
          </div>
        )}
        
        <div className="metadata-info">
          <h3 className="video-title">{metadata.title}</h3>
          
          <div className="metadata-details">
            <span className="detail-item">
              <strong>📺 Duration:</strong> {formatDuration(metadata.duration)}
            </span>
            <span className="detail-item">
              <strong>👤 Uploader:</strong> {metadata.uploader || 'Unknown'}
            </span>
            <span className="detail-item">
              <strong>👁️ Views:</strong> {formatViews(metadata.views)}
            </span>
            <span className="detail-item">
              <strong>📅 Uploaded:</strong> {formatDate(metadata.uploadDate)}
            </span>
          </div>

          <p className="video-description">{metadata.description}</p>
        </div>
      </div>
    </div>
  );
}

export default MetadataPreview;
