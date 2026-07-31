/* ===================================================================
   TELVE C.A. — Lógica de la página
   =================================================================== */

/* -------------------------------------------------------------------
   👉 DATOS DEL TALLER — edita aquí y se actualiza en toda la web
   ------------------------------------------------------------------- */
const CONFIG = {
  // Número de WhatsApp en formato internacional, SOLO dígitos (sin +, espacios ni guiones).
  // Recepción TELVE: +58 414 563.2964
  whatsapp: "584145632964",

  // Teléfono como quieres que se vea en la sección Contacto.
  telefono: "+58 414 563.2964",

  // Mensaje que se abre al pulsar los botones de WhatsApp.
  mensajeWhatsapp: "Hola TELVE C.A., quiero información sobre reparación / rebobinado de mi motor o generador."
};

/* ------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Navegación entre secciones (SPA) ---------- */
  const pages = document.querySelectorAll("[data-page]");
  const links = document.querySelectorAll(".nav__link");

  function goTo(name) {
    pages.forEach(function (p) {
      p.hidden = p.getAttribute("data-page") !== name;
    });
    links.forEach(function (l) {
      l.classList.toggle("is-active", l.getAttribute("data-nav") === name);
    });
    // cierra el menú móvil si estaba abierto
    const menu = document.querySelector("[data-links]");
    if (menu) menu.classList.remove("is-open");
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
  }

  // Cualquier elemento con data-nav="..." cambia de sección
  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.addEventListener("click", function () {
      goTo(el.getAttribute("data-nav"));
    });
  });

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

});
