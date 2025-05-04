const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a[href^="#"]:not(.dropdown-toggle)');
const backToTopButton = document.querySelector('.back-to-top');
const dropdownToggle = document.querySelector('.dropdown-toggle');


document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.querySelector(".preloader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("preloader--hidden");
      preloader.addEventListener("transitionend", () => {
        preloader.remove();
        document.body.style.overflow = "auto";
      });
    }, 1000);
  });
});


if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (dropdownToggle) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault(); 
    const dropdown = dropdownToggle.parentElement; 
    dropdown.classList.toggle('active');
    const isExpanded = dropdown.classList.contains('active');
    dropdownToggle.setAttribute('aria-expanded', isExpanded);
    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
      if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
        otherDropdown.classList.remove('active');
        otherDropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const headerHeight = document.querySelector('.header').offsetHeight;

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: 'smooth'
      });

      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
      const dropdown = link.closest('.dropdown');
      if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      }
    }
  });
});

document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && dropdown.classList.contains('active') && !e.target.closest('.dropdown')) {
    dropdown.classList.remove('active');
    dropdownToggle.setAttribute('aria-expanded', 'false');
  }
});

if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}