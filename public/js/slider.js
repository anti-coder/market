
    'use strict';

this.el = document.createElement('body'); // создаем тело документа

    // верстка основы слайдера 
    let template = `
      <div id="mainCarousel" class="main-carousel carousel slide">
        <ol class="carousel-indicators">
            <li data-target="#mainCarousel" data-slide-to="0" class="carousel-indicator"></li>
            <li data-target="#mainCarousel" data-slide-to="1" class="carousel-indicator"></li>
            <li data-target="#mainCarousel" data-slide-to="2" class="carousel-indicator"></li>
        </ol>
        <div class="carousel-inner">
            <!--Вот здесь будет активный слайд-->
        </div>
        <button class="carousel-control-prev" href="#mainCarousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </button>
        <button class="carousel-control-next" href="#mainCarousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </button>
      </div>
    `;
    this.el.insertAdjacentHTML(`beforeend`, template); // вставляем основу слайдера в тело документа





    
    let slideShow = (function () {
      return function (selector, config) {
        let
          _slider = document.querySelector(selector), // основный элемент блока
          _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
          _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекция .slider-item
          _sliderControls = _slider.querySelectorAll('.slider__control'), // элементы управления
          _currentPosition = 0, // позиция левого активного элемента
          _transformValue = 0, // значение транфсофрмации .slider_wrapper
          _transformStep = 100, // величина шага (для трансформации)
          _itemsArray = [], // массив элементов
          _timerId,
          _indicatorItems,
          _indicatorIndex = 0,
          _indicatorIndexMax = _sliderItems.length - 1,
          _stepTouch = 50,
          _config = {
            isAutoplay: false, // автоматическая смена слайдов
            directionAutoplay: 'next', // направление смены слайдов
            delayAutoplay: 5000, // интервал между автоматической сменой слайдов
            isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
          };

        // настройка конфигурации слайдера в зависимости от полученных ключей
        for (let key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        // наполнение массива _itemsArray
        for (let i = 0, length = _sliderItems.length; i < length; i++) {
          _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
        }

        // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
        let position = {
          getItemIndex: function (mode) {
            let index = 0;
            for (let i = 0, length = _itemsArray.length; i < length; i++) {
              if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                index = i;
              }
            }
            return index;
          },
          getItemPosition: function (mode) {
            return _itemsArray[position.getItemIndex(mode)].position;
          }
        };

        // функция, выполняющая смену слайда в указанном направлении
        let _move = function (direction) {
          let nextItem, currentIndicator = _indicatorIndex;;
          if (direction === 'next') {
            _currentPosition++;
            if (_currentPosition > position.getItemPosition('max')) {
              nextItem = position.getItemIndex('min');
              _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
              _itemsArray[nextItem].transform += _itemsArray.length * 100;
              _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
            }
            _transformValue -= _transformStep;
            _indicatorIndex = _indicatorIndex + 1;
            if (_indicatorIndex > _indicatorIndexMax) {
              _indicatorIndex = 0;
            }
          } else {
            _currentPosition--;
            if (_currentPosition < position.getItemPosition('min')) {
              nextItem = position.getItemIndex('max');
              _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
              _itemsArray[nextItem].transform -= _itemsArray.length * 100;
              _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
            }
            _transformValue += _transformStep;
            _indicatorIndex = _indicatorIndex - 1;
            if (_indicatorIndex < 0) {
              _indicatorIndex = _indicatorIndexMax;
            }
          }
          _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
          _indicatorItems[currentIndicator].classList.remove('active');
          _indicatorItems[_indicatorIndex].classList.add('active');
        };

        // функция, осуществляющая переход к слайду по его порядковому номеру
        let _moveTo = function (index) {
          let i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
          while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
            _move(direction);
            i++;
          }
        };

        // функция для запуска автоматической смены слайдов через промежутки времени
        let _startAutoplay = function () {
          if (!_config.isAutoplay) {
            return;
          }
          _stopAutoplay();
          _timerId = setInterval(function () {
            _move(_config.directionAutoplay);
          }, _config.delayAutoplay);
        };

        // функция, отключающая автоматическую смену слайдов
        let _stopAutoplay = function () {
          clearInterval(_timerId);
        };

        // функция, добавляющая индикаторы к слайдеру
        let _addIndicators = function () {
          let indicatorsContainer = document.createElement('ol');
          indicatorsContainer.classList.add('slider__indicators');
          for (let i = 0, length = _sliderItems.length; i < length; i++) {
            let sliderIndicatorsItem = document.createElement('li');
            if (i === 0) {
              sliderIndicatorsItem.classList.add('active');
            }
            sliderIndicatorsItem.setAttribute("data-slide-to", i);
            indicatorsContainer.appendChild(sliderIndicatorsItem);
          }
          _slider.appendChild(indicatorsContainer);
          _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };

        let _isTouchDevice = function () {
          return !!('ontouchstart' in window || navigator.maxTouchPoints);
        };

        // функция, осуществляющая установку обработчиков для событий 
        let _setUpListeners = function () {
          let _startX = 0;
          if (_isTouchDevice()) {
            _slider.addEventListener('touchstart', function (e) {
              _startX = e.changedTouches[0].clientX;
              _startAutoplay();
            });
            _slider.addEventListener('touchend', function (e) {
              let
                _endX = e.changedTouches[0].clientX,
                _deltaX = _endX - _startX;
              if (_deltaX > _stepTouch) {
                _move('prev');
              } else if (_deltaX < -_stepTouch) {
                _move('next');
              }
              _startAutoplay();
            });
          } else {
            for (let i = 0, length = _sliderControls.length; i < length; i++) {
              _sliderControls[i].classList.add('slider__control_show');
            }
          }
          _slider.addEventListener('click', function (e) {
            if (e.target.classList.contains('slider__control')) {
              e.preventDefault();
              _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
              _startAutoplay();
            } else if (e.target.getAttribute('data-slide-to')) {
              e.preventDefault();
              _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
              _startAutoplay();
            }
          });
          document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === "hidden") {
              _stopAutoplay();
            } else {
              _startAutoplay();
            }
          }, false);
          if (_config.isPauseOnHover && _config.isAutoplay) {
            _slider.addEventListener('mouseenter', function () {
              _stopAutoplay();
            });
            _slider.addEventListener('mouseleave', function () {
              _startAutoplay();
            });
          }
        };

        // добавляем индикаторы к слайдеру
        _addIndicators();
        // установливаем обработчики для событий
        _setUpListeners();
        // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
        _startAutoplay();

        return {
          // метод слайдера для перехода к следующему слайду
          next: function () {
            _move('next');
          },
          // метод слайдера для перехода к предыдущему слайду          
          left: function () {
            _move('prev');
          },
          // метод отключающий автоматическую смену слайдов
          stop: function () {
            _config.isAutoplay = false;
            _stopAutoplay();
          },
          // метод запускающий автоматическую смену слайдов
          cycle: function () {
            _config.isAutoplay = true;
            _startAutoplay();
          }
        }
      }
    }());

    slideShow('.slider', {
      isAutoplay: true
    });
 
