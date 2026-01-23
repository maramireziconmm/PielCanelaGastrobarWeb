// Simple include script para header y footer en sitio estático
function loadInclude(id, path) {
  fetch(path).then(r => {
    if (!r.ok) return Promise.reject('no include');
    return r.text();
  }).then(html => {
    document.getElementById(id).innerHTML = html;
  }).catch(() => {
    // si falla, no bloquea la página
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loadInclude('site-header', 'assets/partials/header.html');
  loadInclude('site-footer', 'assets/partials/footer.html');
});