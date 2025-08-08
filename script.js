document.addEventListener('DOMContentLoaded', function () {

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

  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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
  }, { threshold: 0.5 });

  if (numbersSection) {
    numberObserver.observe(numbersSection);
  }

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

     // Lógica do carrossel de histórias (testimonials)
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

 
// Lógica para o carrossel de imagens dentro de cada 'product'
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
        


   function animateTextByLetter(element, delayStart = 0, speedMultiplier = 0.02, onComplete = null) {
    const originalText = element.innerHTML;
    const text = element.textContent;
    element.innerHTML = "";

      element.style.visibility = "visible";

    [...text].forEach((char, i) => {
    const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char; // preserva espaços
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

  // Inicia a animação do h1 imediatamente
  animateTextByLetter(h1, 0, 0.028);

  // Inicia a animação do p com um pequeno delay fixo
  // Ajuste o valor de 0.8s para controlar a velocidade da transição
   setTimeout(() => {
    animateTextByLetter(p, 0, 0.015); 
  }, 100);

  // Inicia a animação dos botões logo após o p
  setTimeout(() => {
    heroButtons.style.opacity = 1;
    heroButtons.style.transform = "translateY(0)";
  }, 1600); // 800ms (p) + 800ms (duração da animação)
});

});

 