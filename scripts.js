document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const teamsList = document.getElementById('teams-list');
    const drawMatchesButton = document.getElementById('draw-matches');
    const matchesList = document.getElementById('matches-list');
    const resultsForm = document.getElementById('results-form');
    const standingsList = document.getElementById('standings-list');

    let teams = [];
    let matches = [];
    let results = {};

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const teamName = document.getElementById('team-name').value;
        const player1 = document.getElementById('player1').value;
        const player2 = document.getElementById('player2').value;

        teams.push({ teamName, player1, player2, enabled: true });
        updateTeamsList();
        registerForm.reset();
    });

    drawMatchesButton.addEventListener('click', () => {
        matches = [];
        const activeTeams = teams.filter(team => team.enabled);
        if (activeTeams.length < 2) {
            alert('Se necesitan al menos 2 equipos habilitados para sortear partidos.');
            return;
        }
        for (let i = 0; i < activeTeams.length; i++) {
            for (let j = i + 1; j < activeTeams.length; j++) {
                matches.push({ team1: activeTeams[i], team2: activeTeams[j] });
            }
        }
        updateMatchesList();
    });

    function updateTeamsList() {
        teamsList.innerHTML = '';
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.textContent = `${team.teamName}: ${team.player1}, ${team.player2}`;
            if (!team.enabled) {
                li.classList.add('disabled');
            }
            teamsList.appendChild(li);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = team.enabled ? 'Deshabilitar' : 'Habilitar';
            toggleButton.classList.add('toggle-disable');
            toggleButton.addEventListener('click', () => {
                teams[index].enabled = !teams[index].enabled;
                updateTeamsList();
            });
            li.appendChild(toggleButton);
        });
    }

    function updateMatchesList() {
        matchesList.innerHTML = '';
        matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.textContent = `${match.team1.teamName} vs ${match.team2.teamName}`;
            matchesList.appendChild(li);

            const resultButton = document.createElement('button');
            resultButton.textContent = 'Registrar Resultado';
            resultButton.addEventListener('click', () => registerResult(index));
            li.appendChild(resultButton);
        });
    }

    function registerResult(matchIndex) {
        resultsForm.innerHTML = '';
        const match = matches[matchIndex];
        const form = document.createElement('form');

        const team1Label = document.createElement('label');
        team1Label.textContent = `Resultado de ${match.team1.teamName}:`;
        const team1Input = document.createElement('input');
        team1Input.type = 'number';
        team1Input.min = 0;
        team1Input.required = true;

        const team2Label = document.createElement('label');
        team2Label.textContent = `Resultado de ${match.team2.teamName}:`;
        const team2Input = document.createElement('input');
        team2Input.type = 'number';
        team2Input.min = 0;
        team2Input.required = true;

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Guardar Resultado';
        submitButton.type = 'submit';

        form.appendChild(team1Label);
        form.appendChild(team1Input);
        form.appendChild(team2Label);
        form.appendChild(team2Input);
        form.appendChild(submitButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            results[matchIndex] = {
                team1: parseInt(team1Input.value),
                team2: parseInt(team2Input.value)
            };
            updateStandings();
            resultsForm.innerHTML = '';
        });

        resultsForm.appendChild(form);
    }

    function updateStandings() {
        standingsList.innerHTML = '';
        let standings = teams.map(team => ({
            teamName: team.teamName,
            played: 0,
            won: 0,
            lost: 0,
            points: 0
        }));

        matches.forEach((match, index) => {
            if (results[index]) {
                const result = results[index];
                const team1 = standings.find(t => t.teamName === match.team1.teamName);
                const team2 = standings.find(t => t.teamName === match.team2.teamName);

                team1.played++;
                team2.played++;

                if (result.team1 > result.team2) {
                    team1.won++;
                    team2.lost++;
                    team1.points += 3;
                } else if (result.team1 < result.team2) {
                    team2.won++;
                    team1.lost++;
                    team2.points += 3;
                } else {
                    team1.points++;
                    team2.points++;
                }
            }
        });

        standings.sort((a, b) => b.points - a.points);

        standings.forEach(team => {
            const li = document.createElement('li');
            li.textContent = `${team.teamName}: ${team.points} puntos (Jugados: ${team.played}, Ganados: ${team.won}, Perdidos: ${team.lost})`;
            standingsList.appendChild(li);
        });
    }
});
