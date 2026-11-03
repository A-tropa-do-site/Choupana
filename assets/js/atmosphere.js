/* Smoke stays between the leadership divider and the bottom of the map. */
(() => {
  const flow = document.querySelector('.atmosphere-flow');
  const leadership = document.querySelector('#lideranca');
  const map = document.querySelector('.journey-map');
  if (!flow || !leadership) return;

  const smoke = flow.querySelector('.leadership-smoke');
  const source = smoke?.querySelector('img');
  if (!smoke || !source) return;
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
    const geometry = {
      '--smoke-top': `${start}px`,
      '--smoke-height': `${Math.max(0, end - start)}px`,
      '--smoke-focus-y': `${Math.round(top - start)}px`,
      '--smoke-leadership-end': `${Math.round(leadEnd - start)}px`
    };
    Object.entries(geometry).forEach(([name, value]) => {
      if (flow.style.getPropertyValue(name) !== value) flow.style.setProperty(name, value);
    });

    // Overlapping copies of one cached image keep the descent continuous.
    const mobile = window.innerWidth <= 760;
    const textureHeight = window.innerWidth * (mobile ? 2.4 : 1.4) * 941 / 1672;
    const distance = Math.max(0, end - leadEnd);
    const count = Math.max(2, Math.min(mobile ? 3 : 4, Math.ceil(distance / (textureHeight * .65)) + 1));
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
    updateMotion();
  }

  let layoutFrame = 0;
  function schedulePosition() {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      positionSmoke();
    });
  }
  schedulePosition();
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(schedulePosition);
    resize.observe(flow);
    resize.observe(leadership);
  } else {
    window.addEventListener('resize', schedulePosition, { passive: true });
  }
  document.fonts?.ready.then(schedulePosition);
  window.addEventListener('load', schedulePosition, { once: true });

  let inView = true;
  function updateMotion() {
    const running = inView && !document.hidden && document.documentElement.dataset.motionPaused !== 'true';
    flow.classList.toggle('atmosphere-in-view', running);
    // Keep the complete atmosphere, but only animate two visible textures.
    // The remaining plumes stay static instead of allocating more animated layers.
    let animated = 0;
    smoke.querySelectorAll('img').forEach(image => {
      const visible = running && visiblePlumes.has(image);
      image.classList.toggle('smoke-in-view', visible);
      image.classList.toggle('smoke-animating', visible && animated++ < 2);
    });
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
