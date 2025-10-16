document.addEventListener('DOMContentLoaded', function () {

  // --- LAZY LOADING COMPLETO ---
  class LazyLoader {
    constructor() {
      this.imageObserver = null;
      this.bgObserver = null;
      this.init();
    }

    init() {
      this.setupImageLazyLoading();
      
      this.setupBackgroundLazyLoading();
    }

    setupImageLazyLoading() {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        images.forEach(img => this.imageObserver.observe(img));
      } else {
        this.loadImagesImmediately(images);
      }
    }

    setupBackgroundLazyLoading() {
      const bgElements = document.querySelectorAll('[data-bg-src]');
      
      if ('IntersectionObserver' in window) {
        this.bgObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const bgSrc = element.dataset.bgSrc;
              element.style.backgroundImage = `url('${bgSrc}')`;
              element.classList.add('bg-loaded');
              observer.unobserve(element);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        bgElements.forEach(element => this.bgObserver.observe(element));
      } else {
        this.loadBackgroundsImmediately(bgElements);
      }
    }

    loadImagesImmediately(images) {
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }

    loadBackgroundsImmediately(elements) {
      elements.forEach(element => {
        const bgSrc = element.dataset.bgSrc;
        element.style.backgroundImage = `url('${bgSrc}')`;
        element.classList.add('bg-loaded');
      });
    }
  }

  const lazyLoader = new LazyLoader();
  
  // Carregar imediatamente a imagem do hero 
  const heroSection = document.getElementById('hero');
  if (heroSection && heroSection.dataset.bgSrc) {
    const heroBg = heroSection.dataset.bgSrc;
    heroSection.style.backgroundImage = `url('${heroBg}')`;
    heroSection.classList.add('bg-loaded');
  }

  // --- Lógica do Menu Hambúrguer ---
  const hamburgerButton = document.querySelector('.hamburger-menu');
  const mainNav = document.getElementById('main-nav');

  if (hamburgerButton && mainNav) {
    hamburgerButton.addEventListener('click', () => {
      hamburgerButton.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerButton.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }

  // --- Lógica do Scroll Suave ---
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Lógica do Header Sticky e Sombra ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Lógica de Animação com Intersection Observer ---
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        if (entry.target.classList.contains('program-card')) {
          entry.target.style.transitionDelay = `${[...entry.target.parentElement.children].indexOf(entry.target) * 0}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        } else {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1
  });

  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .program-card');
  elementsToAnimate.forEach(el => observer.observe(el));

  // --- Lógica de Animação de Números ---
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);

      if (obj.dataset.prefix === '+') {
        obj.innerHTML = `+${currentValue}`;
      } else {
        obj.innerHTML = currentValue;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const numbersSection = document.getElementById('numeros');
  const numberObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberSpans = document.querySelectorAll('.numbers .number');
        numberSpans.forEach(span => {
          const text = span.textContent;
          const endValue = parseInt(text.replace('+', ''), 10);

          if (text.includes('+')) {
            span.dataset.prefix = '+';
          }

          animateValue(span, 0, endValue, 2000);
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  if (numbersSection) {
    numberObserver.observe(numbersSection);
  }

  // --- Lógica do Botão de Copiar PIX ---
  const copyPixButton = document.querySelector('.pix-qr .button');
  if (copyPixButton) {
    copyPixButton.addEventListener('click', function () {
      const pixKey = "00.000.000/0001-00";

      navigator.clipboard.writeText(pixKey).then(() => {
        const oldNotification = document.querySelector('.pix-notification');
        if (oldNotification) {
          oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'pix-notification';
        notification.textContent = 'Chave PIX copiada com sucesso!';
        document.body.appendChild(notification);

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 4000);

      }).catch(err => {
        console.error('Erro ao copiar a chave PIX: ', err);
        alert('Não foi possível copiar a chave PIX. Tente manualmente.');
      });
    });

    // --- Lógica do Carrossel de Histórias ---
    const storySlider = document.querySelector('.story-slider');
    if (storySlider) {
      const slides = Array.from(storySlider.children);
      const nextButton = document.querySelector('.carousel-button.next');
      const prevButton = document.querySelector('.carousel-button.prev');
      const dotsContainer = document.querySelector('.stories .carousel-dots');

      let currentIndex = 0;
      const slideWidth = slides[0].getBoundingClientRect().width;

      slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir para a história ${index + 1}`);
        dotsContainer.appendChild(dot);

        dot.addEventListener('click', () => {
          goToSlide(index);
        });
      });

      const dots = dotsContainer.querySelectorAll('.dot');

      const goToSlide = (index) => {
        storySlider.style.transform = 'translateX(-' + slideWidth * index + 'px)';

        dots.forEach(dot => dot.classList.remove('active'));

        currentIndex = index;

        dots[currentIndex].classList.add('active');
      };

      nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex);
      });

      prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
      });

      goToSlide(0);

      window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        storySlider.style.transition = 'none';
        storySlider.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
        setTimeout(() => {
          storySlider.style.transition = 'transform 0.5s ease-in-out';
        });
      });
    }

    // --- Lógica dos Modais de Programas ---
    const programDetails = {
      musica: {
        title: "Aulas de Música",
        body: "<p>Nossas aulas de música são um convite para explorar a criatividade e a expressão artística. Oferecemos aulas de canto coral, violão e percussão, ajudando a desenvolver a sensibilidade, o trabalho em equipe e a autoconfiança dos nossos alunos.</p>"
      },
      ingles: {
        title: "Curso de Inglês",
        body: "<p>Em um mundo globalizado, o inglês abre portas. Nosso curso é focado em conversação e atividades práticas, tornando o aprendizado divertido e eficaz para crianças e adolescentes se prepararem para um futuro com mais oportunidades.</p>"
      },
      reforco: {
        title: "Reforço Escolar",
        body: "<p>Oferecemos apoio pedagógico individualizado para ajudar os alunos a superarem suas dificuldades de aprendizado. Com tutores dedicados, focamos em matemática, português e ciências para garantir um desempenho escolar brilhante.</p>"
      },
      informatica: {
        title: "Informática e Tecnologia",
        body: "<p>Preparamos nossos jovens para o futuro digital. O curso de informática ensina desde o básico do computador até noções de Excel, Word e PowerPoint, habilidades essenciais para o século XXI.</p>"
      },
      horta: {
        title: "Horta Comunitária",
        body: "<p>Na nossa horta, as crianças aprendem na prática sobre o ciclo da vida, sustentabilidade, trabalho em equipe e a importância de uma alimentação saudável. Elas plantam, cuidam e colhem, conectando-se com a natureza.</p>"
      }
    };


    const modalOverlay = document.querySelector('.modal-overlay');
    const learnMoreLinks = document.querySelectorAll('.learn-more');

    if (modalOverlay && learnMoreLinks.length > 0) {
      const modalContainer = document.querySelector('.modal-container');
      const modalTitle = document.getElementById('modal-title');
      const modalBody = document.getElementById('modal-body');
      const closeModalBtn = document.querySelector('.modal-close-btn');

      const openModal = (programKey) => {
        const details = programDetails[programKey];
        if (details) {
          modalTitle.textContent = details.title;
          modalBody.innerHTML = details.body;
          modalOverlay.classList.add('active');
        }
      };

      const closeModal = () => {
        modalOverlay.classList.remove('active');
      };

      learnMoreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();

          const button = e.currentTarget;
          const circle = document.createElement('span');
          const diameter = Math.max(button.clientWidth, button.clientHeight);
          const radius = diameter / 2;

          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.clientX - (button.getBoundingClientRect().left + radius)}px`;
          circle.style.top = `${e.clientY - (button.getBoundingClientRect().top + radius)}px`;
          circle.classList.add('ripple');

          const existingRipple = button.querySelector('.ripple');
          if (existingRipple) {
            existingRipple.remove();
          }

          button.appendChild(circle);
          const programKey = link.dataset.program;
          openModal(programKey);
        });
      });

      closeModalBtn.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', (e) => {

        if (e.target === modalOverlay) {
          closeModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
          closeModal();
        }
      });
    }
  }


  // --- Lógica dos Carrosséis de Imagens ---
  const products = document.querySelectorAll('.product');

  products.forEach(product => {
    const images = product.querySelectorAll('.carousel-image');
    const prevButton = product.querySelector('.carousel-nav-btn.prev');
    const nextButton = product.querySelector('.carousel-nav-btn.next');
    const dotsContainer = product.querySelector('.carousel-dots');
    let currentImageIndex = 0;

    if (images.length > 1) {
      images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) {
          dot.classList.add('active');
        }
        if (dotsContainer) {
          dot.addEventListener('click', () => goToImage(index));
          dotsContainer.appendChild(dot);
        }
      });

      const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : null;

      const goToImage = (index) => {
        images[currentImageIndex].classList.remove('active');
        if (dots) {
          dots[currentImageIndex].classList.remove('active');
        }
        images[index].classList.add('active');
        if (dots) {
          dots[index].classList.add('active');
        }
        currentImageIndex = index;
      };

      if (prevButton) {
        prevButton.addEventListener('click', () => {
          const newIndex = (currentImageIndex - 1 + images.length) % images.length;
          goToImage(newIndex);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          const newIndex = (currentImageIndex + 1) % images.length;
          goToImage(newIndex);
        });
      }
    }
  });

  // --- Lógica de Efeito Hover nos Cards ---
  const cards = document.querySelectorAll('.program-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      card.style.transform = `scale(1.05)`;
      card.classList.add('hovering');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateZ(0) rotateX(0) rotateY(0) scale(1)';
      card.classList.remove('hovering');
    });
  });


  // --- Lógica de Animação de Texto por Letra ---
  function animateTextByLetter(element, delayStart = 0, speedMultiplier = 0.02, onComplete = null) {
    const originalText = element.innerHTML;
    const text = element.textContent;
    element.innerHTML = "";

    element.style.visibility = "visible";

    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animation = `fadeInLeft 0.3s ease forwards`;
      span.style.animationDelay = `${delayStart + i * speedMultiplier}s`;
      element.appendChild(span);
    });

    if (originalText.includes("<br")) {
      element.innerHTML = element.innerHTML.replace(/(de Cada Vez)/, '$1<br>');
    }

    if (onComplete) {
      const totalDuration = (delayStart + text.length * speedMultiplier) * 1000 + 300;
      setTimeout(onComplete, totalDuration);
    }
  }

  const h1 = document.getElementById("hero-title");
  const p = document.getElementById("hero-paragraph");
  const heroButtons = document.querySelector(".hero-buttons");

  animateTextByLetter(h1, 0, 0.028);

  setTimeout(() => {
    animateTextByLetter(p, 0, 0.015);
  }, 100);

  setTimeout(() => {
    heroButtons.style.opacity = 1;
    heroButtons.style.transform = "translateY(0)";
  }, 1600);

});

// ======================================
// CARROSSEL DE MOMENTOS QUE MARCAM A HISTÓRIA
// ======================================

document.addEventListener('DOMContentLoaded', function() {

  const momentsSlider = document.querySelector('.moments-slider');
  const momentsSlides = document.querySelectorAll('.moment-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (!momentsSlider || momentsSlides.length === 0) return;
  
  let currentIndex = 0;
  let filteredSlides = Array.from(momentsSlides);
  let currentFilter = 'todos';
  let autoplayInterval;
  let touchStartX = 0;
  let touchEndX = 0;
  
  function init() {
    const cards = document.querySelectorAll('.moment-card');
    cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index);
      
      addInteractiveElements(card);
      
      addMouse3DEffects(card);
    });
    
    createIndicators();
    updateCarousel();
    setupEventListeners();
    startAutoplay();
  }
  
  function addInteractiveElements(card) {
    const shineEffect = document.createElement('div');
    shineEffect.className = 'shine-effect';
    card.appendChild(shineEffect);
    
    const magicParticles = document.createElement('div');
    magicParticles.className = 'magic-particles';
    card.appendChild(magicParticles);
    
    card.addEventListener('click', function(e) {
      createRippleEffect(e, this);
    });
  }
  
  function createRippleEffect(event, card) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(231, 111, 81, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10';
    
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    card.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  function addMouse3DEffects(card) {
    card.addEventListener('mousemove', function(e) {
      if (this.matches(':hover')) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `
          translateY(-8px) 
          scale(1.02) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
        
        const shineEffect = this.querySelector('.shine-effect');
        if (shineEffect) {
          const shineX = (x / rect.width) * 100;
          const shineY = (y / rect.height) * 100;
          shineEffect.style.background = `
            radial-gradient(
              circle at ${shineX}% ${shineY}%,
              rgba(255,255,255,0.6) 0%,
              rgba(255,255,255,0.3) 30%,
              transparent 70%
            )
          `;
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      
      const shineEffect = this.querySelector('.shine-effect');
      if (shineEffect) {
        shineEffect.style.background = '';
      }
    });
  }
  
  let mouseHoverNavigation = false;
  let mousePosition = 0;
  let hoverSpeed = 0;
  
  function getCarouselDimensions() {
    const container = document.querySelector('.moments-carousel-container');
    const slider = document.querySelector('.moments-slider');
    
    if (!container || !slider) return null;
    
    const containerWidth = container.offsetWidth - 40; 
    const gap = 20;
    
    const slideElement = slider.querySelector('.moment-slide');
    if (!slideElement) return null;
    
    const tempSlide = slideElement.cloneNode(true);
    tempSlide.style.position = 'absolute';
    tempSlide.style.visibility = 'hidden';
    tempSlide.style.flex = '1';
    tempSlide.style.minWidth = '250px';
    tempSlide.style.maxWidth = '400px';
    document.body.appendChild(tempSlide);
    
    const slideWidth = tempSlide.offsetWidth;
    document.body.removeChild(tempSlide);
    
    const visibleSlides = Math.max(1, Math.floor(containerWidth / (slideWidth + gap)));
    
    const totalSlides = filteredSlides.length;
    const totalWidth = totalSlides * slideWidth + (totalSlides - 1) * gap;
    
    
    const maxTranslate = totalWidth > containerWidth ? -(totalWidth - containerWidth) : 0;
    
    return {
      containerWidth,
      slideWidth,
      gap,
      visibleSlides,
      totalSlides,
      totalWidth,
      maxTranslate
    };
  }
  
  function setupMouseHoverNavigation() {
    const container = document.querySelector('.moments-carousel-container');
    const slider = document.querySelector('.moments-slider');
    
    if (!container || !slider) return;
    
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    function handleMouseMove(e) {
      if (!mouseHoverNavigation) return;
      
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const mouseX = e.clientX - rect.left;
      
      mousePosition = mouseX / containerWidth;
      
      const center = 0.5;
      const distanceFromCenter = Math.abs(mousePosition - center);
      const maxDistance = 0.4; 
      
      if (distanceFromCenter > 0.1) { 
        const speedMultiplier = Math.min((distanceFromCenter - 0.1) / (maxDistance - 0.1), 1);
        hoverSpeed = speedMultiplier * 20 ; 
      
        if (mousePosition > center) {
          hoverSpeed = -hoverSpeed; 
        } else {
          hoverSpeed = hoverSpeed; 
        }
      } else {
        hoverSpeed = 0;
      }
    }
    
    function handleMouseEnter() {
      mouseHoverNavigation = true;
      startHoverAnimation();
    }
    
    function handleMouseLeave() {
      mouseHoverNavigation = false;
      hoverSpeed = 0;
      cancelAnimationFrame(hoverAnimationId);
    }
    
    function startHoverAnimation() {
      if (!mouseHoverNavigation) return;
      
      const dims = getCarouselDimensions();
      if (!dims) {
        hoverAnimationId = requestAnimationFrame(startHoverAnimation);
        return;
      }
      
      if (hoverSpeed !== 0) {
        currentTranslate += hoverSpeed;
        
        currentTranslate = Math.max(dims.maxTranslate, Math.min(0, currentTranslate));
        
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${currentTranslate}px)`;
        
        currentIndex = Math.round(Math.abs(currentTranslate) / (dims.slideWidth + dims.gap));
        
        updateIndicators();
      }
      
      hoverAnimationId = requestAnimationFrame(startHoverAnimation);
    }
  }
  
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let prevTranslate = 0;
  let currentTranslate = 0;
  let animationId = 0;
  
  function setupDragListeners() {
    const slider = document.querySelector('.moments-slider');
    const container = document.querySelector('.moments-carousel-container');
    
    if (!slider || !container) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let swipeThreshold = 50; 
    
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      e.preventDefault();
    });
    
    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('dragging');
    });
    
    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');
    });
    
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = true;
      container.classList.add('dragging');
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchEndX = e.changedTouches[0].screenX;
      
      const diff = touchStartX - touchEndX;
      const currentScroll = slider.scrollLeft;
      slider.scrollLeft = currentScroll + diff;
      
      touchStartX = touchEndX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      container.classList.remove('dragging');
      
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeDistance = touchStartX - touchEndX;
      const absSwipeDistance = Math.abs(swipeDistance);
      
      if (absSwipeDistance > swipeThreshold) {
        if (swipeDistance > 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }
      }
    }
    
    container.addEventListener('touchmove', (e) => {
      if (isSwiping) {
        e.preventDefault();
      }
    }, { passive: false });
    
    container.addEventListener('touchstart', () => {
      slider.style.transition = 'none';
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
      slider.style.transition = 'transform 0.3s ease';
    }, { passive: true });
    
    let lastTouchX = 0;
    container.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const currentTouchX = e.changedTouches[0].screenX;
      const deltaX = currentTouchX - lastTouchX;
      
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if ((slider.scrollLeft <= 0 && deltaX > 0) || 
          (slider.scrollLeft >= maxScroll && deltaX < 0)) {
        const resistance = 0.3;
        slider.scrollLeft -= deltaX * resistance;
      }
      
      lastTouchX = currentTouchX;
    }, { passive: true });
    
    slider.removeEventListener('mousedown', dragStart);
    slider.removeEventListener('mousemove', dragMove);
    slider.removeEventListener('mouseup', dragEnd);
    slider.removeEventListener('mouseleave', dragEnd);
    slider.removeEventListener('touchstart', dragStart);
    slider.removeEventListener('touchmove', dragMove);
    slider.removeEventListener('touchend', dragEnd);
    
    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('mousemove', dragMove);
    slider.addEventListener('mouseup', dragEnd);
    slider.addEventListener('mouseleave', dragEnd);
    
    slider.addEventListener('touchstart', dragStart);
    slider.addEventListener('touchmove', dragMove);
    slider.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
      if (e.target.closest('.moment-card')) {
        return;
      }
      
      isDragging = true;
      container.classList.add('dragging');
      
      if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
      } else {
        startX = e.clientX;
      }
      
      cancelAnimationFrame(animationId);
      slider.style.transition = 'none';
      
      const dims = getCarouselDimensions();
      if (!dims) return;
      
      prevTranslate = Math.max(dims.maxTranslate, Math.min(0, currentTranslate));
    }
    
    function dragMove(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
      } else {
        currentX = e.clientX;
      }
      
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      
      const dims = getCarouselDimensions();
      if (!dims) return;
      
      currentTranslate = Math.max(dims.maxTranslate, Math.min(0, currentTranslate));
      
      slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function dragEnd() {
      if (!isDragging) return;
      
      isDragging = false;
      container.classList.remove('dragging');
      
      const dims = getCarouselDimensions();
      if (!dims) return;
      
      const slideTotalWidth = dims.slideWidth + dims.gap;
      
      const targetTranslate = Math.round(currentTranslate / slideTotalWidth) * slideTotalWidth;
      const finalTranslate = Math.max(dims.maxTranslate, Math.min(0, targetTranslate));
      
      slider.style.transition = 'transform 0.3s ease';
      slider.style.transform = `translateX(${finalTranslate}px)`;
      
      currentIndex = Math.round(Math.abs(finalTranslate) / slideTotalWidth);
      
      prevTranslate = finalTranslate;
      currentTranslate = finalTranslate;
      
      setTimeout(() => {
        slider.style.transition = '';
      }, 300);
      
      updateIndicators();
    }
  }
  
  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    
    const dims = getCarouselDimensions();
    if (!dims) return;
    
    const slidesPerView = Math.max(1, Math.floor((dims.containerWidth + dims.gap) / (dims.slideWidth + dims.gap)));
    const totalGroups = Math.ceil(filteredSlides.length / slidesPerView);
    
    for (let i = 0; i < totalGroups; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('indicator');
      indicator.addEventListener('click', () => goToGroup(i));
      indicatorsContainer.appendChild(indicator);
    }
  }
  
  function updateCarousel() {
    if (filteredSlides.length === 0) {
      showNoResults();
      return;
    }
    
    hideNoResults();
    
    if (currentIndex >= filteredSlides.length) {
      currentIndex = 0;
    }
    
    const slider = document.querySelector('.moments-slider');
    const dims = getCarouselDimensions();
    
    if (!dims || !slider) return;
    
    const offset = -(currentIndex * (dims.slideWidth + dims.gap));
    
    const finalOffset = Math.max(dims.maxTranslate, Math.min(0, offset));
    
    slider.style.transform = `translateX(${finalOffset}px)`;
    
    currentTranslate = finalOffset;
    prevTranslate = finalOffset;
    
    updateIndicators();
  }
  
  function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('.indicator');
    const dims = getCarouselDimensions();
    
    if (!dims || indicators.length === 0) return;
    
    const slidesPerView = Math.max(1, Math.floor((dims.containerWidth + dims.gap) / (dims.slideWidth + dims.gap)));
    const currentGroup = Math.floor(currentIndex / slidesPerView);
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentGroup);
    });
  }
  
  
  function goToSlide(index) {
    if (index >= 0 && index < filteredSlides.length) {
      currentIndex = index;
      updateCarousel();
      resetAutoplay();
    }
  }
  
  function goToGroup(groupIndex) {
    const dims = getCarouselDimensions();
    if (!dims) return;
    
    const slidesPerView = Math.max(1, Math.floor((dims.containerWidth + dims.gap) / (dims.slideWidth + dims.gap)));
    const totalGroups = Math.ceil(filteredSlides.length / slidesPerView);
    
    if (groupIndex >= 0 && groupIndex < totalGroups) {
      currentIndex = groupIndex * slidesPerView;
      
      if (currentIndex >= filteredSlides.length) {
        currentIndex = Math.max(0, (totalGroups - 1) * slidesPerView);
      }
      
      updateCarousel();
      resetAutoplay();
    }
  }
  
  function filterSlides(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    if (filter === 'todos') {
      filteredSlides = Array.from(momentsSlides);
    } else if (filter === 'recentes') {
      filteredSlides = Array.from(momentsSlides).filter(slide => {
        const categories = slide.dataset.category ? slide.dataset.category.split(' ') : [];
        return categories.includes('recentes');
      });
    } else {
      filteredSlides = Array.from(momentsSlides).filter(slide => {
        const categories = slide.dataset.category ? slide.dataset.category.split(' ') : [];
        return categories.includes(filter);
      });
    }
    
    momentsSlides.forEach(slide => {
      if (filteredSlides.includes(slide)) {
        slide.classList.remove('hidden');
        slide.classList.add('visible');
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('visible');
      }
    });
    
    currentIndex = 0;
    currentTranslate = 0;
    prevTranslate = 0;
    
    setTimeout(() => {
      const visibleCards = document.querySelectorAll('.moment-slide:not(.hidden) .moment-card');
      visibleCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
      });
    }, 100);
    
    createIndicators();
    updateCarousel();
    resetAutoplay();
    
    addFilterAnimation();
  }
  
  function addFilterAnimation() {
    const visibleSlides = document.querySelectorAll('.moment-slide.visible');
    visibleSlides.forEach((slide, index) => {
      slide.style.opacity = '0';
      slide.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        slide.style.transition = 'all 0.5s ease';
        slide.style.opacity = '1';
        slide.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  function showNoResults() {
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results';
      noResultsMsg.innerHTML = `
        <div class="icon">📭</div>
        <h3>Nenhum momento encontrado</h3>
        <p>Tente selecionar outra categoria ou volte para ver todos os momentos.</p>
      `;
      momentsSlider.parentElement.appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = 'block';
    momentsSlider.style.display = 'none';
    indicatorsContainer.style.display = 'none';
  }
  
  function hideNoResults() {
    const noResultsMsg = document.querySelector('.no-results');
    if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
    momentsSlider.style.display = 'flex';
    indicatorsContainer.style.display = 'flex';
  }
  
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }
  
  function setupEventListeners() {
    setupDragListeners();
    
    setupMouseHoverNavigation();
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-category');
        filterSlides(filter);
      });
    });
  }
  
  init();
  
  window.momentsCarousel = {
    filterSlides,
    getCurrentIndex: () => currentIndex,
    getCurrentFilter: () => currentFilter,
    getFilteredSlides: () => filteredSlides
  };
});