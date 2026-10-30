/* Cada item aparece uma vez, quando entra na tela, com intervalos de 80 ms. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const groups = document.querySelectorAll('.menu-language-grid, .family-photo-tabs, .journey-birthday-layout, .journey-location-layout');
  const pending = new Set();

  function finish(element) {
    pending.delete(element);
    element.classList.remove('cascade-item', 'cascade-visible');
    element.style.removeProperty('--cascade-delay');
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      element.classList.add('cascade-visible');
      element.addEventListener('transitionend', event => {
        if (event.target === element && event.propertyName === 'opacity') finish(element);
      });
    });
  }, { threshold: .12, rootMargin: '0px 0px -32px 0px' });

  groups.forEach(group => {
    [...group.children].forEach((element, index) => {
      pending.add(element);
      element.style.setProperty('--cascade-delay', `${Math.min(index, 4) * 80}ms`);
      element.classList.add('cascade-item');
      observer.observe(element);
    });
  });

  function showAll() {
    observer.disconnect();
    [...pending].forEach(finish);
  }
  preference.addEventListener('change', event => { if (event.matches) showAll(); });
  document.addEventListener('motionpreferencechange', () => {
    if (document.documentElement.dataset.motionPaused === 'true') showAll();
  });
  document.addEventListener('menulanguagechange', event => {
    const card = event.detail.card;
    observer.unobserve(card);
    finish(card);
  });
  window.addEventListener('beforeprint', showAll);
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.cascade-item');
    if (!element) return;
    observer.unobserve(element);
    finish(element);
  });
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
})();
