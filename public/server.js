const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// API per salvare i dati di una partita
app.post('/saveMatch', (req, res) => {
    const { matchNumber, matchDate, team1Name, team2Name, team1Score, team2Score, winner } = req.body;

    const query = `
        INSERT INTO matches (matchNumber, matchDate, team1Name, team2Name, team1Score, team2Score, winner)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [matchNumber, matchDate, team1Name, team2Name, team1Score, team2Score, winner], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Errore durante il salvataggio della partita.');
        } else {
            res.status(200).send({ id: this.lastID });
        }
    });
});

// API per recuperare le partite
app.get('/getMatches', (req, res) => {
    const query = `SELECT * FROM matches`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Errore durante il recupero delle partite.');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});