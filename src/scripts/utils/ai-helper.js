// 🔗 Link Model Teachable Machine
const URL_MODEL = 'https://teachablemachine.withgoogle.com/models/Nx-0C1FzJ/';

let model, maxPredictions;

// ⚠️ Database Saran Keselamatan (K3)
const K3_ADVICE = {
  AC_Rusak: {
    msg: '⚠️ Bahaya Listrik & Air! Jangan berdiri di bawah AC.',
    action: 'Matikan aliran listrik AC jika memungkinkan.',
  },
  Kabel_Bahaya: {
    msg: '⚡ BAHAYA TERSENGAT! Jangan sentuh kabel yang terbuka.',
    action: 'Pasang tanda bahaya dan jauhi area tersebut.',
  },
  Lantai_Licin: {
    msg: '💧 Risiko Terpleset! Lantai basah/licin.',
    action: "Berjalan hati-hati dan pasang 'Wet Floor Sign'.",
  },
  Kursi_Rusak: {
    msg: '🪑 Risiko Terjatuh/Terjepit.',
    action: 'Singkirkan kursi agar tidak diduduki orang lain.',
  },
  Meja_Rusak: {
    msg: '⚠️ Bahaya Benda Tajam/Runtuh.',
    action: 'Jangan letakkan barang berat di atas meja ini.',
  },
  Plafon_Rusak: {
    msg: '🏗️ Bahaya Material Jatuh!',
    action: 'DILARANG melintas atau duduk di bawah area plafon ini.',
  },
  Tembok_Retak: {
    msg: '🧱 Risiko Struktur Bangunan.',
    action: 'Jangan bersandar pada tembok dan lapor segera.',
  },
};

const AIHelper = {
  // 1. Inisialisasi Model
  async init() {
    if (model) return true; // Kalau sudah ada, skip load

    const modelURL = URL_MODEL + 'model.json';
    const metadataURL = URL_MODEL + 'metadata.json';

    try {
      // Pastikan script tmImage sudah ada di index.html
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      console.log('🤖 AI SiLapor Siap (Custom Model)!');
      return true;
    } catch (error) {
      console.error('Gagal memuat AI:', error);
      return false;
    }
  },

  // 2. Deteksi Gambar
  async detectObject(imageElement) {
    try {
      // Pastikan model sudah dimuat
      if (!model) await this.init();

      // Prediksi menggunakan Teachable Machine
      const prediction = await model.predict(imageElement);

      let highestProb = 0;
      let bestClass = '';

      // Cari probabilitas tertinggi
      for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
          highestProb = prediction[i].probability;
          bestClass = prediction[i].className;
        }
      }

      // --- LOGIKA FILTER (Threshold) ---
      // Jika keyakinan AI di bawah 50%, anggap tidak tahu
      if (highestProb < 0.5) {
        return {
          category: 'Unknown',
          confidence: (highestProb * 100).toFixed(1) + '%',
          k3: null,
        };
      }

      // Jika Terdeteksi
      return {
        category: bestClass,
        confidence: (highestProb * 100).toFixed(1) + '%',
        k3: K3_ADVICE[bestClass] || null, // Ambil saran K3
      };
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },
};

export default AIHelper;
