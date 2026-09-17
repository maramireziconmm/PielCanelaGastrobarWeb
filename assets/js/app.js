/* ==========================================================================
   Piel Canela — app.js
   Modo oscuro/claro · idioma ES/EN · animaciones al hacer scroll ·
   botón volver arriba · loading screen · banner de cookies ·
   formulario de contacto (validación + envío) · consentimiento para GTM
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- 1) Quitar loading screen cuando la página está lista ---------------- */
  function hideLoader() {
    document.documentElement.classList.add("is-loaded");
  }
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
    // Salvaguarda: nunca bloquear la página más de 1.2s aunque algo tarde
    setTimeout(hideLoader, 1200);
  }

  /* ---------------- 2) Tema claro/oscuro ---------------- */
  var THEME_KEY = "pc-theme";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(saved);
  }
  initTheme();

  /* ---------------- 3) Diccionario de idioma ---------------- */
  var LANG_KEY = "pc-lang";
  var DICT = {
    en: {
      "nav.home": "Specialties",
      "nav.raciones": "Dishes",
      "nav.menus": "Set menus",
      "nav.arroces": "Rice & Lamb",
      "nav.grupos": "Groups",
      "nav.vinos": "Wine list",
      "nav.contacto": "Contact",
      "hero.cta.menu": "See our menu",
      "hero.cta.book": "Book a table",
      "cta.strip.title": "Craving something delicious?",
      "cta.strip.text": "Book your table in Valladolid and enjoy our home-style dishes.",
      "cta.strip.btn": "Book now",
      "footer.legal.notice": "Legal notice",
      "footer.legal.privacy": "Privacy policy",
      "footer.legal.cookies": "Cookies policy",
      "cookie.text": "We use our own and third-party cookies to improve your experience and analyse site traffic. You can accept them, reject them or read more in our",
      "cookie.link": "cookies policy",
      "cookie.accept": "Accept",
      "cookie.reject": "Reject",
      "backtotop.label": "Back to top",
      "whatsapp.label": "Chat on WhatsApp",
      "theme.toggle": "Toggle dark mode",
      "lang.toggle": "Switch to Spanish"
    },
    es: {
      "nav.home": "Especialidades",
      "nav.raciones": "Raciones",
      "nav.menus": "Menús",
      "nav.arroces": "Arroces y Lechazo",
      "nav.grupos": "Grupos",
      "nav.vinos": "Carta Vinos",
      "nav.contacto": "Contacto",
      "hero.cta.menu": "Ver nuestra carta",
      "hero.cta.book": "Reservar mesa",
      "cta.strip.title": "¿Se te antoja algo rico?",
      "cta.strip.text": "Reserva tu mesa en Valladolid y disfruta de nuestra cocina casera.",
      "cta.strip.btn": "Reservar ahora",
      "footer.legal.notice": "Aviso legal",
      "footer.legal.privacy": "Política de privacidad",
      "footer.legal.cookies": "Política de cookies",
      "cookie.text": "Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico del sitio. Puedes aceptarlas, rechazarlas o leer más en nuestra",
      "cookie.link": "política de cookies",
      "cookie.accept": "Aceptar",
      "cookie.reject": "Rechazar",
      "backtotop.label": "Volver arriba",
      "whatsapp.label": "Escríbenos por WhatsApp",
      "theme.toggle": "Cambiar a modo oscuro",
      "lang.toggle": "Switch to English"
    }
  };

  function translatePage(lang) {
    var dict = DICT[lang] || DICT.es;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-label");
      if (dict[key]) el.setAttribute("aria-label", dict[key]);
    });
    document.documentElement.setAttribute("lang", lang);
    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.textContent = lang === "es" ? "EN" : "ES";
  }
  function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    var lang = saved || "es";
    translatePage(lang);
  }
  initLang();

  /* ---------------- 4) Delegación de clicks: tema, idioma, volver arriba ---------------- */
  document.addEventListener("click", function (e) {
    var themeBtn = e.target.closest("#theme-toggle");
    if (themeBtn) {
      var current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
      return;
    }
    var langBtn = e.target.closest("#lang-toggle");
    if (langBtn) {
      var saved = null;
      try { saved = localStorage.getItem(LANG_KEY); } catch (err) {}
      var next = (saved || "es") === "es" ? "en" : "es";
      try { localStorage.setItem(LANG_KEY, next); } catch (err) {}
      translatePage(next);
      return;
    }
    var topBtn = e.target.closest("#back-to-top");
    if (topBtn) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  });

  /* ---------------- 5) Header con sombra al hacer scroll + botón volver arriba ---------------- */
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var nav = document.querySelector(".site-nav");
    if (nav) nav.classList.toggle("scrolled", y > 8);
    var topBtn = document.getElementById("back-to-top");
    if (topBtn) topBtn.classList.toggle("visible", y > 480);
    lastY = y;
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- 6) Animaciones al hacer scroll (reveal) ---------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
  initReveal();

  /* ---------------- 7) Banner de cookies + consentimiento para GTM ---------------- */
  var COOKIE_KEY = "pc-cookie-consent";
  function grantAnalytics() {
    if (window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
    }
    window.dispatchEvent(new Event("pc-analytics-consent-granted"));
  }
  function initCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var consent = null;
    try { consent = localStorage.getItem(COOKIE_KEY); } catch (e) {}
    if (consent === "accepted") { grantAnalytics(); return; }
    if (consent === "rejected") return;
    requestAnimationFrame(function () {
      setTimeout(function () { banner.classList.add("visible"); }, 600);
    });
    banner.addEventListener("click", function (e) {
      if (e.target.closest(".cookie-accept")) {
        try { localStorage.setItem(COOKIE_KEY, "accepted"); } catch (err) {}
        banner.classList.remove("visible");
        grantAnalytics();
      } else if (e.target.closest(".cookie-reject")) {
        try { localStorage.setItem(COOKIE_KEY, "rejected"); } catch (err) {}
        banner.classList.remove("visible");
      }
    });
  }
  initCookieBanner();

  /* ---------------- 8) Formulario de contacto: validación + envío (FormSubmit) ---------------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector("button[type=submit]");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim() === "" || /^[0-9()+\s-]{6,20}$/.test(v.trim()); },
      message: function (v) { return v.trim().length >= 10; }
    };
    var messages = {
      name: "Escribe tu nombre (mínimo 2 caracteres).",
      email: "Escribe un email válido.",
      phone: "Revisa el formato del teléfono.",
      message: "Cuéntanos algo más (mínimo 10 caracteres)."
    };

    function fieldRow(input) { return input.closest(".form-row"); }

    function validateField(input) {
      var name = input.name;
      var validator = validators[name];
      if (!validator) return true;
      var ok = validator(input.value);
      var row = fieldRow(input);
      if (row) {
        row.classList.toggle("has-error", !ok);
        var err = row.querySelector(".field-error");
        if (err && messages[name]) err.textContent = messages[name];
      }
      return ok;
    }

    // Validación "al salir del campo" (exit) y al escribir si ya había error
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        var row = fieldRow(input);
        if (row && row.classList.contains("has-error")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot anti-spam: si el campo oculto tiene valor, es un bot
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      var fields = form.querySelectorAll("input[name], textarea[name]");
      var allOk = true;
      fields.forEach(function (input) {
        if (validators[input.name] && !validateField(input)) allOk = false;
      });

      if (status) {
        status.classList.remove("show", "success", "error");
      }

      if (!allOk) {
        if (status) {
          status.textContent = "Revisa los campos marcados en rojo antes de enviar.";
          status.classList.add("show", "error");
        }
        var firstError = form.querySelector(".form-row.has-error input, .form-row.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.setAttribute("disabled", "disabled");
      submitBtn.classList.add("is-loading");

      var endpoint = form.getAttribute("data-ajax-action") || form.action;
      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              status.textContent = "¡Gracias! Hemos recibido tu mensaje y te contestaremos lo antes posible.";
              status.classList.add("show", "success");
            }
          } else {
            throw new Error("submit failed");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = "No se pudo enviar el mensaje. Prueba de nuevo o escríbenos directamente a pielcanelagastrobar@gmail.com.";
            status.classList.add("show", "error");
          }
        })
        .finally(function () {
          submitBtn.removeAttribute("disabled");
          submitBtn.classList.remove("is-loading");
        });
    });
  }
  initContactForm();

  /* ---------------- 9) Marcar enlace de navegación activo ---------------- */
  function markActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }
  markActiveNav();

  /* ---------------- 10) Año del footer ---------------- */
  function setFooterYear() {
    var y = document.getElementById("footer-year");
    if (y) y.textContent = new Date().getFullYear();
  }
  setFooterYear();

  /* ---------------- 11) Cuando header/footer se inyectan de forma asíncrona ---------------- */
  document.addEventListener("pc:partials-loaded", function () {
    var lang = "es";
    try { lang = localStorage.getItem(LANG_KEY) || "es"; } catch (e) {}
    translatePage(lang);
    markActiveNav();
    setFooterYear();
  });
})();
