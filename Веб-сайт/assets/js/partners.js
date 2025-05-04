function loadPartners() {
    const partnersGrid = document.getElementById('partners-grid');
    const partnerImages = Array.from({ length: 38 }, (_, i) => ({
      src: `assets/images/partners/${i + 1}.png`,
      alt: `Partner ${i + 1}`,
      href: '/'
    }));
  
    const rowSizes = [4, 3, 2, 1];
    let imageIndex = 0;
  
    while (imageIndex < partnerImages.length) {
      const partnersRow = document.createElement('div');
      partnersRow.className = 'partners-row';
      const logosInRow = rowSizes[imageIndex % rowSizes.length];
      for (let i = 0; i < logosInRow && imageIndex < partnerImages.length; i++) {
        const { src, alt, href } = partnerImages[imageIndex];
        const partnerLogo = document.createElement('a');
        partnerLogo.className = 'partner-logo';
        partnerLogo.href = href;
        partnerLogo.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy">`;
        const rotation = Math.random() * 10 - 5;
        partnerLogo.querySelector('img').style.transform = `rotate(${rotation}deg)`;
        partnersRow.appendChild(partnerLogo);
        imageIndex++;
      }
      partnersGrid.appendChild(partnersRow);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPartners();
});