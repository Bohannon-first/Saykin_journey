// Бургерное меню
let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__toggle');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});

// Переменные
const modalSend = document.querySelector('.modal__content--send');
const modalBuy = document.querySelector('.modal__content--buy');
const buttonBuy = document.querySelectorAll('.button__buy');
const formSend = modalBuy.querySelector('.modal__form-buy');
const buttonClose = document.querySelectorAll('.modal__button-close');
const modalTel = formSend.querySelector('.modal__input--tel');
const modalEmail = formSend.querySelector('.modal__input--email');
const modalBtnBuy = formSend.querySelector('.modal__button-buy');
const modalInputs = formSend.querySelectorAll('.modal__input');
const feedback = document.querySelector('.feedback');
const formFeedback = feedback.querySelector('.feedback__form');
const feedbackInputPhone = formFeedback.querySelector('.feedback__input--phone');
const feedbackInputEmail = formFeedback.querySelector('.feedback__input--email');
const feedbackInputs = formFeedback.querySelectorAll('.feedback__input');
const feedbackButtonSend = formFeedback.querySelector('.feedback__button-send');
const arrowToUp = document.querySelector('.back-to-top__svg');
const buyTourNow = document.querySelectorAll('a[href^="#feedback"]');
const globalModalBuy = document.querySelector('.modal--buy');
const globalModalSend = document.querySelector('.modal--send');

// Удаление у всех кнопок 'Купить тур сейчас' атрибута href
buyTourNow.forEach(elem => elem.removeAttribute('href'));

// Удаление id у feedback, чтобы при загрузке страницы не было прокрутки к нему
feedback.removeAttribute('id');

// Проверка есть ли в браузере поддержка localStorage
let isStorageSupport = true;
let storage = '';

try {
  storage = localStorage.getItem('tel');
} catch (error) {
  isStorageSupport = false;
}

// Цикл в ходе которого каждому элементу навешивается обработчик события 'клик'
for (let button of buttonBuy) {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    globalModalBuy.classList.add('modal--blackout');
    modalBuy.classList.add('modal__content--show');
    document.body.style.overflow = 'hidden'; // Блокируется прокрутка
    if (storage) {
      modalTel.value = storage;
      modalEmail.focus();
    } else {
      modalTel.focus();
    }
  })
};

// Отправка формы(модалка)
formSend.addEventListener('submit', (evt) => {
  if (!modalTel.value || !modalEmail.value) {
    evt.preventDefault();
    modalBuy.classList.remove('modal__content--error');
    modalBuy.offsetWidth = modalBuy.offsetWidth;
    modalBuy.classList.add('modal__content--error');
  } else {
    if (isStorageSupport) {
      localStorage.setItem('tel', modalTel.value) && ('email', modalEmail.value);
      modalBuy.classList.remove('modal__content--show');
      modalSend.classList.add('modal__content--show'); // Окно об отправке формы
    }
  }
});

// Проверка на наличие незаполненных полей с присвоением оранжевой обводки
formSend.addEventListener('submit', () => {
  for (let modalInput of modalInputs) {
    if (modalInput.value == '') {
      modalInput.classList.add('modal__input--error');
    }
  }
});

// Удаление оранжевой обводки при наборе текста
for (let modalInput of modalInputs) {
  modalInput.onchange = () => {
    if (modalInput.classList.contains('modal__input--error')) {
      modalInput.classList.remove('modal__input--error');
    }
  }
};

// Закрытие модального окна о покупке тура
for (let button of buttonClose) {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    modalBuy.classList.remove('modal__content--show');
    modalSend.classList.remove('modal__content--show');
    modalBuy.classList.remove('modal__content--error');
    globalModalBuy.classList.remove('modal--blackout');
    globalModalSend.classList.remove('modal--blackout');
    modalInputs.forEach(modalInput => modalInput.classList.remove('modal__input--error'));
    document.body.style.overflow = 'visible'; // Разблокировка блокировки прокрутки
  })
};

// Закрытие модального окна о покупке тура кнопкой Esc и удаление всех классов
window.addEventListener('keydown', (evt) => {
  if (evt.keyCode === 27) {
    if (modalBuy.classList.contains('modal__content--show') || modalSend.classList.contains('modal__content--show')) {
      evt.preventDefault();
      modalBuy.classList.remove('modal__content--show');
      modalSend.classList.remove('modal__content--show');
      modalBuy.classList.remove('modal__content--error');
      globalModalBuy.classList.remove('modal--blackout');
      globalModalSend.classList.remove('modal--blackout');
      modalInputs.forEach(modalInput => modalInput.classList.remove('modal__input--error'));
      document.body.style.overflow = 'visible';
    }
  }
});

// Проверка есть ли в браузере поддержка localStorage для feedback
if (storage) {
  feedbackInputPhone.value = storage;
}

// Отправка формы обратной связи(feedback)
formFeedback.addEventListener('submit', (evt) => {
  if (!feedbackInputPhone.value || !feedbackInputEmail.value) {
    evt.preventDefault();
    formFeedback.classList.remove('modal__content--error');
    formFeedback.offsetWidth = modalBuy.offsetWidth;
    formFeedback.classList.add('modal__content--error');
  } else {
    if (isStorageSupport) {
      localStorage.setItem('phone', feedbackInputPhone.value) && ('email', feedbackInputEmail.value);
      globalModalSend.classList.add('modal--blackout');
      modalSend.classList.add('modal__content--show'); // Окно об отправке формы
      document.body.style.overflow = 'hidden';
    }
  }
});

// Проверка на наличие незаполненных полей с присвоением оранжевой обводки для формы feedback
formFeedback.addEventListener('submit', () => {
  for (let feedbackInput of feedbackInputs) {
    if (feedbackInput.value == '') {
      feedbackInput.classList.add('feedback__input--error');
    }
  }
});

// Удаление оранжевой обводки при наборе текста в форме feedback
for (let feedbackInput of feedbackInputs) {
  feedbackInput.onchange = () => {
    if (feedbackInput.classList.contains('feedback__input--error')) {
      feedbackInput.classList.remove('feedback__input--error');
    }
  }
};

// Плавная прокрутка к якорю
// Все ссылки с атрибутом href, начинающимся с '#'
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => link.addEventListener('click', (evt) => {
  evt.preventDefault();
  let id = link.getAttribute('href').slice(1);

  document.getElementById(id).scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}));

// Кнопка для прокрутки страницы вверх
// Функция скролла вверх
const scrollUp = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// При нажатии кнопки, прокрутить в самый верх
arrowToUp.addEventListener('click', (evt) => {
  evt.preventDefault();
  scrollUp();
});

// Фукнкция показа кнопки при пролистывании вниз
const showArrowToUp = () => {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    arrowToUp.style.display = 'block';
  } else {
    arrowToUp.style.display = 'none';
  }
}

// Когда пользователь пролистывает вниз на 500px, появляется кнопка
window.onscroll = () => {
  showArrowToUp()
};
