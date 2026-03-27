// ОПТИМИЗИРОВАННЫЙ СКРИПТ
const isMobile = window.innerWidth < 768;
const isSlowDevice = navigator.deviceMemory && navigator.deviceMemory < 4;

// Частицы только на мощных устройствах
if (!isMobile && !isSlowDevice) {
  const container = document.getElementById('particles');
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const s = Math.random() * 3 + 1;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = Math.random() * 12 + 8 + 's';
    p.style.animationDelay = Math.random() * 8 + 's';
    container.appendChild(p);
  }
} else {
  document.getElementById('particles').style.display = 'none';
}

// NAVIGATION
function toggleNav() { document.getElementById('navLinks').classList.toggle('open'); }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

const navbar = document.getElementById('navbar');
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, 10);
}, { passive: true });

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) scrollBtn.classList.add('show');
  else scrollBtn.classList.remove('show');
});

// MODALS
let activeModal = null;
function openModal(type) {
  activeModal = type;
  const el = document.getElementById(type + 'Modal');
  el.style.display = 'flex';
  setTimeout(() => el.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}
function closeModal(type) {
  const el = document.getElementById(type + 'Modal');
  el.classList.remove('active');
  setTimeout(() => { el.style.display = 'none'; document.body.style.overflow = 'auto'; }, 200);
  activeModal = null;
}
function openPrivacy() { openModal('privacy'); }
function closePrivacy() { closeModal('privacy'); }

// TELEGRAM (вставьте свои данные)
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_CHAT_ID_HERE';
async function sendToTelegram(name, phone, service, date, time, people, comment) {
  if (BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
    const msg = `📅 НОВАЯ ЗАЯВКА\n👤 ${name}\n📞 ${phone}\n🎮 ${service}\n📆 ${date || '—'} ${time || '—'}\n👥 ${people || '1'}\n💬 ${comment || '—'}`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
      });
    } catch(e) {}
  }
}
function submitBooking(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (!name || !phone) { alert('Заполните имя и телефон'); return; }
  sendToTelegram(name, phone, document.getElementById('service').value, document.getElementById('date').value, document.getElementById('time').value, document.getElementById('people').value, document.getElementById('comment').value);
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
  setTimeout(() => {
    closeModal('booking');
    setTimeout(() => {
      document.getElementById('bookingForm').reset();
      document.getElementById('bookingForm').style.display = 'block';
      document.getElementById('bookingSuccess').style.display = 'none';
    }, 200);
  }, 1500);
}
function quickBooking() {
  const phone = document.getElementById('widgetPhone').value.trim();
  if (!phone) { alert('Введите номер'); return; }
  openModal('booking');
  document.getElementById('phone').value = phone;
}

// CERTIFICATE
let currentCertType = null;
function selectCert(type) {
  currentCertType = type;
  document.getElementById('certForm').style.display = 'block';
  document.getElementById('certPreview').style.display = 'block';
  document.getElementById('certAmount').textContent = '750₽';
  document.getElementById('certTypeLabel').textContent = 'VR КОМПЛЕКТ 1 час';
  updateCertPreview();
  generateCertNumber();
}
function generateCertNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  document.getElementById('certNumber').textContent = `PARADOX-${year}-${random}`;
}
function updateCertPreview() {
  const to = document.getElementById('certTo').value || '[Имя получателя]';
  const from = document.getElementById('certFrom').value || '[Ваше имя]';
  const wish = document.getElementById('certWish').value;
  document.getElementById('certRecipientName').innerHTML = `Для: ${to}`;
  document.getElementById('certFromName').textContent = from;
  if (wish) {
    document.getElementById('certWishText').style.display = 'block';
    document.getElementById('certWishText').textContent = `«${wish}»`;
  } else {
    document.getElementById('certWishText').style.display = 'none';
  }
}
function processCertificate() {
  const to = document.getElementById('certTo').value.trim();
  const from = document.getElementById('certFrom').value.trim();
  const phone = document.getElementById('certPhone').value.trim();
  if (!to || !from || !phone) { alert('Заполните все поля'); return; }
  if (confirm(`Сертификат на сумму 750₽ будет оплачен. После подтверждения оплаты вы сможете скачать PDF.`)) {
    downloadCertificatePDF();
  } else {
    alert('Оплата отменена.');
  }
}
function downloadCertificatePDF() {
  const element = document.getElementById('certPreview');
  const recipient = document.getElementById('certTo').value || 'Друг';
  const opt = {
    margin: 12,
    filename: `Sertifikat_PARADOX_${recipient}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 1.8, backgroundColor: '#1a0033' },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  html2pdf().set(opt).from(element).save();
  setTimeout(() => closeModal('certificate'), 500);
}

// INVITATION
function updateInvPreview() {
  const name = document.getElementById('invName').value || '[Имя]';
  const dt = document.getElementById('invDateTime').value;
  const from = document.getElementById('invFrom').value || '[Ваше имя]';
  const phone = document.getElementById('invPhone').value || '+7 923 244-02-20';
  const guests = document.getElementById('invGuests').value || '1';
  document.getElementById('previewInvName').textContent = name;
  if (dt) {
    const d = new Date(dt);
    const formatted = d.toLocaleString('ru-RU', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
    document.getElementById('previewDateTime').textContent = '📅 ' + formatted;
  } else {
    document.getElementById('previewDateTime').textContent = '📅 Дата не выбрана';
  }
  document.getElementById('previewFrom').textContent = from;
  document.getElementById('previewPhone').textContent = phone;
  document.getElementById('previewGuests').textContent = `Гостей: ${guests}`;
}
function downloadInvitation(e) {
  e.preventDefault();
  const name = document.getElementById('invName').value.trim();
  const dt = document.getElementById('invDateTime').value;
  const from = document.getElementById('invFrom').value.trim();
  const phone = document.getElementById('invPhone').value.trim();
  if (!name || !dt || !from || !phone) { alert('Заполните все поля'); return; }
  const element = document.getElementById('invPreview');
  const opt = {
    margin: 12,
    filename: `Priglashenie_${name}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 1.8 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  html2pdf().set(opt).from(element).save();
  setTimeout(() => closeModal('invitation'), 500);
}

document.getElementById('certTo')?.addEventListener('input', updateCertPreview);
document.getElementById('certFrom')?.addEventListener('input', updateCertPreview);
document.getElementById('certWish')?.addEventListener('input', updateCertPreview);
document.getElementById('invName')?.addEventListener('input', updateInvPreview);
document.getElementById('invDateTime')?.addEventListener('input', updateInvPreview);
document.getElementById('invFrom')?.addEventListener('input', updateInvPreview);
document.getElementById('invPhone')?.addEventListener('input', updateInvPreview);
document.getElementById('invGuests')?.addEventListener('input', updateInvPreview);

// GAMES DATA
const gamesLib = {
  vr: [
    {name:"Job Simulator",desc:"Классика VR-юмора",img:"💼"},
    {name:"I am CAT",desc:"Приключения кота в VR",img:"🐱"},
    {name:"Island Time",desc:"Отдых на острове",img:"🏝️"},
    {name:"Throw Anything",desc:"Бросай всё что угодно",img:"💥"},
    {name:"Extreme Escape",desc:"Экстремальный побег",img:"🚀"},
    {name:"Gun Raiders",desc:"Динамичный шутер",img:"🔫"},
    {name:"The Climb",desc:"Скалолазание",img:"🧗"},
    {name:"Five Nights at Freddy's",desc:"Хоррор от первого лица",img:"👻"},
    {name:"Creed: Rise to Glory",desc:"Боксёрский симулятор",img:"🥊"},
    {name:"Beat Saber",desc:"Ритм-игра с мечами",img:"⚔️"},
    {name:"Face Fears II",desc:"Борьба со страхами",img:"😱"},
    {name:"Kingspray",desc:"Граффити-симулятор",img:"🎨"},
    {name:"Blade & Sorcery",desc:"Физический экшн",img:"🗡️"},
    {name:"Gorn",desc:"Гладиаторские бои",img:"⚔️"},
    {name:"Gladius",desc:"Гладиаторские бои",img:"🛡️"},
    {name:"Vacation Simulator",desc:"Отдых в виртуальном мире",img:"🏖️"},
    {name:"Drunkn Bar Fight",desc:"Весёлый симулятор драки",img:"🍺"},
    {name:"Eleven Table Tennis",desc:"Настольный теннис",img:"🏓"},
    {name:"Warplanes: WW1 Fighters",desc:"Авиасимулятор",img:"✈️"},
    {name:"Carve Snowboarding",desc:"Сноубординг",img:"🏂"},
    {name:"Wii Fighters",desc:"Файтинги",img:"🥋"},
    {name:"Snowboarding",desc:"Сноубординг",img:"🏔️"},
    {name:"Elven Combat",desc:"Эльфийские битвы",img:"🧝"},
    {name:"Coaster Combat",desc:"Американские горки",img:"🎢"},
    {name:"Waltz of the Wizard",desc:"Магический симулятор",img:"🧙"},
    {name:"Arizona Sunshine",desc:"Зомби-шутер",img:"🧟"},
    {name:"Superhot VR",desc:"Время только когда ты движешься",img:"🔥"},
    {name:"Pavlov VR",desc:"Тактический шутер",img:"🎯"},
    {name:"Gorilla Tag",desc:"Веселые гонки",img:"🦍"}
  ],
  ps5: [
    {name:"Mortal Kombat 11",desc:"Жестокие файтинги",img:"⚡"},
    {name:"Silent Hill 2 Remake",desc:"Психологический хоррор",img:"🌫️"},
    {name:"Spider-Man 2",desc:"Нью-Йорк в твоих руках",img:"🕷️"},
    {name:"Stray",desc:"Приключения кота-робота",img:"🐈"},
    {name:"Mortal Kombat 1",desc:"Перезапуск легендарной серии",img:"⚡"},
    {name:"UFL",desc:"Бесплатный футбольный симулятор",img:"⚽"},
    {name:"EA Sports FC 24",desc:"Футбольный симулятор",img:"⚽"},
    {name:"Human Fall Flat",desc:"Весёлая физическая головоломка",img:"🧑‍🦽"},
    {name:"Gran Turismo 7",desc:"Реалистичные гонки",img:"🏁"},
    {name:"God of War Ragnarök",desc:"Скандинавский эпос",img:"⚔️"},
    {name:"Cyberpunk 2077",desc:"Ролевой экшн в открытом мире",img:"🌃"},
    {name:"Elden Ring",desc:"Эпическое фэнтези",img:"⚔️"},
    {name:"Hogwarts Legacy",desc:"Мир Гарри Поттера",img:"⚡"},
    {name:"Tekken 8",desc:"Файтинг",img:"👊"},
    {name:"Street Fighter 6",desc:"Легендарный файтинг",img:"👊"},
    {name:"Call of Duty: MW III",desc:"Военный шутер",img:"🔫"},
    {name:"Fortnite",desc:"Королевская битва",img:"🎮"},
    {name:"Rocket League",desc:"Футбол на машинах",img:"🏎️"},
    {name:"It Takes Two",desc:"Кооперативное приключение",img:"❤️"}
  ],
  sim: [
    {name:"Forza Horizon 5",desc:"Мексика, сотни авто",img:"🌵"},
    {name:"BeamNG.drive",desc:"Физика разрушений",img:"💥"},
    {name:"Assetto Corsa",desc:"Симулятор высшего класса",img:"🏎️"},
    {name:"DiRT Rally 2.0",desc:"Раллийные трассы",img:"🪨"}
  ]
};

function renderGames(filter = 'all') {
  let all = [];
  if (filter === 'all') all = [...gamesLib.vr, ...gamesLib.ps5, ...gamesLib.sim];
  else if (filter === 'vr') all = gamesLib.vr;
  else if (filter === 'ps5') all = gamesLib.ps5;
  else if (filter === 'sim') all = gamesLib.sim;
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = all.map(g => `<div class="game-card"><div class="game-img">${g.img}</div><div class="game-info"><div class="game-name">${g.name}</div><div class="game-desc">${g.desc}</div></div></div>`).join('');
  const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.1 });
  document.querySelectorAll('.game-card').forEach(card => observer.observe(card));
}

// PRICING
const pricingData = [
  { icon:"🥽", name:"VR Комплект", amount:"400₽", duration:"30 мин", features:["Oculus Quest 2","1 комплект"] },
  { icon:"🥽", name:"VR Комплект", amount:"750₽", duration:"1 час", features:["Oculus Quest 2","Выбор игры"], featured:true },
  { icon:"🏎️", name:"Автосимулятор MOZA", amount:"300₽", duration:"15 мин", features:["Forza 5, BeamNG","48+ трасс"] },
  { icon:"🎮", name:"PlayStation 5", amount:"350₽", duration:"1 час", features:["Mortal Kombat 11","Silent Hill 2","Spider-Man 2","Stray"] },
  { icon:"🏢", name:"Аренда всего клуба", amount:"3 800₽", duration:"1 час / до 12 чел", features:["👥 До 12 человек","🥽 4 VR комплекта","🏎️ MOZA","🎮 PS5","🍕 Своя еда"] },
  { icon:"🎂", name:"День рождения", amount:"3 230₽", duration:"1 час / до 12 чел", features:["Весь клуб","VR + PS5 + MOZA","Подарок имениннику","Своя еда"], birthday:true, oldAmount:"3 800₽" }
];
function renderPricing() {
  const grid = document.getElementById('pricingGrid');
  grid.innerHTML = pricingData.map(p => `
    <div class="price-card ${p.featured ? 'featured' : ''} ${p.birthday ? 'birthday' : ''}">
      <div class="equip-icon">${p.icon}</div>
      <div class="price-name">${p.name}</div>
      ${p.birthday ? `<div class="price-amount old-price">${p.oldAmount}</div><div class="price-amount new-price">${p.amount}</div>` : `<div class="price-amount">${p.amount}</div>`}
      <div style="color:var(--text-dim);">${p.duration}</div>
      <ul class="price-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <a href="#" class="btn-primary" style="padding:6px 14px; font-size:0.75rem; margin-top:8px" onclick="openModal('booking'); return false;">Записаться</a>
    </div>
  `).join('');
}

// REVIEWS
const reviews = [
  { name:"Алексей Д.", text:"Лучший VR-клуб в Новосибирске! Оборудование топ. MOZA — огонь!", stars:"★★★★★", date:"15.12.2025", init:"АД" },
  { name:"Екатерина С.", text:"Отмечали день рождения сына (10 лет). Всё супер, дети в восторге!", stars:"★★★★★", date:"20.01.2026", init:"ЕС" },
  { name:"Игорь М.", text:"Арендовали весь клуб. 70м² хватило всем, отличная зона отдыха.", stars:"★★★★★", date:"05.02.2026", init:"ИМ" },
  { name:"Мария К.", text:"Очень атмосферно! Неон, киберпанк стиль, крутые игры на PS5.", stars:"★★★★★", date:"01.03.2026", init:"МК" }
];
function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.init}</div>
        <div><div class="review-name">${r.name}</div><div class="review-date">${r.date}</div></div>
      </div>
      <div class="stars">${r.stars}</div>
      <div class="review-text">"${r.text}"</div>
    </div>
  `).join('');
}

// ADVANTAGES
const advantagesData = [
  { icon:"🥽", name:"Свобода движений", desc:"Беспроводные Oculus Quest 2 — никаких проводов, полная свобода действий в VR", badge:"Беспроводной" },
  { icon:"🎮", name:"Мультиплеер PS5", desc:"До 4 игроков одновременно — сражайтесь или кооперируйте в любимых играх", badge:"До 4 игроков" },
  { icon:"🏎️", name:"Реализм MOZA", desc:"Силовая обратная связь руля, педали, ковш-кресло — 48 реальных трасс", badge:"48+ трасс" },
  { icon:"📐", name:"70 м² зал", desc:"Просторный зал, уютная лаунж-зона с диванами и пуфами — отдыхай между сессиями", badge:"До 12 человек" },
  { icon:"🎂", name:"Дни рождения", desc:"Специальный пакет со скидкой 15%. Весь клуб для вашей компании — незабываемо!", badge:"Скидка 15%" },
  { icon:"🍕", name:"Своя еда — ок!", desc:"Приноси любимую еду и напитки. Уютная лаунж-зона с диванами и пуфами", badge:"Своя еда" },
  { icon:"📍", name:"Удобная локация", desc:"Ул. Виктора Шевелева, 24. Бесплатная парковка у входа. Метро Площадь Маркса — 15 мин", badge:"Спальный район" },
  { icon:"⭐", name:"4 года опыта", desc:"С 2022 года — более 2 847 счастливых гостей. Профессиональные инструкторы", badge:"2 847+ гостей" }
];
function renderAdvantages() {
  const grid = document.getElementById('advantagesGrid');
  grid.innerHTML = advantagesData.map(a => `
    <div class="advantage-card">
      <div class="advantage-icon">${a.icon}</div>
      <div class="equip-name">${a.name}</div>
      <div class="equip-desc">${a.desc}</div>
      <div class="advantage-badge">${a.badge}</div>
    </div>
  `).join('');
}

// GALLERY (placeholder images)
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const images = [];
  for (let i = 1; i <= 8; i++) {
    images.push({
      src: `images/gallery/club_${i}.jpg`,
      alt: `Фото клуба PARADOX ${i}`,
      fallback: i === 1 ? '🥽' : i === 2 ? '🍕' : i === 3 ? '🎮' : i === 4 ? '🎮' : i === 5 ? '🏎️' : i === 6 ? '💡' : i === 7 ? '🎂' : '✨'
    });
  }
  grid.innerHTML = images.map(img => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20150%22%3E%3Crect%20width%3D%22200%22%20height%3D%22150%22%20fill%3D%22%231a1a2e%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%2300f5ff%22%3E${img.fallback}%3C%2Ftext%3E%3C%2Fsvg%3E'">
    </div>
  `).join('');
}

// FAQ
const faqData = [
  { q: "Какой возраст?", a: "От 6 лет. С 10 лет возможно самостоятельное посещение (с согласия родителей)." },
  { q: "Можно ли со своей едой?", a: "Да! У нас есть уютная lunch-зона с диванчиками и пуфиками. Приносите свои напитки и перекусы." },
  { q: "Нужна ли предварительная запись?", a: "Рекомендуется, особенно в выходные и праздничные дни." },
  { q: "Есть ли парковка?", a: "Да, бесплатная парковка у входа." },
  { q: "Как оплатить?", a: "Наличными, банковской картой, переводом." },
  { q: "Как получить подарочный сертификат?", a: "Выберите номинал, заполните форму, оплатите и скачайте PDF. Сертификат действителен 12 месяцев." },
  { q: "Можно ли организовать день рождения?", a: "Да! У нас есть специальные пакеты, украшение зала, VR-турниры. Скидка 15%." },
  { q: "Есть ли кофе/чай?", a: "Вы можете принести свои напитки. В зоне отдыха есть стол и диванчики." }
];
function renderFAQ() {
  const container = document.getElementById('faqContainer');
  container.innerHTML = faqData.map((item, idx) => `
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-question">
        <h4>${item.q}</h4>
        <span class="faq-toggle">+</span>
      </div>
      <div class="faq-answer">${item.a}</div>
    </div>
  `).join('');
}
window.toggleFaq = function(el) {
  el.classList.toggle('open');
  const toggle = el.querySelector('.faq-toggle');
  toggle.textContent = el.classList.contains('open') ? '−' : '+';
};

// LIVE COUNTER
let counterValue = 8;
setInterval(() => {
  counterValue = Math.floor(Math.random() * 12) + 1;
  document.getElementById('counter').textContent = counterValue;
}, 10000);

// FILTERS
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGames(btn.dataset.filter);
  });
});

// CLOSE MODALS ON BACKDROP
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (overlay.id === 'privacyModal') closePrivacy();
      else if (activeModal) closeModal(activeModal);
    }
  });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// INIT
renderGames('all');
renderPricing();
renderReviews();
renderAdvantages();
renderGallery();
renderFAQ();
setTimeout(() => {
  document.querySelectorAll('.game-card').forEach(c => c.classList.add('visible'));
  document.getElementById('invPreview').style.display = 'block';
  document.getElementById('certPreview').style.display = 'none';
  document.getElementById('certForm').style.display = 'none';
}, 100);