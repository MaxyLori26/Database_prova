let matches = [];

function calculateWinner() {
    const matchNumber = document.getElementById('matchNumber').value;
    const matchDate = document.getElementById('matchDate').value;
    const team1Score = parseInt(document.getElementById('team1Score').value);
    const team2Score = parseInt(document.getElementById('team2Score').value);
    const team1Penalty = parseInt(document.getElementById('team1Penalty').value) || 0;
    const team2Penalty = parseInt(document.getElementById('team2Penalty').value) || 0;

    const adjustedTeam1Score = team1Score - team1Penalty;
    const adjustedTeam2Score = team2Score - team2Penalty;

    const winner = adjustedTeam1Score > adjustedTeam2Score ? localStorage.getItem('team1Name') : localStorage.getItem('team2Name');
    document.getElementById('winnerMessage').textContent = `${winner} è la squadra vincitrice!`;

    matches.push({
        matchNumber,
        matchDate,
        team1Score,
        team2Score,
        winner,
    });

    localStorage.setItem('matches', JSON.stringify(matches));
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('storico.html')) {
        const matches = JSON.parse(localStorage.getItem('matches')) || [];
        const tableBody = document.querySelector('#matchHistoryTable tbody');
        matches.forEach(match => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${match.matchNumber}</td>
                <td>${match.matchDate || 'Non disponibile'}</td>
                <td>${localStorage.getItem('team1Name')}</td>
                <td>${localStorage.getItem('team2Name')}</td>
                <td>${match.team1Score} - ${match.team2Score}</td>
                <td>${match.winner}</td>
            `;
        });
    }
});

function saveTeams() {
    const team1Name = document.getElementById('team1Name').value.trim();
    const team2Name = document.getElementById('team2Name').value.trim();

    if (team1Name && team2Name) {
        // Salviamo i nomi delle squadre nel localStorage
        localStorage.setItem('team1Name', team1Name);
        localStorage.setItem('team2Name', team2Name);
        // Reindirizza alla pagina per inserire il punteggio
        window.location.href = 'partita.html';
    } else {
        alert('Inserisci i nomi di entrambe le squadre per continuare.');
    }
}

function viewHistory() {
    // Verifica se i dati delle partite sono stati salvati correttamente
    const matches = JSON.parse(localStorage.getItem('matches')) || [];
    if (matches.length > 0) {
        window.location.href = 'storico.html';
    } else {
        alert('Nessuna partita registrata. Inserisci i punteggi prima di visualizzare lo storico.');
    }
}

function saveMatchToDatabase() {
    const matchNumber = document.getElementById('matchNumber').value;
    const matchDate = document.getElementById('matchDate').value;
    const team1Name = localStorage.getItem('team1Name');
    const team2Name = localStorage.getItem('team2Name');
    const team1Score = parseInt(document.getElementById('team1Score').value);
    const team2Score = parseInt(document.getElementById('team2Score').value);
    const team1Penalty = parseInt(document.getElementById('team1Penalty').value) || 0;
    const team2Penalty = parseInt(document.getElementById('team2Penalty').value) || 0;

    const adjustedTeam1Score = team1Score - team1Penalty;
    const adjustedTeam2Score = team2Score - team2Penalty;
    const winner = adjustedTeam1Score > adjustedTeam2Score ? team1Name : team2Name;

    const matchData = {
        matchNumber,
        matchDate,
        team1Name,
        team2Name,
        team1Score,
        team2Score,
        winner
    };

    fetch('http://localhost:3000/saveMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
    })
    .then(response => {
        if (response.ok) {
            alert('Partita salvata con successo!');
        } else {
            alert('Errore durante il salvataggio della partita.');
        }
    })
    .catch(error => {
        console.error('Errore durante la connessione al server:', error);
    });
}

function loadMatchHistory() {
    fetch('http://localhost:3000/getMatches')
        .then(response => response.json())
        .then(matches => {
            const tableBody = document.querySelector('#matchHistoryTable tbody');
            tableBody.innerHTML = ''; // Pulisce la tabella

            matches.forEach(match => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${match.matchNumber}</td>
                    <td>${match.matchDate}</td>
                    <td>${match.team1Name}</td>
                    <td>${match.team2Name}</td>
                    <td>${match.team1Score} - ${match.team2Score}</td>
                    <td>${match.winner}</td>
                `;
            });
        })
        .catch(error => {
            console.error('Errore durante il caricamento dello storico:', error);
        });
}
