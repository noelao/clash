const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'DataImage');
const outputDir = path.join(__dirname, 'dataJson');

/**
 * Fungsi rekursif untuk membangun struktur folder/file secara nested
 */
function buildTree(dirPath) {
    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    
    // Path relatif untuk digunakan di frontend/EJS
    const relativePath = path.relative(__dirname, dirPath).replace(/\\/g, '/');

    const item = {
        name: name,
        path: relativePath
    };

    if (stats.isDirectory()) {
        item.type = 'folder';
        // Membaca isi folder dan memetakan setiap anaknya
        item.children = fs.readdirSync(dirPath).map(child => {
            return buildTree(path.join(dirPath, child));
        });
    } else {
        item.type = 'file';
        item.extension = path.extname(dirPath);
        // Di sini kita tidak menambahkan properti 'children'
    }

    return item;
}

// 1. Pastikan folder dataJson ada
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 2. Baca DataImage dan bagi per kategori utama (pasukan, gear, hero, dll)
try {
    const mainCategories = fs.readdirSync(inputDir).filter(item => {
        return fs.statSync(path.join(inputDir, item)).isDirectory();
    });

    mainCategories.forEach(category => {
        const categoryPath = path.join(inputDir, category);
        
        // Membangun pohon data untuk kategori ini
        const treeData = buildTree(categoryPath);

        const outputFile = path.join(outputDir, `${category}.json`);
        
        // Simpan ke file JSON
        fs.writeFileSync(outputFile, JSON.stringify(treeData, null, 4), 'utf-8');
        console.log(`✅ File JSON kategori '${category}' berhasil dibuat.`);
    });

    console.log("\nProses selesai! Folder 'gear' sekarang memiliki data 'children' untuk warden, king, dll.");
} catch (error) {
    console.error("Gagal memetakan folder:", error.message);
}