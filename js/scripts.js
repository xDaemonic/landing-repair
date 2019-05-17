/* Навигация по файлу

1. Переменные
2. Настройки слайдера
3. Функции для отложенной загрузки яндекс.карт
4. Показываем попап по клику на кнопку в хедере
5. Показываем попап по клику на кнопки карточек
6. Скрываем попап по клику на крестик
7. Маски для все инпутов с типом tel
8. Валидатор для всех форм
9. Загрузка карты при появлении в области видимости
10.Отправка форм AJAX */





/* 1.Переменные */

let inputPhones = $('input[type=tel]');
let forms = $('form');
let cardsBtn = $('.price-box_button');



/* 2.Настройки слайдера */

$('.work-slider').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: '<div class="left-arrow"></div>',
  nextArrow: '<div class="right-arrow"></div>',
  responsive: [{

      breakpoint: 1200,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }


  ]
});

/* 3.Функции для отложенной загрузки яндекс.карт */

//Переменная для включения/отключения индикатора загрузки
var spinner = $('.map-container').children('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
var myMapTemp, myPlacemarkTemp;

//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init() {
  var myMapTemp = new ymaps.Map("map", {
    center: [55.730138, 37.594238], // координаты центра на карте
    zoom: 14, // коэффициент приближения карты
    controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании
  });
  var myPlacemarkTemp = new ymaps.GeoObject({
    geometry: {
      type: "Point",
      coordinates: [55.730138, 37.594238] // координаты, где будет размещаться флажок на карте
    }
  });
  myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
  myMapTemp.behaviors.disable('scrollZoom');
  // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
  var layer = myMapTemp.layers.get(0).get(0);

  // Решение по callback-у для определения полной загрузки карты
  waitForTilesLoad(layer).then(function () {
    // Скрываем индикатор загрузки после полной загрузки карты
    spinner.removeClass('is-active');
  });
}

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
function waitForTilesLoad(layer) {
  return new ymaps.vow.Promise(function (resolve, reject) {
    var tc = getTileContainer(layer),
      readyAll = true;
    tc.tiles.each(function (tile, number) {
      if (!tile.isReady()) {
        readyAll = false;
      }
    });
    if (readyAll) {
      resolve();
    } else {
      tc.events.once("ready", function () {
        resolve();
      });
    }
  });
}

function getTileContainer(layer) {
  for (var k in layer) {
    if (layer.hasOwnProperty(k)) {
      if (
        layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
        layer[k] instanceof ymaps.layer.tileContainer.DomContainer
      ) {
        return layer[k];
      }
    }
  }
  return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback) {
  var script = document.createElement("script");

  if (script.readyState) { // IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" ||
        script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // Другие браузеры
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}



$(document).ready(function () {

  /* 4.Показываем попап по клику на кнопку в хедере */

  $('.header-cont_button').on('click', function () {
    $('.popup-success').removeClass('removeTop');
    $('.popup-request').removeClass('removeTop');
    $('.overlay').css('display', 'block');
    setTimeout(function () {
      $('.overlay').toggleClass('overlay-active');
    }, 300);
    setTimeout(function () {
      $('.popup-request').toggleClass('dropTop');
    }, 500)
  });



  /*  5.Показываем попап по клику на кнопки карточек */

  cardsBtn.on('click', function (event) {
    event.preventDefault();
    $('.popup-success').removeClass('removeTop');
    $('.popup-request').removeClass('removeTop');
    $('.overlay').css('display', 'block');
    setTimeout(function () {
      $('.overlay').toggleClass('overlay-active');
    }, 300);
    setTimeout(function () {
      $('.popup-request').toggleClass('dropTop');
    }, 500)
  })



  /* 6.Скрываем попап по клику на крестик */

  $('.close').on('click', function () {
    $('.popup-request').addClass('removeTop');
    $('.popup-request').toggleClass('dropTop');
    setTimeout(function () {
      $('.overlay').toggleClass('overlay-active');
    }, 300);
    setTimeout(function () {
      $('.overlay').css('display', 'none');
    }, 500);
  });

  $('.success-button').on('click', function () {
    $('.popup-success').addClass('removeTop');
    $('.popup-success').toggleClass('dropTop');
    setTimeout(function () {
      $('.overlay').removeClass('overlay-active');
    }, 300);
    setTimeout(function () {
      $('.overlay').css('display', 'none');
    }, 500);
  })

  /* 7.Маски для все инпутов с типом tel */

  inputPhones.each(function () {
    $(this).mask('+7(999) 999-9999');
  });



  /* 8.Валидатор для всех форм */
  forms.each(function () {
    $(this).validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        },
        phone: {
          required: true
        }
      },
      messages: {
        name: {
          required: 'Это обязательное поле',
          minlength: 'Не менее 3 символов'
        },
        phone: {
          required: 'Это обязательное поле'
        }
      },
      submitHandler: function (form, event) {
        event.preventDefault();
        $.ajax({
          type: 'POST',
          url: '../mailer/smart.php',
          data: $(this).serialize(),
          success: function () {
            forms.each(function () {
              $(this).trigger('reset');
            });
            if ($('.overlay').hasClass('overlay-active')) {
              $('.popup-request').addClass('removeTop');
              $('.popup-request').toggleClass('dropTop');
              setTimeout(function () {
                $('.popup-success').addClass('dropTop');
              }, 300);
            } else {
              $('.popup-request').removeClass('removeTop');
              $('.popup-success').removeClass('removeTop');
              $('.overlay').css('display', 'block');
              setTimeout(function () {
                $('.overlay').addClass('overlay-active');
              }, 300);
              setTimeout(function () {
                $('.popup-success').addClass('dropTop');
              }, 500);
            }

          }
        })
      }
    })
  })



  /* 9.Загрузка карты при появлении в области видимости */

  $(window).on('scroll', function () {
    let road = $('#map').offset()['top'];
    let scroll = $(window).scrollTop();
    let winHeight = $(window).height();
    let come = scroll + winHeight;

    if (road < (come)) {
      if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

        // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
        check_if_load = true;

        // Показываем индикатор загрузки до тех пор, пока карта не загрузится
        spinner.addClass('is-active');

        // Загружаем API Яндекс.Карт
        loadScript("https://api-maps.yandex.ru/2.1?apikey=b94eb56c-18c8-4df2-b6a4-2bf15f878911&lang=ru_RU&amp;loadByRequire=1", function () {
          // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
          ymaps.load(init);
        });
      }
      $(window).off('scroll');
    }
  })
});

/* 10.Отправка форм AJAX */


/*      $('.offer-form').on('submit', function (event) {
       event.preventDefault();
       $.ajax({
         type: 'POST',
         url: '../mailer/smart.php',
         data: $(this).serialize(),
         success: function () {
           if ($('.overlay').hasClass('overlay-active')) {
             $('.popup-request').addClass('removeTop');
             $('.popup-request').toggleClass('dropTop');
             setTimeout(function () {
               $('.popup-success').addClass('dropTop');
             }, 300);
           } else {
             $('.overlay').css('display', 'block');
             setTimeout(function () {
               $('.overlay').addClass('overlay-active');
             }, 300);
             setTimeout(function () {
               $('.popup-success').addClass('dropTop');
             }, 500);
           }
         }
       })
     }) */