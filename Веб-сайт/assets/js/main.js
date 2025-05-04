const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      939: {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      },
    }
  });
  
  const animateElements = document.querySelectorAll('.animate-in');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  animateElements.forEach(el => observer.observe(el));
  
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryImages = [
    'assets/images/moments/1.jpg',
    'assets/images/moments/2.jpg',
    'assets/images/moments/3.jpg',
    'assets/images/moments/4.jpg',
  ];
  
  galleryImages.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Игровой момент';
    img.loading = 'lazy';
    galleryGrid.appendChild(img);
  });
  
  const statsGrid = document.getElementById('stats-grid');
  const statsData = [
    { title: 'Матчи', value: 45 },
    { title: 'Победы', value: 30 },
    { title: 'Голы', value: 120 },
    { title: 'Зрители', value: 15000 },
  ];
  
  statsData.forEach(stat => {
    const statCard = document.createElement('div');
    statCard.className = 'stat-card';
    statCard.innerHTML = `<h3>${stat.title}</h3><p>${stat.value}</p>`;
    statsGrid.appendChild(statCard);
  });