// Menú móvil: accesibilidad y comportamiento.
// La cabecera y el pie ahora van escritos directamente en cada página
// (ya no se cargan con fetch), así que esto funciona igual tanto si
// abres el archivo con doble clic (file://) como si está publicado
// en un servidor. Usamos event delegation para que funcione siempre.

function initMobileNav() {
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.nav-toggle');
    if (toggle) {
      const siteNav = toggle.closest('.site-nav');
      if (!siteNav) return;
      const willOpen = !siteNav.classList.contains('open');
      siteNav.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      const icHamb = toggle.querySelector('.icon-hamb');
      const icClose = toggle.querySelector('.icon-close');
      if (icHamb && icClose) {
        icHamb.style.display = willOpen ? 'none' : '';
        icClose.style.display = willOpen ? '' : 'none';
      }
      e.stopPropagation();
      return;
    }

    const navLink = e.target.closest('.nav-links a');
    if (navLink) {
      const siteNav = document.querySelector('.site-nav');
      const toggleBtn = document.querySelector('.nav-toggle');
      if (siteNav) siteNav.classList.remove('open');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      if (toggleBtn) {
        const icHamb = toggleBtn.querySelector('.icon-hamb');
        const icClose = toggleBtn.querySelector('.icon-close');
        if (icHamb && icClose) { icHamb.style.display = ''; icClose.style.display = 'none'; }
      }
    }
  });

  document.addEventListener('click', function (e) {
    const siteNav = document.querySelector('.site-nav');
    if (!siteNav) return;
    if (!siteNav.classList.contains('open')) return;
    if (!siteNav.contains(e.target)) {
      siteNav.classList.remove('open');
      const toggleBtn = document.querySelector('.nav-toggle');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      if (toggleBtn) {
        const icHamb = toggleBtn.querySelector('.icon-hamb');
        const icClose = toggleBtn.querySelector('.icon-close');
        if (icHamb && icClose) { icHamb.style.display = ''; icClose.style.display = 'none'; }
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const siteNav = document.querySelector('.site-nav');
      if (siteNav && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        const toggleBtn = document.querySelector('.nav-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        if (toggleBtn) {
          const icHamb = toggleBtn.querySelector('.icon-hamb');
          const icClose = toggleBtn.querySelector('.icon-close');
          if (icHamb && icClose) { icHamb.style.display = ''; icClose.style.display = 'none'; }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  // La cabecera y el pie ya están en el HTML desde el primer render,
  // así que avisamos a app.js inmediatamente (antes se esperaba al fetch).
  document.dispatchEvent(new CustomEvent('pc:partials-loaded'));
});
