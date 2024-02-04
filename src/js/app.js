import * as myFunctions from "./modules/functions.js";
import { useDynamicAdapt } from './modules/dynamicAdapt.js';
import Swiper from 'swiper/bundle';
import noUiSlider from 'nouislider';
import $ from "jquery";
import { Fancybox } from "@fancyapps/ui";
import JustValidate from 'just-validate';
import barba from '@barba/core';
import { gsap } from "gsap";

myFunctions.isWebp();
myFunctions.isTouch();
useDynamicAdapt();

const links = document.querySelectorAll('a');

links.forEach(function (el) {
  el.addEventListener('click', (e) => {
    e.preventDefault();
  })
})

function homePage() {
  const favoritesSlider = new Swiper('.favorites__slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 2000,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    breakpoints: {
      450: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      767: {
        slidesPerView: 3,
        spaceBetween: 50,
      }
    }
  });

  //Анимация текста
  const swiftUpElements = document.querySelectorAll('.swift-up-text');
  swiftUpElements.forEach(elem => {
    const elements = elem.textContent.split(' ');
    const words = elements.filter(function (el) {
      return el !== '';
    })
    elem.innerHTML = '';
    words.forEach((el, index) => {
      words[index] = `<span><i>${words[index]}</i></span>`;
    });

    elem.innerHTML = words.join(' ');
    const children = document.querySelectorAll('span > i');
    children.forEach((node, index) => {
      node.style.animationDelay = `${(index + 4) * .15}s`; //Задержка перед началом анимации
    });
  });

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  //Deal clock
  if (document.querySelector('.deal__clock')) {
    function initializeClock(id, endtime) {
      const clock = document.querySelector('.deal__clock');
      const daysSpan = clock.querySelector('.deal__days');
      const hoursSpan = clock.querySelector('.deal__hours');
      const minutesSpan = clock.querySelector('.deal__minutes');
      const secondsSpan = clock.querySelector('.deal__seconds');
      const timeinterval = setInterval(updateClock, 1000);

      function updateClock() {
        const t = getTimeRemaining(endtime);
        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
        if (t.total <= 0) {
          document.querySelector(".deal__clock").style.display = 'none';
          document.querySelector(".deadline-message").style.display = 'block';
          clearInterval(timeinterval);
        }
      }
      updateClock();
    }
    const deadline = document.querySelector('.deal__clock').dataset.time;
    initializeClock('.deal-clock', deadline);
  }
}

function furniturePage() {
  const rangeSlider = document.querySelector('.filter-price__range');

  if (rangeSlider) {
    const input0 = document.getElementById('input-0');
    const input1 = document.getElementById('input-1');
    const inputs = [input0, input1];

    noUiSlider.create(rangeSlider, {
      start: [150, 2000],
      connect: true,
      range: {
        'min': 150,
        'max': 2000
      }
    });
    rangeSlider.noUiSlider.on('update', function (values, handle) {
      inputs[handle].value = Math.round(values[handle])
    });
    const setRangeSlider = function (i, value) {
      let arr = [null, null];
      arr[i] = value;
      rangeSlider.noUiSlider.set(arr);
    }
    inputs.forEach(function (el, index) {
      el.addEventListener('change', function (e) {
        setRangeSlider(index, e.currentTarget.value)
      })
    })
  }

  const filterResetBtn = document.querySelector('.furniture__filter-btn--reset');
  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', function () {
      rangeSlider.noUiSlider.reset();
    })
  }

  const filterHeads = document.querySelectorAll('.filter__item-head');

  function filterCheck() {
    filterHeads.forEach(function (item) {
      if (item.classList.contains('open')) {
        item.nextElementSibling.style.maxHeight = item.nextElementSibling.scrollHeight + 'px';
        item.nextElementSibling.style.marginBottom = 16 + 'px';
      }
      else {
        item.nextElementSibling.style.maxHeight = null;
        item.nextElementSibling.style.marginBottom = null;
      }
    })
  }

  filterHeads.forEach(function (item) {
    item.addEventListener('click', function () {
      item.classList.toggle('open');
      filterCheck();
    })
  })

  filterCheck();
}

function contactsPage() {

  if (document.querySelector('.contacts__form')) {
    const validateContacts = new JustValidate('.contacts__form');
    validateContacts
      .addField(document.querySelector('.contacts__form-input--name'), [
        {
          rule: 'required',
          errorMessage: 'Заполните поле',
        },
      ])
      .addField(document.querySelector('.contacts__form-input--email'), [
        {
          rule: 'required',
          errorMessage: 'Заполните поле',
        },
        {
          rule: 'email',
          errorMessage: 'Введите корректный емейл',
        },
      ])
      .addField(document.querySelector('.contacts__form-input--subject'), [
        {
          rule: 'required',
          errorMessage: 'Заполните поле',
        },
      ])
      .addField(document.querySelector('.contacts__form-textarea'), [
        {
          rule: 'required',
          errorMessage: 'Заполните поле',
        },
        {
          rule: 'minLength',
          value: 10,
          errorMessage: 'Длина сообщения не менее 10 символов',
        }
      ])
      .onSuccess(e => {
        e.target.reset();
      })
  }

  //YandexMaps
  let center = [52.50831275573165, 13.404848558991203];
  function init() {
    let map = new ymaps.Map('map', {
      center: center,
      zoom: 16,
    });

    let placemark = new ymaps.Placemark(center, {
      balloonContent: `
                      <div class="balloon">
                        <div class="balloon__address">Alte Jakob Strasse, 100 Berlin</div>
                        <div class="balloon__contacts">
                          <a href="tel:+1074832839">+107 483 2839</a>
                        </div>
                        <div class="logo"></div>
                      </div>
                      `
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/icons/location-icon.svg',
      iconImageSize: [40, 40],
      iconImageOffset: [-19, -44],
    });
    // map.controls.remove('geolocationControl'); // удаляем геолокацию
    // map.controls.remove('searchControl'); // удаляем поиск
    // map.controls.remove('trafficControl'); // удаляем контроль трафика
    // map.controls.remove('typeSelector'); // удаляем тип
    // map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    // map.controls.remove('zoomControl'); // удаляем контрол зуммирования
    // map.controls.remove('rulerControl'); // удаляем контрол правил
    map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
    map.geoObjects.add(placemark);
    placemark.balloon.open();
  };
  ymaps.ready(init);
}

function productPage() {
  const productSliderThumbs = new Swiper('.product-page__slider-thumbs', {
    slidesPerView: 'auto',
  });

  const productSliderBig = new Swiper('.product-page__slider-big', {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: productSliderThumbs
    }
  });

  //Qty//
  if (document.querySelector('.qty')) {
    const plus = document.querySelector(".plus"),
      minus = document.querySelector(".minus"),
      num = document.querySelector(".num");
    let a;

    if (localStorage["num"]) {
      num.innerText = localStorage.getItem("num");
    } else {
      let a = "01";
      num.innerText = a;
    }
    ;

    plus.addEventListener("click", () => {
      a = num.innerText;
      a++;
      a = (a < 10) ? "0" + a : a;
      localStorage.setItem("num", a);
      num.innerText = localStorage.getItem("num");
    });

    minus.addEventListener("click", () => {
      a = num.innerText;
      if (a > 1) {
        a--;
        a = (a < 10) ? "0" + a : a;
        localStorage.setItem("num", a);
        num.innerText = localStorage.getItem("num");
      }
    });
  }


  //star rating//
  const ratings = document.querySelectorAll('.rating');
  if (ratings.length > 0) {
    initRatings();
  }

  //Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    //Инициализируем конкретный рейтинг
    function initRating(rating) {
      initRatingVars(rating);
      setRatingActiveWidth();
      if (rating.classList.contains('rating_set')) {
        setRating(rating);
      }
    }
    //Инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector('.rating__active');
      ratingValue = rating.querySelector('.rating__value');
    }
    //Изменяем ширину активных звёзд
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    //Возможность указать оценку
    function setRating(rating) {
      const ratingItems = rating.querySelectorAll('.rating__item');
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener('mouseenter', function (e) {
          //Обновление переменных
          initRatingVars(rating);
          //Обновление активных звёзд
          setRatingActiveWidth(ratingItem.value);
        })
        ratingItem.addEventListener('mouseleave', function (e) {
          //Обновление активных звёзд
          setRatingActiveWidth();
        })
        ratingItem.addEventListener('click', function (e) {
          //Обновление переменных
          initRatingVars(rating);
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        })
      }
    }
  }
}

//counter//
const counter = function () {
  const btns = document.querySelectorAll('.counter__btn');
  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      const direction = this.dataset.direction;
      const inp = this.parentElement.querySelector('.counter__value');
      const currentValue = +inp.value;
      let newValue;
      if (direction === 'plus') {
        newValue = currentValue + 1;
      } else {
        newValue = currentValue - 1 > 0 ? currentValue - 1 : 0;
      }
      inp.value = newValue;
    })
  })
}
counter();

const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const body = document.body;

burger.addEventListener('click', function () {
  menu.classList.toggle('active');
  body.classList.toggle('no-scroll');
  burger.classList.toggle('active');
});


document.querySelector('.menu__link').classList.add('menu__link--active');

const menuLinks = document.querySelectorAll('.menu__link');

function UnderlineMenuLink() {
  menuLinks.forEach(function (item) {
    if (window.location.pathname.indexOf(item.getAttribute('href')) > -1) {
      menuLinks.forEach(function (el) {
        el.classList.remove('menu__link--active');
      });
      item.classList.add('menu__link--active');
    }
  });
}
UnderlineMenuLink();

const mobileMenuElements = document.querySelectorAll('.mobile-menu-element');

if (body.classList.contains('touch')) {
  mobileMenuElements.forEach(function (item) {
    item.addEventListener('click', function (e) {
      menu.classList.remove('active');
      body.classList.remove('no-scroll');
      burger.classList.remove('active');
    })
  })
}

const searchBtnMobile = document.querySelector('.form-search__btn--mobile');
const formSearch = document.querySelector('.form-search');
const headerLogo = document.querySelector('.header__logo');

document.addEventListener('click', function (e) {
  if (e.target.closest('.form-search')) {
    formSearch.classList.add('open');
    searchBtnMobile.classList.add('hide');
    headerLogo.classList.add('hide')
  }
  else {
    formSearch.classList.remove('open');
    searchBtnMobile.classList.remove('hide');
    headerLogo.classList.remove('hide')
  }
})

//popup//
const popupBtns = document.querySelectorAll('.popup-btn');
const modalOverlay = document.querySelector('.modal-overlay ');
const modals = document.querySelectorAll('.modal');
const modalWrap = document.querySelector('.modal-wrap');

popupBtns.forEach((el) => {
  el.addEventListener('click', (e) => {
    let path = e.currentTarget.getAttribute('data-path');
    modals.forEach((el) => {
      el.classList.remove('modal--visible');
    });

    document.querySelector(`[data-target="${path}"]`).classList.add('modal--visible');

    modalOverlay.classList.add('modal-overlay--visible');
    body.classList.add('noscroll');

    const closeBtn = document.querySelectorAll('.modal__btn--close');
    closeBtn.forEach(el => {
      el.addEventListener('click', () => {
        modalOverlay.classList.remove('modal-overlay--visible');
        modals.forEach((el) => {
          el.classList.remove('modal--visible');
          body.classList.remove('noscroll');
        });
      })
    })

    modalWrap.addEventListener('click', (e) => {

      if (e.target == modalWrap) {
        modalOverlay.classList.remove('modal-overlay--visible');
        modals.forEach((el) => {
          el.classList.remove('modal--visible');
          body.classList.remove('noscroll');
        });
      }
    });
  });
});


//cart calculate//
const getItemSubtotalPrice = function (input) {
  return Number(input.value) * Number(input.dataset.price);
}

function summ() {
  let totalCost = 0;
  [...document.querySelectorAll('.cart__item')].forEach(function (cartItem) {
    totalCost += getItemSubtotalPrice(cartItem.querySelector('.counter__value'));
    let itemTotalCost = cartItem.querySelector('.qty-item__summ-number');
    itemTotalCost.textContent = "$" + getItemSubtotalPrice(cartItem.querySelector('.counter__value'));
  })
  totalPriceWrapper.textContent = '$' + totalCost;
}

const totalPriceWrapper = document.querySelector('.cart__summ-value');
if (totalPriceWrapper) {
  summ();
}

// cart number calc
function cartCalc() {
  const cartNumText = document.querySelector('.user-actions__cart-number');
  let cartNum = 0;
  document.querySelectorAll('.cart__item').forEach(function (el) {
    cartNum += Number(el.querySelector('.counter__value').value);
  })
  cartNumText.textContent = cartNum;
};
cartCalc();

if (document.querySelector('.cart__body')) {
  document.querySelector('.cart__body').addEventListener('click', function (e) {
    if (e.target.closest('.qty-item__summ-btn--delete')) {
      e.target.closest('.cart__item').remove()
      summ();
      cartCalc();
    }
    else if (e.target.closest('.counter__btn')) {
      summ();
      cartCalc();
    }
  })
}


Fancybox.bind("[data-fancybox]", {});

const validateFooter = new JustValidate('.footer__form');
validateFooter
  .addField(document.querySelector('.footer__form-input'), [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    },
    {
      rule: 'email',
      errorMessage: 'Введите корректный email',
    },
  ])
  .onSuccess(e => {
    e.target.reset();
  })


const validatePopup = new JustValidate('.popup__form');
validatePopup
  .addField(document.querySelector('.popup__form-input--login'), [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    },
  ])
  .addField(document.querySelector('.popup__form-input--password'), [
    {
      rule: 'required',
      errorMessage: 'Заполните поле',
    },
    {
      rule: 'minLength',
      value: 6,
      errorMessage: 'Длина пароля не менее 8 символов',
    }
  ])
  .onSuccess(e => {
    e.target.reset();
    modalOverlay.classList.remove('modal-overlay--visible');
    modals.forEach((el) => {
      el.classList.remove('modal--visible');
      body.classList.remove('noscroll');
    });
  })


barba.init({
  transitions: [{
    name: 'opacity-transition',
    sync: true,
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0
      });
    }
  }],
  views: [{
    namespace: 'home',
    afterEnter() {
      homePage();
    }
  },
  {
    namespace: 'furniture',
    afterEnter() {
      furniturePage();
    }
  },
  {
    namespace: 'contacts',
    afterEnter() {
      contactsPage();
    }
  },
  {
    namespace: 'product',
    afterEnter() {
      productPage();
    }
  },
  ]
});

barba.hooks.enter((data) => {
  UnderlineMenuLink();
});









