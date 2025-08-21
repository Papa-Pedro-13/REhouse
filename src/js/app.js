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

    // Клик по кастомной кнопке
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });

    // Синхронизация кнопки с состоянием видео
    video.addEventListener('play', () => {
      playBtn.style.opacity = '0';
      playBtn.style.pointerEvents = 'none';
    });
    video.addEventListener('pause', () => {
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = 'auto';
    });

    // Клик по видео (если controls не перехватили)
    video.addEventListener('click', (e) => {
      e.preventDefault(); // Попытка избежать конфликта с controls
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
});
if (document.querySelector('.gallery__slider')) {
  new Splide('.gallery__slider', {
    type: 'fade',
    rewind: true,
  }).mount();
}
if (document.querySelector('.portfolio__slider')) {
  new Splide('.portfolio__slider', {
    type: 'fade',
    rewind: true,
  }).mount();
}
if (document.querySelector('.slider-section__slider')) {
  new Splide('.slider-section__slider', {
    type: 'fade',
    rewind: true,
  }).mount();
}
if (document.querySelector('.step-slider__slider')) {
  new Splide('.step-slider__slider', {
    type: 'fade',
    rewind: true,
    mediaQuery: 'min',
    breakpoints: {
      992: {
        destroy: true,
      },
    },
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
if (document.querySelector('.reviews__slider')) {
  var splide3 = new Splide('.reviews__slider', {
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
  splide3.mount();
}

new Accordion('.accordion', {
  shouldOpenAll: false, // true
  defaultOpen: [], // [0,1]
  collapsedClass: 'open',
});

const preloader = document.querySelector('.preloader-container');
const mask = document.querySelector('.preloader-mask');

bodyLock(true);
// После 2 циклов анимации убираем прелоадер и ЧБ фильтр
let animationCount = 0;
mask.addEventListener('animationiteration', () => {
  animationCount++;
  if (animationCount >= 3) {
    preloader.classList.add('close');
    bodyLock(false);
  }
});
