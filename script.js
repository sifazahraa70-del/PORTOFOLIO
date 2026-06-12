// script.js
const landing = document.getElementById('landing');
const portfolio = document.getElementById('portfolio');
const enterBtn = document.getElementById('enterBtn');
const calendarToggle = document.getElementById('calendarToggle');
const calendarModal = document.getElementById('calendarModal');
const calendarYears = document.getElementById('calendarYears');
const calendarModalTitle = document.getElementById('calendarModalTitle');
const calendarYearSelect = document.getElementById('calendarYearSelect');
const calendarMonthSelect = document.getElementById('calendarMonthSelect');
const calendarTodayLabel = document.getElementById('calendarTodayLabel');
const calendarNextLabel = document.getElementById('calendarNextLabel');
const calendarWeekdayLabel = document.getElementById('calendarWeekdayLabel');
const themeToggle = document.getElementById('themeToggle');
const rotateCardBtn = document.getElementById('rotateCardBtn');
const lanyardCard = document.getElementById('lanyardCard');
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalDesc = document.getElementById('certModalDesc');
const backToProfileBtn = document.getElementById('backToProfileBtn');
const lanyardScene = document.getElementById('lanyardScene');

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
const longDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});
const weekdayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' });
const CALENDAR_YEAR_SPAN = 20;

function formatUppercaseDate(date) {
  return longDateFormatter.format(date).toUpperCase();
}

function normalizeCapitalization(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createMonthCard(year, monthIndex, today) {
  const card = document.createElement('article');
  card.className = 'calendar-month';
  card.dataset.calendarYear = String(year);
  card.dataset.calendarMonth = String(monthIndex);

  const title = document.createElement('h4');
  title.textContent = `${normalizeCapitalization(monthFormatter.format(new Date(year, monthIndex, 1)))} ${year}`;

  const grid = document.createElement('div');
  grid.className = 'calendar-month__grid';

  ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'].forEach((dayLabel) => {
    const header = document.createElement('span');
    header.className = 'calendar-month__weekday';
    header.textContent = dayLabel;
    grid.appendChild(header);
  });

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;

  for (let emptyIndex = 0; emptyIndex < offset; emptyIndex += 1) {
    const placeholder = document.createElement('span');
    placeholder.className = 'calendar-month__day calendar-month__day--empty';
    grid.appendChild(placeholder);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayButton = document.createElement('span');
    const date = new Date(year, monthIndex, day);
    dayButton.className = 'calendar-month__day';
    dayButton.textContent = String(day);

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      dayButton.classList.add('is-today');
      card.classList.add('is-selected');
    }

    grid.appendChild(dayButton);
  }

  card.append(title, grid);
  return card;
}

function populateCalendarControls(currentYear, today) {
  if (!calendarYearSelect || !calendarMonthSelect) return;

  calendarYearSelect.innerHTML = '';
  for (let year = currentYear; year < currentYear + CALENDAR_YEAR_SPAN; year += 1) {
    const option = document.createElement('option');
    option.value = String(year);
    option.textContent = String(year);
    calendarYearSelect.appendChild(option);
  }

  calendarMonthSelect.innerHTML = '';
  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const option = document.createElement('option');
    option.value = String(monthIndex);
    option.textContent = normalizeCapitalization(monthFormatter.format(new Date(currentYear, monthIndex, 1)));
    calendarMonthSelect.appendChild(option);
  }

  calendarYearSelect.value = String(currentYear);
  calendarMonthSelect.value = String(today.getMonth());
}

function jumpToSelectedMonth() {
  const selectedYear = Number(calendarYearSelect?.value);
  const selectedMonth = Number(calendarMonthSelect?.value);
  if (!Number.isFinite(selectedYear) || !Number.isFinite(selectedMonth)) return;

  document.querySelectorAll('.calendar-month.is-selected').forEach((monthCard) => {
    monthCard.classList.remove('is-selected');
  });

  const target = document.querySelector(
    `.calendar-month[data-calendar-year="${selectedYear}"][data-calendar-month="${selectedMonth}"]`
  );

  if (target) {
    target.classList.add('is-selected');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function renderCalendarYears(today) {
  if (!calendarYears) return;

  const currentYear = today.getFullYear();
  const lastYear = currentYear + CALENDAR_YEAR_SPAN - 1;

  calendarModalTitle.textContent = `Kalender ${currentYear} - ${lastYear}`;
  calendarTodayLabel.textContent = formatUppercaseDate(today);
  calendarNextLabel.textContent = formatUppercaseDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  );
  calendarWeekdayLabel.textContent = normalizeCapitalization(weekdayFormatter.format(today));
  document.getElementById('landingDateText').textContent = formatUppercaseDate(today);
  populateCalendarControls(currentYear, today);

  calendarYears.innerHTML = '';

  for (let year = currentYear; year < currentYear + CALENDAR_YEAR_SPAN; year += 1) {
    const section = document.createElement('section');
    section.className = 'calendar-year';

    const heading = document.createElement('div');
    heading.className = 'calendar-year__heading';

    const title = document.createElement('h4');
    title.textContent = year;

    const description = document.createElement('span');
    description.textContent = year === currentYear ? 'Tahun berjalan' : 'Tahun berikutnya';

    heading.append(title, description);

    const months = document.createElement('div');
    months.className = 'calendar-year__months';

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      months.appendChild(createMonthCard(year, monthIndex, today));
    }

    section.append(heading, months);
    calendarYears.appendChild(section);
  }
}

function openCalendarModal() {
  calendarModal.classList.add('is-open');
  calendarModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  jumpToSelectedMonth();
}

function closeCalendarModal() {
  calendarModal.classList.remove('is-open');
  calendarModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

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
  const prefersLight =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark');
}

function showPortfolio() {
  landing.classList.remove('active');
  portfolio.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Init calendar + navigation ----
const today = new Date();
renderCalendarYears(today);

enterBtn.addEventListener('click', showPortfolio);

calendarToggle.addEventListener('click', openCalendarModal);

calendarYearSelect.addEventListener('change', jumpToSelectedMonth);
calendarMonthSelect.addEventListener('change', jumpToSelectedMonth);

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
});

function stopSwayAndReset() {
  lanyardCard.classList.remove('is-swaying');
  lanyardCard.style.animation = 'none';
  lanyardCard.style.transition = 'none';
  lanyardCard.style.transform = 'rotateX(10deg) rotateY(0deg)';
}

let rotateCardClickCount = 0;
rotateCardBtn.addEventListener('click', () => {
  rotateCardClickCount += 1;

  // Sesuai request: klik ganjil = ON (gerak muncul), klik genap = OFF (gerak mati)
  const shouldBeActive = rotateCardClickCount % 2 === 1;

  if (!shouldBeActive) {
    // OFF: matikan semua efek animasi/transform termasuk sisa dari mousemove
    lanyardCard.classList.remove('is-drop');
    lanyardCard.classList.remove('is-swaying');
    if (lanyardScene) lanyardScene.classList.remove('is-swaying');

    lanyardCard.style.animation = 'none';
    lanyardCard.style.transition = 'none';
    lanyardCard.style.transform = 'rotateX(10deg) rotateY(0deg)';
    return;
  }

  // ON: nyalakan state
  lanyardCard.classList.add('is-swaying');
  if (lanyardScene) lanyardScene.classList.add('is-swaying');

  // restart drop animation setiap klik ON
  lanyardCard.classList.remove('is-drop');
  lanyardCard.offsetHeight; // force reflow
  lanyardCard.classList.add('is-drop');

  // reset pose dasar
  lanyardCard.style.animation = '';
  lanyardCard.style.transition = '';
  lanyardCard.style.transform = 'rotateX(10deg) rotateY(0deg)';
});

// smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
initTheme();

// certificates modal
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

calendarModal.querySelectorAll('[data-calendar-close]').forEach((element) => {
  element.addEventListener('click', closeCalendarModal);
});

backToProfileBtn.addEventListener('click', () => {
  backToProfileBtn.classList.add('is-animating');
  window.setTimeout(() => backToProfileBtn.classList.remove('is-animating'), 900);
  closeCertModal();
  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (certModal.classList.contains('is-open')) {
    closeCertModal();
    return;
  }
  if (calendarModal.classList.contains('is-open')) {
    closeCalendarModal();
  }
});

calendarModal.addEventListener('click', (event) => {
  if (event.target === calendarModal) {
    closeCalendarModal();
  }
});

// Smooth parallax lanyard movement
if (lanyardScene) {
  lanyardScene.addEventListener('mousemove', (e) => {
    if (lanyardCard.classList.contains('is-swaying')) return;
    const rect = lanyardScene.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    lanyardCard.style.transform = `rotateX(${10 - y}deg) rotateY(${x}deg) translateY(0)`;
  });

  lanyardScene.addEventListener('mouseleave', () => {
    if (lanyardCard.classList.contains('is-swaying')) return;
    lanyardCard.style.transform = 'rotateX(10deg) rotateY(0deg)';
  });
}

window.addEventListener('load', () => {
  const card = document.getElementById('lanyardCard');
  setTimeout(() => {
    card.style.transition = 'transform .3s ease';
  }, 2000);
});

// ---- CV download (klik tombol otomatis unduh PDF) ----
const downloadCvLink = document.getElementById('downloadCvLink');
if (downloadCvLink) {
  downloadCvLink.addEventListener('click', (e) => {
    e.preventDefault();

    const pdfUrl = 'cvluthfiazahra.pdf';
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'cvluthfiazahra.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

// Music toggle (putar audio loop dekat tombol theme)
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

if (musicToggle && bgMusic) {
  // default: mati
  bgMusic.pause();

  // cinta meletus saat tombol musik diklik
  const spawnHearts = () => {
    const rect = musicToggle.getBoundingClientRect();
    const totalCount = 28;

    // Biar emoji tidak terlalu cepat: delay stagger + durasi lebih panjang
    const baseDelay = 40; // ms
    const stagger = 10; // ms
    const baseDuration = 700; // ms
    const durationJitter = 350; // ms

    for (let i = 0; i < totalCount; i += 1) {
      const heart = document.createElement('span');
      heart.textContent = '🎵';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
      heart.style.top = `${rect.top + rect.height / 2 + (Math.random() * 16 - 8)}px`;
      heart.style.fontSize = `${12 + Math.random() * 18}px`;
      heart.style.opacity = '1';
      heart.style.zIndex = '9999';
      heart.style.pointerEvents = 'none';
      heart.style.transform = 'translate(-50%, -50%)';

      const dx = Math.random() * 160 - 80;
      const dy = -(80 + Math.random() * 140);
      const rotate = Math.random() * 50 - 25;
      const duration = baseDuration + Math.random() * durationJitter;
      const delay = baseDelay + i * stagger;

      heart.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity ${duration}ms ease ${delay}ms, filter ${duration}ms ease ${delay}ms`;
      heart.style.filter = 'drop-shadow(0 8px 10px rgba(236,72,153,.25))';

      document.body.appendChild(heart);

      // start animation after delay
      window.setTimeout(() => {
        heart.style.opacity = '0';
        heart.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg) scale(1.15)`;
      }, delay);

      window.setTimeout(() => {
        heart.remove();
      }, delay + duration + 60);
    }
  };

  musicToggle.addEventListener('click', async () => {
    spawnHearts();

    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        musicToggle.textContent = '⏸';
      } else {
        bgMusic.pause();
        musicToggle.textContent = '♫';
      }
    } catch {
      // autoplay sering diblok oleh browser; tampilkan ikon tetap
      musicToggle.textContent = '♫';
    }
  });
}


// Contact form: submit langsung ke Formspree via attribute `action` pada <form> (tidak di-intercept di sini).
const contactForm = document.getElementById('contactForm');
const contactEmailEl = document.getElementById('contactEmail');
const contactMessageEl = document.getElementById('contactMessage');

if (contactForm && contactEmailEl && contactMessageEl) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value?.trim() || '';
    const fromEmail = contactEmailEl.value.trim();
    const message = contactMessageEl.value.trim();

    const formspreeUrl = 'https://formspree.io/f/xdavlvkl';
    const formData = new FormData(contactForm);

    formData.set('name', name);
    formData.set('email', fromEmail);
    formData.set('message', message);

    fetch(formspreeUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(() => {
        contactForm.reset();
        window.alert('Pesan berhasil dikirim!');
      })
      .catch(() => {
        window.alert('Gagal mengirim pesan. Coba lagi.');
      });
  });
}

