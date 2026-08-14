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

  document.addEventListener("DOMContentLoaded", function () {
    initAuthModal();
    initEquipos();
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
    var tabsWrap   = modal.querySelector(".authModal__tabs");
    var titulo     = document.getElementById("authModalTitle");

    var sesionActual = null;
    var tabActual = "login";

    function mostrarTab(tab) {
      tabActual = tab;
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
      mostrarTab(tab || "login");
      document.addEventListener("keydown", alEscape);
    }
    function cerrarModal() {
      modal.hidden = true;
      document.removeEventListener("keydown", alEscape);
    }

    navBtn.addEventListener("click", function () {
      if (sesionActual) { sb.auth.signOut(); return; }
      abrirModal("login");
    });
    if (cerrarBtn) cerrarBtn.addEventListener("click", cerrarModal);
    if (backdrop)  backdrop.addEventListener("click", cerrarModal);
    tabLogin.addEventListener("click", function () { mostrarTab("login"); });
    tabReg.addEventListener("click", function () { mostrarTab("register"); });

    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      loginError.hidden = true;
      var email = document.getElementById("authLoginEmail").value;
      var clave = document.getElementById("authLoginPass").value;
      sb.auth.signInWithPassword({ email: email, password: clave }).then(function (r) {
        if (r.error) {
          loginError.textContent = tAuth("loginError", "Correo o contraseña incorrectos.");
          loginError.hidden = false;
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
      same_password:              ["claveIgual",     "Esa ya es tu contraseña actual. Elige otra."]
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
      var email = document.getElementById("authRegEmail").value;
      var clave = document.getElementById("authRegPass").value;
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
        options: { emailRedirectTo: location.origin + location.pathname }
      }).then(function (r) {
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
      if (!email) {
        loginError.textContent = tAuth("escribeCorreo", "Escribe tu correo arriba y vuelve a pulsar.");
        loginError.hidden = false;
        return;
      }
      sb.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin + location.pathname
      }).then(function (r) {
        if (r.error) {
          loginError.textContent = mensajeError(r.error, "resetError", "No se pudo enviar el enlace. Intenta de nuevo en un momento.");
          loginError.hidden = false;
          return;
        }
        loginNote.hidden = false;
      });
    });

    /* ---------- Segundo tramo: guardar la contraseña nueva ----------
       El visitante vuelve del correo con la sesión de recuperación ya abierta,
       así que no hay que verificar nada más: basta con cambiar la clave. */
    if (formNueva) formNueva.addEventListener("submit", function (e) {
      e.preventDefault();
      nuevaError.hidden = true;
      nuevaNote.hidden = true;
      sb.auth.updateUser({ password: document.getElementById("authNuevaPass").value }).then(function (r) {
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
      });
    });

    if (ES_RECUPERACION) abrirModal("nueva");

    function pintarBoton(sesion) {
      sesionActual = sesion;
      navBtn.textContent = sesion ? tAuth("logout", "Cerrar sesión") : tAuth("login", "Iniciar sesión");
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

    /* Escapa para meter texto dentro de HTML, incluidos los ATRIBUTOS.
       Antes esto se hacía con textContent → innerHTML, que escapa < > &
       pero NO las comillas: un valor con una comilla doble cerraba el
       atributo de al lado y permitía inyectar código (por ejemplo un
       onerror= dentro de la etiqueta img de la foto). Se escapan también
       las dos comillas, que es lo que hace segura la interpolación en
       src="..." y data-id="..." de tarjeta(). */
    var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    function escapar(txt) {
      return String(txt).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
    }

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
})();
