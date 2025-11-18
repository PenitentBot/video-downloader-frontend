import React, { useState } from 'react';
import './DownloadForm.css';
import MetadataPreview from './MetadataPreview';

const API_URL = 'https://ytvideomp3downloader.netlify.app';

function DownloadForm({ onPlaylistDetected }) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);

  const isPlaylistUrl = (url) => {
    return url.includes('list=') || url.includes('playlist');
  };

  const fetchMetadata = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (isPlaylistUrl(url)) {
      onPlaylistDetected(url);
      return;
    }

    setLoading(true);
    setError('');
    setMetadata(null);

    try {
      const response = await fetch(`${API_URL}/api/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      setError('❌ Failed to fetch video info');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/download-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format, quality })
      });

      if (!response.ok) {
        throw new Error('Failed to get download link');
      }

      const data = await response.json();
      
      // Download using direct link
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = `${data.title}.${format === 'audio' ? 'mp3' : 'mp4'}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      setError('❌ Download failed: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-form">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchMetadata()}
        />
        <button onClick={fetchMetadata} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Info'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {metadata && (
        <>
          <MetadataPreview metadata={metadata} />

          <div className="format-selector">
            <label>
              <input
                type="radio"
                value="mp4"
                checked={format === 'mp4'}
                onChange={(e) => setFormat(e.target.value)}
              />
              Video (MP4)
            </label>
            <label>
              <input
                type="radio"
                value="audio"
                checked={format === 'audio'}
                onChange={(e) => setFormat(e.target.value)}
              />
              Audio (MP3)
            </label>
          </div>

          {format === 'mp4' && (
            <div className="quality-selector">
              <label>Quality:</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="360">360p</option>
                <option value="480">480p</option>
                <option value="720">720p (HD)</option>
                <option value="1080">1080p (Full HD)</option>
              </select>
            </div>
          )}

          <button 
            className="download-btn" 
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? 'Downloading...' : '⬇️ Download'}
          </button>
        </>
      )}
    </div>
  );
}

export default DownloadForm;
