/* Uma composição compacta no celular; os dois cartões voltam no desktop. */
(() => {
  const button = document.querySelector('#menuLanguageToggle');
  const status = document.querySelector('#menuLanguageStatus');
  const cards = [...document.querySelectorAll('.menu-language-card')];
  if (!button || cards.length !== 2) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  const flagUS = '<img src="assets/images/flags/us.svg" alt="" width="25" height="17">';
  const flagBR = '<img src="assets/images/flags/br.svg" alt="" width="25" height="17">';
  let language = 'pt';
  function update(userChange = false) {
    const active = cards[language === 'pt' ? 0 : 1];
    cards.forEach(card => { card.hidden = mobile.matches && card !== active; });
    button.hidden = !mobile.matches;
    button.innerHTML = language === 'pt' ? `${flagUS}<span lang="en">English</span>` : `${flagBR}<span>Português</span>`;
    button.setAttribute('aria-label', language === 'pt' ? 'Ver cardápio em inglês' : 'Ver cardápio em português');
    if (userChange) {
      status.textContent = language === 'pt' ? 'Cardápio em português exibido.' : 'Cardápio em inglês exibido.';
      document.dispatchEvent(new CustomEvent('menulanguagechange', { detail: { card: active } }));
    }
  }
  button.addEventListener('click', () => { language = language === 'pt' ? 'en' : 'pt'; update(true); });
  mobile.addEventListener('change', () => update());
  update();
})();

/* A barra entra somente depois que o hero sai da área visível. */
(() => {
  const hero = document.querySelector('#inicio');
  const bar = document.querySelector('.sticky-mobile-bar');
  if (!hero || !bar) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  const header = document.querySelector('.header');

  function updateBar() {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const visible = mobile.matches && hero.getBoundingClientRect().bottom <= headerHeight;
    bar.classList.toggle('is-visible', visible);
    bar.inert = !visible;
    bar.setAttribute('aria-hidden', String(!visible));
  }

  updateBar();
  mobile.addEventListener('change', updateBar);
  window.addEventListener('pageshow', updateBar);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(updateBar, {
      threshold: 0,
      rootMargin: '-68px 0px 0px 0px'
    }).observe(hero);
  } else {
    let frame = 0;
    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; updateBar(); });
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
})();
