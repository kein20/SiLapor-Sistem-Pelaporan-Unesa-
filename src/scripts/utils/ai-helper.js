const AIHelper = {
  // 1. Inisialisasi Model
  async loadModel() {
    console.log('Memuat Model AI...');
    // Menggunakan MobileNet yang sudah tersedia global via script di HTML
    return await mobilenet.load();
  },

  // 2. Deteksi Gambar
  async detectObject(imgElement) {
    try {
      const model = await this.loadModel();
      const predictions = await model.classify(imgElement);

      if (predictions && predictions.length > 0) {
        // Ambil prediksi dengan akurasi tertinggi
        const bestGuess = predictions[0].className;
        return this.translateToIndonesian(bestGuess);
      }
      return null;
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  // 3. Translate Sederhana (Mapping objek umum kampus)
  translateToIndonesian(englishName) {
    const dictionary = {
      desk: 'Meja Rusak',
      'folding chair': 'Kursi Lipat Rusak',
      chair: 'Kursi Rusak',
      monitor: 'Layar Monitor Bermasalah',
      screen: 'Layar Monitor Bermasalah',
      television: 'TV / Display Info Mati',
      'desktop computer': 'Komputer Lab Bermasalah',
      keyboard: 'Keyboard Rusak',
      mouse: 'Mouse Rusak',
      'water bottle': 'Sampah Botol Berserakan',
      ashcan: 'Tempat Sampah Penuh',
      'trash can': 'Tempat Sampah Penuh',
      umbrella: 'Barang Tertinggal (Payung)',
      projector: 'Proyektor Bermasalah',
      'window shade': 'Tirai Jendela Rusak',
      'sliding door': 'Pintu Geser Macet',
      doormat: 'Keset Kotor/Rusak',
      broom: 'Alat Kebersihan Berserakan',
    };

    // Cari teks yang cocok di kamus
    // MobileNet sering kasih output koma, misal "desk, table"
    const words = englishName.split(',')[0].toLowerCase();

    // Cek kamus, jika tidak ada, return teks asli tapi dipercantik
    return dictionary[words] || `Kerusakan pada ${englishName}`;
  },
};

export default AIHelper;
