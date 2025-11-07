import React, { useEffect, useState } from 'react';

function DownloadProgressModal({ isOpen, progress, downloadedSize, totalSize, onCancel }) {
  const [displaySize, setDisplaySize] = useState('0 Bytes');
  const [displayTotal, setDisplayTotal] = useState('0 Bytes');

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  useEffect(() => {
    setDisplaySize(formatBytes(downloadedSize));
    setDisplayTotal(formatBytes(totalSize));
  }, [downloadedSize, totalSize]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>📥 Downloading</h2>
        </div>

        <div style={styles.content}>
          {/* Progress Circle */}
          <div style={styles.circleContainer}>
            <svg width="150" height="150" style={styles.circle}>
              <circle cx="75" cy="75" r="70" style={styles.circleBg} />
              <circle
                cx="75"
                cy="75"
                r="70"
                style={{
                  ...styles.circleProgress,
                  strokeDashoffset: 440 - (440 * progress) / 100
                }}
              />
              <text x="75" y="85" style={styles.circleText}>
                {progress}%
              </text>
            </svg>
          </div>

          {/* Size Info */}
          <div style={styles.sizeInfo}>
            <p style={styles.sizeLabel}>
              <strong>{displaySize}</strong>
            </p>
            <p style={styles.totalLabel}>of {displayTotal}</p>
          </div>

          {/* Linear Progress Bar */}
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`
              }}
            ></div>
          </div>

          {/* Status */}
          <p style={styles.status}>
            ⏳ {progress === 100 ? 'Download complete!' : 'Downloading...'}
          </p>
        </div>

        {/* Cancel Button */}
        <button style={styles.cancelBtn} onClick={onCancel}>
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '30px'
  },
  content: {
    marginBottom: '30px'
  },
  circleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  circle: {
    transform: 'rotate(-90deg)'
  },
  circleBg: {
    fill: 'none',
    stroke: '#f0f0f0',
    strokeWidth: '8'
  },
  circleProgress: {
    fill: 'none',
    stroke: '#667eea',
    strokeWidth: '8',
    strokeLinecap: 'round',
    strokeDasharray: '440',
    transition: 'stroke-dashoffset 0.3s ease'
  },
  circleText: {
    fontSize: '24px',
    fontWeight: 'bold',
    fill: '#667eea',
    textAnchor: 'middle',
    dominantBaseline: 'middle'
  },
  sizeInfo: {
    marginBottom: '20px'
  },
  sizeLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0'
  },
  totalLabel: {
    fontSize: '14px',
    color: '#999',
    margin: '0'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '15px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    transition: 'width 0.3s ease'
  },
  status: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    margin: '0'
  },
  cancelBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default DownloadProgressModal;
