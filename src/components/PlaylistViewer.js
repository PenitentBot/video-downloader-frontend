import React, { useState } from 'react';

function PlaylistViewer({ playlist, onDownloadVideo, loading }) {
  const [selectedVideos, setSelectedVideos] = useState([]);

  const toggleVideo = (id) => {
    setSelectedVideos(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedVideos.length === playlist.videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(playlist.videos.map(v => v.id));
    }
  };

  const downloadSelected = () => {
    const videosToDownload = playlist.videos.filter(v =>
      selectedVideos.includes(v.id)
    );
    onDownloadVideo(videosToDownload);
  };

  if (!playlist) return null;

  return (
    <div className="playlist-viewer">
      <div className="playlist-header">
        <h3>📋 {playlist.playlistTitle}</h3>
        <p>{playlist.totalVideos} videos • {selectedVideos.length} selected</p>
      </div>

      <div className="playlist-controls">
        <button 
          className="select-all-btn"
          onClick={toggleAll}
          disabled={loading}
        >
          {selectedVideos.length === playlist.videos.length ? '✓ Deselect All' : '☐ Select All'}
        </button>
        
        <button
          className="download-selected-btn"
          onClick={downloadSelected}
          disabled={selectedVideos.length === 0 || loading}
        >
          ⬇️ Download Selected ({selectedVideos.length})
        </button>
      </div>

      <div className="videos-list">
        {playlist.videos.map((video) => (
          <div key={video.id} className="video-item">
            <input
              type="checkbox"
              checked={selectedVideos.includes(video.id)}
              onChange={() => toggleVideo(video.id)}
              disabled={loading}
            />
            <div className="video-info">
              <span className="video-number">{video.id}.</span>
              <span className="video-title">{video.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistViewer;
