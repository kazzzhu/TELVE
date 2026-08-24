/* ===================================================================
   TELVE C.A. — Acceso (login/registro) y catálogo de equipos en venta
   (motores, bombas, generadores) vía Supabase.
   Cualquiera puede registrarse; solo el correo del administrador puede
   agregar equipos. Esa restricción la impone la base de datos (política
   RLS), este archivo solo refleja el mismo criterio en la interfaz para
   no mostrar un botón que la base de datos igual rechazaría.
   =================================================================== */
(function () {
  var SUPABASE_URL = "https://jwpbwbknwxrfhaiberkz.supabase.co";
  var SUPABASE_KEY = "sb_publishable_eKbEmIEBrVtoiWXVYRYI9A_jTesbBCw";
  var ADMIN_EMAIL  = "telveca@gmail.com";

  /* Clave PÚBLICA del widget de Turnstile (el CAPTCHA de Cloudflare). Va en el
     código a propósito, como la de Supabase: la que no puede salir de aquí es
     la "secret key", que vive solo en el panel de Supabase.

     Existe para que nadie pueda registrarse en bucle: cada intento manda un
     correo, y entre el tope de Supabase (30/hora) y el de Resend (3.000/mes)
     un script deja sin correo de confirmación a los clientes de verdad.

     Dejarla en "" apaga el captcha por completo y el sitio se comporta como
     antes de agregarlo. Eso NO basta para desactivarlo: si la casilla del
     panel de Supabase está marcada, el servidor exige el token igual y el
     acceso deja de funcionar. Para desactivarlo de verdad hay que desmarcarla
     allí, y entonces no hace falta redesplegar nada. */
  var CAPTCHA_SITE_KEY = "0x4AAAAAAEUqWgI-NrkKWhgZ";

  /* ---------- Turnstile: montar, leer el token y reiniciarlo ----------
     Un widget por formulario. El del acceso sirve a TRES llamadas (entrar,
     pedir enlace de contraseña y reenviar la confirmación) porque las tres
     salen de esa misma pestaña. */
  var captchaIds = { login: null, registro: null };

  function captchaActivo() { return !!CAPTCHA_SITE_KEY && !!window.turnstile; }

  function montarCaptcha() {
    if (!captchaActivo()) return;
    [["login", "captchaLogin"], ["registro", "captchaRegister"]].forEach(function (par) {
      if (captchaIds[par[0]] !== null) return;      // ya montado, no se duplica
      var caja = document.getElementById(par[1]);
      if (!caja) return;
      captchaIds[par[0]] = window.turnstile.render(caja, {
        sitekey: CAPTCHA_SITE_KEY,
        theme: "light",
        // El widget habla el idioma del sitio, no el del navegador.
        language: document.documentElement.getAttribute("data-lang") || "es"
      });
    });
  }

  /* Cloudflare llama a esto cuando su script termina de bajar. Se define aquí
     arriba y no dentro de initAuthModal porque api.js va con async: puede
     terminar antes de que corra DOMContentLoaded, y entonces la función
     todavía no existiría. Solo monta si la ventana ya estaba abierta; en el
     caso normal monta abrirModal, con el contenedor ya visible (Turnstile no
     se lleva bien con dibujarse dentro de algo oculto). */
  window.TELVE_captchaListo = function () {
    var m = document.getElementById("authModal");
    if (m && !m.hidden) montarCaptcha();
  };

  function captchaToken(cual) {
    if (!captchaActivo() || captchaIds[cual] === null) return undefined;
    return window.turnstile.getResponse(captchaIds[cual]) || undefined;
  }

  /* El token es de UN SOLO USO. Sin esto, el segundo intento seguido en el
     mismo formulario (fallo de contraseña y reintento, o entrar y luego
     pulsar "reenviar") manda un token ya gastado y el servidor lo rechaza. */
  function captchaReiniciar(cual) {
    if (!captchaActivo() || captchaIds[cual] === null) return;
    window.turnstile.reset(captchaIds[cual]);
  }

  // La librería viene de un CDN: si no cargó (sin internet, red que lo
  // bloquea), la página de Equipos quedaría vacía y sin explicación. Se
  // avisa y se corta aquí; el resto del sitio funciona igual.
  if (!window.supabase) {
    document.addEventListener("DOMContentLoaded", function () {
      var aviso = document.getElementById("equiposOffline");
      if (aviso) aviso.hidden = false;
    });
    return;
  }
  /* El enlace de "cambiar contraseña" del correo devuelve al visitante con
     #type=recovery en la URL. Se mira AQUÍ, antes de crear el cliente:
     supabase-js detecta ese hash al arrancar, abre la sesión de recuperación
     y limpia la URL, así que para cuando corre initAuthModal ya no está. */
  var ES_RECUPERACION = location.hash.indexOf("type=recovery") > -1;

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  /* Textos que este archivo escribe directo en el DOM se traducen en vivo
     consultando el idioma activo, en vez de depender del recorrido de
     cacharTextos (que no ve texto insertado después de que corrió). */
  function diccionario() {
    var i18n = window.TELVE_I18N;
    var lang = document.documentElement.getAttribute("data-lang") || (i18n && i18n.base) || "es";
    return (i18n && i18n[lang]) || null;
  }
  function tAuth(clave, porDefecto) {
    var dic = diccionario();
    return (dic && dic.auth && dic.auth[clave]) || porDefecto;
  }
  function tEquipos(clave, porDefecto) {
    var dic = diccionario();
    return (dic && dic.equipos && dic.equipos[clave]) || porDefecto;
  }
  function tProceso(clave, porDefecto) {
    var dic = diccionario();
    return (dic && dic.proceso && dic.proceso[clave]) || porDefecto;
  }

  /* Escapa para meter texto dentro de HTML, incluidos los ATRIBUTOS.
     Antes esto se hacía con textContent → innerHTML, que escapa < > &
     pero NO las comillas: un valor con una comilla doble cerraba el
     atributo de al lado y permitía inyectar código (por ejemplo un
     onerror= dentro de la etiqueta img de la foto). Se escapan también
     las dos comillas, que es lo que hace segura la interpolación en
     src="..." y data-id="..." de tarjeta() y de las tarjetas de proceso. */
  var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function escapar(txt) {
    return String(txt).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAuthModal();
    initEquipos();
    initProceso();
  });

  /* ---------- Lightbox: agrandar la foto de un equipo con un clic ---------- */
  function abrirLightbox(src) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    // Se arma el <img> como elemento en vez de con innerHTML: así la URL
    // nunca se interpreta como HTML, sin depender de escapar nada.
    var img = document.createElement("img");
    img.src = src;
    img.alt = "";
    overlay.appendChild(img);
    function cerrar() {
      overlay.remove();
      document.removeEventListener("keydown", alEscape);
    }
    function alEscape(e) { if (e.key === "Escape") cerrar(); }
    overlay.addEventListener("click", cerrar);
    document.addEventListener("keydown", alEscape);
    document.body.appendChild(overlay);
  }

  /* ---------- Modal de acceso: disponible en cualquier página ---------- */
  function initAuthModal() {
    var modal   = document.getElementById("authModal");
    var navBtn  = document.getElementById("navAuth");
    if (!modal || !navBtn) return;

    var cerrarBtn  = document.getElementById("authModalClose");
    var backdrop   = modal.querySelector("[data-auth-close]");
    var tabLogin   = document.getElementById("tabLogin");
    var tabReg     = document.getElementById("tabRegister");
    var formLogin  = document.getElementById("formAuthLogin");
    var formReg    = document.getElementById("formAuthRegister");
    var formNueva  = document.getElementById("formAuthNueva");
    var loginError = document.getElementById("authLoginError");
    var loginNote  = document.getElementById("authLoginNote");
    var regError   = document.getElementById("authRegError");
    var regNote    = document.getElementById("authRegNote");
    var nuevaError = document.getElementById("authNuevaError");
    var nuevaNote  = document.getElementById("authNuevaNote");
    var forgotBtn  = document.getElementById("authForgot");
    var resendBtn  = document.getElementById("authResend");
    var resendNote = document.getElementById("authResendNote");
    var tabsWrap   = modal.querySelector(".authModal__tabs");
    var titulo     = document.getElementById("authModalTitle");

    var sesionActual = null;
    var tabActual = "login";

    /* A dónde vuelve el visitante desde el correo. Se manda la pestaña en la
       QUERY y no en el hash porque Supabase reemplaza el fragmento entero por
       su token (#access_token=…), así que un "#equipos" no sobreviviría el
       viaje. script.js lee ese ?p= al arrancar. Si la dirección no estuviera
       en la lista blanca del panel, Supabase la ignora y cae en la Site URL:
       se aterriza en Inicio, que es como funcionaba antes. */
    function urlVuelta() {
      var pagina = (location.hash || "").replace("#", "");
      return location.origin + location.pathname + (pagina ? "?p=" + encodeURIComponent(pagina) : "");
    }

    /* Validación propia en vez de la del navegador. Con required/minlength,
       Chrome vuelve a sacar su globo amarillo con cada tecla una vez que el
       campo quedó inválido en un envío. Los formularios llevan novalidate y
       se comprueba aquí, al enviar: un solo mensaje, en su sitio y traducido. */
    var RE_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    function faltaCorreo(email) {
      if (!email) return tAuth("camposVacios", "Escribe tu correo y tu contraseña.");
      if (!RE_CORREO.test(email)) return tAuth("correoInvalido", "Ese correo no parece válido.");
      return null;
    }
    function faltaClave(clave) {
      if (!clave) return tAuth("camposVacios", "Escribe tu correo y tu contraseña.");
      if (clave.length < 6) return tAuth("claveDebil", "La contraseña debe tener al menos 6 caracteres.");
      return null;
    }

    function mostrarTab(tab) {
      tabActual = tab;
      // Los avisos del formulario anterior no pintan nada en el nuevo.
      [loginError, loginNote, regError, regNote, nuevaError, nuevaNote,
       resendBtn, resendNote].forEach(function (el) { if (el) el.hidden = true; });
      var esLogin = tab === "login";
      var esReg   = tab === "register";
      var esNueva = tab === "nueva";
      // En recuperación no hay nada que elegir: se esconden las pestañas.
      if (tabsWrap) tabsWrap.hidden = esNueva;
      tabLogin.classList.toggle("is-active", esLogin);
      tabReg.classList.toggle("is-active", esReg);
      tabLogin.setAttribute("aria-selected", esLogin ? "true" : "false");
      tabReg.setAttribute("aria-selected", esReg ? "true" : "false");
      formLogin.hidden = !esLogin;
      formReg.hidden   = !esReg;
      if (formNueva) formNueva.hidden = !esNueva;
      titulo.textContent = esNueva
        ? tAuth("nuevaClaveTitle", "Elige una contraseña nueva")
        : esLogin
          ? tAuth("loginTitle", "Bienvenido de nuevo")
          : tAuth("registerTitle", "Crear cuenta");
    }

    function alEscape(e) { if (e.key === "Escape") cerrarModal(); }
    function abrirModal(tab) {
      modal.hidden = false;
      montarCaptcha();
      mostrarTab(tab || "login");
      document.addEventListener("keydown", alEscape);
    }
    function cerrarModal() {
      /* Volver desde el enlace del correo abre una SESIÓN DE VERDAD: es lo que
         permite llamar a updateUser, no se puede cambiar la contraseña sin
         ella. Esa sesión se cierra SIEMPRE al salir de aquí, haya cambiado la
         contraseña o no. Quien abrió el enlace pidió cambiar su contraseña,
         no entrar; y si la cambió, entra con la nueva, que además es la única
         forma de comprobar que quedó como esperaba. */
      if (tabActual === "nueva") sb.auth.signOut();
      modal.hidden = true;
      document.removeEventListener("keydown", alEscape);
    }

    var authMenu   = document.getElementById("navAuthMenu");
    var signOutBtn = document.getElementById("navSignOut");

    function cerrarAuthMenu() {
      if (authMenu) authMenu.hidden = true;
      navBtn.setAttribute("aria-expanded", "false");
    }

    navBtn.addEventListener("click", function (e) {
      if (!sesionActual) { abrirModal("login"); return; }
      // Con sesión, el botón ya no cierra sesión al toque: abre el menú
      // (Mi equipo / Cerrar sesión). data-nav de "Mi equipo" navega solo.
      if (!authMenu) { sb.auth.signOut(); return; }
      e.stopPropagation();
      var abierto = !authMenu.hidden;
      authMenu.hidden = abierto;
      navBtn.setAttribute("aria-expanded", abierto ? "false" : "true");
    });
    if (authMenu) {
      document.addEventListener("click", function (e) {
        if (!authMenu.hidden && !authMenu.contains(e.target) && e.target !== navBtn) cerrarAuthMenu();
      });
      authMenu.addEventListener("click", function (e) {
        if (e.target.hasAttribute("data-nav")) cerrarAuthMenu(); // deja que script.js navegue
      });
    }
    if (signOutBtn) signOutBtn.addEventListener("click", function () {
      cerrarAuthMenu();
      sb.auth.signOut();
    });
    if (cerrarBtn) cerrarBtn.addEventListener("click", cerrarModal);
    if (backdrop)  backdrop.addEventListener("click", cerrarModal);
    tabLogin.addEventListener("click", function () { mostrarTab("login"); });
    tabReg.addEventListener("click", function () { mostrarTab("register"); });

    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      loginError.hidden = true;
      loginNote.hidden = true;
      if (resendBtn) resendBtn.hidden = true;
      if (resendNote) resendNote.hidden = true;
      var email = document.getElementById("authLoginEmail").value.trim();
      var clave = document.getElementById("authLoginPass").value;
      var falta = faltaCorreo(email) || faltaClave(clave);
      if (falta) {
        loginError.textContent = falta;
        loginError.hidden = false;
        return;
      }
      sb.auth.signInWithPassword({
        email: email,
        password: clave,
        options: { captchaToken: captchaToken("login") }
      }).then(function (r) {
        captchaReiniciar("login");
        if (r.error) {
          /* Cuenta creada pero sin confirmar: quien borró o nunca recibió ese
             correo se queda encallado aquí, y hasta ahora la única salida era
             que alguien lo borrara a mano desde el panel. Se le ofrece el
             reenvío en el mismo sitio donde se topa con el problema. */
          var sinConfirmar = r.error.code === "email_not_confirmed";
          loginError.textContent = sinConfirmar
            ? tAuth("noConfirmado", "Tu cuenta todavía no está confirmada. Revisa tu correo.")
            : tAuth("loginError", "Correo o contraseña incorrectos.");
          loginError.hidden = false;
          if (resendBtn) resendBtn.hidden = !sinConfirmar;
          return;
        }
        formLogin.reset();
        cerrarModal();
      });
    });

    /* Supabase devuelve sus errores en inglés y con jerga ("User already
       registered"). Un visitante navegando en portugués no debería verlos.
       Se traducen por CÓDIGO, no por texto: el código es estable entre
       versiones de la librería, el mensaje no. Lo que no esté en la lista
       cae en un mensaje genérico — nunca se muestra el crudo. */
    var ERRORES_AUTH = {
      user_already_exists:        ["yaRegistrado",   "Ese correo ya tiene una cuenta. Inicia sesión."],
      email_exists:               ["yaRegistrado",   "Ese correo ya tiene una cuenta. Inicia sesión."],
      weak_password:              ["claveDebil",     "La contraseña debe tener al menos 6 caracteres."],
      email_address_invalid:      ["correoInvalido", "Ese correo no parece válido."],
      over_email_send_rate_limit: ["muchosCorreos",  "Se enviaron demasiados correos. Espera unos minutos y vuelve a intentar."],
      signup_disabled:            ["registroCerrado","El registro de cuentas nuevas está cerrado por ahora."],
      same_password:              ["claveIgual",     "Esa ya es tu contraseña actual. Elige otra."],
      captcha_failed:             ["captchaFallo",   "Completa la comprobación de seguridad y vuelve a intentar."]
    };
    // El mensaje de reserva cambia según de qué formulario venga el error.
    function mensajeError(err, claveGenerica, textoGenerico) {
      var par = ERRORES_AUTH[err && err.code];
      if (par) return tAuth(par[0], par[1]);
      return tAuth(claveGenerica, textoGenerico);
    }

    formReg.addEventListener("submit", function (e) {
      e.preventDefault();
      regError.hidden = true;
      regNote.hidden = true;
      var email = document.getElementById("authRegEmail").value.trim();
      var clave = document.getElementById("authRegPass").value;
      var falta = faltaCorreo(email) || faltaClave(clave);
      if (falta) {
        regError.textContent = falta;
        regError.hidden = false;
        return;
      }
      /* emailRedirectTo: a dónde vuelve el visitante al pulsar el enlace del
         correo de confirmación. Sin esto, Supabase usa la "Site URL" del
         panel, que de fábrica es http://localhost:3000 y deja el enlace
         muerto. Se calcula de la página actual para que sirva igual en
         GitHub Pages que abriendo el archivo en local.
         OJO: la dirección también tiene que estar en la lista de
         "Redirect URLs" del panel de Supabase, o la ignora y vuelve a caer
         en la Site URL. La configuración exacta está en CLAUDE.md. */
      sb.auth.signUp({
        email: email,
        password: clave,
        options: { emailRedirectTo: urlVuelta(), captchaToken: captchaToken("registro") }
      }).then(function (r) {
        captchaReiniciar("registro");
        if (r.error) {
          regError.textContent = mensajeError(r.error, "registroError", "No se pudo crear la cuenta. Intenta de nuevo en un momento.");
          regError.hidden = false;
          return;
        }
        formReg.reset();
        if (!r.data.session) {
          // Proyecto con confirmación de correo activa: no hay sesión aún.
          regNote.hidden = false;
        } else {
          cerrarModal();
        }
      });
    });

    /* ---------- Olvidé mi contraseña, primer tramo: pedir el enlace ----------
       Se reutiliza el correo ya escrito arriba en vez de montar un tercer
       formulario. Supabase contesta OK aunque ese correo no exista, a
       propósito: si dijera "no hay cuenta", cualquiera podría averiguar quién
       está registrado probando direcciones. Por eso el aviso empieza con "si
       ese correo tiene una cuenta". */
    if (forgotBtn) forgotBtn.addEventListener("click", function () {
      loginError.hidden = true;
      loginNote.hidden = true;
      var email = document.getElementById("authLoginEmail").value.trim();
      if (!email || !RE_CORREO.test(email)) {
        loginError.textContent = tAuth("escribeCorreo", "Escribe tu correo arriba y vuelve a pulsar.");
        loginError.hidden = false;
        return;
      }
      sb.auth.resetPasswordForEmail(email, {
        redirectTo: urlVuelta(),
        captchaToken: captchaToken("login")
      }).then(function (r) {
        captchaReiniciar("login");
        if (r.error) {
          loginError.textContent = mensajeError(r.error, "resetError", "No se pudo enviar el enlace. Intenta de nuevo en un momento.");
          loginError.hidden = false;
          return;
        }
        loginNote.hidden = false;
      });
    });

    /* ---------- Reenviar el correo de confirmación ----------
       Mismo correo y misma plantilla que el del registro; Supabase invalida
       el enlace anterior al mandar el nuevo. El tope de correos por hora del
       panel también cuenta aquí: si se agota, llega "muchosCorreos" traducido
       por mensajeError. */
    if (resendBtn) resendBtn.addEventListener("click", function () {
      loginError.hidden = true;
      resendNote.hidden = true;
      var email = document.getElementById("authLoginEmail").value.trim();
      if (!email || !RE_CORREO.test(email)) {
        loginError.textContent = tAuth("escribeCorreo", "Escribe tu correo arriba y vuelve a pulsar.");
        loginError.hidden = false;
        return;
      }
      sb.auth.resend({
        type: "signup",
        email: email,
        options: { emailRedirectTo: urlVuelta(), captchaToken: captchaToken("login") }
      }).then(function (r) {
        captchaReiniciar("login");
        if (r.error) {
          loginError.textContent = mensajeError(r.error, "resetError", "No se pudo enviar el enlace. Intenta de nuevo en un momento.");
          loginError.hidden = false;
          return;
        }
        resendBtn.hidden = true;
        resendNote.hidden = false;
      });
    });

    /* ---------- Segundo tramo: guardar la contraseña nueva ----------
       El visitante vuelve del correo con la sesión de recuperación ya abierta,
       así que no hay que verificar nada más: basta con cambiar la clave. */
    if (formNueva) formNueva.addEventListener("submit", function (e) {
      e.preventDefault();
      nuevaError.hidden = true;
      nuevaNote.hidden = true;
      var clave = document.getElementById("authNuevaPass").value;
      var falta = faltaClave(clave);
      if (falta) {
        nuevaError.textContent = falta;
        nuevaError.hidden = false;
        return;
      }
      sb.auth.updateUser({ password: clave }).then(function (r) {
        if (r.error) {
          // Sin sesión = el enlace caducó o ya se usó. Es el fallo más común
          // de este flujo y merece decirlo con nombre propio.
          var sinSesion = r.error.name === "AuthSessionMissingError" || r.error.status === 401;
          nuevaError.textContent = sinSesion
            ? tAuth("enlaceCaducado", "Ese enlace ya no sirve. Pide uno nuevo desde “¿Olvidaste tu contraseña?”.")
            : mensajeError(r.error, "claveError", "No se pudo cambiar la contraseña. Intenta de nuevo.");
          nuevaError.hidden = false;
          return;
        }
        formNueva.reset();
        nuevaNote.hidden = false;
        /* La ventana ya no pinta nada: la contraseña está cambiada y el
           visitante quedó con la sesión abierta. Se deja el aviso un momento
           para que se lea y se cierra sola, en vez de obligar a cerrarla a
           mano. Vuelve a la pestaña de inicio de sesión para que la próxima
           vez que se abra no aparezca el formulario de recuperación. */
        setTimeout(function () {
          cerrarModal();
          nuevaNote.hidden = true;
          mostrarTab("login");
        }, 2500);
      });
    });

    if (ES_RECUPERACION) abrirModal("nueva");

    function pintarBoton(sesion) {
      sesionActual = sesion;
      navBtn.setAttribute("aria-label", sesion ? tAuth("miCuenta", "Mi cuenta") : tAuth("login", "Iniciar sesión"));
      if (!sesion) cerrarAuthMenu();
    }
    sb.auth.getSession().then(function (r) { pintarBoton(r.data.session); });
    sb.auth.onAuthStateChange(function (_evento, sesion) { pintarBoton(sesion); });

    // El sitio llama a esto al cambiar de idioma (ver aplicarIdioma en script.js),
    // para refrescar el botón y, si el modal está abierto, su título.
    window.TELVE_refrescarAuthUI = function () {
      pintarBoton(sesionActual);
      if (!modal.hidden) mostrarTab(tabActual);
    };
  }

  /* ---------- Catálogo de equipos: solo corre en la página Equipos ---------- */
  function initEquipos() {
    var grid = document.getElementById("equiposGrid");
    if (!grid) return;

    var MAX_FOTO_MB = 5;   // fotos de catálogo; de sobra para una foto de móvil

    var vacio      = document.getElementById("equiposVacio");
    var adminPanel = document.getElementById("equiposAdminPanel");
    var formEquipo = document.getElementById("formEquipo");
    var equipoMsg  = document.getElementById("equipoMsg");
    var esAdminActual = false;

    function tarjeta(e) {
      var especs = [];
      if (e.marca)    especs.push(tEquipos("marca", "Marca: ") + escapar(e.marca));
      if (e.modelo)   especs.push(tEquipos("modelo", "Modelo: ") + escapar(e.modelo));
      if (e.potencia) {
        var unidad = e.tipo === "Generador" ? "KVA" : "HP";
        especs.push(tEquipos("potencia", "Potencia: ") + escapar(e.potencia) + " " + unidad);
      }
      if (e.voltaje)          especs.push(tEquipos("voltaje", "Voltaje: ") + escapar(e.voltaje));
      if (e.diametro_succion) especs.push(tEquipos("succion", "Diám. succión: ") + escapar(e.diametro_succion));
      if (e.diametro_salida)  especs.push(tEquipos("salida", "Diám. salida: ") + escapar(e.diametro_salida));
      if (e.diametro_eje)     especs.push(tEquipos("eje", "Diám. eje: ") + escapar(e.diametro_eje));

      var div = document.createElement("div");
      div.className = "card card--plain";
      div.innerHTML =
        (e.foto_url ? '<img class="card__img" loading="lazy" decoding="async" src="' + escapar(e.foto_url) + '" alt="" onerror="this.remove()">' : "") +
        (e.tipo ? '<div class="card__tag"><span class="tag">' + escapar(e.tipo) + "</span></div>" : "") +
        '<h3 class="card__title">' + escapar(e.codigo) + "</h3>" +
        (especs.length ? '<ul class="drawer__list"><li>' + especs.join("</li><li>") + "</li></ul>" : "") +
        (e.precio ? '<p class="card__text"><strong>$' + Number(e.precio).toFixed(2) + "</strong></p>" : "") +
        (esAdminActual ? '<button class="card__del" type="button" data-id="' + escapar(e.id) + '">' + tEquipos("borrar", "Borrar equipo") + "</button>" : "");
      return div;
    }

    function cargarEquipos() {
      sb.from("equipos").select("*").order("created_at", { ascending: false })
        .then(function (r) {
          if (r.error) { console.error("[TELVE] error cargando equipos:", r.error); return; }
          grid.innerHTML = "";
          if (!r.data.length) { if (vacio) vacio.hidden = false; return; }
          if (vacio) vacio.hidden = true;
          r.data.forEach(function (e) { grid.appendChild(tarjeta(e)); });
        });
    }
    cargarEquipos();

    grid.addEventListener("click", function (ev) {
      var img = ev.target.closest(".card__img");
      if (img) { abrirLightbox(img.src); return; }
      var btn = ev.target.closest(".card__del");
      if (!btn) return;
      if (!confirm("¿Borrar este equipo del catálogo?")) return;
      sb.from("equipos").delete().eq("id", btn.getAttribute("data-id")).then(function (r) {
        if (r.error) {
          console.error("[TELVE] error borrando equipo:", r.error);
          alert(tEquipos("borrarError", "No se pudo borrar el equipo. Intenta de nuevo."));
          return;
        }
        cargarEquipos();
      });
    });

    function pintarAdmin(sesion) {
      var esAdmin = !!sesion && sesion.user.email === ADMIN_EMAIL;
      if (esAdmin !== esAdminActual) {
        esAdminActual = esAdmin;
        cargarEquipos(); // re-dibuja las tarjetas para mostrar/ocultar "Borrar"
      }
      if (adminPanel) adminPanel.hidden = !esAdmin;
    }
    sb.auth.getSession().then(function (r) { pintarAdmin(r.data.session); });
    sb.auth.onAuthStateChange(function (_evento, sesion) { pintarAdmin(sesion); });

    function mostrarErrorEquipo(texto) {
      if (equipoMsg) { equipoMsg.textContent = texto; equipoMsg.hidden = false; }
    }

    /* Los errores de Postgres y de Storage vienen con nombres de tabla, de
       columna y de restricciones ("new row violates row-level security
       policy for table equipos"). Eso no se le enseña a nadie: a quien está
       usando el formulario no le dice nada, y a quien esté tanteando el
       sistema le regala el mapa. Se muestra un mensaje traducido y el
       detalle se manda a la consola, que es donde lo necesita quien
       administra si algo falla de verdad. */
    function fallo(clave, porDefecto, error) {
      console.error("[TELVE]", porDefecto, error);
      mostrarErrorEquipo(tAuth(clave, porDefecto));
    }

    /* ---------- Campos según tipo: bombas piden diámetros de succión/salida,
       motores y generadores piden diámetro de eje; la potencia del generador
       se mide en KVA en vez de HP. ---------- */
    var eTipo        = document.getElementById("eTipo");
    var camposBomba  = document.getElementById("camposBomba");
    var camposMotor  = document.getElementById("camposMotor");
    var ePotencia    = document.getElementById("ePotencia");
    var eVoltaje     = document.getElementById("eVoltaje");

    function esBombaTipo(tipo) { return tipo.slice(0, 5) === "Bomba"; }
    function esMotorOGenerador(tipo) { return tipo.slice(0, 5) === "Motor" || tipo === "Generador"; }
    function esTrifasico(tipo) { return tipo.indexOf("trifás") > -1; }

    var VOLTAJES_NORMAL    = [["", "Voltaje de alimentación"], ["110V", "110V"], ["220V", "220V"], ["110V / 220V", "110V / 220V"]];
    var VOLTAJES_TRIFASICO = [["", "Voltaje de alimentación"], ["220V", "220V"], ["440V", "440V"], ["220V / 440V", "220V / 440V"]];

    function actualizarVoltajes(tipo) {
      if (!eVoltaje) return;
      var valorPrevio = eVoltaje.value;
      var opciones = esTrifasico(tipo) ? VOLTAJES_TRIFASICO : VOLTAJES_NORMAL;
      eVoltaje.innerHTML = opciones.map(function (o) {
        return '<option value="' + o[0] + '">' + o[1] + "</option>";
      }).join("");
      eVoltaje.value = opciones.some(function (o) { return o[0] === valorPrevio; }) ? valorPrevio : "";
    }

    function actualizarCampos() {
      var tipo = eTipo.value;
      if (camposBomba) camposBomba.hidden = !esBombaTipo(tipo);
      if (camposMotor) camposMotor.hidden = !esMotorOGenerador(tipo);
      if (ePotencia) ePotencia.placeholder = tipo === "Generador" ? "Potencia (KVA)" : "Potencia (HP)";
      actualizarVoltajes(tipo);
    }
    if (eTipo) {
      eTipo.addEventListener("change", actualizarCampos);
      actualizarCampos();
    }

    function guardarEquipo(fotoUrl) {
      var tipo      = eTipo.value;
      var esBomba   = esBombaTipo(tipo);
      var potencia  = ePotencia.value;
      var precio    = document.getElementById("ePrecio").value;
      var registro = {
        tipo:             tipo || null,
        codigo:           document.getElementById("eCodigo").value.trim(),
        marca:            document.getElementById("eMarca").value.trim()  || null,
        modelo:           document.getElementById("eModelo").value.trim() || null,
        voltaje:          document.getElementById("eVoltaje").value || null,
        potencia:         potencia ? Number(potencia) : null,
        diametro_succion: esBomba ? (document.getElementById("eDiamSuccion").value.trim() || null) : null,
        diametro_salida:  esBomba ? (document.getElementById("eDiamSalida").value.trim()  || null) : null,
        diametro_eje:     !esBomba ? (document.getElementById("eDiamEje").value.trim()     || null) : null,
        precio:           precio ? Number(precio) : null,
        foto_url:         fotoUrl
      };
      sb.from("equipos").insert(registro).then(function (r) {
        if (r.error) { fallo("saveError", "No se pudo guardar el equipo. Revisa los datos e intenta de nuevo.", r.error); return; }
        formEquipo.reset();
        actualizarCampos();
        cargarEquipos();
      });
    }

    if (formEquipo) formEquipo.addEventListener("submit", function (e) {
      e.preventDefault();
      if (equipoMsg) equipoMsg.hidden = true;
      var archivo = document.getElementById("eFoto").files[0];

      if (!archivo) { guardarEquipo(null); return; }

      /* El accept="image/*" del input solo filtra lo que ofrece el diálogo de
         archivos: se salta con arrastrar y soltar o cambiando el filtro. Se
         comprueba aquí de verdad, porque el bucket es público y lo que entre
         queda servido desde el dominio de Supabase.
         Esto es comodidad, no la barrera final: un cliente se puede editar.
         El límite que manda es el del bucket en el panel de Supabase (tipos
         MIME permitidos y tamaño máximo). Ver supabase/README.md. */
      if (archivo.type.indexOf("image/") !== 0) {
        fallo("fotoTipo", "El archivo debe ser una imagen.", { archivo: archivo.type });
        return;
      }
      if (archivo.size > MAX_FOTO_MB * 1024 * 1024) {
        fallo("fotoPeso", "La foto no puede pesar más de " + MAX_FOTO_MB + " MB.", { bytes: archivo.size });
        return;
      }

      // Nombre de archivo único: fecha + nombre original limpio de caracteres raros.
      var ruta = Date.now() + "-" + archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      sb.storage.from("equipos").upload(ruta, archivo).then(function (r) {
        if (r.error) { fallo("uploadError", "No se pudo subir la foto. Intenta de nuevo.", r.error); return; }
        var url = sb.storage.from("equipos").getPublicUrl(ruta).data.publicUrl;
        guardarEquipo(url);
      });
    });

    // El sitio llama a esto al cambiar de idioma, para redibujar las
    // tarjetas con las etiquetas (Marca/Modelo/…) en el idioma nuevo.
    window.TELVE_refrescarEquipos = cargarEquipos;
  }

  /* ---------- Mi equipo: seguimiento de reparación ----------
     El cliente ve los registros cuyo cliente_email coincide con su sesión
     (lo filtra la política RLS, no este archivo); el admin ve todos. Los
     valores de "etapa" se muestran tal cual vienen de la base, en español —
     mismo criterio que tarjeta() usa para tipo/marca/modelo en el catálogo:
     no hay diccionario de traducción por valor, solo de las etiquetas fijas
     de la interfaz (ver tProceso). */
  var ETAPAS = ["Diagnóstico", "En reparación", "Pruebas", "Listo para entrega", "Entregado"];

  /* Un ícono propio por etapa, mismo estilo que el resto del sitio
     (viewBox 24x24, trazo 2.4, extremos redondeados). Se usan en el stepper
     de progreso; el de "Listo para entrega" es el mismo path del ícono de
     caja que ya existe en el estado vacío de esta página. */
  var ETAPA_ICONOS = [
    '<circle cx="10.5" cy="10.5" r="6"/><path d="m20 20-4.35-4.35"/>',                                   // Diagnóstico: lupa
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"/>',           // En reparación: llave
    '<path d="M20 6 9 17l-5-5"/>',                                                                        // Pruebas: check
    '<path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z"/><path d="M3 8.5 12 13l9-4.5M12 13v7"/>',                // Listo para entrega: caja
    '<path d="M20 6 9 17l-5-5"/>'                                                                         // Entregado: check
  ];

  function initProceso() {
    var grid       = document.getElementById("procesoGrid");
    if (!grid) return;

    var MAX_FOTO_MB      = 5;
    var vacio             = document.getElementById("procesoVacio");
    var adminPanel        = document.getElementById("procesoAdminPanel");
    var historialWrap     = document.getElementById("procesoHistorialWrap");
    var historialGrid     = document.getElementById("procesoHistorial");
    var formProceso       = document.getElementById("formProceso");
    var procesoMsg        = document.getElementById("procesoMsg");
    var esAdminActual = false;

    function progresoStepper(r) {
      var idx = ETAPAS.indexOf(r.etapa);
      return '<div class="etapa-stepper" role="list">' +
        ETAPAS.map(function (et, i) {
          var estado = i < idx ? " is-done" : i === idx ? " is-current" : "";
          return '<div class="etapa-stepper__item' + estado + '" role="listitem">' +
            '<span class="etapa-stepper__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ETAPA_ICONOS[i] + "</svg></span>" +
            '<span class="etapa-stepper__label">' + escapar(et) + "</span>" +
            "</div>";
        }).join("") +
        "</div>";
    }

    function adminControles(r) {
      if (r.etapa === "Entregado") return ""; // ya está en el historial, de solo lectura
      var idx      = ETAPAS.indexOf(r.etapa);
      var siguiente = ETAPAS[idx + 1];
      var esUltimoPaso = siguiente === "Entregado";
      var textoBoton = esUltimoPaso
        ? tProceso("confirmarEntrega", "Confirmar entrega")
        : tProceso("siguienteEtapa", "Siguiente etapa");
      return '<div class="proceso-admin" data-id="' + escapar(r.id) + '">' +
        '<button type="button" class="btn btn--primary proceso-avanzar" data-id="' + escapar(r.id) + '" data-next="' + escapar(siguiente) + '">' + escapar(textoBoton) + "</button>" +
        '<textarea class="proceso-nota-texto" placeholder="' + escapar(tProceso("notaPlaceholder", "Nota (opcional)")) + '"></textarea>' +
        '<div class="proceso-dropzone" data-empty="1">' +
        '<label class="proceso-dropzone__label" for="notaFoto-' + escapar(r.id) + '">' +
        '<svg class="proceso-dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.8a1 1 0 0 1 .8-.4h3a1 1 0 0 1 .8.4L15.5 6h2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.3"/></svg>' +
        '<span class="proceso-dropzone__text">' + escapar(tProceso("adjuntarFoto", "Adjuntar foto (opcional)")) + "</span>" +
        "</label>" +
        '<input type="file" id="notaFoto-' + escapar(r.id) + '" class="proceso-nota-foto proceso-dropzone__input" accept="image/*" hidden>' +
        '<img class="proceso-dropzone__preview" alt="" hidden>' +
        "</div>" +
        '<button type="button" class="btn btn--primary proceso-nota-guardar">' + escapar(tProceso("guardarNota", "Guardar nota")) + "</button>" +
        "</div>";
    }

    function tarjeta(r) {
      var notas = (r.reparacion_notas || []).slice().sort(function (a, b) {
        return new Date(a.created_at) - new Date(b.created_at);
      });
      var notasHtml = notas.map(function (n) {
        return '<div class="proceso-nota">' +
          '<p class="proceso-nota__fecha">' + escapar(new Date(n.created_at).toLocaleDateString()) + "</p>" +
          '<p class="proceso-nota__texto">' + escapar(n.texto) + "</p>" +
          (n.foto_url ? '<img class="proceso-nota__foto" loading="lazy" decoding="async" src="' + escapar(n.foto_url) + '" alt="" onerror="this.remove()">' : "") +
          "</div>";
      }).join("");

      var div = document.createElement("div");
      div.className = "card card--plain";
      div.innerHTML =
        '<h3 class="card__title">' + escapar(r.equipo) + "</h3>" +
        '<p class="card__text">' + tProceso("numero", "Nº de servicio: ") + escapar(r.numero_servicio) + "</p>" +
        progresoStepper(r) +
        (notasHtml ? '<div class="proceso-notas">' + notasHtml + "</div>" : "") +
        (esAdminActual ? adminControles(r) : "");
      return div;
    }

    function cargarProceso() {
      sb.from("reparaciones").select("*, reparacion_notas(*)").order("created_at", { ascending: false })
        .then(function (r) {
          if (r.error) { console.error("[TELVE] error cargando proceso:", r.error); return; }
          grid.innerHTML = "";
          if (historialGrid) historialGrid.innerHTML = "";

          var datos = r.data;
          if (esAdminActual) {
            // Al admin no le sirve ver mezclado lo entregado con lo activo:
            // lo entregado se archiva solo en un historial aparte.
            var activos    = datos.filter(function (x) { return x.etapa !== "Entregado"; });
            var entregados = datos.filter(function (x) { return x.etapa === "Entregado"; });
            if (!activos.length) { if (vacio) vacio.hidden = false; } else {
              if (vacio) vacio.hidden = true;
              activos.forEach(function (reg) { grid.appendChild(tarjeta(reg)); });
            }
            if (historialWrap) historialWrap.hidden = !entregados.length;
            entregados.forEach(function (reg) { if (historialGrid) historialGrid.appendChild(tarjeta(reg)); });
          } else {
            // El cliente ve todo junto, activo y entregado, como siempre.
            if (historialWrap) historialWrap.hidden = true;
            if (!datos.length) { if (vacio) vacio.hidden = false; } else {
              if (vacio) vacio.hidden = true;
              datos.forEach(function (reg) { grid.appendChild(tarjeta(reg)); });
            }
          }
        });
    }
    cargarProceso();

    function guardarNotaDesdePanel(panel) {
      var id      = panel.getAttribute("data-id");
      var texto   = panel.querySelector(".proceso-nota-texto").value.trim();
      var archivo = panel.querySelector(".proceso-nota-foto").files[0];
      if (!texto) return;

      function insertarNota(fotoUrl) {
        sb.from("reparacion_notas").insert({ reparacion_id: id, texto: texto, foto_url: fotoUrl }).then(function (r) {
          if (r.error) {
            console.error("[TELVE] error guardando nota:", r.error);
            alert(tProceso("notaError", "No se pudo guardar la nota. Intenta de nuevo."));
            return;
          }
          cargarProceso();
        });
      }

      if (!archivo) { insertarNota(null); return; }
      // Mismo criterio que la foto de equipos: filtro de comodidad en el
      // cliente, el límite real lo pone el bucket en el panel de Supabase.
      if (archivo.type.indexOf("image/") !== 0 || archivo.size > MAX_FOTO_MB * 1024 * 1024) {
        alert(tAuth("fotoTipo", "El archivo debe ser una imagen."));
        return;
      }
      var ruta = Date.now() + "-" + archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      sb.storage.from("reparaciones").upload(ruta, archivo).then(function (r) {
        if (r.error) {
          console.error("[TELVE] error subiendo foto de nota:", r.error);
          alert(tAuth("uploadError", "No se pudo subir la foto. Intenta de nuevo."));
          return;
        }
        var url = sb.storage.from("reparaciones").getPublicUrl(ruta).data.publicUrl;
        insertarNota(url);
      });
    }

    grid.addEventListener("click", function (ev) {
      var img = ev.target.closest(".proceso-nota__foto");
      if (img) { abrirLightbox(img.src); return; }

      var avanzarBtn = ev.target.closest(".proceso-avanzar");
      if (avanzarBtn) {
        var id2  = avanzarBtn.getAttribute("data-id");
        var next = avanzarBtn.getAttribute("data-next");
        avanzarBtn.disabled = true; // evita doble click mientras viaja el pedido
        sb.from("reparaciones").update({ etapa: next }).eq("id", id2).then(function (r) {
          if (r.error) {
            console.error("[TELVE] error actualizando etapa:", r.error);
            alert(tProceso("etapaError", "No se pudo actualizar la etapa."));
            avanzarBtn.disabled = false;
            return;
          }
          cargarProceso();
        });
        return;
      }

      var guardarBtn = ev.target.closest(".proceso-nota-guardar");
      if (guardarBtn) { guardarNotaDesdePanel(guardarBtn.closest(".proceso-admin")); return; }
    });

    // Vista previa inmediata al elegir una foto, antes de guardar la nota.
    grid.addEventListener("change", function (ev) {
      var input = ev.target.closest(".proceso-dropzone__input");
      if (!input) return;
      var zona    = input.closest(".proceso-dropzone");
      var preview = zona.querySelector(".proceso-dropzone__preview");
      var archivo = input.files[0];
      if (!archivo) { preview.hidden = true; zona.setAttribute("data-empty", "1"); return; }
      if (archivo.type.indexOf("image/") !== 0 || archivo.size > MAX_FOTO_MB * 1024 * 1024) {
        alert(tAuth("fotoTipo", "El archivo debe ser una imagen."));
        input.value = "";
        return;
      }
      preview.src = URL.createObjectURL(archivo);
      preview.hidden = false;
      zona.removeAttribute("data-empty");
    });

    function pintarAdmin(sesion) {
      var esAdmin = !!sesion && sesion.user.email === ADMIN_EMAIL;
      if (esAdmin !== esAdminActual) {
        esAdminActual = esAdmin;
        cargarProceso();
      }
      if (adminPanel) adminPanel.hidden = !esAdmin;
    }
    sb.auth.getSession().then(function (r) { pintarAdmin(r.data.session); });
    sb.auth.onAuthStateChange(function (_evento, sesion) { pintarAdmin(sesion); });

    var RE_CORREO_PROCESO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (formProceso) formProceso.addEventListener("submit", function (e) {
      e.preventDefault();
      if (procesoMsg) procesoMsg.hidden = true;
      var correo = document.getElementById("pCorreo").value.trim();
      var numero = document.getElementById("pNumero").value.trim();
      var equipo = document.getElementById("pEquipo").value.trim();
      var etapa  = document.getElementById("pEtapa").value;
      if (!correo || !RE_CORREO_PROCESO.test(correo) || !numero || !equipo) {
        if (procesoMsg) {
          procesoMsg.textContent = tProceso("registroError", "No se pudo guardar el registro. Revisa los datos e intenta de nuevo.");
          procesoMsg.hidden = false;
        }
        return;
      }
      sb.from("reparaciones").insert({
        cliente_email: correo, numero_servicio: numero, equipo: equipo, etapa: etapa
      }).then(function (r) {
        if (r.error) {
          console.error("[TELVE] error creando reparación:", r.error);
          if (procesoMsg) {
            procesoMsg.textContent = tProceso("registroError", "No se pudo guardar el registro. Revisa los datos e intenta de nuevo.");
            procesoMsg.hidden = false;
          }
          return;
        }
        formProceso.reset();
        cargarProceso();
      });
    });

    // El sitio llama a esto al cambiar de idioma, igual que TELVE_refrescarEquipos.
    window.TELVE_refrescarProceso = cargarProceso;
  }
})();
