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

  if (!window.supabase) return; // CDN no cargó (sin internet, bloqueado, etc.)
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
    var loginError = document.getElementById("authLoginError");
    var regError   = document.getElementById("authRegError");
    var regNote    = document.getElementById("authRegNote");
    var titulo     = document.getElementById("authModalTitle");

    var sesionActual = null;

    function mostrarTab(tab) {
      var esLogin = tab === "login";
      tabLogin.classList.toggle("is-active", esLogin);
      tabReg.classList.toggle("is-active", !esLogin);
      tabLogin.setAttribute("aria-selected", esLogin ? "true" : "false");
      tabReg.setAttribute("aria-selected", !esLogin ? "true" : "false");
      formLogin.hidden = !esLogin;
      formReg.hidden = esLogin;
      titulo.textContent = esLogin
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

    formReg.addEventListener("submit", function (e) {
      e.preventDefault();
      regError.hidden = true;
      regNote.hidden = true;
      var email = document.getElementById("authRegEmail").value;
      var clave = document.getElementById("authRegPass").value;
      sb.auth.signUp({ email: email, password: clave }).then(function (r) {
        if (r.error) { regError.textContent = r.error.message; regError.hidden = false; return; }
        formReg.reset();
        if (!r.data.session) {
          // Proyecto con confirmación de correo activa: no hay sesión aún.
          regNote.hidden = false;
        } else {
          cerrarModal();
        }
      });
    });

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
      if (!modal.hidden) mostrarTab(formLogin.hidden ? "register" : "login");
    };
  }

  /* ---------- Catálogo de equipos: solo corre en la página Equipos ---------- */
  function initEquipos() {
    var grid = document.getElementById("equiposGrid");
    if (!grid) return;

    var vacio      = document.getElementById("equiposVacio");
    var adminPanel = document.getElementById("equiposAdminPanel");
    var formEquipo = document.getElementById("formEquipo");
    var equipoMsg  = document.getElementById("equipoMsg");
    var esAdminActual = false;

    function escapar(txt) {
      var d = document.createElement("div");
      d.textContent = String(txt);
      return d.innerHTML;
    }

    function tarjeta(e) {
      var especs = [];
      if (e.marca)       especs.push(tEquipos("marca", "Marca: ") + escapar(e.marca));
      if (e.modelo)      especs.push(tEquipos("modelo", "Modelo: ") + escapar(e.modelo));
      if (e.potencia_hp) especs.push(tEquipos("potencia", "Potencia: ") + escapar(e.potencia_hp) + " HP");
      if (e.caudal)      especs.push(tEquipos("caudal", "Caudal: ") + escapar(e.caudal));
      if (e.presion)     especs.push(tEquipos("presion", "Presión: ") + escapar(e.presion));

      var div = document.createElement("div");
      div.className = "card card--plain";
      div.innerHTML =
        (e.foto_url ? '<img class="card__img" loading="lazy" decoding="async" src="' + escapar(e.foto_url) + '" alt="" onerror="this.remove()">' : "") +
        (e.tipo ? '<div class="card__tag"><span class="tag">' + escapar(e.tipo) + "</span></div>" : "") +
        '<h3 class="card__title">' + escapar(e.nombre) + "</h3>" +
        (especs.length ? '<ul class="drawer__list"><li>' + especs.join("</li><li>") + "</li></ul>" : "") +
        (e.precio ? '<p class="card__text"><strong>$' + Number(e.precio).toFixed(2) + "</strong></p>" : "") +
        (esAdminActual ? '<button class="card__del" type="button" data-id="' + e.id + '">' + tEquipos("borrar", "Borrar equipo") + "</button>" : "");
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
      var btn = ev.target.closest(".card__del");
      if (!btn) return;
      if (!confirm("¿Borrar este equipo del catálogo?")) return;
      sb.from("equipos").delete().eq("id", btn.getAttribute("data-id")).then(function (r) {
        if (r.error) { alert("Error al borrar: " + r.error.message); return; }
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

    function guardarEquipo(fotoUrl) {
      var potencia = document.getElementById("ePotencia").value;
      var precio   = document.getElementById("ePrecio").value;
      var registro = {
        tipo:        document.getElementById("eTipo").value || null,
        nombre:      document.getElementById("eNombre").value.trim(),
        marca:       document.getElementById("eMarca").value.trim()  || null,
        modelo:      document.getElementById("eModelo").value.trim() || null,
        potencia_hp: potencia ? Number(potencia) : null,
        caudal:      document.getElementById("eCaudal").value.trim()  || null,
        presion:     document.getElementById("ePresion").value.trim() || null,
        precio:      precio ? Number(precio) : null,
        foto_url:    fotoUrl
      };
      sb.from("equipos").insert(registro).then(function (r) {
        if (r.error) { mostrarErrorEquipo(tAuth("saveError", "Error al guardar: ") + r.error.message); return; }
        formEquipo.reset();
        cargarEquipos();
      });
    }

    if (formEquipo) formEquipo.addEventListener("submit", function (e) {
      e.preventDefault();
      if (equipoMsg) equipoMsg.hidden = true;
      var archivo = document.getElementById("eFoto").files[0];

      if (!archivo) { guardarEquipo(null); return; }

      // Nombre de archivo único: fecha + nombre original limpio de caracteres raros.
      var ruta = Date.now() + "-" + archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      sb.storage.from("equipos").upload(ruta, archivo).then(function (r) {
        if (r.error) { mostrarErrorEquipo(tAuth("uploadError", "Error al subir la foto: ") + r.error.message); return; }
        var url = sb.storage.from("equipos").getPublicUrl(ruta).data.publicUrl;
        guardarEquipo(url);
      });
    });

    // El sitio llama a esto al cambiar de idioma, para redibujar las
    // tarjetas con las etiquetas (Marca/Modelo/…) en el idioma nuevo.
    window.TELVE_refrescarEquipos = cargarEquipos;
  }
})();
