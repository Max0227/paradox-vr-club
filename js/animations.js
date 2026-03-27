// ============ ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ ============

// Инициализация анимаций при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHoverEffects();
    initParticleSystem();
    initTypewriterEffect();
});

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    document.querySelectorAll('.equipment-card, .game-card, .pricing-card, .advantage-card, .review-card, .gallery-item').forEach(card => {
        observer.observe(card);
    });
}

// Эффекты при наведении
function initHoverEffects() {
    // Неоновое свечение для кнопок
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.6)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // 3D эффект для карточек
    document.querySelectorAll('.equipment-card, .pricing-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Система частиц
function initParticleSystem() {
    const isMobile = window.innerWidth < 768;
    const isSlowDevice = navigator.deviceMemory && navigator.deviceMemory < 4;

    if (isSlowDevice) return;

    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = isMobile ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }

    // Создаем новые частицы периодически
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < particleCount) {
            createParticle(particlesContainer);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Случайные параметры
    const size = Math.random() * 4 + 1;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    // Случайный цвет
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;

    container.appendChild(particle);

    // Удаляем частицу после анимации
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

// Эффект печатной машинки для заголовков
function initTypewriterEffect() {
    const titles = document.querySelectorAll('.hero-title .title-line');

    titles.forEach((title, index) => {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid var(--primary)';

        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 500);
            }
        }, 100 + index * 200);
    });
}

// Параллакс эффект для hero секции
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (heroBg) {
            heroBg.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Анимированные счетчики
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Запуск анимированных счетчиков при видимости
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// Инициализация всех эффектов
function initAllEffects() {
    initScrollAnimations();
    initHoverEffects();
    initParticleSystem();
    initTypewriterEffect();
    initParallaxEffect();
    initCounterAnimation();
}

// Экспорт функций
window.AnimationSystem = {
    init: initAllEffects,
    createParticle: createParticle,
    animateCounters: animateCounters
};