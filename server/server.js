const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000; 

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors()); 
app.use(bodyParser.json({ limit: '10mb' })); 

const readData = () => {
    // Cek apakah file ada
    if (!fs.existsSync(DATA_FILE)) {
        // Jika tidak ada, buat file kosong array []
        fs.writeFileSync(DATA_FILE, '[]');
        return [];
    }
    
    try {
        const data = fs.readFileSync(DATA_FILE);
        // Cek jika file kosong agar tidak error JSON parse
        if (data.length === 0) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error("Error membaca data:", error);
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 1. GET: Ambil Semua Laporan
app.get('/api/reports', (req, res) => {
    const reports = readData();

    // Log hanya di development agar log Railway tidak penuh sampah
    if (process.env.NODE_ENV !== 'production') {
        console.log('\n===================================');
        console.log(`📥 [REQUEST] GET /api/reports`);
        console.log('===================================\n');
    }

    res.json(reports);
});

// 2. POST: Tambah Laporan Baru
app.post('/api/reports', (req, res) => {
    const reports = readData();
    const newReport = req.body;

    // Validasi sederhana
    if (!newReport.title || !newReport.desc) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    console.log(`📤 [POST] Data Laporan Baru Diterima: ${newReport.title}`);

    reports.unshift(newReport); 
    writeData(reports);

    res.status(201).json({ message: 'Laporan berhasil disimpan', data: newReport });
});

// 3. GET: Detail Laporan
app.get('/api/reports/:id', (req, res) => {
    const reports = readData();
    const report = reports.find(r => r.id == req.params.id);

    if (report) {
        res.json(report);
    } else {
        res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }
});

// 4. Default Route (Untuk Cek Server Nyala)
app.get('/', (req, res) => {
    res.send('Server SiLapor UNESA Berjalan! 🚀');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server Back-End berjalan di port ${PORT}`);
    console.log(`Siap menerima request...`);
});