/* Smoke stays between the leadership divider and the bottom of the map. */
(() => {
  const flow = document.querySelector('.atmosphere-flow');
  const leadership = document.querySelector('#lideranca');
  const map = document.querySelector('.journey-map');
  if (!flow || !leadership) return;

  const smoke = flow.querySelector('.leadership-smoke');
  const source = smoke.querySelector('img');
  const trails = document.createElement('div');
  trails.className = 'smoke-trails';
  smoke.append(trails);
  const visiblePlumes = new Set();
  const plumeObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visiblePlumes.add(entry.target);
      else visiblePlumes.delete(entry.target);
    });
    updateMotion();
  }, { rootMargin: '150px' }) : null;
  smoke.querySelectorAll('img').forEach(image => {
    if (plumeObserver) plumeObserver.observe(image);
    else visiblePlumes.add(image);
  });

  function positionSmoke() {
    const origin = flow.getBoundingClientRect().top;
    const anchor = window.matchMedia('(max-width: 760px)').matches ? document.querySelector('#comemoracoes') : leadership;
    const top = anchor.getBoundingClientRect().top - origin;
    const start = Math.ceil(Math.max(0, top));
    const leadEnd = top + anchor.offsetHeight;
    const end = Math.floor(map ? map.getBoundingClientRect().bottom - origin : leadEnd);
    flow.style.setProperty('--smoke-top', `${Math.round(start)}px`);
    flow.style.setProperty('--smoke-height', `${Math.round(end - start)}px`);
    flow.style.setProperty('--smoke-focus-y', `${Math.round(top - start)}px`);
    flow.style.setProperty('--smoke-leadership-end', `${Math.round(leadEnd - start)}px`);

    // Overlapping copies of one cached image keep the descent continuous.
    const mobile = window.innerWidth <= 760;
    const textureHeight = window.innerWidth * (mobile ? 2.4 : 1.4) * 941 / 1672;
    const distance = Math.max(0, end - leadEnd);
    const count = Math.max(2, Math.min(8, Math.ceil(distance / (textureHeight * .65)) + 1));
    while (trails.childElementCount < count) {
      const plume = document.createElement('img');
      plume.src = source.getAttribute('src');
      plume.alt = '';
      plume.width = 1672;
      plume.height = 941;
      plume.decoding = 'async';
      plume.loading = 'lazy';
      plume.className = 'smoke-plume--trail';
      trails.append(plume);
      if (plumeObserver) plumeObserver.observe(plume);
      else visiblePlumes.add(plume);
    }
    while (trails.childElementCount > count) {
      const plume = trails.lastElementChild;
      plumeObserver?.unobserve(plume);
      visiblePlumes.delete(plume);
      plume.remove();
    }
    [...trails.children].forEach((plume, index) => {
      const progress = index / (count - 1);
      const y = leadEnd - start - textureHeight * .24 + progress * Math.max(0, distance - textureHeight * .64);
      plume.style.setProperty('--trail-y', `${Math.round(y)}px`);
      plume.style.setProperty('--trail-x', `${index % 2 ? -5 : -35}%`);
      plume.style.setProperty('--trail-opacity', (.06 * (1 - progress) ** 1.3 + .008).toFixed(3));
      plume.style.setProperty('--trail-duration', `${32 + index * 3}s`);
      plume.style.setProperty('--trail-delay', `${index * -7}s`);
    });
  }

  positionSmoke();
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(positionSmoke);
    resize.observe(flow);
    resize.observe(leadership);
  } else {
    window.addEventListener('resize', positionSmoke, { passive: true });
  }
  document.fonts?.ready.then(positionSmoke);
  window.addEventListener('load', positionSmoke, { once: true });

  let inView = true;
  function updateMotion() {
    const running = inView && !document.hidden && document.documentElement.dataset.motionPaused !== 'true';
    flow.classList.toggle('atmosphere-in-view', running);
    smoke.querySelectorAll('img').forEach(image => image.classList.toggle('smoke-in-view', running && visiblePlumes.has(image)));
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateMotion();
    }, { rootMargin: '150px' }).observe(flow.querySelector('.leadership-smoke'));
  }
  document.addEventListener('visibilitychange', updateMotion);
  document.addEventListener('motionpreferencechange', updateMotion);
  updateMotion();
})();
