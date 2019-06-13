// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;


// ===========================
// Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Base de datos
// ===========================

let urlDB;
let usuario = 'cafe-usuario';
let password = 'l12asup';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = `mongodb+srv://${usuario}:${password}@cluster0-u37ql.mongodb.net/cafe`;
}

// mongodb + srv: //kay:myRealPassword@cluster0.mongodb.net/admin

process.env.URLDB = urlDB;