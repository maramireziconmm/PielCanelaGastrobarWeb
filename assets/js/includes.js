// Carga de partials y menú móvil
// loadInclude devuelve una Promise para poder inicializar el menú después de la carga.
function loadInclude(id, path) {
  return fetch(path).then(r => {
    if (!r.ok) return Promise.reject(new Error('no include: ' + path));
    return r.text();
  }).then(html => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
    return html;
  }).catch((err) => {
    // si falla, mostramos en consola (no bloquea la página)
    console.warn('Include failed:', path, err);
    return Promise.resolve('');
  });
}

function initMobileNav() {
  const siteNav = document.querySelector('.site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!siteNav || !navToggle || !navLinks) return;

  // Función para actualizar estado accesible
  function setOpen(open) {
    siteNav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    // alternar iconos
    const icHamb = navToggle.querySelector('.icon-hamb');
    const icClose = navToggle.querySelector('.icon-close');
    if (icHamb && icClose) {
      icHamb.style.display = open ? 'none' : '';
      icClose.style.display = open ? '' : 'none';
    }
  }

  // Toggle on click
  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = siteNav.classList.contains('open');
    setOpen(!isOpen);
  });

  // Close when clicking a link (good UX)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!siteNav.classList.contains('open')) return;
    if (!siteNav.contains(e.target)) setOpen(false);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) {
      setOpen(false);
    }
  });
}

// Cargar header y footer y luego inicializar el menú
document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    loadInclude('site-header', 'assets/partials/header.html'),
    loadInclude('site-footer', 'assets/partials/footer.html')
  ]).then(() => {
    // inicializa menú móvil (si existe)
    initMobileNav();
  });
});