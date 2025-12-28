const API_ENDPOINT =
  'https://silapor-sistem-pelaporan-unesa-production.up.railway.app/api/reports';

const AUTH_KEY = 'SILAPOR_USER_SESSION';

const DataManager = {
  // 1. Ambil Data dari API Back-End (Async)
  async getAllReports() {
    try {
      const response = await fetch(API_ENDPOINT);

      // Cek jika response bukan OK (misal 404 atau 500)
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Gagal mengambil data dari server:', error);
      return []; // Return array kosong agar aplikasi tidak crash
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

      // Cek status pengiriman
      if (!response.ok) {
        throw new Error(`Gagal kirim: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gagal mengirim data:', error);
      throw error;
    }
  },

  // 3. Ambil Detail by ID
  async getReportById(id) {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`);

      if (!response.ok) throw new Error('Not Found');

      return await response.json();
    } catch (error) {
      console.error(`Gagal ambil detail ID ${id}:`, error);
      return null;
    }
  },

  // --- AUTHENTICATION (Client-side) ---
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
