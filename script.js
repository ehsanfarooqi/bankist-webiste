// Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const footer = document.querySelector('.footer__nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

// Modal window
const openModal = function () {
  modal.classList.remove('hiden');
  overlay.classList.remove('hiden');
};

const closeModal = function () {
  modal.classList.add('hiden');
  overlay.classList.add('hiden');
};

btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hiden')) {
    closeModal();
  }
});

// Button scroll
btnScrollTo.addEventListener('click', function () {
  const s1Coords = section1.getBoundingClientRect();

  // Trick one
  //   scrollTo(
  //     s1Coords.left + window.pageXOffset,
  //     s1Coords.top + window.pageYOffset
  //   );

  // Trick two
  window.scrollTo({
    left: s1Coords.left + window.pageXOffset,
    top: s1Coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
});

// Navigation Scrool

//1. Implement Delegation Trick
// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// 2. Impelement Bubbling Trick
// 1. Add event iistener to common parent element
// 2. Detarmine what element originated the event
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.preventDefault();

//   // Maching Stratigy
//   if (e.target.classList.contains('nav__link')) {
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   }
// });

// Tab event
tabsContainer.addEventListener('click', function (e) {
  const cliked = e.target.closest('.operations__tab');

  if (!cliked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );

  cliked.classList.add('operations__tab--active');

  document
    .querySelector(`.operation__content--${cliked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Header Links mouseover and mouseout events
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const closet = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    closet.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Footer links mouseover and mouseout events
const handleFoterHover = function (e) {
  if (e.target.classList.contains('footer__link')) {
    const fotLink = e.target;
    const closest = fotLink
      .closest('.footer')
      .querySelectorAll('.footer__link');
    const logo = fotLink.closest('.footer').querySelector('img');

    closest.forEach(el => {
      if (el !== fotLink) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
footer.addEventListener('mouseover', handleFoterHover.bind(0.5));
footer.addEventListener('mouseout', handleFoterHover.bind(1));

// Sticky Navigation Scroll

/*
    // Trick 1
    const initailCoords = section1.getBoundingClientRect();
    window.addEventListener('scroll', function (e) {
    if (this.window.scrollY > initailCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
    });
*/
// Trick 2
const navHeigh = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObser = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeigh}px`,
});
headerObser.observe(header);

// Reveal Section
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hiden');
  observer.unobserve(entry.target);
};
const revealObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  revealObserver.observe(section);
  section.classList.add('section--hiden');
});

//Loading Lazy Imges
const loadImg = document.querySelectorAll('img[data-src]');

const lazyImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  observer.unobserve(entry.target);

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};
const lazyObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});
loadImg.forEach(img => lazyObserver.observe(img));

// Slider

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;
// Functions

const activeDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const goToSlides = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

// Next Slides
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlides(curSlide);
  activeDots(curSlide);
};

// Prev Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlides(curSlide);
  activeDots(curSlide);
};

const init = function () {
  goToSlides(0);
  createDots();

  activeDots(0);
};
init();
// Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlides(slide);
    activeDots(slide);
  }
});
