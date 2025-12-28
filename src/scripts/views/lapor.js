import DataManager from '../data/data-manager';
import AIHelper from '../utils/ai-helper';

const Lapor = {
  async render() {
    // 1. Cek Login
    if (!DataManager.isLoggedIn()) {
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
      <section class="container fade-in" style="padding-top:40px; padding-bottom:50px;">
        <h2 class="section-title">
            Buat Laporan <span style="font-size:0.6em; background:#e3f2fd; color:var(--primary); padding:4px 10px; border-radius:20px; vertical-align:middle;">AI Powered</span>
        </h2>
        
        <div class="form-container">
          <form id="laporForm">
            
            <div class="form-group">
              <label class="form-label">Bukti Foto</label>
              
              <div class="upload-area" id="uploadArea">
                <img id="previewImg" src="#" style="display:none; width:100%; max-height:300px; object-fit:contain; margin-bottom:10px; border-radius:8px;">
                
                <div id="uploadText">
                   <i class="fas fa-camera" style="font-size:2rem; color:#ccc; margin-bottom:10px;"></i>
                   <p style="color:#666;">Klik untuk ambil foto / upload gambar</p>
                </div>
                
                <div id="aiLoading" style="display:none; text-align:center; padding:20px;">
                    <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--accent);"></i>
                    <p style="color:var(--primary); font-weight:600; margin-top:10px;">AI sedang menganalisis objek...</p>
                </div>

                <input type="file" id="foto" accept="image/*" hidden required>
              </div>
            </div>

            <div id="aiResult" style="display:none; margin-bottom:25px;">
                
                <div id="labelBox" style="background:#e3f2fd; padding:15px; border-radius:12px; display:flex; align-items:center; gap:15px; margin-bottom:15px; border:1px solid #bbdefb;">
                    <div style="background:#fff; padding:10px; border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center;">
                        <i id="aiIcon" class="fas fa-robot" style="font-size:1.5rem; color:#005baa;"></i>
                    </div>
                    <div>
                        <small style="color:#666;">Terdeteksi Otomatis:</small>
                        <h3 id="detectedObject" style="margin:0; font-size:1.2rem; color:#005baa;">-</h3>
                        <small id="confidenceScore" style="color:#888;">-</small>
                    </div>
                </div>

                <div id="k3Box" style="display:none; background:#fff3cd; border-left: 6px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom:15px;">
                    <h4 style="color:#856404; margin-bottom:5px; font-size:1rem;">
                        <i class="fas fa-exclamation-triangle"></i> Peringatan Keselamatan
                    </h4>
                    <p id="k3Message" style="color:#856404; font-weight:600; margin-bottom:5px;">-</p>
                    <small id="k3Action" style="color:#666;">-</small>
                </div>

                <div id="manualMsg" style="display:none; color:#721c24; background:#f8d7da; padding:15px; border-radius:8px; border:1px solid #f5c6cb;">
                    <i class="fas fa-times-circle"></i> Objek tidak dikenali dengan jelas. Silakan isi judul secara manual.
                </div>
            </div>

            <div class="form-group">
              <label class="form-label">Judul Laporan</label>
              <input type="text" id="judul" class="form-input" required placeholder="Menunggu hasil foto...">
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Masalah</label>
              <textarea id="desc" class="form-input" rows="3" required placeholder="Jelaskan kondisi kerusakan lebih rinci..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Lokasi Detail</label>
              <input type="text" id="lokasi" class="form-input" placeholder="Contoh: Gedung K10 Lantai 2, Ruang 02.04" required>
            </div>

            <div class="form-group">
              <label class="form-label">Titik Peta</label>
              <div id="map"></div>
            </div>

            <button type="submit" id="btnSubmit" class="btn-submit">
                <i class="fas fa-paper-plane"></i> Kirim Laporan
            </button>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    if (!DataManager.isLoggedIn()) return;

    // --- 1. INISIALISASI AI ---
    await AIHelper.init(); //

    // --- 2. LOGIKA MAP
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

        // Fix Leaflet Map Render bug in tabs/hidden divs
        setTimeout(() => {
          map.invalidateSize();
        }, 500);

        marker.on('dragend', (e) => {
          const position = marker.getLatLng();
          lat = position.lat;
          lng = position.lng;
        });
      }
    };
    updateMap(lat, lng);

    // 3. LOGIKA FOTO & AI
    const fotoInput = document.getElementById('foto');
    const uploadArea = document.getElementById('uploadArea');
    const judulInput = document.getElementById('judul');

    // UI Elements
    const aiLoading = document.getElementById('aiLoading');
    const aiResult = document.getElementById('aiResult');
    const detectedText = document.getElementById('detectedObject');
    const confidenceScore = document.getElementById('confidenceScore');
    const labelBox = document.getElementById('labelBox');
    const aiIcon = document.getElementById('aiIcon');
    const k3Box = document.getElementById('k3Box');
    const manualMsg = document.getElementById('manualMsg');

    let fotoBase64 = null;

    uploadArea.addEventListener('click', () => fotoInput.click());

    fotoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (res) => {
          fotoBase64 = res.target.result;

          // Tampilkan Preview
          const imgPreview = document.getElementById('previewImg');
          imgPreview.src = fotoBase64;
          imgPreview.style.display = 'block';
          document.getElementById('uploadText').style.display = 'none';

          // Reset UI State
          aiLoading.style.display = 'block';
          aiResult.style.display = 'none';
          k3Box.style.display = 'none';
          manualMsg.style.display = 'none';
          labelBox.style.background = '#e3f2fd';
          labelBox.style.borderColor = '#bbdefb';

          // --- EKSEKUSI AI ---
          const result = await AIHelper.detectObject(imgPreview); //

          aiLoading.style.display = 'none';
          aiResult.style.display = 'block';

          // --- LOGIKA HASIL ---
          if (result.category === 'Unknown') {
            // KASUS: Tidak Dikenali / Confidence Rendah
            detectedText.textContent = 'Tidak Terdeteksi';
            detectedText.style.color = '#721c24';
            confidenceScore.textContent = `Akurasi rendah (${result.confidence})`;

            labelBox.style.background = '#f8d7da'; // Merah
            labelBox.style.borderColor = '#f5c6cb';
            aiIcon.className = 'fas fa-question-circle';
            aiIcon.style.color = '#721c24';

            // Kosongkan judul buat manual
            judulInput.value = '';
            judulInput.placeholder = 'Silakan isi judul manual...';
            judulInput.focus();

            manualMsg.style.display = 'block';
          } else {
            // KASUS: Berhasil Deteksi
            const cleanName = result.category.replace(/_/g, ' ');

            detectedText.textContent = cleanName;
            detectedText.style.color = '#005baa';
            confidenceScore.textContent = `Akurasi: ${result.confidence}`;

            aiIcon.className = 'fas fa-check-circle';
            aiIcon.style.color = '#005baa';

            // Auto Fill Judul
            judulInput.value = `Laporan: ${cleanName}`;

            // Animasi flash kuning di input
            judulInput.style.backgroundColor = '#fff9c4';
            setTimeout(
              () => (judulInput.style.backgroundColor = 'white'),
              1000
            );

            // Tampilkan K3 (Jika ada)
            if (result.k3) {
              k3Box.style.display = 'block';
              document.getElementById('k3Message').innerText = result.k3.msg;
              document.getElementById('k3Action').innerText =
                'Saran: ' + result.k3.action;
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // 4. SUBMIT FORM
    document
      .getElementById('laporForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnSubmit = document.getElementById('btnSubmit');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        btnSubmit.disabled = true;

        const newReport = {
          id: new Date().getTime(),
          title: document.getElementById('judul').value,
          location: document.getElementById('lokasi').value,
          desc: document.getElementById('desc').value,
          img: fotoBase64 || './images/hero.jpg', // Fallback image
          lat: lat,
          lng: lng,
        };

        try {
          await DataManager.addReport(newReport);

          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Laporan Anda telah terkirim.',
            confirmButtonColor: '#005baa',
            timer: 2000,
          });

          window.location.hash = '/';
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan koneksi.',
            confirmButtonColor: '#d33',
          });
          btnSubmit.innerHTML = originalText;
          btnSubmit.disabled = false;
        }
      });
  },
};

export default Lapor;
