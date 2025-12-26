import DataManager from '../data/data-manager';

const Home = {
    async render() {
        return `
      <section class="hero">
        <div class="container">
          <h1>Sistem Laporan Infrastruktur UNESA</h1>
          <p>Laporkan kerusakan fasilitas kampus dengan mudah dan cepat.</p>
          <a href="#/lapor" class="nav-btn" style="background:var(--accent); color:#000;">Mulai Lapor</a>
        </div>
      </section>

      <section class="container" style="padding-bottom: 50px;">
        <h2 style="text-align:center; color:var(--primary); margin-bottom:30px;">Laporan Terbaru</h2>
        
        <div id="loading" style="text-align:center; display:none;">
            <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--primary);"></i>
            <p>Memuat data laporan...</p>
        </div>

        <div class="card-grid" id="reportsList"></div>
      </section>
    `;
    },

    async afterRender() {
        const container = document.getElementById('reportsList');
        const loading = document.getElementById('loading');

        // Tampilkan loading sebelum ambil data
        loading.style.display = 'block';

        try {
            // PERBAIKAN: Tambahkan await karena sekarang ambil dari Server
            const allReports = await DataManager.getAllReports();

            // Sembunyikan loading setelah data sampai
            loading.style.display = 'none';

            // Ambil 6 terbaru (Pastikan allReports adalah array sebelum di-slice)
            const reports = Array.isArray(allReports) ? allReports.slice(0, 6) : [];

            if (reports.length === 0) {
                container.innerHTML = '<p style="text-align:center; width:100%;">Belum ada laporan masuk.</p>';
                return;
            }

            container.innerHTML = '';
            reports.forEach(item => {
                container.innerHTML += `
        <article class="card" onclick="location.hash='#/detail/${item.id}'">
          <img src="${item.img || './images/hero.jpg'}" alt="${item.title}" class="card-img" onerror="this.src='./images/hero.jpg'">
          <div class="card-body">
            <span class="card-tag"><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
            <h3>${item.title}</h3>
            <p>${item.desc.substring(0, 60)}...</p>
            <button style="color:var(--primary); background:none; border:none; font-weight:600; cursor:pointer;">Lihat Detail &rarr;</button>
          </div>
        </article>
      `;
            });
        } catch (error) {
            console.error(error);
            loading.style.display = 'none';
            container.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat data laporan. Pastikan server Back-End menyala.</p>';
        }
    }
};

export default Home;