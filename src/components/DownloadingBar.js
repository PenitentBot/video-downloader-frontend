import React from 'react';

function DownloadingBar({ isDownloading, message, fileSize, onCancel }) {
  if (!isDownloading) return null;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Loading Animation */}
        <div style={styles.leftSection}>
          <div style={styles.spinner}></div>
          <div style={styles.textSection}>
            <span style={styles.mainText}>{message || 'Download started'}</span>
            {fileSize && <span style={styles.sizeText}>{fileSize}</span>}
          </div>
        </div>

        {/* Cancel Button */}
        <button 
          style={styles.cancelBtn}
          onClick={onCancel}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444';
          }}
        >
          ✕ Cancel
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBar}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderTop: '2px solid #3b82f6',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
    padding: '16px 24px 12px 24px'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid rgba(59, 130, 246, 0.3)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  textSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  mainText: {
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600'
  },
  sizeText: {
    color: '#94a3b8',
    fontSize: '13px'
  },
  cancelBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  progressBarContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s ease-in-out infinite',
    borderRadius: '2px'
  }
};

// Add keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(styleSheet);

export default DownloadingBar;
