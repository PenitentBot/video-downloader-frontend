import React, { useState, useEffect } from 'react';
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

  const isValidYouTubeUrl = (url) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const fetchMetadata = async (videoUrl) => {
    if (!isValidYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube URL');
      setMetadata(null);
      return;
    }

    if (isPlaylistUrl(videoUrl)) {
      if (onPlaylistDetected) {
        onPlaylistDetected(videoUrl);
      }
      return;
    }

    setLoading(true);
    setError('');
    setMetadata(null);

    try {
      const response = await fetch(`${API_URL}/api/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      setError('❌ Failed to fetch video info: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when URL changes
  useEffect(() => {
    if (url.trim() && isValidYouTubeUrl(url)) {
      const timer = setTimeout(() => {
        fetchMetadata(url);
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timer);
    } else {
      setMetadata(null);
      setError('');
    }
  }, [url]);

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

      setError('✅ Download started! Check your downloads folder.');
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
          placeholder="Paste YouTube URL here (auto-fetches video info)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading && <div className="loading">⏳ Fetching video info...</div>}
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
              🎥 Video (MP4)
            </label>
            <label>
              <input
                type="radio"
                value="audio"
                checked={format === 'audio'}
                onChange={(e) => setFormat(e.target.value)}
              />
              🎵 Audio (MP3)
            </label>
          </div>

          {format === 'mp4' && (
            <div className="quality-selector">
              <label>Quality:</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="360">360p (Low)</option>
                <option value="480">480p (Medium)</option>
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
            {loading ? '⏳ Preparing Download...' : '⬇️ Download Now'}
          </button>
        </>
      )}
    </div>
  );
}

export default DownloadForm;
