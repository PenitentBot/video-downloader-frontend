import React, { useState, useRef } from 'react';
import MetadataPreview from './MetadataPreview';
import PlaylistViewer from './PlaylistViewer';

function DownloadForm({ isPremium }) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('video');
  const [resolution, setResolution] = useState('720p');
  const [audioQuality, setAudioQuality] = useState('128k');
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

        console.log(`[${i + 1}/${videosToDownload.length}] ${video.title}`);
        
        const response = await fetch('http://localhost:3000/api/download-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: video.url,
            format,
            resolution: format === 'audio' ? null : resolution,
            audioQuality: format === 'audio' ? audioQuality : null,
            isPremium
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

      console.log('⬇️ Starting download...');

      const response = await fetch('http://localhost:3000/api/download-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          format,
          resolution: format === 'audio' ? null : resolution,
          audioQuality: format === 'audio' ? audioQuality : null,
          isPremium
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
      link.download = format === 'audio' ? 'audio.mp3' : 'video.mp4';
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
    <div style={styles.wrapper}>
      <div style={styles.downloadCard}>
        <h1 style={styles.cardTitle}>📥 Download Your Video</h1>
        <p style={styles.cardDesc}>Paste YouTube URL and choose your format</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* URL Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>🔗 Video URL</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={handleUrlChange}
              disabled={loading}
              style={styles.input}
            />
          </div>

          {/* Format & Quality Selection */}
          <div style={styles.selectRow}>
            <div style={styles.selectGroup}>
              <label style={styles.label}>📺 Format</label>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                disabled={loading}
                style={styles.select}
              >
                <option value="video">🎬 MP4 Video</option>
                <option value="audio">🎵 MP3 Audio</option>
              </select>
            </div>

            {format === 'audio' && (
              <div style={styles.selectGroup}>
                <label style={styles.label}>🎧 Quality</label>
                <select 
                  value={audioQuality} 
                  onChange={(e) => setAudioQuality(e.target.value)}
                  disabled={loading}
                  style={styles.select}
                >
                  <option value="128k">📻 128k (Free)</option>
                  {isPremium && <option value="max">🎧 Max (Premium)</option>}
                </select>
              </div>
            )}

            {format === 'video' && (
              <div style={styles.selectGroup}>
                <label style={styles.label}>📹 Quality</label>
                <select 
                  value={resolution} 
                  onChange={(e) => setResolution(e.target.value)}
                  disabled={loading}
                  style={styles.select}
                >
                  <option value="480p">📱 480p</option>
                  <option value="720p">🎬 720p</option>
                  {isPremium && <option value="1080p">🎥 1080p</option>}
                  {isPremium && <option value="best">⭐ Best</option>}
                </select>
              </div>
            )}
          </div>

          {/* Quality Badge */}
          <div style={styles.qualityBadge}>
            {format === 'audio' ? (
              <span>🎵 {audioQuality === '128k' ? '128k Bitrate' : 'Max Quality'}</span>
            ) : (
              <span>📺 {resolution.toUpperCase()} {isPremium ? '(Premium)' : ''}</span>
            )}
          </div>

          {/* Download Button */}
          <button 
            type="submit" 
            disabled={loading || metadataLoading}
            style={{
              ...styles.downloadBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            {loading ? '⏳ Downloading...' : isPlaylist ? '📋 Download Playlist' : '⬇️ Download Now'}
          </button>

          {/* Cancel Button */}
          {loading && (
            <button 
              type="button"
              onClick={handleCancel}
              style={styles.cancelBtn}
            >
              ✕ Cancel
            </button>
          )}
        </form>

        {/* Messages */}
        {error && <p style={styles.errorMsg}>{error}</p>}
        {success && <p style={styles.successMsg}>{success}</p>}
      </div>

      {/* Metadata Preview */}
      {!isPlaylist && (
        <MetadataPreview 
          metadata={metadata}
          loading={metadataLoading}
          error={metadataError}
        />
      )}

      {/* Playlist */}
      {isPlaylist && playlist && (
        <PlaylistViewer 
          playlist={playlist}
          onDownloadVideo={handleDownloadPlaylistVideos}
          loading={loading}
        />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    margin: '0 auto',
    maxWidth: '900px',
    padding: '20px'
  },
  downloadCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '50px 30px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
    marginBottom: '40px'
  },
  cardTitle: {
    fontSize: '36px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  cardDesc: {
    fontSize: '16px',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    opacity: 0.95
  },
  input: {
    padding: '15px 20px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#333',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  selectRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  select: {
    padding: '12px 15px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  qualityBadge: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    padding: '12px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },
  downloadBtn: {
    background: 'white',
    color: '#764ba2',
    border: 'none',
    padding: '16px 30px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  },
  cancelBtn: {
    background: 'rgba(255, 77, 77, 0.9)',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  errorMsg: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '2px solid #ef4444',
    color: 'white',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600'
  },
  successMsg: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '2px solid #22c55e',
    color: 'white',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600'
  }
};

export default DownloadForm;
