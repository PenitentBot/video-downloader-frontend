import React from 'react';

function HeroSection() {
  return (
    <div style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>Download Videos from YouTube</h1>
        <p style={styles.heroSubtitle}>Fast, Easy & Free. Convert to MP4 or MP3</p>
        <div style={styles.heroFeatures}>
          <span style={styles.feature}>✨ 1080p Quality</span>
          <span style={styles.feature}>⚡ Fast Downloads</span>
          <span style={styles.feature}>🎵 MP3 Audio</span>
          <span style={styles.feature}>🔒 Secure</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '54px',
    margin: '0 0 20px 0',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '24px',
    opacity: 0.9,
    margin: '0 0 30px 0'
  },
  heroFeatures: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  feature: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '16px'
  }
};

export default HeroSection;
