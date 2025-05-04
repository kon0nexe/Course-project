document.addEventListener('DOMContentLoaded', () => {
    const scheduleBody = document.getElementById('schedule-body');
    const scheduleList = document.getElementById('schedule-list');
    const monthTitle = document.querySelector('.month-title');
    const prevButton = document.querySelector('.month-prev');
    const nextButton = document.querySelector('.month-next');
    var today = new Date();
    var mm = String(today.getMonth()).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    let currentDate = new Date(yyyy, mm, 1);
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    async function loadScheduleData() {
        try {
            const response = await fetch('assets/data/schedule.xml');
            const xmlText = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(xmlText, 'application/xml');
        } catch (error) {
            console.error('Error loading schedule:', error);
            return null;
        }
    }
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    async function renderSchedule() {
        scheduleBody.innerHTML = '';
        scheduleList.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthTitle.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const xmlDoc = await loadScheduleData();
        const events = xmlDoc ? xmlDoc.getElementsByTagName('event') : [];

        let dayCount = 1;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.classList.add('day');

                const index = row * 7 + col;
                if (index < startOffset || dayCount > daysInMonth) {
                    cell.classList.add('empty');
                } else {
                    const dayNumber = document.createElement('span');
                    dayNumber.classList.add('day-number');
                    dayNumber.textContent = dayCount;
                    cell.appendChild(dayNumber);

                    const eventDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                    for (let event of events) {
                        const date = event.getElementsByTagName('date')[0].textContent;
                        if (date === eventDate) {
                            const match = document.createElement('div');
                            match.classList.add('match', event.getElementsByTagName('type')[0].textContent);
                            match.textContent = event.getElementsByTagName('description')[0].textContent;
                            cell.appendChild(match);
                        }
                    }
                    dayCount++;
                }
                scheduleBody.appendChild(cell);
            }
        }

        const listHeader = document.createElement('div');
        listHeader.classList.add('list-header');
        listHeader.innerHTML = `
            <span>Дата</span>
            <span>Соперник</span>
            <span>Счёт</span>
        `;
        scheduleList.appendChild(listHeader);

        const monthStr = String(month + 1).padStart(2, '0');
        for (let event of events) {
            const date = event.getElementsByTagName('date')[0].textContent;
            if (date.startsWith(`${year}-${monthStr}`) && event.getElementsByTagName('type')[0].textContent !== 'event') {
                const listItem = document.createElement('div');
                listItem.classList.add('list-item');

                const description = event.getElementsByTagName('description')[0].textContent;
                const score = event.getElementsByTagName('score')[0]?.textContent || 'Ожидается';
                const result = event.getElementsByTagName('result')[0]?.textContent || 'pending';

                listItem.innerHTML = `
                    <span class="date">${formatDate(date)}</span>
                    <span class="opponent">${description}</span>
                    <span class="score ${result}">${score}</span>
                `;
                scheduleList.appendChild(listItem);
            }
        }
    }

    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderSchedule();
    });

    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderSchedule();
    });

    renderSchedule();
});