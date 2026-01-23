// Carga de partials y manejo robusto del menú móvil.
// Usa event delegation para que el botón hamburguesa funcione incluso si el header
// se inyecta dinámicamente o si el usuario tiene el header inline.

function loadInclude(id, path) {
  // Intenta cargar el partial; en caso de fallo devuelve '' para no bloquear.
  return fetch(path).then(r => {
    if (!r.ok) return Promise.reject(new Error('no include: ' + path));
    return r.text();
  }).then(html => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
    return html;
  }).catch((err) => {
    console.warn('Include failed:', path, err);
    return Promise.resolve('');
  });
}

// Inicialización adicional: accesibilidad y comportamiento del menú móvil
function initMobileNav() {
  // No dependemos de querySelector aquí para soportar header inline o inyectado más tarde.
  // Usamos event delegation: escuchamos clicks en document y detectamos .nav-toggle y enlaces del nav.
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.nav-toggle');
    if (toggle) {
      // Encontrar el contenedor .site-nav más cercano
      const siteNav = toggle.closest('.site-nav');
      if (!siteNav) return;
      const willOpen = !siteNav.classList.contains('open');
      siteNav.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      // alternar iconos si existen
      const icHamb = toggle.querySelector('.icon-hamb');
      const icClose = toggle.querySelector('.icon-close');
      if (icHamb && icClose) {
        icHamb.style.display = willOpen ? 'none' : '';
        icClose.style.display = willOpen ? '' : 'none';
      }
      // prevent click from bubbling further (avoid immediately closing by outside click handler)
      e.stopPropagation();
      return;
    }

    // Si clic en enlace dentro del nav (delegación), cerramos el menú (UX típico)
    const navLink = e.target.closest('.nav-links a');
    if (navLink) {
      const siteNav = document.querySelector('.site-nav');
      const toggleBtn = document.querySelector('.nav-toggle');
      if (siteNav) siteNav.classList.remove('open');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      // swap icons back if needed
      if (toggleBtn) {
        const icHamb = toggleBtn.querySelector('.icon-hamb');
        const icClose = toggleBtn.querySelector('.icon-close');
        if (icHamb && icClose) { icHamb.style.display = ''; icClose.style.display = 'none'; }
      }
    }
  });

  // Cerrar al pulsar fuera (si está abierto)
  document.addEventListener('click', function (e) {
    const siteNav = document.querySelector('.site-nav');
    if (!siteNav) return;
    if (!siteNav.classList.contains('open')) return;
    // Si el click no ocurrió dentro del siteNav, cerramos
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

  // Cerrar con ESC
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

// Carga los partials y luego asegura la inicialización del nav.
// Si no puedes usar fetch por file://, loadInclude devolverá '' y aún así initMobileNav funcionará (delegación).
document.addEventListener('DOMContentLoaded', function () {
  // Intentamos cargar partials; si fallan, no bloqueamos.
  Promise.allSettled([
    loadInclude('site-header', 'assets/partials/header.html'),
    loadInclude('site-footer', 'assets/partials/footer.html')
  ]).then(() => {
    // Inicializar comportamiento del menú inmediatamente (event delegation)
    initMobileNav();
  });
});