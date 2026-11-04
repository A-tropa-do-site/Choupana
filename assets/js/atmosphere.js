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
  let textureUrl = source.getAttribute('src');
  let textureReady = false;
  const firefox = /Firefox\//.test(navigator.userAgent) && window.innerWidth > 760;
  let preparedImage, compositeFrame = 0, compositeRevision = 0, compositeUrl;

  async function prepareMosaic() {
    const strip = document.querySelector('.mosaic-strip');
    if (!firefox || !strip || window.innerWidth <= 760) return;
    const items = [...strip.querySelectorAll('.mosaic-item')];
    await Promise.all(items.map(async item => {
      const image = item.querySelector('img');
      image.loading = 'eager';
      await image.decode().catch(() => {});
    }));
    const canvas = document.createElement('canvas');
    canvas.className = 'mosaic-cached-image';
    canvas.setAttribute('aria-hidden', 'true');
    strip.append(canvas);
    let frame = 0;
    function draw() {
      frame = 0;
      const bounds = strip.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = Math.min(1920 / bounds.width, window.devicePixelRatio || 1);
      canvas.width = Math.ceil(bounds.width * scale);
      canvas.height = Math.ceil(bounds.height * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.scale(scale, scale);
      context.fillStyle = getComputedStyle(flow).backgroundColor;
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.globalAlpha = .87;
      context.filter = 'grayscale(22%) saturate(.8)';
      for (const item of items) {
        const image = item.querySelector('img');
        if (!image.naturalWidth) return;
        const tile = item.getBoundingClientRect();
        const rect = image.getBoundingClientRect();
        const polygon = getComputedStyle(item).getPropertyValue('--shard-clip').match(/polygon\((.*)\)/);
        if (!polygon) return;
        context.save();
        context.beginPath();
        polygon[1].split(',').forEach((point, index) => {
          const [x, y] = point.trim().split(/\s+/).map(parseFloat);
          const px = tile.left - bounds.left + x * tile.width / 100;
          const py = tile.top - bounds.top + y * tile.height / 100;
          if (index) context.lineTo(px, py); else context.moveTo(px, py);
        });
        context.closePath();
        context.clip();
        const fit = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
        const width = image.naturalWidth * fit, height = image.naturalHeight * fit;
        context.drawImage(image, rect.left - bounds.left + (rect.width - width) * .5,
          rect.top - bounds.top + (rect.height - height) * .65, width, height);
        context.restore();
      }
      strip.classList.add('mosaic-rasterized');
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    schedule();
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(strip);
    else window.addEventListener('resize', schedule, { passive: true });
  }

  async function prepareBackdrop() {
    const backdrop = document.querySelector('.journey-backdrop img');
    if (!firefox || !backdrop) return;
    try {
      const rect = backdrop.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const original = new Image();
      original.src = backdrop.getAttribute('src');
      await original.decode();
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 640 / rect.width);
      canvas.width = Math.ceil(rect.width * scale);
      canvas.height = Math.ceil(rect.height * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      const color = getComputedStyle(flow).backgroundColor;
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const fit = Math.max(canvas.width / original.naturalWidth, canvas.height / original.naturalHeight);
      context.globalAlpha = .28;
      context.filter = 'saturate(.65)';
      context.drawImage(original, (canvas.width - original.naturalWidth * fit) / 2,
        (canvas.height - original.naturalHeight * fit) / 2,
        original.naturalWidth * fit, original.naturalHeight * fit);
      context.filter = 'none';
      context.globalAlpha = 1;
      const left = context.createLinearGradient(0, 0, canvas.width, 0);
      left.addColorStop(0, color);
      left.addColorStop(.35, 'transparent');
      context.fillStyle = left;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const edges = context.createLinearGradient(0, 0, 0, canvas.height);
      edges.addColorStop(0, color);
      edges.addColorStop(.1, 'transparent');
      edges.addColorStop(.85, 'transparent');
      edges.addColorStop(1, color);
      context.fillStyle = edges;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .88));
      if (!blob) return;
      backdrop.src = URL.createObjectURL(blob);
      backdrop.classList.add('journey-backdrop-ready');
    } catch { /* The original photograph remains available as a fallback. */ }
  }

  // Firefox paints this long translucent scene much more efficiently as one
  // cached static bitmap. Rebuild only when its layout changes, never on scroll.
  function scheduleComposite() {
    if (!firefox || !preparedImage || compositeFrame) return;
    compositeFrame = requestAnimationFrame(() => {
      compositeFrame = 0;
      const revision = ++compositeRevision;
      const bounds = smoke.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = Math.min(1, 960 / bounds.width, 4096 / bounds.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(bounds.width * scale);
      canvas.height = Math.ceil(bounds.height * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = getComputedStyle(flow).backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      smoke.querySelectorAll('img').forEach(image => {
        const rect = image.getBoundingClientRect();
        context.globalAlpha = Number(getComputedStyle(image).opacity);
        context.drawImage(preparedImage, (rect.left - bounds.left) * scale,
          (rect.top - bounds.top) * scale, rect.width * scale, rect.height * scale);
      });
      canvas.toBlob(blob => {
        if (!blob || revision !== compositeRevision) return;
        const previous = compositeUrl;
        compositeUrl = URL.createObjectURL(blob);
        smoke.style.backgroundImage = `url("${compositeUrl}")`;
        smoke.classList.add('smoke-rasterized');
        if (previous) URL.revokeObjectURL(previous);
      }, 'image/webp', .85);
    });
  }

  // Flatten the color filter and alpha mask once. Firefox software rendering
  // otherwise repaints several full-size filtered/masked surfaces on each scroll.
  async function prepareTexture() {
    try {
      const original = new Image();
      original.decoding = 'async';
      original.src = textureUrl;
      await original.decode();
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(960, original.naturalWidth);
      canvas.height = Math.round(canvas.width * original.naturalHeight / original.naturalWidth);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(original, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = (255 - pixels.data[i]) * .8;
        pixels.data[i + 1] = (255 - pixels.data[i + 1]) * .8;
        pixels.data[i + 2] = (255 - pixels.data[i + 2]) * .8;
      }
      context.putImageData(pixels, 0, 0);
      const fade = context.createLinearGradient(0, 0, 0, canvas.height);
      fade.addColorStop(0, 'transparent');
      fade.addColorStop(.18, '#000');
      fade.addColorStop(.76, '#000');
      fade.addColorStop(1, 'transparent');
      context.globalCompositeOperation = 'destination-in';
      context.fillStyle = fade;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .85));
      if (!blob) throw new Error('Texture unavailable');
      textureUrl = URL.createObjectURL(blob);
      const ready = new Image();
      ready.src = textureUrl;
      await ready.decode();
      preparedImage = ready;
      smoke.querySelectorAll('img').forEach(image => { image.src = textureUrl; });
      textureReady = true;
      smoke.classList.add('smoke-texture-ready');
      updateMotion();
      schedulePosition();
    } catch {
      // Decorative graphics must never compromise scrolling or content access.
      smoke.classList.add('smoke-texture-unavailable');
    }
  }
  const visiblePlumes = new Set();
  const plumeObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visiblePlumes.add(entry.target);
      else visiblePlumes.delete(entry.target);
    });
    updateMotion();
    scheduleComposite();
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
      plume.src = textureUrl;
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
    const running = textureReady && !firefox && inView && !document.hidden && document.documentElement.dataset.motionPaused !== 'true';
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
  prepareTexture();
  prepareBackdrop();
  prepareMosaic();
})();
