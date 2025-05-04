document.addEventListener('DOMContentLoaded', () => {   
    fetch('assets/data/players.xml')
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const players = xml.getElementsByTagName('player');

            const goalkeepers = [];
            const defenders = [];
            const attackers = [];

            Array.from(players).forEach(player => {
                const position = player.getElementsByTagName('position')[0].textContent;
                const playerData = {
                    name: player.getElementsByTagName('name')[0].textContent,
                    image: player.getElementsByTagName('image')[0].textContent,
                    alt: player.getElementsByTagName('alt')[0].textContent,
                    number: player.getElementsByTagName('number')[0].textContent,
                    age: parseInt(player.getElementsByTagName('age')[0].textContent),
                    country: player.getElementsByTagName('country')[0].textContent
                };

                if (position === 'Вратарь') {
                    goalkeepers.push(playerData);
                } else if (position === 'Защитник') {
                    defenders.push(playerData);
                } else if (position === 'Нападающий') {
                    attackers.push(playerData);
                }
            });

            function getAgeText(age) {
                if (age % 10 === 1 && age % 100 !== 11) {
                    return `${age} год`;
                } else if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) {
                    return `${age} года`;
                } else {
                    return `${age} лет`;
                }
            }

            function generatePlayerHTML(player) {
                return `
                    <div class="player-card">
                        <div class="player-image-wrapper">
                            <img src="${player.image}" alt="${player.alt}" class="player-image">
                            <span class="player-number">${player.number}</span>
                        </div>
                        <h3 class="player-name">${player.name}</h3>
                        <p class="player-info">${getAgeText(player.age)}, ${player.country}</p>
                    </div>
                `;
            }

            const gkGrid = document.getElementById('gk_personal-grid');
            const defGrid = document.getElementById('def_personal-grid');
            const atGrid = document.getElementById('at_personal-grid');

            gkGrid.innerHTML = goalkeepers.map(generatePlayerHTML).join('');
            defGrid.innerHTML = defenders.map(generatePlayerHTML).join('');
            atGrid.innerHTML = attackers.map(generatePlayerHTML).join('');
        })
        .catch(error => console.error('Error loading players.xml:', error));
});

const filterButtons = document.querySelectorAll('.left-30');

const playerSections = document.querySelectorAll('#gk_personal, #def_personal, #at_personal');

function filterPlayers(filter) {
    filterButtons.forEach(button => button.classList.remove('active'));

    const activeButton = document.querySelector(`.left-30[data-filter="${filter}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    if (filter === 'all') {
        playerSections.forEach(section => section.classList.remove('hidden'));
    } else {
        const sectionFilter = {
            'Вратарь': 'gk_personal',
            'Защитник': 'def_personal',
            'Нападающий': 'at_personal'
        };
        playerSections.forEach(section => {
            if (section.id === sectionFilter[filter]) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
}

filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const filter = button.getAttribute('data-filter');
        filterPlayers(filter);
    });
});

filterPlayers('all');