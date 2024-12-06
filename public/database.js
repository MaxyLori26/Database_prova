const sqlite3 = require('sqlite3').verbose();

// Creazione del database
const db = new sqlite3.Database('./fantavolley.db', (err) => {
    if (err) {
        console.error('Errore nella connessione al database:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
    }
});

// Creazione della tabella
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matchNumber INTEGER,
            matchDate TEXT,
            team1Name TEXT,
            team2Name TEXT,
            team1Score INTEGER,
            team2Score INTEGER,
            winner TEXT
        )
    `);
});

module.exports = db;
