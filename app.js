const express = require('express');
const path = require('path');
const app = express();

// Import Router API
const apiRouter = require('./routes/api');

// Konfigurasi EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/DataImage', express.static(path.join(__dirname, 'DataImage')));

// Pasang Router API
app.use('/api', apiRouter);

// Route Utama menggunakan EJS
app.get('/', (req, res) => {
    // Kita render file views/slot.ejs
    res.render('slot', { 
        title: "clash of Elplongor" 
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server EJS aktif di http://localhost:${PORT}`);
});