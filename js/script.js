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

/* ¿Toca moverse poco? La respuesta vive en data-motion del <html>: el script
   en línea del <head> lo siembra con la preferencia del sistema (Windows:
   "Efectos de animación"; iOS/Android: "Reducir movimiento") y el panel de
   ajustes deja cambiarlo. Se consulta en cada tic, así el cambio surte
   efecto de inmediato sin reiniciar los carruseles. */
function prefiereMenosMovimiento() {
  return document.documentElement.getAttribute("data-motion") === "reduced";
}

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Navegación entre secciones (SPA) ---------- */
  const pages = document.querySelectorAll("[data-page]");
  const links = document.querySelectorAll(".nav__link");

  const validPages = Array.from(pages).map(function (p) { return p.getAttribute("data-page"); });

  function goTo(name, guardar) {
    pages.forEach(function (p) {
      var mostrar = p.getAttribute("data-page") === name;
      p.hidden = !mostrar;
      // Transición de entrada al cambiar de pestaña
      if (mostrar) {
        p.classList.remove("page-anim");
        void p.offsetWidth; // reinicia la animación
        p.classList.add("page-anim");
      }
    });
    links.forEach(function (l) {
      var activo = l.getAttribute("data-nav") === name;
      l.classList.toggle("is-active", activo);
      // Marca la sección actual para lectores de pantalla, no solo con color.
      if (activo) l.setAttribute("aria-current", "page");
      else l.removeAttribute("aria-current");
    });
    // cierra el menú móvil si estaba abierto
    const menu = document.querySelector("[data-links]");
    if (menu) menu.classList.remove("is-open");
    var burgerBtn = document.getElementById("burger");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
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
      var abierto = menu.classList.toggle("is-open");
      // El botón debe anunciar si el menú está abierto o cerrado.
      burger.setAttribute("aria-expanded", abierto ? "true" : "false");
      burger.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
  }

  /* ---------- 3. Enlaces de WhatsApp ---------- */
  function mensajePorDefecto() {
    // El mensaje sale en el idioma activo, si ese idioma trae traducción.
    var i18n = window.TELVE_I18N;
    var lang = document.documentElement.getAttribute("data-lang");
    if (i18n && lang && i18n[lang] && i18n[lang].whatsapp) return i18n[lang].whatsapp;
    return CONFIG.mensajeWhatsapp;
  }

  function urlWhatsapp(mensaje) {
    const texto = encodeURIComponent(mensaje || mensajePorDefecto());
    if (CONFIG.whatsapp) {
      return "https://wa.me/" + CONFIG.whatsapp + "?text=" + texto;
    }
    // Sin número aún: abre WhatsApp genérico para que la web no quede rota
    return "https://wa.me/?text=" + texto;
  }

  // Se vuelve a llamar al cambiar de idioma para refrescar el mensaje.
  window.TELVE_refrescarWhatsapp = function () {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.setAttribute("href", urlWhatsapp());
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  };
  window.TELVE_refrescarWhatsapp();

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

  /* ---------- 8. Animaciones (revelado + contadores) ---------- */
  initAnimations();

  /* ---------- 9. Barra roja deslizante del menú ---------- */
  initNavIndicator();

  /* ---------- 10. Panel de ajustes (movimiento + idioma) ---------- */
  initPrefs();

});

/* ===================================================================
   PANEL DE AJUSTES
   Dos preferencias que el visitante controla y que se recuerdan entre
   visitas (localStorage). El valor inicial de "movimiento" lo pone el
   script en línea del <head>, leyendo la configuración del sistema.
   =================================================================== */
function initPrefs() {
  var raiz    = document.documentElement;
  var toggle  = document.getElementById("prefsToggle");
  var panel   = document.getElementById("prefsPanel");
  if (!toggle || !panel) return;

  function guardar(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) {}
  }

  /* --- abrir / cerrar --- */
  function abrir(si) {
    panel.hidden = !si;
    toggle.setAttribute("aria-expanded", si ? "true" : "false");
  }
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    abrir(panel.hidden);
  });
  // Clic fuera y Escape cierran el panel.
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) abrir(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) { abrir(false); toggle.focus(); }
  });

  /* --- movimiento --- */
  var btnsMov = Array.prototype.slice.call(panel.querySelectorAll("[data-motion-set]"));
  function pintarMov() {
    var actual = raiz.getAttribute("data-motion");
    btnsMov.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-motion-set") === actual ? "true" : "false");
    });
  }
  btnsMov.forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-motion-set");
      raiz.setAttribute("data-motion", v);
      guardar("telve-motion", v);
      pintarMov();
      // No hay que reiniciar nada: los carruseles consultan la preferencia
      // en cada tic, así que se detienen o reanudan solos.
    });
  });
  pintarMov();

  /* --- idioma --- */
  var i18n   = window.TELVE_I18N;
  var select = document.getElementById("prefsLang");
  var base   = (i18n && i18n.base) || "es";

  if (select && i18n && i18n.idiomas) {
    // El desplegable se arma desde la lista del diccionario: agregar un
    // idioma nuevo no obliga a tocar el HTML.
    i18n.idiomas.forEach(function (idioma) {
      var op = document.createElement("option");
      op.value = idioma.code;
      op.textContent = idioma.nombre;
      op.lang = idioma.code;      // cada nombre se lee en su propio idioma
      select.appendChild(op);
    });
    select.value = raiz.getAttribute("data-lang") || base;

    select.addEventListener("change", function () {
      guardar("telve-lang", select.value);
      aplicarIdioma(select.value);
    });
  }

  // El <head> ya dejó escrito data-lang; si no es el idioma base, se traduce.
  cacharTextos();
  var actual = raiz.getAttribute("data-lang") || base;
  if (actual !== base) aplicarIdioma(actual);
  pintarCodigoIdioma();

  /* --- aviso de primera visita --- */
  var aviso  = document.getElementById("prefsCallout");
  var avisoOk = document.getElementById("prefsCalloutOk");

  function cerrarAviso() {
    if (!aviso || aviso.hidden) return;
    aviso.hidden = true;
    guardar("telve-aviso-visto", "1");
  }

  if (aviso) {
    var yaVisto;
    try { yaVisto = localStorage.getItem("telve-aviso-visto"); } catch (e) { yaVisto = "1"; }
    if (!yaVisto) {
      // Con un respiro tras la carga: si aparece de una compite con el hero
      // y el visitante todavía no está mirando esa esquina.
      setTimeout(function () {
        // Si mientras tanto ya abrió el panel por su cuenta, sobra el aviso.
        if (panel.hidden) aviso.hidden = false;
        else cerrarAviso();
      }, 1400);
    }
    if (avisoOk) avisoOk.addEventListener("click", function (e) {
      e.stopPropagation();
      cerrarAviso();
      toggle.focus();
    });
    // Abrir los ajustes ya cumple el propósito del aviso.
    toggle.addEventListener("click", cerrarAviso);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarAviso();
    });
  }
}

/* Escribe el código del idioma activo en la insignia del círculo. */
function pintarCodigoIdioma() {
  var el = document.getElementById("prefsCode");
  if (!el) return;
  var lang = document.documentElement.getAttribute("data-lang") || "es";
  el.textContent = lang.toUpperCase();
}

/* ===================================================================
   IDIOMA
   El español vive en el HTML y es la fuente de verdad. Aquí solo se
   guarda el original de cada nodo de texto y se sustituye por el inglés
   del diccionario (js/i18n.js). Lo que no esté traducido se queda en
   español: no se rompe nada, simplemente no cambia.
   =================================================================== */
var TELVE_originales     = [];     // [{nodo, texto}]
var TELVE_origAttrs      = [];     // [{el, attr, valor}]
var TELVE_tituloOriginal = "";
var TELVE_descOriginal   = null;

function cacharTextos() {
  if (TELVE_originales.length) return;   // ya estaba

  TELVE_tituloOriginal = document.title;
  var md = document.querySelector('meta[name="description"]');
  TELVE_descOriginal = md ? md.getAttribute("content") : null;

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      var p = n.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      var t = p.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
      // Los nombres de idioma del desplegable van siempre en su propio
      // idioma ("Español" sigue diciendo Español en la versión inglesa).
      if (t === "OPTION") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var n;
  while ((n = walker.nextNode())) {
    TELVE_originales.push({ nodo: n, texto: n.nodeValue });
  }

  var ATRIBUTOS = ["alt", "aria-label", "title", "placeholder"];
  document.querySelectorAll("[alt],[aria-label],[title],[placeholder]").forEach(function (el) {
    ATRIBUTOS.forEach(function (a) {
      if (el.hasAttribute(a)) {
        TELVE_origAttrs.push({ el: el, attr: a, valor: el.getAttribute(a) });
      }
    });
  });
}

function aplicarIdioma(lang) {
  var i18n = window.TELVE_I18N;
  var raiz = document.documentElement;
  var base = (i18n && i18n.base) || "es";
  var dic  = i18n && i18n[lang];      // diccionario del idioma pedido

  raiz.setAttribute("data-lang", lang);
  raiz.lang = lang;

  if (lang === base || !dic) {
    // Volver al idioma base: se restaura el original tal cual venía del HTML.
    // También es la red de seguridad si piden un idioma sin diccionario.
    TELVE_originales.forEach(function (o) { o.nodo.nodeValue = o.texto; });
    TELVE_origAttrs.forEach(function (o) { o.el.setAttribute(o.attr, o.valor); });
    document.title = TELVE_tituloOriginal;
    var mdBase = document.querySelector('meta[name="description"]');
    if (mdBase && TELVE_descOriginal !== null) mdBase.setAttribute("content", TELVE_descOriginal);
  } else {
    var faltan = [];
    TELVE_originales.forEach(function (o) {
      var crudo = o.texto;
      var clave = crudo.replace(/\s+/g, " ").trim();
      var tr = dic.text[clave];
      if (tr) {
        // Se conservan los espacios de alrededor para no pegar palabras
        // en contextos en línea.
        var antes   = crudo.match(/^\s*/)[0];
        var despues = crudo.match(/\s*$/)[0];
        o.nodo.nodeValue = antes + tr + despues;
      } else if (clave.length > 3 &&
                 !/^[\d\s+.,:/·—–@-]+$/.test(clave) &&
                 (i18n.sinTraducir || []).indexOf(clave) === -1) {
        faltan.push(clave);
      }
    });
    TELVE_origAttrs.forEach(function (o) {
      var tr = dic.attrs[o.valor];
      if (tr) o.el.setAttribute(o.attr, tr);
    });
    if (dic.meta) {
      document.title = dic.meta.title;
      var md = document.querySelector('meta[name="description"]');
      if (md && dic.meta.description) md.setAttribute("content", dic.meta.description);
    }
    if (faltan.length) {
      console.info(
        "[TELVE] " + faltan.length + " frases sin traducir al inglés. " +
        "Agrégalas a js/i18n.js con el español exacto como clave:", faltan
      );
    }
  }

  // Los enlaces de WhatsApp llevan el mensaje en el idioma activo.
  if (window.TELVE_refrescarWhatsapp) window.TELVE_refrescarWhatsapp();
  // Los enlaces del menú cambian de ancho: hay que recolocar la barra roja.
  window.dispatchEvent(new Event("resize"));
  // La insignia del círculo debe reflejar el idioma recién elegido.
  pintarCodigoIdioma();
}

function initNavIndicator() {
  var wrap = document.querySelector(".nav__links");
  if (!wrap) return;
  var barra = wrap.querySelector(".nav__indicator");
  var enlaces = Array.prototype.slice.call(wrap.querySelectorAll(".nav__link"));
  if (!barra || !enlaces.length) return;

  function moverA(el) {
    if (!el) { barra.style.opacity = "0"; return; }
    barra.style.opacity = "1";
    barra.style.left = el.offsetLeft + "px";
    barra.style.width = el.offsetWidth + "px";
    barra.style.top = (el.offsetTop + el.offsetHeight + 4) + "px";
  }
  function activo() { return wrap.querySelector(".nav__link.is-active"); }
  function reposar() { moverA(activo()); }

  enlaces.forEach(function (l) {
    l.addEventListener("mouseenter", function () { moverA(l); });
    l.addEventListener("click", function () { setTimeout(reposar, 0); });
  });
  wrap.addEventListener("mouseleave", reposar);

  reposar();
  window.addEventListener("load", reposar);   // tras cargar las fuentes
  window.addEventListener("resize", reposar);
}

function initAnimations() {
  /* --- 8a. Revelado al hacer scroll --- */
  var seleccion = ".specs__item, .card, .step, .service, .client, .team, .split__body, .info, .map, .facade";
  var elementos = Array.prototype.slice.call(document.querySelectorAll(seleccion));
  elementos.forEach(function (el) { el.classList.add("reveal"); });

  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var obsReveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obsReveal.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach(function (el) { obsReveal.observe(el); });
  }

  /* --- 8b. Contadores animados (specs) --- */
  function contar(el) {
    var txt = el.textContent.trim();
    var m = txt.match(/^(\d+)(.*)$/);
    if (!m) return;                       // no empieza por número (ej. "AC/DC")
    var sufijo = m[2];
    if (sufijo.charAt(0) === "/") return; // evita "24/7"
    var objetivo = parseInt(m[1], 10);
    var dur = 1200, inicio = null;
    function paso(ts) {
      if (!inicio) inicio = ts;
      var p = Math.min((ts - inicio) / dur, 1);
      var val = Math.round(objetivo * (1 - Math.pow(1 - p, 3))); // easeOutCubic
      el.textContent = val + sufijo;
      if (p < 1) requestAnimationFrame(paso);
      else el.textContent = objetivo + sufijo;
    }
    requestAnimationFrame(paso);
  }

  var numeros = Array.prototype.slice.call(document.querySelectorAll(".specs__num"));
  if (numeros.length && "IntersectionObserver" in window) {
    var obsNum = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // Se decide al entrar en pantalla, no al cargar: con movimiento
        // reducido el número se queda en su valor final del HTML.
        if (!prefiereMenosMovimiento()) contar(e.target);
        obsNum.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    numeros.forEach(function (el) { obsNum.observe(el); });
  }
}

function initServiceCarousels() {
  const carruseles = document.querySelectorAll(".svc-carousel");
  if (!carruseles.length) return;
  const INTERVALO = 4000; // milisegundos entre fotos

  function start() {
    carruseles.forEach(function (box, i) {
      // Solo las fotos que SÍ cargaron (existen en /img).
      var fotos = Array.prototype.slice.call(box.querySelectorAll("img.svc-slide"))
        .filter(function (img) { return img.complete && img.naturalWidth > 0; });
      var marcadores = Array.prototype.slice.call(box.querySelectorAll(".svc-ph"));

      // Las fotos reales mandan: en cuanto exista al menos una, los
      // marcadores de color sobran y se quitan del DOM.
      var slides;
      if (fotos.length) {
        marcadores.forEach(function (m) { m.remove(); });
        slides = fotos;
      } else {
        slides = marcadores;
      }

      // Ni fotos ni marcadores: la columna vacía no aporta, el texto ocupa
      // todo el ancho.
      if (slides.length === 0) {
        var ficha = box.closest(".service");
        if (ficha) ficha.classList.add("service--sinfoto");
        return;
      }

      slides[0].classList.add("is-active");

      var dotsWrap = box.querySelector(".svc-dots");
      if (slides.length < 2) {                  // una sola: se queda fija
        if (dotsWrap) dotsWrap.hidden = true;
        return;
      }

      // Puntitos: además de indicar cuántas fotos hay, dejan saltar a una.
      var puntos = [];
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        slides.forEach(function (_, n) {
          var d = document.createElement("span");
          d.className = "svc-dot" + (n === 0 ? " is-active" : "");
          dotsWrap.appendChild(d);
          puntos.push(d);
        });
      }

      var idx = 0, timer = null;
      function mostrar(n) {
        slides[idx].classList.remove("is-active");
        if (puntos[idx]) puntos[idx].classList.remove("is-active");
        idx = (n + slides.length) % slides.length;
        slides[idx].classList.add("is-active");
        if (puntos[idx]) puntos[idx].classList.add("is-active");
      }
      // Al pulsar un punto se salta a esa foto y se reinicia la cuenta, para
      // que no cambie sola justo después de elegirla.
      puntos.forEach(function (d, n) {
        d.addEventListener("click", function () { mostrar(n); reiniciar(); });
      });
      function reiniciar() {
        clearInterval(timer);
        timer = setInterval(function () {
          if (prefiereMenosMovimiento()) return;
          mostrar(idx + 1);
        }, INTERVALO);
      }

      // Desfase por tarjeta para que no cambien todas al mismo tiempo.
      // El intervalo vive siempre; con movimiento reducido no avanza, así
      // reanuda al instante si el visitante cambia el ajuste.
      setTimeout(reiniciar, i * 1300);
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
    // El intervalo vive siempre; con movimiento reducido simplemente no
    // avanza. Los puntitos y las flechas siguen funcionando en ambos casos:
    // el control queda del lado del visitante.
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () {
        if (prefiereMenosMovimiento()) return;
        next();
      }, INTERVALO);
    }

    if (btnNext) btnNext.addEventListener("click", function () { next(); restart(); });
    if (btnPrev) btnPrev.addEventListener("click", function () { prev(); restart(); });

    show(0);
    restart();
  }

  // Esperamos a que las imágenes intenten cargar antes de decidir.
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
}
