async function loadPlayers() {
    try {
      const response = await fetch('assets/data/players.xml');
      if (!response.ok) {
        throw new Error(`Failed to fetch players.xml: ${response.status}`);
      }
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Failed to parse XML: Invalid XML format');
      }
  
      const playerNodes = xmlDoc.querySelectorAll('player');
      const players = Array.from(playerNodes).map(node => ({
        name: node.querySelector('name')?.textContent || 'Неизвестный игрок',
        position: node.querySelector('position')?.textContent || 'Неизвестная позиция',
        image: node.querySelector('image')?.textContent || 'https://placehold.co/600x400/EEE/31343C',
        alt: node.querySelector('alt')?.textContent || 'Игрок'
      }));
  
      const swiperWrapper = document.querySelector('.swiper-wrapper');
      players.forEach(player => {
        if (player.name && player.image) {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `
            <div class="player-card">
              <img src="${player.image}" alt="${player.alt}" loading="lazy">
              <div class="player-details">
                <h3>${player.name}</h3>
                <span>${player.position}</span>
              </div>
            </div>
          `;
          swiperWrapper.appendChild(slide);
        } else {
          console.warn(`Skipping player with missing data: ${JSON.stringify(player)}`);
        }
      });
  
      if (players.length >= 2) {
        swiper.autoplay.start();
      }
      swiper.update();
    } catch (error) {
      console.error('Error loading players:', error);
      const swiperWrapper = document.querySelector('.swiper-wrapper');
      swiperWrapper.innerHTML = '<div class="swiper-slide"><p>Ошибка загрузки данных команды. Пожалуйста, попробуйте позже.</p></div>';
      swiper.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
});