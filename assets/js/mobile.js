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
