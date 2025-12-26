const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; 
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors()); 
app.use(bodyParser.json({ limit: '10mb' })); 

const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 1. GET: Ambil Semua Laporan
app.get('/api/reports', (req, res) => {
    const reports = readData();

    console.log('\n===================================');
    console.log(`📥 [REQUEST] GET /api/reports diterima pada ${new Date().toLocaleTimeString()}`);
    console.log('📦 DATA JSON YANG DIKIRIM KE CLIENT:');
    console.log(JSON.stringify(reports, null, 2));
    console.log('===================================\n');

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

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server Back-End berjalan di http://localhost:${PORT}`);
    console.log(`Siap menerima request dari Front-End...`);
});