# SiLapor UNESA (Sistem Pelaporan Unesa)

**SiLapor UNESA** adalah aplikasi berbasis web (_Progressive Web App_) yang dirancang untuk mendigitalkan proses pelaporan kerusakan infrastruktur di lingkungan Universitas Negeri Surabaya. Aplikasi ini mengintegrasikan kecerdasan buatan (_Artificial Intelligence_) untuk mendeteksi objek kerusakan secara otomatis, memudahkan civitas akademika dalam mengirimkan laporan secara cepat, akurat, dan transparan.

Proyek ini dikembangkan sebagai **Mini Project** untuk program MBKM Studi Independen yang telah dilaksanakan di **Dicoding Indonesia** (Learning Path: Front-End & Back-End).

---

## 🌟 Fitur Unggulan

### 1. 🤖 Smart Detection (AI Powered)

Menggunakan **TensorFlow.js** dengan model **MobileNet** untuk mengenali objek dalam foto yang diunggah (misal: "Kursi", "Monitor", "Botol") dan mengisi judul laporan secara otomatis.

### 2. ⚡ Progressive Web App (PWA)

- **Offline Capability:** Aplikasi tetap dapat dibuka dan berfungsi dasar meskipun tidak ada koneksi internet.
- **Installable:** Dapat diinstal ke _homescreen_ perangkat _mobile_ maupun _desktop_ layaknya aplikasi native.

### 3. 🗺️ Lokasi & Pemetaan

Terintegrasi dengan **Leaflet.js** untuk menampilkan peta lokasi kerusakan secara interaktif, memastikan petugas teknis dapat menemukan lokasi dengan tepat.

### 4. 📱 Responsive & Modern UI

Desain antarmuka yang bersih dan responsif (_Mobile-First Approach_) menggunakan CSS modern, menjamin kenyamanan pengguna di berbagai ukuran layar.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur _Client-Server_ (Separation of Concerns).

### Front-End (Client)

- **HTML5, CSS3, & JavaScript (ES6+)**
- **Webpack** (Module Bundler)
- **TensorFlow.js** (Machine Learning di Browser)
- **Leaflet.js** (Interactive Maps)
- **SweetAlert2** (Notifikasi Cantik)
- **Service Worker** (PWA Caching & Offline Strategy)

### Back-End (Server)

- **Node.js** (Runtime Environment)
- **File System (fs)** (Penyimpanan data berbasis JSON untuk prototipe)
- **CORS & Body-Parser** (Middleware)

## 🚀 Cara Menjalankan Project (Local Installation)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokalmu:

### Prasyarat

Pastikan kamu sudah menginstal **Node.js** dan **NPM** di komputermu.

### 1. Clone Repository

```bash
git clone [https://github.com/kein20/SiLapor-Sistem-Pelaporan-Unesa-.git](https://github.com/kein20/SiLapor-Sistem-Pelaporan-Unesa-.git)
cd silapor-unesa
2. Install Dependencies
Install semua library yang dibutuhkan untuk Front-End dan Back-End.

Bash

npm install
3. Jalankan Server Back-End
Buka terminal baru, lalu jalankan server Node.js (berjalan di port 3000).

Bash

node server/server.js
Output: Server Back-End berjalan di http://localhost:3000

4. Jalankan Front-End
Buka terminal lain (split terminal), lalu jalankan mode pengembangan (berjalan di port 9000/8080).

Bash

npm run start-dev
Aplikasi akan otomatis terbuka di browser.

📂 Struktur Direktori
silapor-unesa/
├── dist/                # Output hasil build (Production ready)
├── server/              # Kode Back-End
│   ├── data.json        # Database sederhana (JSON)
│   └── server.js        # Entry point server Express
├── src/                 # Kode Front-End
│   ├── public/          # Aset statis (images, icons)
│   ├── scripts/         # Logika JavaScript
│   │   ├── components/  # Web Components (jika ada)
│   │   ├── data/        # Data Manager & API Handling
│   │   ├── views/       # Halaman (Home, Detail, Lapor)
│   │   ├── index.js     # Entry point aplikasi
│   │   └── sw.js        # Service Worker (PWA)
│   ├── styles/          # File CSS
│   └── index.html       # Template HTML utama
├── package.json         # Daftar dependencies & scripts
└── webpack.common.js    # Konfigurasi Webpack
```
