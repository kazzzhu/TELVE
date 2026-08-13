# Configuración de Supabase — sitio TELVE

Todo lo que el sitio necesita del panel de Supabase y que **no vive en el código**.
Si algo del registro o del catálogo deja de funcionar, la causa suele estar aquí.

Proyecto: `jwpbwbknwxrfhaiberkz` · Sitio publicado: <https://kazzzhu.github.io/TELVE/>

---

## 1. URL Configuration (Authentication → URL Configuration)

| Campo | Valor |
|---|---|
| Site URL | `https://kazzzhu.github.io/TELVE/` |
| Redirect URLs | `https://kazzzhu.github.io/TELVE/**` |
| Redirect URLs | `http://localhost:8000/**` (para probar en local) |

La barra final y el `/TELVE/` importan: sin la ruta, el enlace de confirmación
aterriza en la página raíz de GitHub del dueño de la cuenta, no en el sitio.

`js/equipos.js` manda `emailRedirectTo: location.origin + location.pathname`,
pero Supabase **ignora en silencio** cualquier redirección que no esté en esa
lista blanca y vuelve a caer en la Site URL. Los dos lados tienen que estar bien.

---

## 2. Correo saliente (SMTP)

**El SMTP de fábrica de Supabase no sirve para uso general.** Está limitado a
unos 2 correos por hora y, en proyectos nuevos, solo entrega a las direcciones
del equipo del proyecto. Un cliente cualquiera que se registre no recibe nada.
No es un problema de código y no se arregla desde este repositorio.

### El obstáculo: TELVE no tiene dominio propio

Casi todos los servicios de correo transaccional exigen verificar un **dominio**
(`telve.com.ve`, por ejemplo) para poder enviar a terceros. TELVE hoy usa una
dirección de Gmail y el sitio vive en `github.io`. Eso deja dos caminos:

**Camino A — Brevo, sin dominio (lo que se puede hacer hoy)**

Brevo permite verificar una **dirección suelta**, sin dominio propio.

1. Crear cuenta en <https://www.brevo.com> (plan gratis: 300 correos/día).
2. *Senders & IP* → *Senders* → agregar `telveca@gmail.com` y confirmar el
   correo de verificación que llega a esa bandeja.
3. *SMTP & API* → *SMTP* → copiar servidor, puerto, usuario y clave.
4. En Supabase: *Project Settings* → *Authentication* → *SMTP Settings* →
   *Enable Custom SMTP* y pegar esos datos.
   - Sender email: `telveca@gmail.com`
   - Sender name: `TELVE, C.A.`
5. *Authentication* → *Rate Limits* → subir el límite de correos por hora
   (con el SMTP de fábrica está clavado en 2).

Funciona, pero el correo sale desde los servidores de Brevo con una dirección
`@gmail.com`, así que Gmail y Outlook lo muestran con un aviso de "enviado
por brevo.com" y una parte puede caer en spam. Es aceptable para arrancar.

**Camino B — dominio propio (lo correcto a mediano plazo)**

Comprar `telve.com.ve` o similar (unos 10–15 USD al año) resuelve de raíz:
el correo sale de `no-responder@telve.com.ve` con SPF y DKIM alineados, deja
de caer en spam, y de paso el sitio puede dejar de vivir en una URL de GitHub.
Con dominio, Resend (<https://resend.com>, 3.000 correos/mes gratis) es más
simple de configurar que Brevo.

Vale la pena plantearlo al cliente: es el gasto más pequeño con más efecto
sobre cómo se ve la empresa por correo.

---

## 3. Plantillas de correo

En *Authentication* → *Emails* → *Templates*, pegar en "Message body":

| Plantilla de Supabase | Archivo de este repositorio |
|---|---|
| Confirm signup | `plantillas-correo/confirmar-cuenta.html` |
| Reset password | `plantillas-correo/recuperar-clave.html` |

Están en español porque Supabase tiene **una sola plantilla por proyecto**: no
puede elegir idioma según el visitante, aunque el sitio hable cuatro. El español
es el idioma base y el de la clientela.

Van maquetadas con `<table>` y estilos en línea a propósito — Outlook y Gmail
descartan `<style>`, flexbox y grid.

---

## 4. Permisos (RLS)

La regla de quién puede publicar equipos vive en las **políticas RLS de la base
de datos**, no en el JavaScript. `js/equipos.js` compara contra `ADMIN_EMAIL`
solo para no mostrar un botón que la base de datos igual rechazaría.

Nunca confiar en el chequeo del cliente para permisos: cualquiera puede editar
el JavaScript en su navegador. Si hay que cambiar quién administra, se cambia
la política RLS, y de paso la constante del archivo.

---

## Pendientes conocidos

- **No hay pantalla de "olvidé mi contraseña"** en el sitio. La plantilla existe,
  pero nada la dispara todavía; hoy solo se puede resetear a mano desde el panel.
- **No hay forma de reenviar el correo de confirmación.** Quien lo borre o no lo
  reciba se queda con una cuenta sin confirmar y sin salida por la interfaz;
  hay que borrar el usuario en *Authentication* → *Users* para que pueda
  registrarse de nuevo.
- **Una cuenta registrada no sirve de nada todavía.** El catálogo se lee sin
  sesión y lo único que desbloquea una sesión es el panel del administrador.
  El registro público está abierto por decisión del dueño del sitio, previendo
  funciones de cliente más adelante.
