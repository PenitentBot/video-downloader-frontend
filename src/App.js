import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import DownloadForm from './components/DownloadForm';
import AboutSection from './components/AboutSection';

function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="App">
      <Navigation activePage={activePage} setActivePage={setActivePage} />

      {/* HOME PAGE */}
      {activePage === 'home' && (
        <div>
          <HeroSection />
          <main style={styles.main}>
            <div style={styles.container}>
              {/* Beautiful Download Section */}
              <DownloadForm />

              {/* Ad Space 1 */}
              <div style={styles.adsSection}>
                <div style={styles.adPlaceholder}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Google Ad Space 1</p>
                  <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>728x90</p>
                </div>
              </div>

              {/* Info Cards */}
              <div style={styles.infoSection}>
                <div style={styles.infoCard}>
                  <div style={styles.iconBig}>🚀</div>
                  <h3>Easy to Use</h3>
                  <p>Paste YouTube URL and download instantly in seconds</p>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.iconBig}>🎥</div>
                  <h3>Multiple Formats</h3>
                  <p>Download as MP4 video or MP3 audio in various qualities</p>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.iconBig}>⚡</div>
                  <h3>Fast Downloads</h3>
                  <p>Direct downloads with high-speed connections guaranteed</p>
                </div>
              </div>

              {/* Ad Space 2 */}
              <div style={styles.adsSection}>
                <div style={styles.adPlaceholder}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Google Ad Space 2</p>
                  <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>300x250</p>
                </div>
              </div>

              {/* Features Section */}
              <div style={styles.featuresSection}>
                <h2 style={styles.featuresTitle}>✨ Why Choose Us?</h2>
                <div style={styles.featuresGrid}>
                  <div style={styles.featureBox}>
                    <span style={styles.featureEmoji}>🔒</span>
                    <h4>100% Secure</h4>
                    <p>No tracking, no ads, encrypted downloads</p>
                  </div>
                  <div style={styles.featureBox}>
                    <span style={styles.featureEmoji}>⚙️</span>
                    <h4>Simple Interface</h4>
                    <p>Easy to use for everyone</p>
                  </div>
                  <div style={styles.featureBox}>
                    <span style={styles.featureEmoji}>📱</span>
                    <h4>All Devices</h4>
                    <p>Works on mobile, tablet, desktop</p>
                  </div>
                  <div style={styles.featureBox}>
                    <span style={styles.featureEmoji}>⭐</span>
                    <h4>HD Quality</h4>
                    <p>Download in highest quality available</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ABOUT PAGE */}
      {activePage === 'about' && <AboutSection />}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={{ margin: '0 0 15px 0' }}>🎬 YT Downloader</h4>
            <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
              Download YouTube videos and audio in multiple formats
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={{ margin: '0 0 15px 0' }}>Quick Links</h4>
            <div style={styles.footerLinks}>
              <button 
                onClick={() => setActivePage('home')}
                style={styles.footerLink}
              >
                Home
              </button>
              <button 
                onClick={() => setActivePage('about')}
                style={styles.footerLink}
              >
                About
              </button>
            </div>
          </div>
          <div style={styles.footerSection}>
            <h4 style={{ margin: '0 0 15px 0' }}>Legal</h4>
            <div style={styles.footerLinks}>
              <a href="#privacy" style={styles.footerLink}>Privacy</a>
              <a href="#terms" style={styles.footerLink}>Terms</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 YouTube Video Downloader. All rights reserved.</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Disclaimer: Always respect copyright laws and terms of service.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 100px)',
    padding: '40px 20px',
    background: '#f8f9fa'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    margin: '60px 0'
  },
  infoCard: {
    background: 'white',
    padding: '30px 20px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  iconBig: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  adsSection: {
    display: 'flex',
    justifyContent: 'center',
    margin: '50px 0',
    padding: '20px'
  },
  adPlaceholder: {
    background: '#e8eaed',
    border: '2px dashed #999',
    padding: '50px 40px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#666',
    width: '100%',
    maxWidth: '728px'
  },
  featuresSection: {
    margin: '80px 0'
  },
  featuresTitle: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  featureBox: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  featureEmoji: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px'
  },
  footer: {
    background: '#1a1a1a',
    color: '#999',
    padding: '60px 20px 30px',
    marginTop: '60px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  footerSection: {
    textAlign: 'left'
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  footerLink: {
    background: 'none',
    border: 'none',
    color: '#999',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    textAlign: 'left'
  },
  footerBottom: {
    borderTop: '1px solid #333',
    paddingTop: '20px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  }
};

export default App;
