/**
 * !(i)
 * Код попадает в итоговый файл, только когда вызвана функция, например FLSFunctions.spollers();
 * Или когда импортирован весь файл, например import "files/script.js";
 * Неиспользуемый код в итоговый файл не попадает.

 * Если мы хотим добавить модуль следует его раскомментировать
 */
// import MousePRLX from './libs/parallaxMouse'
// import AOS from 'aos'
// import Swiper from 'swiper';

import BaseHelpers from './helpers/BaseHelpers.js';
import PopupManager from './modules/PopupManager';
import BurgerMenu from './modules/BurgerMenu';
import Tabs from './modules/Tabs';
import Accordion from './modules/Accordion.js';

BaseHelpers.checkWebpSupport();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();

BaseHelpers.headerFixed();

/**
 * Открытие/закрытие модальных окон
 * Чтобы модальное окно открывалось и закрывалось
 * На окно повешай атрибут data-popup="<название окна>"
 * На кнопку, которая вызывает окно повешай атрибут data-type="<название окна>"

 * На обертку(.popup) окна добавь атрибут '[data-close-overlay]'
 * На кнопку для закрытия окна добавь класс '.button-close'
 * */
new PopupManager();

/**
 *  Модуль для работы с меню (Бургер)
 * */
new BurgerMenu().init();

/**
 *  Библиотека для анимаций
 *  документация: https://michalsnik.github.io/aos
 * */
// AOS.init();

/**
 * Параллакс мышей
 * */
// new MousePRLX();

function bodyLock(isLock) {
  const pageWrapper = document.querySelector('.page');
  const lockPaddingValue = window.innerWidth - pageWrapper.offsetWidth;
  const lockPaddingElements = document.querySelectorAll('[data-lp]');
  if (lockPaddingElements) {
    lockPaddingElements.forEach((element) => {
      element.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px';
    });
  }

  document.body.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px';
  document.documentElement.classList.toggle('lock', isLock);
}

import Splide from '@splidejs/splide';
document.addEventListener('DOMContentLoaded', () => {
  const videoBlocks = document.querySelectorAll('.video-block');

  videoBlocks.forEach((block) => {
    const video = block.querySelector('.video-block__player');
    const playBtn = block.querySelector('.video-block__play-btn');


    video.removeAttribute('controls');

    // Клик по кастомной кнопке
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play(); video.setAttribute('controls', 'controls');

      } else {
        video.pause();
      }
    });

    // Синхронизация кнопки с состоянием видео
    video.addEventListener('play', () => {
      playBtn.style.opacity = '0';
      playBtn.style.pointerEvents = 'none'; video.setAttribute('controls', 'controls');

    });
    video.addEventListener('pause', () => {
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = 'auto'; video.removeAttribute('controls');

    });

    // Клик по видео (если controls не перехватили)
    video.addEventListener('click', (e) => {
      e.preventDefault(); // Попытка избежать конфликта с controls
      if (video.paused) {
        video.play(); video.setAttribute('controls', 'controls');

      } else {
        video.pause();
      }
    });
  });
});
if (document.querySelector('.portfolio__slider')) {
  new Splide('.portfolio__slider', {
    // type: 'fade',
    gap: 16,
    rewind: true,
  }).mount();
}
if (document.querySelector('.popular-reviews__slider')) {
  var splide2 = new Splide('.popular-reviews__slider', {
    type: 'slide',
    rewind: true,
    mediaQuery: 'min',
    gap: 16,
    breakpoints: {
      768: {
        perPage: 2,
        perMove: 1,
      },
      1024: {
        perPage: 3,
      },
      1240: {
        destroy: true,
      },
    },
  });
  splide2.mount();
}
const accToggleList = document.querySelectorAll('.accordion-toggle')
if (accToggleList.length > 0) {
  accToggleList.forEach((accToggle) => {
    accToggle.addEventListener('click', () => {
      accToggle.closest('.accordion').classList.toggle('open')
    })
  })
}

const filterIcon = document.querySelector('.filters__icon')
if (filterIcon) {
  filterIcon.addEventListener('click', () => {
    filterIcon.closest('.filters').classList.toggle('open')
  })
}

new Accordion('.accordion', {
  shouldOpenAll: false, // true
  defaultOpen: [], // [0,1]
  collapsedClass: 'open',
});

// const preloader = document.querySelector('.preloader-container');
// const mask = document.querySelector('.preloader-mask');

// bodyLock(true);
// // После 2 циклов анимации убираем прелоадер и ЧБ фильтр
// let animationCount = 0;
// mask.addEventListener('animationiteration', () => {
//   animationCount++;
//   if (animationCount >= 3) {
//     preloader.classList.add('close');
//     bodyLock(false);
//   }
// });



(function () {
  const container = document.querySelector('.way__container');
  if (!container) return;
  const way = container.closest('.way');
  const cardsWrap = container.querySelector('.way__cards');
  const cards = Array.from(cardsWrap.querySelectorAll('.way__card'));
  if (!cards.length) return;

  // Настройки (подгони под макет)
  const pinFactor = 0.95;      // сколько экранов занимает весь pin (умножается на кол-во карточек)
  const overlapPx = 20;       // сколько px уходит карточка вверх в финале
  const startOffsetVh = 0.1;   // начало пина чуть раньше (в VH)
  const easing = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let pinStart = 0;
  let pinDuration = 0;
  let ticking = false;

  function setup() {
    // очистка (если что было)
    if (way) {
      way.style.removeProperty('--way-pin-height');
    }
    container.style.removeProperty('--pin-left');
    container.style.removeProperty('--pin-width');

    const n = cards.length;
    const vh = window.innerHeight;

    // общая длительность пина (в px) — n экранов * factor
    pinDuration = Math.round(vh * n * pinFactor);

    // выставляем высоту секции напрямую на .way (вместо spacer)
    if (way) {
      way.style.setProperty('--way-pin-height', `${pinDuration}px`);
    }

    // вычисляем координаты контейнера в документе (текущее положение)
    const contRect = container.getBoundingClientRect();
    const docScroll = window.scrollY || window.pageYOffset;
    const contDocTop = docScroll + contRect.top;
    pinStart = contDocTop - vh * startOffsetVh;

    // запомним left/width и выставим CSS-переменные при пине
    container.dataset.origLeft = contRect.left + 'px';
    container.dataset.origWidth = contRect.width + 'px';

    // гарантируем, что .way__cards имеет позиционирование relative в CSS
    const wrapHeight = Math.max(cardsWrap.clientHeight, Math.round(vh * 0.5)); // fallback
    const centerY = Math.round(wrapHeight * 0.5); // точка, где карточка "в центре" секции

    // Проставляем начальные inline-стили карточкам
    cards.forEach((c, i) => {
      c.style.position = 'absolute';
      // c.style.top = `${centerY / 2}px`;
      c.style.left = '0%';
      c.style.transform = ''; // сброс
      c.style.setProperty('--y-translate', '110px');
      c.style.setProperty('--scale', '1');
      c.style.willChange = 'transform, z-index';
      c.style.zIndex = String(100 - i);
      // центрирование по горизонтали (если нужно)
      // c.style.marginLeft = `calc(-1 * (min(720px, 92%) / 2))`; /* опционально: если не используете translateX */
    });

    // начальный кадр
    onScrollRaf();
  }

  function onScrollRaf() {
    ticking = false;
    const scroll = window.scrollY || window.pageYOffset;


    const inPin = (scroll >= pinStart && scroll <= (pinStart + pinDuration));
    if (inPin) {
      // ставим переменные для точной фиксации слева/ширины
      container.style.setProperty('--pin-left', container.dataset.origLeft);
      container.style.setProperty('--pin-width', container.dataset.origWidth);
      container.classList.add('is-pinned');

      // общий прогресс 0..1
      const progress = Math.max(0, Math.min(1, (scroll - pinStart) / pinDuration));
      animateCards(progress);
    } else {
      // убираем фикс
      container.classList.remove('is-pinned');
      container.style.removeProperty('--pin-left');
      container.style.removeProperty('--pin-width');
      // если до начала — возвращаем к стартовой позиции
      if (scroll < pinStart) {
        cards.forEach((c, i) => {
          c.style.setProperty('--y-translate', '110px');
          c.style.setProperty('--scale', '1');
          c.style.zIndex = String(100 - i);
        });
      } else {
        // после конца пина — ставим карточки в финальную позицию (уйти вверх)
        cards.forEach((c, i) => {
          c.style.setProperty('--y-translate', `${-overlapPx}px`);
          c.style.setProperty('--scale', '0.95');
          c.style.zIndex = String(i);

        });
      }
    }
  }

  // core: последовательная анимация карточек
  function animateCards(globalProgress) {
    const n = cards.length;
    const step = 1 / n;
    const overlap = 0//Math.min(0.12, step * 0.6); // небольшой overlap
    const effectiveStep = step + overlap;

    cards.forEach((card, i) => {
      const startAt = i * step;
      const local = (globalProgress - startAt) / effectiveStep;
      const clamped = Math.max(0, Math.min(1, local));

      let y;
      if (clamped === 0) {
        y = 110;
      } else if (clamped < 0.5) {
        const t = easing(clamped / 0.5);
        y = 110 * (1 - t); // 120 -> 0
      } else {
        const t = easing((clamped - 0.5) / 0.5);
        y = -overlapPx * t; // 0 -> -overlapPx
      }

      const scale = 1 - 0.02 * Math.min(1, clamped);

      let z;
      if (clamped < 1) {
        if (clamped > 0) {
          z = 1000 + i;
        } else {
          z = 100 - i;
        }
      } else {
        z = i;
      }

      card.style.setProperty('--y-translate', `${Math.round(y)}px`);
      card.style.setProperty('--scale', `${scale.toFixed(3)}`);
      card.style.zIndex = String(Math.round(z));

    });
  }

  // scroll handler -> rAF
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(onScrollRaf);
      ticking = true;
    }
  }

  // resize: пересчёт высоты и параметров
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // удаляем inline свойства (безопасно) и пересоздаём
      cards.forEach(c => {
        c.style.transform = '';
        c.style.position = '';
        c.style.top = '';
        c.style.left = '';
        c.style.marginLeft = '';
        c.style.zIndex = '';
      });
      container.style.removeProperty('--pin-left');
      container.style.removeProperty('--pin-width');
      if (way) way.style.removeProperty('--way-pin-height');
      setup();
    }, 120);
  }

  // init
  setup();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
})();