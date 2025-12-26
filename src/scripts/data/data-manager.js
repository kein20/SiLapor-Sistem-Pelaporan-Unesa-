const API_ENDPOINT = 'http://localhost:3000/api/reports';
const AUTH_KEY = 'SILAPOR_USER_SESSION';

const DataManager = {
  // 1. Ambil Data dari API Back-End (Async)
  async getAllReports() {
    try {
      const response = await fetch(API_ENDPOINT);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Gagal mengambil data dari server:', error);
      return []; // Return kosong jika server mati
    }
  },

  // 2. Kirim Data ke API Back-End
  async addReport(report) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      return await response.json();
    } catch (error) {
      console.error('Gagal mengirim data:', error);
      // Hapus alert() biasa, ganti dengan console.error saja
      // atau biarkan UI (seperti lapor.js) yang menangani alertnya
      throw error; // Lempar error agar bisa ditangkap oleh SweetAlert di lapor.js
    }
  },

  // 3. Ambil Detail by ID
  async getReportById(id) {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`);
      if (!response.ok) throw new Error('Not Found');
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // --- AUTHENTICATION (Sederhana/Client-side simulation) ---
  isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) !== null;
  },

  login(username) {
    localStorage.setItem(AUTH_KEY, username);
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};

export default DataManager;
