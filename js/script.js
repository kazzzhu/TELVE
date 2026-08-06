/* ===================================================================
   TELVE C.A. — Lógica de la página
   =================================================================== */

/* -------------------------------------------------------------------
    DATOS DEL TALLER — edita aquí y se actualiza en toda la web
   ------------------------------------------------------------------- */
const CONFIG = {
  // Número de WhatsApp en formato internacional, SOLO dígitos (sin +, espacios ni guiones).
  // Recepción TELVE: +58 414 563.2964
  whatsapp: "584145632964",

  // Teléfono como quieres que se vea en la sección Contacto.
  telefono: "+58 414 563.2964",

  // Mensaje que se abre al pulsar los botones de WhatsApp.
  mensajeWhatsapp: "Hola TELVE C.A., quiero información sobre reparación y/o rebobinado de mi motor o generador electrico."
};

/* ------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Navegación entre secciones (SPA) ---------- */
  const pages = document.querySelectorAll("[data-page]");
  const links = document.querySelectorAll(".nav__link");

  const validPages = Array.from(pages).map(function (p) { return p.getAttribute("data-page"); });

  function goTo(name, guardar) {
    pages.forEach(function (p) {
      p.hidden = p.getAttribute("data-page") !== name;
    });
    links.forEach(function (l) {
      l.classList.toggle("is-active", l.getAttribute("data-nav") === name);
    });
    // cierra el menú móvil si estaba abierto
    const menu = document.querySelector("[data-links]");
    if (menu) menu.classList.remove("is-open");
    // Guarda la pestaña actual en la URL (#servicios, #contacto, …) para que
    // al recargar (F5) vuelva a la misma pestaña en vez de ir al inicio.
    if (guardar !== false) {
      try { history.replaceState(null, "", "#" + name); } catch (e) {}
    }
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
  }

  // Cualquier elemento con data-nav="..." cambia de sección
  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.addEventListener("click", function () {
      goTo(el.getAttribute("data-nav"));
    });
  });

  // Al cargar, restaurar la pestaña guardada en la URL.
  var pestanaInicial = (location.hash || "").replace("#", "");
  if (validPages.indexOf(pestanaInicial) >= 0 && pestanaInicial !== "inicio") {
    goTo(pestanaInicial, false);
  }

  /* ---------- 2. Menú hamburguesa (móvil) ---------- */
  const burger = document.getElementById("burger");
  const menu = document.querySelector("[data-links]");
  if (burger && menu) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("is-open");
    });
  }

  /* ---------- 3. Enlaces de WhatsApp ---------- */
  function urlWhatsapp(mensaje) {
    const texto = encodeURIComponent(mensaje || CONFIG.mensajeWhatsapp);
    if (CONFIG.whatsapp) {
      return "https://wa.me/" + CONFIG.whatsapp + "?text=" + texto;
    }
    // Sin número aún: abre WhatsApp genérico para que la web no quede rota
    return "https://wa.me/?text=" + texto;
  }

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", urlWhatsapp());
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });

  /* ---------- 4. Teléfono en la sección Contacto ---------- */
  const phoneEl = document.querySelector("[data-phone-display]");
  if (phoneEl && CONFIG.telefono && CONFIG.telefono !== "+00 000 000 0000") {
    phoneEl.textContent = CONFIG.telefono;
  }

  /* ---------- 5. Formulario de contacto -> WhatsApp ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const telefono = form.telefono.value.trim();
      const mensaje = form.mensaje.value.trim();
      const texto =
        "Hola TELVE C.A., soy " + nombre + "." +
        "\nTeléfono: " + telefono +
        "\nMensaje: " + mensaje;
      window.open(urlWhatsapp(texto), "_blank", "noopener");
    });
  }

  /* ---------- 6. Carrusel del hero (imágenes rotativas) ---------- */
  initHeroSlider();

  /* ---------- 7. Mini-carruseles de cada servicio ---------- */
  initServiceCarousels();

});

function initServiceCarousels() {
  const carruseles = document.querySelectorAll(".svc-carousel");
  if (!carruseles.length) return;
  const INTERVALO = 4000; // milisegundos entre fotos

  function start() {
    carruseles.forEach(function (box, i) {
      // Solo las fotos que SÍ cargaron (existen en /img).
      const slides = Array.from(box.querySelectorAll(".svc-slide"))
        .filter(function (img) { return img.complete && img.naturalWidth > 0; });

      if (slides.length === 0) return;          // sin fotos: queda el marcador
      slides[0].classList.add("is-active");
      if (slides.length < 2) return;            // una sola: se queda fija

      let idx = 0;
      // Desfase por tarjeta para que no cambien todas al mismo tiempo.
      setTimeout(function () {
        setInterval(function () {
          slides[idx].classList.remove("is-active");
          idx = (idx + 1) % slides.length;
          slides[idx].classList.add("is-active");
        }, INTERVALO);
      }, i * 1300);
    });
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
}

function initHeroSlider() {
  const hero = document.querySelector(".hero--slider");
  if (!hero) return;

  const dotsWrap = hero.querySelector(".hero__dots");
  const btnPrev  = hero.querySelector(".hero__arrow--prev");
  const btnNext  = hero.querySelector(".hero__arrow--next");
  const INTERVALO = 5000; // milisegundos entre imágenes

  function start() {
    // Solo consideramos las imágenes que SÍ cargaron (existen en /img).
    const slides = Array.from(hero.querySelectorAll(".hero__slide"))
      .filter(function (img) { return img.complete && img.naturalWidth > 0; });

    // Si hay menos de 2 fotos, no hay carrusel: ocultamos los controles.
    if (slides.length < 2) {
      if (dotsWrap) dotsWrap.hidden = true;
      if (btnPrev)  btnPrev.hidden = true;
      if (btnNext)  btnNext.hidden = true;
      if (slides.length === 1) slides[0].classList.add("is-active");
      return;
    }

    let idx = 0, timer = null;

    // construir puntitos
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        const d = document.createElement("span");
        d.className = "hero__dot" + (i === 0 ? " is-active" : "");
        d.addEventListener("click", function () { show(i); restart(); });
        dotsWrap.appendChild(d);
      });
    }

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (el, n) { el.classList.toggle("is-active", n === idx); });
      if (dotsWrap) {
        dotsWrap.querySelectorAll(".hero__dot").forEach(function (d, n) {
          d.classList.toggle("is-active", n === idx);
        });
      }
    }
    function next()    { show(idx + 1); }
    function prev()    { show(idx - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, INTERVALO); }

    if (btnNext) btnNext.addEventListener("click", function () { next(); restart(); });
    if (btnPrev) btnPrev.addEventListener("click", function () { prev(); restart(); });

    show(0);
    restart();
  }

  // Esperamos a que las imágenes intenten cargar antes de decidir.
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
}
