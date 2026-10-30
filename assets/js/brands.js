/* Progressive enhancement: without JavaScript, every brand stays visible. */
(() => {
  const section = document.querySelector('.section-brands');
  if (!section) return;

  const track = section.querySelector('.brands-track');
  const list = section.querySelector('.brands-list');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('inert', '');
  copy.querySelectorAll('img').forEach(image => { image.alt = ''; });
  track.append(copy);
  track.classList.add('is-animated');

  function updateMotion() {
    track.classList.toggle('is-paused', reducedMotion.matches || document.documentElement.dataset.motionPaused === 'true');
  }

  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('motionpreferencechange', updateMotion);
  updateMotion();
})();
