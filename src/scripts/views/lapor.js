import DataManager from '../data/data-manager';
import AIHelper from '../utils/ai-helper';

const Lapor = {
  async render() {
    if (!DataManager.isLoggedIn()) {
      // Ganti Alert Login
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu untuk melapor.',
        confirmButtonColor: '#005baa',
      }).then(() => {
        window.location.hash = '/login';
      });
      return '';
    }

    return `
      <section class="container" style="padding-top:40px; padding-bottom:50px;">
        <h2 style="text-align:center; color:var(--primary); margin-bottom:30px;">
           Buat Laporan <span style="font-size:0.7em; background:#e3f2fd; color:var(--primary); padding:3px 8px; border-radius:10px;">Powered by AI</span>
        </h2>
        
        <div class="form-container">
          <form id="laporForm">
            
            <div class="form-group">
              <label class="form-label">Bukti Foto (AI akan mendeteksi objek)</label>
              <div class="upload-area" onclick="document.getElementById('foto').click()">
                <img id="previewImg" src="" style="max-height:200px; display:none; margin:0 auto; border-radius:8px;">
                
                <div id="aiLoading" style="display:none; margin-top:10px;">
                    <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--accent);"></i>
                    <p style="font-weight:600; color:var(--primary); margin-top:5px;">AI sedang menganalisis...</p>
                </div>

                <div id="uploadText">
                  <i class="fas fa-camera" style="font-size:2rem; color:#ccc;"></i>
                  <p style="margin-top:10px; color:#666;">Klik untuk ambil foto</p>
                </div>
                <input type="file" id="foto" accept="image/*" style="display:none" required>
              </div>
            </div>

            <div id="aiResult" style="display:none; background:#e8f5e9; padding:10px; border-radius:8px; margin-bottom:20px; border:1px solid #4caf50;">
                <p style="color:#2e7d32; font-size:0.9rem;">
                    <i class="fas fa-robot"></i> <strong>AI Mendeteksi:</strong> <span id="detectedObject">-</span>
                </p>
            </div>

            <div class="form-group">
              <label class="form-label">Detail Lokasi</label>
              <input type="text" id="lokasi" class="form-input" 
                     placeholder="Contoh: Gedung K10 Lantai 2, Ruang 02.04" required>
            </div>

            <div class="form-group">
              <label class="form-label">Titik Peta</label>
              <div id="map"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Judul Laporan (Otomatis)</label>
              <input type="text" id="judul" class="form-input" required placeholder="Menunggu hasil foto...">
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Masalah</label>
              <textarea id="desc" class="form-input" rows="3" required placeholder="Jelaskan kondisi kerusakan..."></textarea>
            </div>

            <button type="submit" id="btnSubmit" class="btn-submit">Kirim Laporan</button>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    if (!DataManager.isLoggedIn()) return;

    // 1. Init Map
    let lat = -7.312151;
    let lng = 112.726268;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        updateMap(lat, lng);
      });
    }

    let map, marker;
    const updateMap = (latitude, longitude) => {
      if (map) {
        map.setView([latitude, longitude], 17);
        marker.setLatLng([latitude, longitude]);
      } else {
        map = L.map('map').setView([latitude, longitude], 17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
          map
        );
        marker = L.marker([latitude, longitude], { draggable: true }).addTo(
          map
        );
        marker.on('dragend', (e) => {
          const position = marker.getLatLng();
          lat = position.lat;
          lng = position.lng;
        });
      }
    };
    updateMap(lat, lng);

    // 2. Logic Foto & AI
    const fotoInput = document.getElementById('foto');
    const judulInput = document.getElementById('judul');
    const aiLoading = document.getElementById('aiLoading');
    const aiResult = document.getElementById('aiResult');
    const detectedText = document.getElementById('detectedObject');
    let fotoBase64 = null;

    fotoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (res) => {
          fotoBase64 = res.target.result;
          const imgPreview = document.getElementById('previewImg');
          imgPreview.src = fotoBase64;
          imgPreview.style.display = 'block';
          document.getElementById('uploadText').style.display = 'none';

          aiLoading.style.display = 'block';
          aiResult.style.display = 'none';

          const detected = await AIHelper.detectObject(imgPreview);

          aiLoading.style.display = 'none';

          if (detected) {
            aiResult.style.display = 'block';
            detectedText.textContent = detected;
            judulInput.value = detected;
            judulInput.style.backgroundColor = '#e8f5e9';
            setTimeout(
              () => (judulInput.style.backgroundColor = 'white'),
              1000
            );
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // 3. Submit dengan SweetAlert2
    document
      .getElementById('laporForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnSubmit = document.getElementById('btnSubmit');
        const originalText = btnSubmit.innerText;
        btnSubmit.innerText = 'Mengirim...';
        btnSubmit.disabled = true;

        const newReport = {
          id: new Date().getTime(),
          title: document.getElementById('judul').value,
          location: document.getElementById('lokasi').value,
          desc: document.getElementById('desc').value,
          img: fotoBase64 || './images/hero.jpg',
          lat: lat,
          lng: lng,
        };

        try {
          await DataManager.addReport(newReport);

          // [GANTI] Menggunakan SweetAlert Success
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Laporan Anda telah terkirim ke server.',
            confirmButtonColor: '#005baa',
            timer: 2000,
          });

          window.location.hash = '/';
        } catch (error) {
          console.error(error);

          // [GANTI] Menggunakan SweetAlert Error
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan koneksi ke server.',
            confirmButtonColor: '#d33',
          });

          btnSubmit.innerText = originalText;
          btnSubmit.disabled = false;
        }
      });
  },
};

export default Lapor;
