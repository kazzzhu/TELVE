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
> SPF (MX + TXT) en `send`, y DMARC `p=none` en `_dmarc`. La clave de Resend
> se cambió el 2026-08-14 por una de **Sending access** solamente.

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
4. *API Keys* → crear una clave con permiso **Sending access** (no *Full
   access*: para enviar correo no hace falta poder borrar dominios ni crear
   más claves) y tomar las credenciales SMTP.
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

La de *Reset password* la dispara el enlace "¿Olvidaste tu contraseña?" del
modal de acceso. El visitante vuelve a `https://telveca.com/` con
`#type=recovery` en la URL; `js/equipos.js` lo detecta al arrancar y abre el
modal directo en el formulario de contraseña nueva.

Los dos correos vuelven con un `?p=<pestaña>` en la dirección, para aterrizar
en la pestaña desde la que se pidió el correo y no en Inicio. Va en la query y
no en el hash porque **Supabase reemplaza el fragmento entero** por su token.
`https://telveca.com/**` de la lista blanca ya cubre esas direcciones; si
alguna vez dejaran de cubrirlas, Supabase las ignora y cae en la Site URL —
se aterriza en Inicio, sin romper nada.

Son **bilingües, español arriba e inglés debajo**, porque Supabase tiene una
sola plantilla por proyecto: no sabe en qué idioma navegaba el visitante,
aunque el sitio hable cuatro. El español manda por ser el idioma del sitio y
el de la clientela; el inglés cubre a quien no lo hable.

Se puede hacer de verdad multi-idioma guardando el idioma en los metadatos del
usuario al registrarse y ramificando con condicionales de Go
(`{{ if eq .Data.lang "en" }}`). Se descartó: solo funcionaría para quien se
registre a partir de ese cambio, y multiplica por cuatro el tamaño de dos
plantillas que hay que editar a mano en el panel.

El inglés está escrito a propósito sin vocabulario del ramo, así que no depende
de la revisión de traducción que TELVE todavía tiene pendiente sobre el sitio.

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

### Permisos del bucket de fotos (`storage.objects`)

Storage lleva sus **propias** políticas, aparte de las de la tabla. Comprobadas
el 2026-08-14 contra producción:

| Operación | Quién |
|---|---|
| SELECT | **nadie** por API (ver abajo) |
| INSERT | solo el correo del administrador |
| DELETE | **nadie**: no hay política, y sin política RLS deniega |
| UPDATE | **nadie**, por lo mismo |

Un visitante anónimo recibe 403 al subir y al borrar; un usuario registrado que
no sea el administrador recibe `new row violates row-level security policy` al
subir. Ninguno de los dos puede tocar las fotos.

**La política SELECT se quitó el 2026-08-14** siguiendo un aviso del propio
panel: era `bucket_id = 'equipos'` para `public`, y permitía pedir el
**listado completo** de archivos del bucket. Las fotos se siguen viendo igual
porque un bucket público las sirve por `/storage/v1/object/public/...`, ruta
que no pasa por RLS. `js/equipos.js` no llama nunca a `.list()`, y
`getPublicUrl()` arma la URL como texto sin tocar la red. Si alguna vez hace
falta listar el bucket desde el sitio, habrá que volver a crear la política —
y entonces conviene acotarla a un prefijo, no al bucket entero.

El mismo truco del DELETE aplica aquí y de forma más engañosa: `storage.remove()`
sobre un archivo que RLS no deja borrar devuelve `{ data: [], error: null }`,
exactamente igual que si el archivo no existiera. **No sirve para medir
permisos.** Lo que sí sirve es leer las políticas:

```sql
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects';
```

Consecuencia práctica, no de seguridad: `js/equipos.js` borra la fila de la
tabla pero nunca el archivo del bucket, y encima el archivo es imborrable por
API. Cada equipo eliminado deja su foto huérfana en Storage para siempre. Son
unos pocos megabytes; si algún día molesta, hay que limpiarlas a mano desde el
panel, o agregar una política DELETE para el administrador y llamar a
`sb.storage.from("equipos").remove([...])` al borrar.

---

## 5. Límites del bucket de fotos (Storage)

`js/equipos.js` rechaza archivos que no sean imagen y los de más de 5 MB antes
de subirlos, pero eso es **comodidad, no seguridad**: es código de cliente y se
puede saltar. El límite que de verdad manda se pone en el panel.

Puesto el 2026-08-14 en *Storage* → bucket `equipos` → *Edit bucket*:

- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
- **File size limit**: 5 MB, para que coincida con `MAX_FOTO_MB` del JavaScript

Importa porque el bucket es público: lo que entre queda servido desde el
dominio de Supabase. Sin este límite, un archivo HTML subido ahí se sirve como
página.

Si algún día se sube `MAX_FOTO_MB` en `js/equipos.js`, hay que subir también el
límite del panel — si no, el navegador acepta la foto y Supabase la rechaza
después, que es peor que rechazarla de entrada.

---

## Pendientes conocidos

- **No hay forma de reenviar el correo de confirmación.** Quien lo borre o no lo
  reciba se queda con una cuenta sin confirmar y sin salida por la interfaz;
  hay que borrar el usuario en *Authentication* → *Users* para que pueda
  registrarse de nuevo.
- **Una cuenta registrada no sirve de nada todavía.** El catálogo se lee sin
  sesión y lo único que desbloquea una sesión es el panel del administrador.
  El registro público está abierto por decisión del dueño del sitio, previendo
  funciones de cliente más adelante.
