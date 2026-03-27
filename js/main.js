// ============ ПЕРЕМЕННЫЕ ============
const isMobile = window.innerWidth < 768;
const isSlowDevice = navigator.deviceMemory && navigator.deviceMemory < 4;

// ============ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbarScroll();
    initFaq();
    initLiveCounter();
    initGamesGrid();
    initPricingGrid();
    initAdvantagesGrid();
    initReviewsGrid();
    initGalleryGrid();
});

// ============ ЧАСТИЦЫ ============
function initParticles() {
    if (isSlowDevice) return;
    
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = isMobile ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = Math.random() * 10 + 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============ НАВИГАЦИЯ ============
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function toggleNav() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ МОДАЛЬНЫЕ ОКНА ============
function openModal(type, param = null) {
    const modal = document.getElementById(type + 'Modal');
    if (!modal) return;
    
    if (type === 'certificate' && param) {
        const certSelect = document.getElementById('certAmount');
        if (certSelect) {
            if (param === 'vr30') certSelect.value = '400';
            if (param === 'vr60') certSelect.value = '750';
            if (param === 'ps5') certSelect.value = '350';
            if (param === 'racing') certSelect.value = '300';
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openPrivacy() {
    openModal('privacy');
}

function closePrivacy() {
    closeModal('privacy');
}

// ============ ФОРМА БРОНИРОВАНИЯ ============
async function submitBooking(event) {
    event.preventDefault();
    
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const service = document.getElementById('service')?.value;
    const date = document.getElementById('date')?.value;
    const time = document.getElementById('time')?.value;
    const people = document.getElementById('people')?.value;
    const comment = document.getElementById('comment')?.value;
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }
    
    // Отправка на почту через FormSubmit
    try {
        await fetch('https://formsubmit.co/ajax/paradoxclub54@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _subject: '📅 НОВАЯ ЗАЯВКА | PARADOX VR CLUB',
                Имя: name,
                Телефон: phone,
                Услуга: service,
                Дата: date || 'не указана',
                Время: time || 'не указано',
                Гостей: people || '1',
                Комментарий: comment || '—'
            })
        });
    } catch (error) {
        console.log('Ошибка отправки на почту');
    }
    
    // Отправка в Telegram (если настроен)
    sendToTelegram(name, phone, service, date, time, people, comment);
    
    // Показать успешное сообщение
    const form = document.getElementById('bookingForm');
    const successDiv = document.getElementById('bookingSuccess');
    
    if (form) form.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
    
    setTimeout(() => {
        closeModal('booking');
        setTimeout(() => {
            if (form) form.style.display = 'block';
            if (successDiv) successDiv.style.display = 'none';
            if (form) form.reset();
        }, 300);
    }, 2000);
}

// ============ TELEGRAM БОТ ============
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_CHAT_ID_HERE';

function sendToTelegram(name, phone, service, date, time, people, comment) {
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') return;
    
    const message = `📅 НОВАЯ ЗАЯВКА\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🎮 Услуга: ${service}\n📆 Дата: ${date || '—'}\n⏰ Время: ${time || '—'}\n👥 Гостей: ${people || '1'}\n💬 Комментарий: ${comment || '—'}`;
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    }).catch(console.error);
}

// ============ ПОДАРОЧНЫЙ СЕРТИФИКАТ ============
async function processCertificate(event) {
    event.preventDefault();
    
    const amount = document.getElementById('certAmount')?.value;
    const to = document.getElementById('certTo')?.value.trim();
    const from = document.getElementById('certFrom')?.value.trim();
    const phone = document.getElementById('certPhone')?.value.trim();
    const wish = document.getElementById('certWish')?.value;
    
    if (!to || !from || !phone) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Генерация уникального номера
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const certNumber = `PARADOX-${year}-${random}`;
    document.getElementById('certNumber').textContent = certNumber;
    
    // Обновление превью
    const amountText = amount === '400' ? '400 ₽' : amount === '750' ? '750 ₽' : amount === '350' ? '350 ₽' : amount === '300' ? '300 ₽' : '550 ₽';
    document.getElementById('previewAmount').textContent = amountText;
    document.getElementById('previewTo').textContent = to;
    document.getElementById('previewFrom').textContent = from;
    
    const wishElement = document.getElementById('previewWish');
    if (wishElement) {
        if (wish) {
            wishElement.textContent = wish;
            wishElement.style.display = 'block';
        } else {
            wishElement.style.display = 'none';
        }
    }
    
    const preview = document.getElementById('certPreview');
    if (preview) preview.style.display = 'block';
    
    // Генерация PDF
    setTimeout(() => {
        const element = document.getElementById('certPreview');
        if (element) {
            const opt = {
                margin: 10,
                filename: `Sertifikat_PARADOX_${to}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, backgroundColor: '#1a1f3a' },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(element).save();
        }
    }, 100);
    
    // Показать сообщение и закрыть
    alert('Сертификат успешно сгенерирован! Скачивание начнется через несколько секунд.');
    setTimeout(() => closeModal('certificate'), 1500);
}

// ============ ПРИГЛАШЕНИЕ ============
function downloadInvitation(event) {
    event.preventDefault();
    
    const name = document.getElementById('invName')?.value.trim();
    const dateTime = document.getElementById('invDateTime')?.value;
    const from = document.getElementById('invFrom')?.value.trim();
    const phone = document.getElementById('invPhone')?.value.trim();
    const guests = document.getElementById('invGuests')?.value;
    
    if (!name || !dateTime || !from || !phone) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Форматирование даты
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString('ru-RU', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    // Обновление превью
    document.getElementById('previewInvName').textContent = name;
    document.getElementById('previewDateTime').textContent = `📅 ${formattedDate}`;
    document.getElementById('previewInvFrom').textContent = from;
    document.getElementById('previewInvPhone').textContent = phone;
    document.getElementById('previewGuests').textContent = `👥 Гостей: ${guests || '1'}`;
    
    const preview = document.getElementById('invPreview');
    if (preview) preview.style.display = 'block';
    
    // Генерация PDF
    setTimeout(() => {
        const element = document.getElementById('invPreview');
        if (element) {
            const opt = {
                margin: 10,
                filename: `Priglashenie_${name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(element).save();
        }
    }, 100);
    
    alert('Приглашение успешно сгенерировано! Скачивание начнется через несколько секунд.');
    setTimeout(() => closeModal('invitation'), 1500);
}

// ============ FAQ ============
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

// ============ ЖИВОЙ СЧЕТЧИК ============
function initLiveCounter() {
    const counterElement = document.getElementById('counter');
    if (!counterElement) return;
    
    let counter = 8;
    setInterval(() => {
        counter = Math.floor(Math.random() * 12) + 1;
        counterElement.textContent = counter;
    }, 8000);
}

// ============ ИГРЫ ============
function initGamesGrid() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    const games = {
        vr: [
            { name: 'Job Simulator', icon: '💼', type: 'vr' },
            { name: 'Beat Saber', icon: '⚔️', type: 'vr' },
            { name: 'Arizona Sunshine', icon: '🧟', type: 'vr' },
            { name: 'The Climb', icon: '🧗', type: 'vr' },
            { name: 'Superhot VR', icon: '🔥', type: 'vr' },
            { name: 'Half-Life: Alyx', icon: '🎯', type: 'vr' },
            { name: 'Pavlov VR', icon: '🔫', type: 'vr' },
            { name: 'Gorilla Tag', icon: '🦍', type: 'vr' }
        ],
        ps5: [
            { name: 'Mortal Kombat 11', icon: '⚡', type: 'ps5' },
            { name: 'Silent Hill 2', icon: '🌫️', type: 'ps5' },
            { name: 'Spider-Man 2', icon: '🕷️', type: 'ps5' },
            { name: 'Stray', icon: '🐱', type: 'ps5' },
            { name: 'Gran Turismo 7', icon: '🏁', type: 'ps5' }
        ],
        racing: [
            { name: 'Forza Horizon 5', icon: '🌵', type: 'racing' },
            { name: 'BeamNG.drive', icon: '💥', type: 'racing' },
            { name: 'Assetto Corsa', icon: '🏎️', type: 'racing' },
            { name: 'DiRT Rally 2.0', icon: '🪨', type: 'racing' }
        ]
    };
    
    function renderGames(filter = 'all') {
        let allGames = [];
        if (filter === 'all') {
            allGames = [...games.vr, ...games.ps5, ...games.racing];
        } else if (filter === 'vr') {
            allGames = games.vr;
        } else if (filter === 'ps5') {
            allGames = games.ps5;
        } else if (filter === 'racing') {
            allGames = games.racing;
        }
        
        gamesGrid.innerHTML = allGames.map(game => `
            <div class="game-card" data-type="${game.type}">
                <div class="game-icon">${game.icon}</div>
                <div>
                    <div class="game-name">${game.name}</div>
                    <div class="game-type">${game.type.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
    }
    
    renderGames('all');
    
    // Фильтры
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGames(btn.dataset.filter);
        });
    });
}

// ============ ТАРИФЫ ============
function initPricingGrid() {
    const pricingGrid = document.getElementById('pricingGrid');
    if (!pricingGrid) return;
    
    const pricing = [
        {
            name: 'VR Комплект',
            icon: '🥽',
            desc: 'Беспроводные VR-шлемы Oculus Quest 3',
            price: '400 ₽',
            period: '30 минут',
            features: ['Oculus Quest 3', '40+ игр', 'Инструктаж'],
            popular: false
        },
        {
            name: 'VR Комплект',
            icon: '🥽',
            desc: 'Полное погружение в виртуальную реальность',
            price: '750 ₽',
            period: '1 час',
            features: ['Oculus Quest 3', 'Выбор игры', 'Смена игр'],
            popular: true
        },
        {
            name: 'MOZA Racing',
            icon: '🏎️',
            desc: 'Профессиональный автосимулятор',
            price: '300 ₽',
            period: '15 минут',
            features: ['Force Feedback', '48+ трасс', 'Forza 5, BeamNG'],
            popular: false
        },
        {
            name: 'MOZA Racing',
            icon: '🏎️',
            desc: 'Для настоящих гонщиков',
            price: '550 ₽',
            period: '30 минут',
            features: ['Force Feedback', '48+ трасс', 'Любая игра'],
            popular: false
        },
        {
            name: 'PlayStation 5',
            icon: '🎮',
            desc: 'Консоль нового поколения',
            price: '350 ₽',
            period: '1 час',
            features: ['4 геймпада', 'Mortal Kombat 11', 'Silent Hill 2'],
            popular: false
        },
        {
            name: 'Аренда клуба',
            icon: '🏢',
            desc: 'Весь зал для вашей компании',
            price: '3 800 ₽',
            period: '1 час / до 12 чел',
            features: ['Все VR шлемы', 'PS5 + MOZA', 'Своя еда'],
            popular: false
        }
    ];
    
    pricingGrid.innerHTML = pricing.map(p => `
        <div class="pricing-card ${p.popular ? 'featured' : ''}">
            ${p.popular ? '<div class="pricing-badge">🔥 ХИТ</div>' : ''}
            <div class="pricing-icon">${p.icon}</div>
            <div class="pricing-name">${p.name}</div>
            <div class="pricing-desc">${p.desc}</div>
            <div class="pricing-price">${p.price}</div>
            <div class="pricing-period">${p.period}</div>
            <ul class="pricing-features">
                ${p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="btn btn-secondary" onclick="openModal('booking')">Забронировать</button>
        </div>
    `).join('');
}

// ============ ПРЕИМУЩЕСТВА ============
function initAdvantagesGrid() {
    const advantagesGrid = document.getElementById('advantagesGrid');
    if (!advantagesGrid) return;
    
    const advantages = [
        { icon: '🥽', title: 'Новейшее оборудование', desc: 'Oculus Quest 3, PS5, MOZA Racing — всё топовое и обслуженное' },
        { icon: '🎮', title: 'Мультиплеер PS5', desc: 'До 4 игроков одновременно — сражайтесь или кооперируйте' },
        { icon: '🏎️', title: 'Реализм MOZA', desc: 'Силовая обратная связь, педали, ковш-кресло — 48+ трасс' },
        { icon: '🏢', title: '70м² киберпространства', desc: 'Просторный зал, уютная лаунж-зона с диванами и пуфиками' },
        { icon: '🎂', title: 'Дни рождения', desc: 'Специальный пакет со скидкой 15%. Весь клуб для вашей компании' },
        { icon: '🍕', title: 'Своя еда', desc: 'Приносите любимые перекусы и напитки. Уютная зона отдыха' },
        { icon: '📍', title: 'Удобная локация', desc: 'Ул. Виктора Шевелева, 24. Бесплатная парковка у входа' },
        { icon: '⭐', title: '4 года опыта', desc: 'Более 2 847 довольных гостей. Профессиональные инструкторы' }
    ];
    
    advantagesGrid.innerHTML = advantages.map(adv => `
        <div class="advantage-card">
            <div class="advantage-icon">${adv.icon}</div>
            <h3>${adv.title}</h3>
            <p>${adv.desc}</p>
        </div>
    `).join('');
}

// ============ ОТЗЫВЫ ============
function initReviewsGrid() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    const reviews = [
        { author: 'Алексей Д.', date: '15.12.2025', rating: 5, text: 'Лучший VR-клуб в Новосибирске! Оборудование топ. MOZA — огонь! Персонал отличный, всё объяснили.' },
        { author: 'Екатерина С.', date: '20.01.2026', rating: 5, text: 'Отмечали день рождения сына (10 лет). Всё супер, дети в восторге! Скидка 15% очень порадовала.' },
        { author: 'Игорь М.', date: '05.02.2026', rating: 5, text: 'Арендовали весь клуб для корпоратива. 70м² хватило всем, отличная зона отдыха. Рекомендую!' },
        { author: 'Мария К.', date: '01.03.2026', rating: 5, text: 'Очень атмосферно! Неон, киберпанк-стиль, крутые игры на PS5. Обязательно придём ещё!' }
    ];
    
    reviewsGrid.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">${r.author}</div>
                <div class="review-date">${r.date}</div>
            </div>
            <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <div class="review-text">"${r.text}"</div>
        </div>
    `).join('');
}

// ============ ГАЛЕРЕЯ ============
function initGalleryGrid() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    const images = ['🥽', '🎮', '🏎️', '🍕', '💡', '🎂'];
    
    galleryGrid.innerHTML = images.map(img => `
        <div class="gallery-item">
            ${img}
        </div>
    `).join('');
}

// ============ SCROLL TO TOP ============
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }
});