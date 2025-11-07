import React from 'react';

function AboutSection() {
  const websites = [
    { name: 'YouTube', icon: '🎥', description: 'Download videos, shorts, playlists' },
    { name: 'Instagram', icon: '📸', description: 'Download reels, stories, posts' },
    { name: 'TikTok', icon: '🎬', description: 'Download TikTok videos' },
    { name: 'Twitter', icon: '🐦', description: 'Download tweets & videos' },
    { name: 'Facebook', icon: '👥', description: 'Download FB videos' },
    { name: 'Dailymotion', icon: '🎞️', description: 'Download videos & playlists' }
  ];

  return (
    <div style={styles.about}>
      <div style={styles.container}>
        <h1 style={styles.title}>About Our Service</h1>
        <p style={styles.description}>
          Our YouTube video downloader is the fastest and easiest way to download videos from multiple platforms.
          Save your favorite content in high quality for offline viewing.
        </p>

        <h2 style={styles.sectionTitle}>📥 Download From</h2>
        <div style={styles.grid}>
          {websites.map((site, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{site.icon}</div>
              <h3>{site.name}</h3>
              <p>{site.description}</p>
            </div>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>✨ Features</h2>
        <div style={styles.featuresList}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🚀</span>
            <h3>Ultra Fast</h3>
            <p>Download videos at maximum speed</p>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🎬</span>
            <h3>Multiple Formats</h3>
            <p>MP4, MP3, and various quality options</p>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🔒</span>
            <h3>100% Safe</h3>
            <p>No viruses, no tracking, secure downloads</p>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>📱</span>
            <h3>All Devices</h3>
            <p>Works on mobile, tablet, and desktop</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>❓ FAQ</h2>
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <h4>Is it legal?</h4>
            <p>Yes, downloading for personal use is legal. Respect copyright laws.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Do you store my data?</h4>
            <p>No, we don't store any of your downloads or personal information.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>What quality can I download?</h4>
            <p>Up to 1080p for video and maximum quality for audio.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Is there a limit?</h4>
            <p>No limits! Download as many videos as you want.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  about: {
    background: '#f8f9fa',
    padding: '60px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '42px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  description: {
    fontSize: '18px',
    textAlign: 'center',
    color: '#666',
    marginBottom: '60px',
    maxWidth: '600px',
    margin: '0 auto 60px'
  },
  sectionTitle: {
    fontSize: '32px',
    marginTop: '60px',
    marginBottom: '30px',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '60px'
  },
  card: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  featuresList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '60px'
  },
  featureItem: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  featureIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px'
  },
  faqList: {
    display: 'grid',
    gap: '20px'
  },
  faqItem: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  }
};

export default AboutSection;
