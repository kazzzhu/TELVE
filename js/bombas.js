/* ===================================================================
   TELVE C.A. — Acceso (login/registro) y catálogo de bombas (Supabase)
   Cualquiera puede registrarse; solo el correo del administrador puede
   agregar bombas. Esa restricción la impone la base de datos (política
   RLS), este archivo solo refleja el mismo criterio en la interfaz para
   no mostrar un botón que la base de datos igual rechazaría.
   =================================================================== */
(function () {
  var SUPABASE_URL = "https://jwpbwbknwxrfhaiberkz.supabase.co";
  var SUPABASE_KEY = "sb_publishable_eKbEmIEBrVtoiWXVYRYI9A_jTesbBCw";
  var ADMIN_EMAIL  = "telveca@gmail.com";

  if (!window.supabase) return; // CDN no cargó (sin internet, bloqueado, etc.)
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  document.addEventListener("DOMContentLoaded", function () {
    initAuthModal();
    initBombas();
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
      titulo.textContent = esLogin ? "Bienvenido de nuevo" : "Crear cuenta";
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
          loginError.textContent = "Correo o contraseña incorrectos.";
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
      navBtn.textContent = sesion ? "Cerrar sesión" : "Iniciar sesión";
    }
    sb.auth.getSession().then(function (r) { pintarBoton(r.data.session); });
    sb.auth.onAuthStateChange(function (_evento, sesion) { pintarBoton(sesion); });
  }

  /* ---------- Catálogo de bombas: solo corre en la página Bombas ---------- */
  function initBombas() {
    var grid = document.getElementById("bombasGrid");
    if (!grid) return;

    var vacio      = document.getElementById("bombasVacio");
    var adminPanel = document.getElementById("bombasAdminPanel");
    var formBomba  = document.getElementById("formBomba");
    var bombaMsg   = document.getElementById("bombaMsg");
    var esAdminActual = false;

    function escapar(txt) {
      var d = document.createElement("div");
      d.textContent = String(txt);
      return d.innerHTML;
    }

    function tarjeta(b) {
      var especs = [];
      if (b.marca)       especs.push("Marca: " + escapar(b.marca));
      if (b.modelo)      especs.push("Modelo: " + escapar(b.modelo));
      if (b.potencia_hp) especs.push("Potencia: " + escapar(b.potencia_hp) + " HP");
      if (b.caudal)      especs.push("Caudal: " + escapar(b.caudal));
      if (b.presion)     especs.push("Presión: " + escapar(b.presion));

      var div = document.createElement("div");
      div.className = "card card--plain";
      div.innerHTML =
        (b.foto_url ? '<img class="card__img" loading="lazy" decoding="async" src="' + escapar(b.foto_url) + '" alt="" onerror="this.remove()">' : "") +
        '<h3 class="card__title">' + escapar(b.nombre) + "</h3>" +
        (especs.length ? '<ul class="drawer__list"><li>' + especs.join("</li><li>") + "</li></ul>" : "") +
        (b.precio ? '<p class="card__text"><strong>$' + Number(b.precio).toFixed(2) + "</strong></p>" : "") +
        (esAdminActual ? '<button class="card__del" type="button" data-id="' + b.id + '">Borrar bomba</button>' : "");
      return div;
    }

    function cargarBombas() {
      sb.from("bombas").select("*").order("created_at", { ascending: false })
        .then(function (r) {
          if (r.error) { console.error("[TELVE] error cargando bombas:", r.error); return; }
          grid.innerHTML = "";
          if (!r.data.length) { if (vacio) vacio.hidden = false; return; }
          if (vacio) vacio.hidden = true;
          r.data.forEach(function (b) { grid.appendChild(tarjeta(b)); });
        });
    }
    cargarBombas();

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".card__del");
      if (!btn) return;
      if (!confirm("¿Borrar esta bomba del catálogo?")) return;
      sb.from("bombas").delete().eq("id", btn.getAttribute("data-id")).then(function (r) {
        if (r.error) { alert("Error al borrar: " + r.error.message); return; }
        cargarBombas();
      });
    });

    function pintarAdmin(sesion) {
      var esAdmin = !!sesion && sesion.user.email === ADMIN_EMAIL;
      if (esAdmin !== esAdminActual) {
        esAdminActual = esAdmin;
        cargarBombas(); // re-dibuja las tarjetas para mostrar/ocultar "Borrar"
      }
      if (adminPanel) adminPanel.hidden = !esAdmin;
    }
    sb.auth.getSession().then(function (r) { pintarAdmin(r.data.session); });
    sb.auth.onAuthStateChange(function (_evento, sesion) { pintarAdmin(sesion); });

    function mostrarErrorBomba(texto) {
      if (bombaMsg) { bombaMsg.textContent = texto; bombaMsg.hidden = false; }
    }

    function guardarBomba(fotoUrl) {
      var potencia = document.getElementById("bPotencia").value;
      var precio   = document.getElementById("bPrecio").value;
      var registro = {
        nombre:      document.getElementById("bNombre").value.trim(),
        marca:       document.getElementById("bMarca").value.trim()  || null,
        modelo:      document.getElementById("bModelo").value.trim() || null,
        potencia_hp: potencia ? Number(potencia) : null,
        caudal:      document.getElementById("bCaudal").value.trim()  || null,
        presion:     document.getElementById("bPresion").value.trim() || null,
        precio:      precio ? Number(precio) : null,
        foto_url:    fotoUrl
      };
      sb.from("bombas").insert(registro).then(function (r) {
        if (r.error) { mostrarErrorBomba("Error al guardar: " + r.error.message); return; }
        formBomba.reset();
        cargarBombas();
      });
    }

    if (formBomba) formBomba.addEventListener("submit", function (e) {
      e.preventDefault();
      if (bombaMsg) bombaMsg.hidden = true;
      var archivo = document.getElementById("bFoto").files[0];

      if (!archivo) { guardarBomba(null); return; }

      // Nombre de archivo único: fecha + nombre original limpio de caracteres raros.
      var ruta = Date.now() + "-" + archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      sb.storage.from("bombas").upload(ruta, archivo).then(function (r) {
        if (r.error) { mostrarErrorBomba("Error al subir la foto: " + r.error.message); return; }
        var url = sb.storage.from("bombas").getPublicUrl(ruta).data.publicUrl;
        guardarBomba(url);
      });
    });
  }
})();
