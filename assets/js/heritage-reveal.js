/* Ilustrações completas e independentes, reveladas uma a uma ao rolar. */
(() => {
  const art = document.querySelector('#tradicao .heritage-art');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!art || preference.matches || document.documentElement.dataset.motionPaused === 'true' || !('IntersectionObserver' in window)) return;
  const icons = [...art.querySelectorAll('[data-heritage-icon]')];
  let requested = 0, revealed = 0, timer = null, stopped = false;
  function revealNext() {
    timer = null;
    if (stopped || revealed >= requested) return;
    icons[revealed++].classList.add('is-visible');
    timer = setTimeout(revealNext, 220);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      requested = Math.max(requested, Number(entry.target.dataset.heritageIcon));
      observer.unobserve(entry.target);
    });
    if (timer === null) revealNext();
  }, { threshold: .15, rootMargin: '0px 0px -15% 0px' });
  art.classList.add('heritage-reveal-ready');
  icons.forEach(icon => observer.observe(icon));
  function showAll() {
    stopped = true;
    clearTimeout(timer);
    observer.disconnect();
    art.classList.remove('heritage-reveal-ready');
  }
  preference.addEventListener('change', event => { if (event.matches) showAll(); });
  document.addEventListener('motionpreferencechange', () => {
    if (document.documentElement.dataset.motionPaused === 'true') showAll();
  });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
})();
