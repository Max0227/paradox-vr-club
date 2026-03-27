// ============ ОБРАБОТКА ФОРМ ============

// Инициализация форм
document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
    initFormSubmission();
    initFormEnhancements();
});

// Валидация форм в реальном времени
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', validateField);
        });
    });
}

// Валидация отдельного поля
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;

    // Удаляем предыдущие сообщения об ошибках
    removeErrorMessage(field);

    let isValid = true;
    let errorMessage = '';

    // Проверки в зависимости от типа поля
    switch (field.type) {
        case 'text':
            if (fieldName === 'name') {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                } else if (!/^[а-яА-Яa-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Имя может содержать только буквы';
                }
            }
            break;

        case 'tel':
            if (!validatePhone(value)) {
                isValid = false;
                errorMessage = 'Формат: +7 (XXX) XXX-XX-XX';
            }
            break;

        case 'email':
            if (value && !validateEmail(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email';
            }
            break;

        case 'date':
            if (value && new Date(value) < new Date()) {
                isValid = false;
                errorMessage = 'Дата не может быть в прошлом';
            }
            break;

        case 'time':
            if (value && fieldName === 'time') {
                const selectedTime = value.split(':');
                const hours = parseInt(selectedTime[0]);
                if (hours < 12 || hours > 21) {
                    isValid = false;
                    errorMessage = 'Время работы: 12:00 - 22:00';
                }
            }
            break;

        case 'number':
            const min = parseInt(field.min) || 0;
            const max = parseInt(field.max) || Infinity;
            const numValue = parseInt(value);

            if (numValue < min) {
                isValid = false;
                errorMessage = `Минимум: ${min}`;
            } else if (numValue > max) {
                isValid = false;
                errorMessage = `Максимум: ${max}`;
            }
            break;
    }

    // Обязательные поля
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }

    // Показываем ошибку или успех
    if (!isValid && errorMessage) {
        showErrorMessage(field, errorMessage);
        field.classList.add('error');
        field.classList.remove('success');
    } else if (value) {
        field.classList.add('success');
        field.classList.remove('error');
    } else {
        field.classList.remove('error', 'success');
    }

    return isValid;
}

// Валидация телефона
function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && cleanPhone.startsWith('7');
}

// Валидация email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Показать сообщение об ошибке
function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--danger);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;

    field.parentNode.appendChild(errorDiv);
}

// Удалить сообщение об ошибке
function removeErrorMessage(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Отправка форм
function initFormSubmission() {
    // Бронирование
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Сертификат
    const certForm = document.getElementById('certForm');
    if (certForm) {
        certForm.addEventListener('submit', handleCertificateSubmit);
    }

    // Приглашение
    const invForm = document.getElementById('invForm');
    if (invForm) {
        invForm.addEventListener('submit', handleInvitationSubmit);
    }
}

// Обработка отправки бронирования
async function handleBookingSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Проверяем валидность всех полей
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }

    // Собираем данные
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

    try {
        // Отправка на сервер (здесь можно добавить реальный API)
        const response = await sendBookingData(data);

        if (response.success) {
            showNotification('Заявка успешно отправлена! Мы перезвоним в течение 15 минут.', 'success');
            closeModal('booking');
            form.reset();

            // Отправка в Telegram
            sendToTelegram(data);
        } else {
            throw new Error(response.message || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        showNotification('Ошибка отправки. Попробуйте позже или позвоните нам.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Отправка данных бронирования (заглушка для API)
async function sendBookingData(data) {
    // Имитация API вызова
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
}

// Обработка сертификата
function handleCertificateSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const amount = document.getElementById('certAmount').value;
    const to = document.getElementById('certTo').value.trim();
    const from = document.getElementById('certFrom').value.trim();
    const phone = document.getElementById('certPhone').value.trim();

    if (!to || !from || !phone) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    // Генерация номера сертификата
    const certNumber = generateCertificateNumber();

    // Обновление превью
    updateCertificatePreview(amount, to, from, certNumber);

    // Скачивание PDF (используем html2pdf)
    downloadCertificate();

    showNotification('Сертификат готов! Скачивание начнется через секунду.', 'success');
    setTimeout(() => closeModal('certificate'), 2000);
}

// Обработка приглашения
function handleInvitationSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = document.getElementById('invName').value.trim();
    const dateTime = document.getElementById('invDateTime').value;
    const from = document.getElementById('invFrom').value.trim();
    const phone = document.getElementById('invPhone').value.trim();
    const guests = document.getElementById('invGuests').value;

    if (!name || !dateTime || !from || !phone) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    // Обновление превью
    updateInvitationPreview(name, dateTime, from, phone, guests);

    // Скачивание PDF
    downloadInvitation();

    showNotification('Приглашение готово! Скачивание начнется через секунду.', 'success');
    setTimeout(() => closeModal('invitation'), 2000);
}

// Генерация номера сертификата
function generateCertificateNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `PARADOX-${year}-${random}`;
}

// Обновление превью сертификата
function updateCertificatePreview(amount, to, from, certNumber) {
    const previewAmount = document.getElementById('previewAmount');
    const previewTo = document.getElementById('previewTo');
    const previewFrom = document.getElementById('previewFrom');
    const certNumberEl = document.getElementById('certNumber');

    if (previewAmount) previewAmount.textContent = `${amount} ₽`;
    if (previewTo) previewTo.textContent = to;
    if (previewFrom) previewFrom.textContent = from;
    if (certNumberEl) certNumberEl.textContent = certNumber;
}

// Обновление превью приглашения
function updateInvitationPreview(name, dateTime, from, phone, guests) {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const previewName = document.getElementById('previewInvName');
    const previewDateTime = document.getElementById('previewDateTime');
    const previewFrom = document.getElementById('previewInvFrom');
    const previewPhone = document.getElementById('previewInvPhone');
    const previewGuests = document.getElementById('previewGuests');

    if (previewName) previewName.textContent = name;
    if (previewDateTime) previewDateTime.textContent = `📅 ${formattedDate}`;
    if (previewFrom) previewFrom.textContent = from;
    if (previewPhone) previewPhone.textContent = phone;
    if (previewGuests) previewGuests.textContent = `👥 Гостей: ${guests || '1'}`;
}

// Скачивание сертификата
function downloadCertificate() {
    const element = document.querySelector('.certificate-preview');
    if (!element) return;

    const opt = {
        margin: 10,
        filename: 'Sertifikat_PARADOX.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}

// Скачивание приглашения
function downloadInvitation() {
    const element = document.querySelector('.invitation-preview');
    if (!element) return;

    const name = document.getElementById('invName').value.trim();
    const opt = {
        margin: 10,
        filename: `Priglashenie_${name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}

// Улучшения форм
function initFormEnhancements() {
    // Маска для телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });

    // Автофокус на первое поле в модалах
    document.addEventListener('modalOpened', (e) => {
        const modal = e.detail;
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    });
}

// Форматирование номера телефона
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('7') || value.startsWith('8')) {
        value = value.substring(1);
    }

    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    let formatted = '+7 ';
    if (value.length > 0) {
        formatted += '(' + value.substring(0, 3) + ') ';
    }
    if (value.length > 3) {
        formatted += value.substring(3, 6);
    }
    if (value.length > 6) {
        formatted += '-' + value.substring(6, 8);
    }
    if (value.length > 8) {
        formatted += '-' + value.substring(8, 10);
    }

    e.target.value = formatted;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Стили
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    document.body.appendChild(notification);

    // Автоматическое удаление
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Отправка в Telegram
function sendToTelegram(data) {
    const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
    const CHAT_ID = 'YOUR_CHAT_ID_HERE';

    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') return;

    const message = `📅 НОВАЯ ЗАЯВКА PARADOX VR CLUB
👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
🎮 Услуга: ${data.service}
📆 Дата: ${data.date || '—'}
⏰ Время: ${data.time || '—'}
👥 Гостей: ${data.people || '1'}
💬 Комментарий: ${data.comment || '—'}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    }).catch(console.error);
}

// Экспорт функций
window.FormHandler = {
    validateField: validateField,
    showNotification: showNotification,
    sendToTelegram: sendToTelegram
};