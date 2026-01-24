const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Alamat folder dataJson
const jsonDir = path.join(__dirname, '../dataJson');

/**
 * Endpoint untuk mendapatkan daftar kategori yang tersedia
 * GET /api/categories
*/
router.get('/categories', (req, res) => {
    try {
        const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
        const categories = files.map(f => f.replace('.json', ''));
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Endpoint untuk mendapatkan data spesifik kategori (misal: pasukan)
 * GET /api/data/:categoryName
*/
router.get('/data/:categoryName', (req, res) => {
    const { categoryName } = req.params;
    const filePath = path.join(jsonDir, `${categoryName}.json`);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } else {
        res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
});

module.exports = router;