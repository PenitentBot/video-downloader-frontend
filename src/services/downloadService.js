import axios from 'axios';

const API_URL = 'http://localhost:3000';

const downloadService = {
  downloadVideo: async (url, format) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/download`,
        { url, format },
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  triggerDownload: (blob, filename) => {
    const urlBlob = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(urlBlob);
  }
};

export default downloadService;
