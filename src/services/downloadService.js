const API_URL = 'https://your-render-backend.onrender.com';

export const downloadVideo = (url, quality = '480') => {
  fetch(`${API_URL}/api/download-proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      url, 
      format: 'video',
      quality 
    })
  }).then(r => r.blob()).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'video.mp4';
    a.click();
  });
};

export const downloadAudio = (url) => {
  fetch(`${API_URL}/api/download-proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      url, 
      format: 'audio'
    })
  }).then(r => r.blob()).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'audio.mp3';
    a.click();
  });
};

export const downloadPlaylist = (url, quality = '480') => {
  fetch(`${API_URL}/api/download-playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      url, 
      format: 'video',
      quality 
    })
  }).then(r => r.blob()).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'playlist.zip';
    a.click();
  });
};
