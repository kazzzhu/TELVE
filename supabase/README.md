# Configuración de Supabase — sitio TELVE

Todo lo que el sitio necesita del panel de Supabase y que **no vive en el código**.
Si algo del registro o del catálogo deja de funcionar, la causa suele estar aquí.

Proyecto: `jwpbwbknwxrfhaiberkz` · Sitio publicado: <https://telveca.com/>

El sitio se sirve desde GitHub Pages con dominio propio (`telveca.com`,
registrado en Cloudflare). La URL vieja `kazzzhu.github.io/TELVE/` redirige
sola y **no debe usarse** en configuración nueva.

---

## 1. URL Configuration (Authentication → URL Configuration)

| Campo | Valor |
|---|---|
| Site URL | `https://telveca.com/` |
| Redirect URLs | `https://telveca.com/**` |
| Redirect URLs | `http://localhost:8000/**` (para probar en local) |

`js/equipos.js` manda `emailRedirectTo: location.origin + location.pathname`,
pero Supabase **ignora en silencio** cualquier redirección que no esté en esa
lista blanca y vuelve a caer en la Site URL. Los dos lados tienen que estar bien.

---

## 2. Correo saliente (SMTP) — Resend

> **Ya configurado y funcionando** desde el 13 de agosto de 2026. Los pasos de
> abajo quedan como referencia, por si hay que rehacerlo o mover el proyecto.
> Estado actual: dominio `telveca.com` verificado en Resend, SMTP propio
> activo en Supabase, remitente `no-responder@telveca.com`, límite de envío
> subido a 30/hora. Registros DNS en Cloudflare: DKIM en `resend._domainkey`,
> SPF (MX + TXT) en `send`, y DMARC `p=none` en `_dmarc`.

**El SMTP de fábrica de Supabase no sirve para uso general.** Está limitado a
unos 2 correos por hora y, en proyectos nuevos, solo entrega a las direcciones
del equipo del proyecto. Un cliente cualquiera que se registre no recibe nada.
No es un problema de código y no se arregla desde este repositorio.

Con `telveca.com` ya registrado, el proveedor es **Resend**
(<https://resend.com>, 3.000 correos/mes gratis).

1. Crear cuenta en Resend.
2. *Domains* → *Add Domain* → `telveca.com`. Resend entrega un juego de
   registros DNS (DKIM en TXT, y un subdominio de retorno para SPF).
3. Crear esos registros en Cloudflare (*DNS → Records*), tal cual los da
   Resend, **con el proxy desactivado** (nube gris). Esperar a que Resend
   marque el dominio como *Verified*.
4. *API Keys* → crear una clave y tomar las credenciales SMTP.
5. Supabase → *Project Settings* → *Authentication* → *SMTP Settings* →
   *Enable Custom SMTP*:
   - Host, puerto, usuario y clave: los de Resend
   - Sender email: `no-responder@telveca.com`
   - Sender name: `TELVE, C.A.`
6. *Authentication* → *Rate Limits* → subir el límite de correos por hora, que
   con el SMTP de fábrica está clavado en 2.

`no-responder@telveca.com` no necesita buzón: Resend firma y envía sin que esa
dirección exista como cuenta de correo. TELVE sigue usando `telveca@gmail.com`
como dirección de contacto publicada en el sitio.

### Si algún día quieren correo propio con el dominio

`info@telveca.com` y similares son *email hosting*, otra cosa distinta de esto.
Zoho Mail tiene plan gratuito para un dominio; Google Workspace ronda 6 USD al
mes por buzón. Requiere agregar registros **MX** en Cloudflare, que conviven sin
problema con los de Resend (Resend usa un subdominio de retorno propio, no el MX
del dominio raíz). No hay que tocar nada de lo de arriba.

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

Comprobado el 2026-08-13 contra el proyecto en producción: un visitante
anónimo recibe 401 al intentar escribir, y un usuario registrado que no sea el
administrador recibe 403 en INSERT y afecta cero filas en DELETE. Conviene
repetir esa prueba si alguna vez se tocan las políticas.

Ojo con el DELETE: RLS **filtra filas en vez de dar error**, así que PostgREST
devuelve 204 igual que si hubiera borrado algo. La prueba válida es mirar si la
fila sigue existiendo, no el código de respuesta.

---

## 5. Límites del bucket de fotos (Storage)

`js/equipos.js` rechaza archivos que no sean imagen y los de más de 5 MB antes
de subirlos, pero eso es **comodidad, no seguridad**: es código de cliente y se
puede saltar. El límite que de verdad manda se pone en el panel.

*Storage* → bucket `equipos` → *Settings*:

- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
- **File size limit**: 5 MB, para que coincida con `MAX_FOTO_MB` del JavaScript

Importa porque el bucket es público: lo que entre queda servido desde el
dominio de Supabase. Sin este límite, un archivo HTML subido ahí se sirve como
página.

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
