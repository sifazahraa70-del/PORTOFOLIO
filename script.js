// script.js
const landing = document.getElementById('landing');
const portfolio = document.getElementById('portfolio');
const enterBtn = document.getElementById('enterBtn');
const themeToggle = document.getElementById('themeToggle');
const rotateCardBtn = document.getElementById('rotateCardBtn');
const lanyardCard = document.getElementById('lanyardCard');
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalDesc = document.getElementById('certModalDesc');
const backToProfileBtn = document.getElementById('backToProfileBtn');

function openCertModal(card) {
  const image = card.querySelector('.cert-thumb__image');
  const title = card.dataset.certTitle || card.querySelector('h4')?.textContent || 'Sertifikat';
  const desc = card.dataset.certDesc || card.querySelector('p')?.textContent || '';
  certModalImage.src = image?.src || '';
  certModalImage.alt = image?.alt || title;
  certModalTitle.textContent = title;
  certModalDesc.textContent = desc;
  certModal.classList.add('is-open');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeCertModal() {
  certModal.classList.remove('is-open');
  certModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('portfolio-theme', theme);
  themeToggle.textContent = theme === 'light' ? '☀' : '☾';
}

function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    setTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark');
}

function showPortfolio() {
  landing.classList.remove('active');
  portfolio.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

enterBtn.addEventListener('click', showPortfolio);

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
});

rotateCardBtn.addEventListener('click', () => {
  lanyardCard.classList.toggle('rotated');
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
initTheme();

document.querySelectorAll('.cert-card').forEach((card) => {
  card.addEventListener('click', () => openCertModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCertModal(card);
    }
  });
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
});

certModal.querySelectorAll('[data-cert-close]').forEach((element) => {
  element.addEventListener('click', closeCertModal);
});

backToProfileBtn.addEventListener('click', () => {
  backToProfileBtn.classList.add('is-animating');
  window.setTimeout(() => backToProfileBtn.classList.remove('is-animating'), 900);
  closeCertModal();
  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && certModal.classList.contains('is-open')) {
    closeCertModal();
  }
});

// Smooth parallax lanyard movement
const scene = document.getElementById('lanyardScene');
if (scene) {
  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    lanyardCard.style.transform = `rotateX(${10 - y}deg) rotateY(${x}deg) translateY(0)`;
  });

  scene.addEventListener('mouseleave', () => {
    lanyardCard.style.transform = document.body.classList.contains('light')
      ? 'rotateX(10deg) rotateY(0deg)'
      : 'rotateX(10deg) rotateY(0deg)';
    if (lanyardCard.classList.contains('rotated')) {
      lanyardCard.style.transform = 'rotateX(10deg) rotateY(14deg)';
    }
  });
}
window.addEventListener('load', () => {
  const card = document.getElementById('lanyardCard');

  setTimeout(() => {
    card.style.transition = 'transform .3s ease';
  }, 2000);
});