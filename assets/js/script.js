/* ==========================================================================
   CONFIG — VX Creative
   Substitua os valores abaixo pelos dados reais antes de publicar.
   ========================================================================== */
const CONFIG = {
  WHATSAPP_NUMBER: '5591981601528',
  WHATSAPP_MESSAGE: 'Olá! Conheci a VX Creative pelo site e gostaria de conversar sobre um projeto.',
  EMAIL: 'victorpamplona6@gmail.com',
  INSTAGRAM: 'https://www.instagram.com/vxcreative_/',
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
  if ('IntersectionObserver' in window && revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    document.documentElement.classList.add('vx-reveal');
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
    const viewport = projectsCarousel.querySelector('.projects-carousel__viewport');
    const slides = Array.from(projectsCarousel.querySelectorAll('.project-card--carousel'));
    const prev = projectsCarousel.querySelector('[data-project-prev]');
    const next = projectsCarousel.querySelector('[data-project-next]');
    const current = projectsCarousel.querySelector('[data-project-current]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;

    const positionFor = (slide) => Math.min(
      slide.offsetLeft - slides[0].offsetLeft,
      Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    );

    const syncControls = () => {
      const left = viewport.scrollLeft;
      let nearestDistance = Infinity;
      slides.forEach((slide, slideIndex) => {
        const distance = Math.abs(positionFor(slide) - left);
        if (distance < nearestDistance) {
          index = slideIndex;
          nearestDistance = distance;
        }
      });
      if (current) current.textContent = String(index + 1).padStart(2, '0');
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= slides.length - 1;
    };

    const goTo = (nextIndex) => {
      const slide = slides[nextIndex];
      if (!slide) return;
      viewport.scrollTo({
        left: positionFor(slide),
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      });
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    viewport.addEventListener('scroll', syncControls, { passive: true });
    window.addEventListener('resize', syncControls);

    projectsCarousel.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
    });

    syncControls();
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
