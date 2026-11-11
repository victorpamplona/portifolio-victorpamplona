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

  /* ---- Section-aware navigation, without changing native anchor behavior ---- */
  const navigationLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sectionMap = new Map(Array.from(navigationLinks).map(link => [link.getAttribute('href').slice(1), link]));
  if ('IntersectionObserver' in window) {
    const sections = Array.from(sectionMap.keys()).map(id => document.getElementById(id)).filter(Boolean);
    const updateActive = id => navigationLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const sectionObserver = new IntersectionObserver(entries => {
      const candidates = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (candidates.length) updateActive(candidates[0].target.id);
    }, { rootMargin: '-20% 0px -54% 0px', threshold: [0,.15,.4] });
    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---- Mobile menu ---- */
  const burger = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    const closeMobileMenu = () => {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    };
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        burger.focus();
      }
    });
  }

  /* ---- Accessible single-open FAQ accordion ---- */
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const shouldOpen = !item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('is-open');
        const control = other.querySelector('.faq-item__q');
        const panel = other.querySelector('.faq-item__a');
        if (control) control.setAttribute('aria-expanded', 'false');
        if (panel) panel.inert = true;
      });
      if (shouldOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        const panel = item.querySelector('.faq-item__a');
        if (panel) panel.inert = false;
      }
    });
  });

  /* ---- VX atmospheric light: desktop pointer only, no extra canvas or libraries ---- */
  const vxHero = document.querySelector('.vx-atmosphere-host');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (vxHero && !motionPreference.matches && finePointer.matches) {
    let pointerFrame = 0;
    let nextX = 72, nextY = 44;
    let isVisible = true;
    const paintLight = () => {
      pointerFrame = 0;
      if (!isVisible) return;
      vxHero.style.setProperty('--vx-light-x', nextX.toFixed(1) + '%');
      vxHero.style.setProperty('--vx-light-y', nextY.toFixed(1) + '%');
    };
    const scheduleLight = () => {
      if (!pointerFrame && isVisible) pointerFrame = window.requestAnimationFrame(paintLight);
    };
    vxHero.addEventListener('pointermove', (event) => {
      const bounds = vxHero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      nextX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      nextY = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
      scheduleLight();
    }, { passive: true });
    vxHero.addEventListener('pointerleave', () => {
      nextX = 72; nextY = 44;
      scheduleLight();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
        if (!isVisible && pointerFrame) {
          window.cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
        }
      }, { threshold: 0 }).observe(vxHero);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
    });
  }

  /* ---- Reveal headings and imagery once as they enter the viewport ---- */
  const vxMotionTargets = document.querySelectorAll('.vx-projects .project-card__visual, .vx-services__heading h2, .vx-process__intro h2, .vx-about__heading h2, .vx-faq__intro h2, .vx-final h2');
  if (vxMotionTargets.length && !motionPreference.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vx-motion-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -12px 0px' });
    vxMotionTargets.forEach(target => {
      target.classList.add('vx-motion-ready');
      revealObserver.observe(target);
    });
  }

  /* ---- Magnetic microinteractions: fine pointers only, never hijack click ---- */
  if (!motionPreference.matches && finePointer.matches) {
    const magnets = document.querySelectorAll('.hero__actions .btn, .navbar__cta .btn, .vx-process__footer .btn, .vx-final__actions .btn');
    magnets.forEach(button => {
      let raf = 0;
      let x = 0, y = 0;
      const update = () => {
        raf = 0;
        button.style.setProperty('--vx-magnet-x', x.toFixed(1) + 'px');
        button.style.setProperty('--vx-magnet-y', y.toFixed(1) + 'px');
      };
      const schedule = () => { if (!raf) raf = window.requestAnimationFrame(update); };
      button.classList.add('vx-magnetic');
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        x = Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * .09));
        y = Math.max(-5, Math.min(5, (event.clientY - rect.top - rect.height / 2) * .11));
        schedule();
      }, { passive:true });
      const reset = () => { x=0; y=0; schedule(); };
      button.addEventListener('pointerleave', reset);
      button.addEventListener('blur', reset);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && raf) { window.cancelAnimationFrame(raf); raf=0; reset(); }
      });
    });
  }

  /* ---- Atmospheric chapter transitions: observer adds only non-blocking accents ---- */
  const chapterSections = document.querySelectorAll('#projetos, #servicos, #processo, #sobre, #faq, #contato');
  if ('IntersectionObserver' in window && chapterSections.length && !motionPreference.matches) {
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vx-chapter-entered');
          chapterObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin:'0px 0px -13% 0px', threshold: .08 });
    chapterSections.forEach(section => {
      section.classList.add('vx-chapter-ready');
      chapterObserver.observe(section);
    });
  }

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
