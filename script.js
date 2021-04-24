const toggleMenu = () => {
  const btnMenu = document.querySelector('.header__burger-menu'),
    menu = document.querySelector('.header__menu'),
    header = document.querySelector('.header'),
    closeBtn = document.querySelector('.header__close-btn'),
    menuItems = menu.querySelectorAll('ul>li');

  const handlerMenu = () => {
    menu.classList.toggle('active-menu');
    menu.style.transform = 'translateX(0%)';
  };

  const inactiveMenu = () => {
    menu.style.transform = 'translateX(100%)';
    menu.style.transition = '1s';
  };

  btnMenu.addEventListener('click', handlerMenu);
  header.addEventListener('click', (event) => {
    let target = event.target;
    console.log(target);
    if (target.classList.contains('header__close-btn') || target.closest('a')) {
      menu.style.transform = 'translateX(100%)';
    }else if (target.closest('.header__main')) {
      inactiveMenu();
    }
  });
};

toggleMenu();


const slider = () => {
  const slider = document.querySelector('.main__slider-content'),
    slide = document.querySelectorAll('.specialties__main-content'),
    dots = document.querySelector('.specialties__slider-buttons'),
    dot = dots.querySelectorAll('.slider-button');

    let currentSlide = 0,
      interval;

    const prevSlide = (elem, index, strClass) => {
      elem[index].classList.remove(strClass);
    };
  
    const nextSlide = (elem, index, strClass) => {
      elem[index].classList.add(strClass);
    };

  const autoPlaySlide = () => {
    prevSlide(slide, currentSlide, "active");
    prevSlide(dot, currentSlide, "slider-button--active");
    currentSlide++;
    if (currentSlide >= slide.length) {
      currentSlide = 0;
    }
    nextSlide(slide, currentSlide, "active");
    nextSlide(dot, currentSlide, "slider-button--active");

  };

  const startSlide = (time = 1500) => {
    interval = setInterval(autoPlaySlide, time);
  };

  const stopSlide = () => {
    clearInterval(interval);
  };

  dots.addEventListener('click', (event) => {

    let target = event.target;

    prevSlide(slide, currentSlide, "active");
    prevSlide(dot, currentSlide, "slider-button--active");

    if (target.matches('.slider-button')) {
      dot.forEach((elem, index) => {
        if (elem === target) {
          currentSlide = index;
        }
      });
    }
    nextSlide(slide, currentSlide, "active");
    nextSlide(dot, currentSlide, "slider-button--active");

  });

  dots.addEventListener("mouseover", (event) => {
    if (event.target.matches(".slider-button")) {
      stopSlide();
    }
  });

  dots.addEventListener("mouseout", event => {
    if ( event.target.matches(".slider-button")) {
      startSlide();
    }
  });

  startSlide(2000);
};

slider();

const galleryCarousel = () => {
  class galleryCarousel {
    constructor({
      main,
      wrap,
      next,
      prev,
      infinity = true,
      position = 0,
      slidesToShow = 3,
      responsive = []
    }) {
      if (!main || !wrap) {
        console.warn('SliderCarousel: Необохдимо передать свойства "main" и "wrap"!');
      }

      this.main = document.querySelector(main);
      this.wrap = document.querySelector(wrap);
      this.slides = document.querySelector(wrap).children;
      this.next = document.querySelector(next);
      this.prev = document.querySelector(prev);
      this.slidesToShow = slidesToShow;
      this.options = {
        position,
        infinity: infinity,
        widthSlide: Math.floor((100 / this.slidesToShow)),
        maxPosition: this.slides.length - this.slidesToShow
      };
      this.responsive = responsive;
    }

    init() {
      this.addClass();
      this.addStyle();
      if(this.prev && this.next) {
        this.controlSLider();
      } 

      if (this.responsive) {
          this.responseInit();
      }
    }

    responseInit() {
      const slidesToShowDefault = this.slidesToShow,
        allResponse = this.responsive.map(item => item.breakpoint),
        maxResponse = Math.max(...allResponse);

      const checkResponse = () => {
          const widthWindow = document.documentElement.clientWidth;

          if (widthWindow < maxResponse) {
              for (let i = 0; i < allResponse.length; i++) {
                  if (widthWindow < allResponse[i]) {
                      this.slidesToShow = this.responsive[i].slideToShow;
                      this.options.widthSlide = Math.floor(100 / this.slidesToShow);
                      this.addStyle();
                  }
              }
          } else {
              this.slidesToShow = slidesToShowDefault;
              this.options.widthSlide = Math.floor(100 / this.slidesToShow);
              this.addStyle();
          }
      };

      checkResponse();

      window.addEventListener('resize', checkResponse);
  }

    addClass() {
      this.main.classList.add('main__restaurant-slider');
      this.wrap.classList.add('restaurant-slider__wrap');
      for (const item of this.slides) {
          item.classList.add('restaurant-slider__item');
      }
    }
    addStyle() {
      let style = document.createElement('style');
      style.id = 'gallery__carousel-style';

      style.textContent = `
            .main__restaurant-slider {
                position: relative !important;
                overflow: hidden !important;
                
            }
            .restaurant-slider__wrap {
                display: flex !important;
                transition: transform 0.5s !important;
                will-change: transform !important;
            }
            .restaurant-slider__item {
              flex: 0 0 ${this.options.widthSlide}% !important;
              overflowX : hidden !important;
            }
      `
      document.head.appendChild(style);

    }

    controlSLider() {
      this.prev.addEventListener('click', this.prevSlider.bind(this));
      this.next.addEventListener('click', this.nextSlider.bind(this));
    }

    prevSlider() {
        if (this.options.infinity || this.options.position > 0) {
            --this.options.position;
            if (this.options.position < 0) {
                this.options.position = this.options.maxPosition;
            }
            this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`;
        }

    }

    nextSlider() {
        if (this.options.infinity || this.options.position < this.options.maxPosition) {
            ++this.options.position;
            if (this.options.position > this.options.maxPosition) {
                this.options.position = 0;
            }
            this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`;
        }

    }
    
  }

  const options = {
    main: '#gallery>.gallery__wrapper',
    wrap: '.gallery__items',
    prev: '#gallery__btn-prev',
    next: '#gallery__btn-next',
    slidesToShow: 4,
    infinity: true,
    responsive: [{
            breakpoint: 769,
            slideToShow: 3
        },
        {
            breakpoint: 575,
            slideToShow: 2
        },
     ]
  };

  let carousel = new galleryCarousel(options);
  carousel.init();

};

galleryCarousel();



function initMap() {
  let pos = {lat: 51.48554282820047, lng: -0.1620269125278846};

  let map = new google.maps.Map(document.getElementById('map'), {center: pos,
            zoom: 18});
  let marker = new google.maps.Marker({
    position: pos,
    map: map,
    
  })
}