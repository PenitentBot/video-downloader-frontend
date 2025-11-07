import React, { useState, useRef } from 'react';
import MetadataPreview from './MetadataPreview';
import PlaylistViewer from './PlaylistViewer';

function DownloadForm() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('video');
  const [quality, setQuality] = useState('480');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState('');

  const [playlist, setPlaylist] = useState(null);
  const [isPlaylist, setIsPlaylist] = useState(false);

  const abortControllerRef = useRef(null);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setError('⚠️ Download cancelled');
    setTimeout(() => setError(''), 3000);
  };

  const handleUrlChange = async (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (!newUrl.trim()) {
      setMetadata(null);
      setPlaylist(null);
      setMetadataError('');
      return;
    }

    setMetadataLoading(true);
    setMetadataError('');
    setPlaylist(null);
    setIsPlaylist(false);

    const isPlaylistUrl = newUrl.includes('playlist?list=') || 
                          newUrl.includes('/playlist/') ||
                          newUrl.includes('&list=');

    try {
      if (isPlaylistUrl) {
        const response = await fetch('http://localhost:3000/api/playlist-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newUrl })
        });

        if (response.ok) {
          const data = await response.json();
          setPlaylist(data);
          setIsPlaylist(true);
        } else {
          setMetadataError('Failed to fetch playlist');
        }
      } else {
        const response = await fetch('http://localhost:3000/api/metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newUrl })
        });

        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
        } else {
          setMetadataError('Failed to fetch video info');
        }
      }
    } catch (err) {
      setMetadataError('Invalid URL');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleDownloadPlaylistVideos = async (videosToDownload) => {
    setError('');
    setSuccess('');
    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < videosToDownload.length; i++) {
        const video = videosToDownload[i];
        
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Download cancelled');
        }

        const response = await fetch('http://localhost:3000/api/download-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: video.url,
            format,
            quality
          }),
          signal: abortControllerRef.current.signal
        });

        if (response.ok) {
          const blob = await response.blob();
          const urlBlob = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = urlBlob;
          link.download = format === 'audio' ? `${video.title}.mp3` : `${video.title}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(urlBlob);

          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      setSuccess(`✅ All ${videosToDownload.length} downloads completed!`);
      setTimeout(() => {
        setSuccess('');
        setLoading(false);
      }, 3000);

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('⚠️ Download cancelled');
      } else {
        setError(`❌ Error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isPlaylist && playlist) {
      handleDownloadPlaylistVideos(playlist.videos);
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      if (!url.trim()) {
        throw new Error('Please paste a URL');
      }

      const response = await fetch('http://localhost:3000/api/download-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          format,
          quality
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = format === 'audio' ? 'audio.mp3' : `video_${quality}p.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

      setUrl('');
      setMetadata(null);
      setSuccess('✅ Download completed!');

      setTimeout(() => {
        setSuccess('');
        setLoading(false);
      }, 2000);

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('⚠️ Download cancelled');
      } else {
        console.error('Error:', err);
        setError(`❌ Error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.downloadCard}>
          <div style={styles.cardHeader}>
            <h1 style={styles.cardTitle}>📥 Start Downloading</h1>
            <p style={styles.cardSubtitle}>Paste your YouTube URL below and choose your format</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* URL Input */}
            <div style={styles.inputContainer}>
              <label style={styles.inputLabel}>
                <span style={styles.labelIcon}>🔗</span>
                Paste Video URL
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={url}
                onChange={handleUrlChange}
                disabled={loading}
                style={{...styles.urlInput, opacity: loading ? 0.6 : 1}}
              />
            </div>

            {/* Format Selection */}
            <div style={styles.optionsGrid}>
              {/* Format */}
              <div style={styles.optionBox}>
                <label style={styles.optionLabel}>
                  <span style={styles.optionIcon}>🎬</span>
                  Format
                </label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={loading}
                  style={styles.select}
                >
                  <option value="video">MP4 Video</option>
                  <option value="audio">MP3 Audio</option>
                </select>
              </div>

              {/* Quality */}
              <div style={styles.optionBox}>
                <label style={styles.optionLabel}>
                  <span style={styles.optionIcon}>📊</span>
                  Quality
                </label>
                {format === 'audio' ? (
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value)}
                    disabled={loading}
                    style={styles.select}
                  >
                    <option value="128">128k (Standard)</option>
                    <option value="192">192k (Good)</option>
                    <option value="256">256k (High)</option>
                    <option value="320">320k (Maximum)</option>
                  </select>
                ) : (
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value)}
                    disabled={loading}
                    style={styles.select}
                  >
                    <option value="480">480p (Fast)</option>
                    <option value="720">720p (Good)</option>
                    <option value="1080">1080p (Best)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Quality Info */}
            <div style={styles.qualityInfo}>
              {format === 'audio' ? (
                <span>🎵 Audio: {quality}k Bitrate</span>
              ) : (
                <span>📺 Video: {quality}p</span>
              )}
            </div>

            {/* Download Button */}
            <button 
              type="submit" 
              disabled={loading || metadataLoading}
              style={{
                ...styles.downloadBtn,
                opacity: loading || metadataLoading ? 0.7 : 1,
                cursor: (loading || metadataLoading) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              {loading ? (
                <>⏳ Downloading...</>
              ) : isPlaylist ? (
                <>📋 Download Playlist</>
              ) : (
                <>⬇️ Download Now</>
              )}
            </button>

            {/* Cancel Button */}
            {loading && (
              <button 
                type="button"
                onClick={handleCancel}
                style={styles.cancelBtn}
              >
                ✕ Cancel Download
              </button>
            )}
          </form>

          {/* Error & Success Messages */}
          {error && <div style={styles.errorMsg}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}
        </div>

        {/* Metadata & Playlist */}
        {!isPlaylist && (
          <MetadataPreview 
            metadata={metadata}
            loading={metadataLoading}
            error={metadataError}
          />
        )}

        {isPlaylist && playlist && (
          <PlaylistViewer 
            playlist={playlist}
            onDownloadVideo={handleDownloadPlaylistVideos}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  downloadCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
    marginBottom: '40px'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  cardTitle: {
    fontSize: '44px',
    margin: '0 0 12px 0',
    fontWeight: 'bold',
    letterSpacing: '-0.5px'
  },
  cardSubtitle: {
    fontSize: '18px',
    opacity: 0.95,
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  inputLabel: {
    fontSize: '15px',
    fontWeight: '600',
    opacity: 0.95,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  labelIcon: {
    fontSize: '18px'
  },
  urlInput: {
    padding: '16px 20px',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.98)',
    color: '#333',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    fontFamily: 'inherit'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  optionBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  optionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    opacity: 0.95,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  optionIcon: {
    fontSize: '18px'
  },
  select: {
    padding: '13px 16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.98)',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontFamily: 'inherit'
  },
  qualityInfo: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    padding: '14px 18px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)'
  },
  downloadBtn: {
    background: 'white',
    color: '#764ba2',
    border: 'none',
    padding: '18px 40px',
    borderRadius: '14px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    marginTop: '10px'
  },
  cancelBtn: {
    background: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  errorMsg: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '2px solid rgba(239, 68, 68, 0.8)',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: '15px'
  },
  successMsg: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '2px solid rgba(34, 197, 94, 0.8)',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: '15px'
  }
};

export default DownloadForm;
