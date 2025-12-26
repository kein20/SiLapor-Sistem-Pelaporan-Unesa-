import DataManager from '../data/data-manager';
import L from 'leaflet';

const Detail = {
  async render() {
    return `
      <div id="detailContent" class="container" style="padding: 80px 20px;">
        <div class="loader" style="text-align:center;">
          <p>Sedang mengambil data dari server...</p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const url = window.location.hash;
    const parts = url.split('/');
    const id = parts[2]; // Ambil ID dari URL

    if (!id) {
      this.showError('ID tidak ditemukan di URL.');
      return;
    }

    try {
      const report = await DataManager.getReportById(id);

      // Cek apakah data benar-benar ada
      if (!report || report.error) {
        this.showError('Laporan tidak ditemukan di server.');
        return;
      }

      // Render Tampilan Detail
      // ... kode JS sebelumnya ...

      // Render Tampilan Detail
      const detailContainer = document.getElementById('detailContent');
      detailContainer.innerHTML = `
          <div class="detail-container"> <div class="detail-card">
              
              <div class="detail-header">
                <img src="${report.img || './images/default.jpg'}" 
                      class="detail-hero-img" 
                      alt="${report.title}"
                      onerror="this.onerror=null;this.src='./images/default.jpg';">
              </div>
              
              <div class="detail-body">
                <h2 class="detail-title">${report.title}</h2>
                
                <div class="detail-meta">
                  <span class="meta-item">
                    <i class="fas fa-map-marker-alt"></i> ${report.location || 'Lokasi tidak tersedia'}
                  </span>
                </div>

                <div class="detail-desc">
                  <p>${report.desc}</p>
                </div>
                
                <h4 class="section-title"><i class="fas fa-map"></i> Lokasi Peta</h4>
                <div id="mapDetail" class="map-container"></div>
                
                <div class="action-buttons">
                  <button id="btnBack" class="btn-secondary">
                    <i class="fas fa-arrow-left"></i> Kembali
                  </button>
                </div>
              </div>

            </div>
          </div>
        `;
      // ... kode JS selanjutnya ...

      // Event Listener Tombol Kembali
      document.getElementById('btnBack').addEventListener('click', () => {
        window.location.hash = '#/'; // Balik ke Home
      });

      // Inisialisasi Peta (Hanya jika koordinat ada)
      if (report.lat && report.lng) {
        this.initMap(report);
      } else {
        document.getElementById('mapDetail').innerHTML =
          '<div class="error-msg">Koordinat lokasi tidak tersedia.</div>';
      }

    } catch (error) {
      console.error(error);
      this.showError('Gagal memuat data. Pastikan server Backend menyala.');
    }
  },

  showError(message) {
    const container = document.getElementById('detailContent');
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <h3>Oops!</h3>
          <p>${message}</p>
          <button onclick="window.location.hash='#/'" class="btn-primary">Ke Beranda</button>
        </div>
      `;
    }
  },

  initMap(report) {
    const mapContainer = document.getElementById('mapDetail');
    if (!mapContainer) return;
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const map = L.map('mapDetail').setView([report.lat, report.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([report.lat, report.lng]).addTo(map)
      .bindPopup(`<b>${report.title}</b><br>${report.location}`)
      .openPopup();
  }
};

export default Detail;