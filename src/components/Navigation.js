import React from 'react';

function Navigation({ activePage, setActivePage }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>🎬 YT Downloader</div>
        <div style={styles.navLinks}>
          <button
            onClick={() => setActivePage('home')}
            style={{
              ...styles.navLink,
              borderBottom: activePage === 'home' ? '3px solid white' : 'none'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActivePage('about')}
            style={{
              ...styles.navLink,
              borderBottom: activePage === 'about' ? '3px solid white' : 'none'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ℹ️ About
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    width: '100%',
    boxSizing: 'border-box'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  navLinks: {
    display: 'flex',
    gap: '30px'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '10px 0',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  }
};

export default Navigation;
