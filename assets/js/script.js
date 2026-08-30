/* ==========================================================================
   CONFIG — Victor Pamplona
   Substitua os valores abaixo pelos dados reais antes de publicar.
   ========================================================================== */
const CONFIG = {
  // TODO: coloque o número real no formato internacional, sem espaços ou símbolos.
  WHATSAPP_NUMBER: '5591981302939', // ex: 5591990000000
  WHATSAPP_MESSAGE: 'Olá, Victor! Conheci seu trabalho pelo site e gostaria de conversar sobre um projeto.',
  // TODO: e-mail e instagram reais de Victor.
  EMAIL: 'victorpamplona6@gmail.com',
  INSTAGRAM: 'https://instagram.com/vxctt._',
};

function buildWhatsAppLink(customMessage){
  const msg = encodeURIComponent(customMessage || CONFIG.WHATSAPP_MESSAGE);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Wire up every WhatsApp CTA on the page ---- */
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const custom = el.getAttribute('data-whatsapp-message');
    el.setAttribute('href', buildWhatsAppLink(custom));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-email]').forEach(el => {
    el.setAttribute('href', `mailto:${CONFIG.EMAIL}`);
  });
  document.querySelectorAll('[data-instagram]').forEach(el => {
    el.setAttribute('href', CONFIG.INSTAGRAM);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ---- Lucide icons ---- */
  if (window.lucide) { window.lucide.createIcons(); }

  /* ---- Navbar scroll state ---- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const burger = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Projects carousel ---- */
  const projectsCarousel = document.querySelector('[data-projects-carousel]');
  if (projectsCarousel) {
    const track = projectsCarousel.querySelector('.projects-carousel__track');
    const slides = Array.from(projectsCarousel.querySelectorAll('.project-card--carousel'));
    const prev = projectsCarousel.querySelector('[data-project-prev]');
    const next = projectsCarousel.querySelector('[data-project-next]');
    const current = projectsCarousel.querySelector('[data-project-current]');
    let index = 0;

    const renderCarousel = () => {
      if (!track || !slides.length) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const width = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = `translate3d(-${index * width}px, 0, 0)`;
      if (current) current.textContent = String(index + 1).padStart(2, '0');
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    };

    const goTo = (nextIndex) => {
      index = Math.max(0, Math.min(slides.length - 1, nextIndex));
      renderCarousel();
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    window.addEventListener('resize', renderCarousel);

    projectsCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    });
    projectsCarousel.setAttribute('tabindex', '0');

    // Touch swipe on mobile.
    let touchStartX = null;
    projectsCarousel.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    projectsCarousel.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    renderCarousel();
  }

  /* ---- Optional contact form -> redirects to WhatsApp with prefilled context ---- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('nome') || '').toString().trim();
      const company = (data.get('empresa') || '').toString().trim();
      const type = (data.get('tipo') || '').toString().trim();
      const message = (data.get('mensagem') || '').toString().trim();
      const feedback = form.querySelector('.form-feedback');

      if (!name || !message) {
        if (feedback) {
          feedback.textContent = 'Preencha ao menos seu nome e uma breve mensagem.';
          feedback.classList.add('is-error');
        }
        return;
      }

      const parts = [
        `Olá, Victor! Meu nome é ${name}.`,
        company ? `Empresa/marca: ${company}.` : null,
        type ? `Tipo de projeto: ${type}.` : null,
        `Mensagem: ${message}`,
      ].filter(Boolean);

      if (feedback) {
        feedback.textContent = 'Mensagem enviada com sucesso. Você será direcionado ao WhatsApp.';
        feedback.classList.remove('is-error');
      }

      window.open(buildWhatsAppLink(parts.join(' ')), '_blank', 'noopener');
      form.reset();
    });
  }
});
