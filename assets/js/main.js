/**
 * CHOUPANA RESTAURANTE & PIZZARIA — "A RAINHA DAS BATIDAS"
 * Scripts de Interatividade & Drawer Navigation (Estilo Barbacoa)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. HERO SLIDESHOW COM SLOW ZOOM IN (BARBACOA STYLE)
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 7000);
  }

  // 3. MENU HAMBÚRGUER & DRAWER LATERAL (OFF-CANVAS)
  const drawerToggle = document.getElementById('drawerToggle');
  const drawerClose = document.getElementById('drawerClose');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (drawerToggle) drawerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. CARDÁPIO TABS (D.O.M. STYLE)
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const tabContents = document.querySelectorAll('.menu-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // 5. WHATSAPP GENERATOR PARA ANIVERSÁRIOS & RESERVAS
  const bdayForm = document.getElementById('bdayForm');
  if (bdayForm) {
    bdayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bdayName').value.trim();
      const date = document.getElementById('bdayDate').value;
      const guests = document.getElementById('bdayGuests').value;

      const message = `Olá, Equipe Choupana! Gostaria de consultar disponibilidade para comemorar um aniversário.\n\n• Nome: ${name}\n• Data: ${date}\n• Nº de Convidados: ${guests} pessoas`;
      const encodedMsg = encodeURIComponent(message);
      
      window.open(`https://api.whatsapp.com/send?phone=551124400545&text=${encodedMsg}`, '_blank');
    });
  }

  // 6. SMOOTH SCROLL PARA LINKS ÂNCORA
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
