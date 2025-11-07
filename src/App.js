import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState('480');
  const [format, setFormat] = useState('video');
  const [downloading, setDownloading] = useState(false);

  const API_URL = 'https://your-render-backend.onrender.com';

  const handleGetInfo = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
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
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch video info. Make sure URL is valid.');
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setDownloading(true);
    try {
      const endpoint = '/api/download-proxy';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          format,
          quality 
        })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      if (format === 'audio') {
        a.download = 'audio.mp3';
      } else {
        a.download = `video_${quality}p.mp4`;
      }
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      alert('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
    setDownloading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎥 Video Downloader</h1>
        <p>Download videos & music from 1000+ websites</p>
      </header>

      <div className="container">
        {/* URL Input Section */}
        <div className="form-container">
          <div className="form-group">
            <input
              type="text"
              placeholder="Paste video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetInfo()}
            />
            <button 
              onClick={handleGetInfo} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Info'}
            </button>
          </div>
        </div>

        {/* Video Info Display */}
        {metadata && (
          <>
            <div className="metadata-container">
              {metadata.thumbnail && (
                <img src={metadata.thumbnail} alt="Video thumbnail" />
              )}
              <div className="metadata-info">
                <strong>Title:</strong>
                <p>{metadata.title}</p>
              </div>
              <div className="metadata-info">
                <strong>Channel:</strong>
                <p>{metadata.channel}</p>
              </div>
              <div className="metadata-info">
                <strong>Duration:</strong>
                <p>{Math.floor(metadata.duration / 60)} minutes</p>
              </div>
              <div className="metadata-info">
                <strong>Views:</strong>
                <p>{(metadata.views || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Download Options */}
            <div className="options-section">
              <h3>📥 Download Options</h3>
              
              {/* Format Selection */}
              <div className="format-select">
                <label>Choose Format:</label>
                <div className="format-buttons">
                  <button 
                    className={format === 'video' ? 'active' : ''} 
                    onClick={() => setFormat('video')}
                  >
                    🎬 Video
                  </button>
                  <button 
                    className={format === 'audio' ? 'active' : ''} 
                    onClick={() => setFormat('audio')}
                  >
                    🎵 Audio (MP3)
                  </button>
                </div>
              </div>

              {/* Quality Selection (Only for video) */}
              {format === 'video' && (
                <div className="quality-select">
                  <label>Video Quality:</label>
                  <div className="quality-buttons">
                    <button 
                      className={quality === '480' ? 'active' : ''} 
                      onClick={() => setQuality('480')}
                    >
                      480p (Fast)
                    </button>
                    <button 
                      className={quality === '720' ? 'active' : ''} 
                      onClick={() => setQuality('720')}
                    >
                      720p (Good)
                    </button>
                    <button 
                      className={quality === '1080' ? 'active' : ''} 
                      onClick={() => setQuality('1080')}
                    >
                      1080p (Best)
                    </button>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <button 
                className="download-btn"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? '⏳ Downloading...' : '⬇️ Download Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
