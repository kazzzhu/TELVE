/* Comprobación de escapar() — se ejecuta con:  node js/escapar.test.js
   No hay framework de pruebas en este repositorio y no hace falta: esto es
   un archivo suelto que se corre a mano cuando se toca el escapado.

   Por qué existe solo para esta función: su salida se interpola dentro de
   atributos HTML en tarjeta() (src="…", data-id="…"). Si deja de escapar
   las comillas, se puede cerrar el atributo e inyectar código. Es el único
   punto del sitio donde un descuido de una línea abre un XSS.

   Lee la función del propio equipos.js en vez de copiarla: una copia
   probaría la copia, no lo que se publica. */
const fs = require("fs");
const assert = require("assert");

const fuente = fs.readFileSync(__dirname + "/equipos.js", "utf8");
const mapa = fuente.match(/var ESCAPES = \{[^}]*\};/);
const funcion = fuente.match(/function escapar\(txt\) \{[\s\S]*?\n {4}\}/);
assert.ok(mapa && funcion, "no se encontró escapar() en equipos.js — ¿la renombraron?");
const escapar = eval("(function(){ " + mapa[0] + funcion[0] + " return escapar; })()");

// Lo que motivó el arreglo: la comilla doble cierra el atributo.
assert.strictEqual(
  escapar('" onerror="alert(1)'),
  "&quot; onerror=&quot;alert(1)",
  "las comillas dobles deben escaparse o se puede salir de un atributo"
);
assert.strictEqual(escapar("'"), "&#39;", "comilla simple");
assert.strictEqual(escapar("<script>"), "&lt;script&gt;", "etiquetas");
assert.strictEqual(escapar("a & b"), "a &amp; b", "ampersand");

// El ampersand va primero, o se re-escaparían las entidades ya generadas.
assert.strictEqual(escapar("&lt;"), "&amp;lt;", "no debe producir doble escapado incorrecto");

// Valores no textuales: tarjeta() le pasa e.id, que puede no ser string.
assert.strictEqual(escapar(42), "42", "números");
assert.strictEqual(escapar(null), "null", "null no debe reventar");

// Texto normal pasa intacto: el catálogo real no debe verse alterado.
assert.strictEqual(escapar("Motor WEG 3/4 HP"), "Motor WEG 3/4 HP", "texto corriente sin cambios");

console.log("escapar(): 8 comprobaciones OK");
