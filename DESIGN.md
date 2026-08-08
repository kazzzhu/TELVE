---
name: TELVE, C.A.
description: Talleres Eléctricos Venezolanos — rebobinado y reparación de motores y generadores eléctricos, Ciudad Bolívar.
colors:
  petroleum-teal: "#336666"
  petroleum-teal-deep: "#244d4d"
  petroleum-teal-darkest: "#1b3b3b"
  signal-red: "#c62828"
  signal-red-bright: "#e23b2e"
  fog-gray: "#f4f6f6"
  workshop-white: "#ffffff"
  pale-mint: "#eaf0ef"
  charcoal-green: "#1f2b2b"
  muted-teal-gray: "#5c6b6b"
  line-gray: "#dbe3e2"
  whatsapp-green: "#25D366"
  whatsapp-green-text: "#04210f"
  hero-plate-pink: "#ffd0cb"
  # --- Tintes de apoyo sobre fondos verdes ---
  # Escalones claros del verde petróleo, usados para texto secundario según
  # cuán oscuro sea el fondo. No son colores nuevos de marca: son la rampa
  # que ya existía en el CSS y que este archivo no declaraba.
  mist-100: "#d3e2e1"   # enlaces de nav en reposo
  mist-200: "#cfe0df"   # bajada del nav
  mist-300: "#b9cccb"   # texto del pie
  mist-400: "#a9c4c3"   # etiquetas de la franja de specs
  mist-500: "#9aa7a7"   # marcador .pending
  mist-600: "#6f8180"   # texto de los marcadores de foto (.ph)
  salmon-light: "#ffb3ab"  # rol del equipo sobre foto oscura
  # --- Neutros oscuros de fotografía ---
  # Fondo de los recuadros de equipo y del logo de cliente en negativo.
  ink-navy: "#0e1626"
  ink-slate: "#1e2126"
  ink-scrim: "rgba(14,22,20,.92)"      # base del degradado sobre foto
  ink-scrim-soft: "rgba(14,22,20,.72)" # tramo medio del mismo degradado
  # --- Sombras (ver Shadow Vocabulary más abajo) ---
  shadow-ambient: "rgba(0,0,0,.12)"
  shadow-hover: "rgba(0,0,0,.2)"
  shadow-badge: "rgba(0,0,0,.18)"
  shadow-action: "rgba(0,0,0,.25)"
  shadow-toggle: "rgba(0,0,0,.28)"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontSize: "70px"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Anton, sans-serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.01em"
  title:
    fontFamily: "Oswald, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Oswald, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.1em"
  mono:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  # --- Escalones intermedios y variantes responsive ---
  # Los seis roles de arriba nombran la intención; estos son los tamaños
  # concretos que la hoja de estilos usa además, incluidos los escalones a
  # los que bajan los títulos en móvil vía clamp(). Estaban en el CSS desde
  # el inicio pero no declarados aquí.
  display-sm:
    fontFamily: "Anton, sans-serif"
    fontSize: "58px"        # hero de páginas internas; baja a 42/36/32/28
  headline-sm:
    fontFamily: "Anton, sans-serif"
    fontSize: "38px"        # h2--sm; baja a 32/28/26
  figure:
    fontFamily: "Anton, sans-serif"
    fontSize: "34px"        # cifras de la franja de specs y folio de servicio
  title-sm:
    fontFamily: "Oswald, sans-serif"
    fontSize: "20px"        # títulos de paso del proceso; 18/19 en variantes
  body-sm:
    fontFamily: "Barlow, sans-serif"
    fontSize: "15px"        # texto de tarjeta y de servicio
  body-xs:
    fontFamily: "Barlow, sans-serif"
    fontSize: "14.5px"      # filas de especificación de las fichas
  label-sm:
    fontFamily: "Oswald, sans-serif"
    fontSize: "12px"        # etiquetas de sección y del pie
  label-xs:
    fontFamily: "Oswald, sans-serif"
    fontSize: "11.5px"      # placa del hero, rol del equipo; 10.5 en móvil
  micro:
    fontFamily: "Oswald, sans-serif"
    fontSize: "9.5px"       # bajada y RIF del nav
  # Escalones a los que bajan los titulares en pantallas chicas (los extremos
  # inferiores de cada clamp() y los overrides de los media queries).
  display-900:
    fontFamily: "Anton, sans-serif"
    fontSize: "42px"
  display-560:
    fontFamily: "Anton, sans-serif"
    fontSize: "36px"
  headline-900:
    fontFamily: "Anton, sans-serif"
    fontSize: "32px"
  headline-560:
    fontFamily: "Anton, sans-serif"
    fontSize: "28px"
  headline-xs:
    fontFamily: "Anton, sans-serif"
    fontSize: "26px"
  brandmark:
    fontFamily: "Anton, sans-serif"
    fontSize: "24px"        # logotipo de texto del nav
  title-xs:
    fontFamily: "Oswald, sans-serif"
    fontSize: "19px"
  subtitle:
    fontFamily: "Oswald, sans-serif"
    fontSize: "18px"        # bajada del hero interno y título de formulario
  micro-sm:
    fontFamily: "Oswald, sans-serif"
    fontSize: "10.5px"      # rol del equipo en móvil
rounded:
  xs: "2px"    # barra deslizante del nav
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  "2xl": "78px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.workshop-white}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-bright}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.workshop-white}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  button-wa:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "{colors.whatsapp-green-text}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  card:
    backgroundColor: "{colors.workshop-white}"
    rounded: "{rounded.lg}"
    padding: "32px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.petroleum-teal-deep}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
---

# Design System: TELVE, C.A.

## Overview

**Creative North Star: "El Manual de Planta"**

TELVE se lee como la señalética y la documentación técnica de un taller industrial de verdad: etiquetas en mayúscula con tracking amplio, franjas de peligro diagonales, un tipo de titular condensado y contundente (Anton) que funciona como letrero de galpón, y un acento monoespaciado (IBM Plex Mono) reservado para lo técnico o lo "pendiente". No es frío ni corporativo — es el manual de un taller familiar de 54 años que conoce su oficio y lo muestra sin adornos innecesarios.

La paleta cruza verde petróleo (el color de la maquinaria y las paredes de un taller real) con rojo señal (el color de las franjas de peligro, los rótulos de emergencia y las llamadas a la acción). El rojo es deliberadamente escaso: aparece donde el visitante debe actuar o donde el taller quiere llamar la atención, nunca como color de fondo extendido.

**Key Characteristics:**
- Tipografía condensada y en mayúscula para todo lo funcional (títulos, etiquetas, botones, navegación); texto corrido siempre en Barlow, en minúscula, legible.
- Rojo como color de acción y acento — no de fondo.
- Motivo recurrente de franja diagonal de peligro (hazard stripe) como firma visual estructural, no decorativa.
- Superficies mayormente planas; la sombra aparece solo como respuesta al hover, nunca en reposo salvo insinuaciones muy sutiles.
- Dos audiencias servidas por igual: nada en el sistema visual debe leerse como "solo para industria pesada" ni "solo para el vecino con un motor de nevera".

## Colors

Paleta de taller industrial: verde petróleo como base dominante, rojo señal como acento de acción, neutros fríos (grises verdosos) como soporte.

### Primary
- **Verde Petróleo** (`#336666`): color de marca dominante — nav, fondos hero, bandas de sección, CTA centrados.
- **Verde Petróleo Profundo** (`#244d4d`): variante oscura de Verde Petróleo — franja de specs, bandas `--teal-dark`, títulos sobre fondo claro (`h2`, títulos de tarjeta).
- **Verde Petróleo Oscuro** (`#1b3b3b`): variante más oscura — footer, franja de peligro (alternando con rojo), overlays de hero.

### Secondary
- **Rojo Señal** (`#c62828`): color de acción — botones primarios, eyebrows, borde superior de tarjetas, indicador de nav activo, franja de peligro. Úsalo con moderación deliberada.
- **Rojo Brillante** (`#e23b2e`): estado hover/brillo del rojo señal y segundo tono de la franja de peligro.
- **Rosa de Placa** (`#ffd0cb`): variante clara del rojo, exclusiva para texto de etiqueta sobre fondos oscuros (`.section-head--dark`, `.split__body`) donde el rojo señal puro no da suficiente contraste.

### Tertiary
- **Verde WhatsApp** (`#25D366`, texto `#04210f`): color puramente funcional, exclusivo del botón/CTA de WhatsApp. No es un acento de marca — no debe aparecer en otro lugar de la interfaz.

### Neutral
- **Gris Niebla** (`#f4f6f6`): fondo base del sitio.
- **Blanco Taller** (`#ffffff`): superficie de tarjetas, formularios, chips de cliente.
- **Verde Menta Pálido** (`#eaf0ef`): superficie secundaria — fondo de bandas alternas (`.band`).
- **Carbón Verdoso** (`#1f2b2b`): texto principal.
- **Gris Verdoso** (`#5c6b6b`): texto secundario/muted (`lead-muted`, `card__text`).
- **Gris Línea** (`#dbe3e2`): bordes y divisores.

### Named Rules
**The Signal Red Rule.** El rojo aparece solo en puntos de acción o énfasis puntual (botones, eyebrows, bordes de acento de 3-4px, indicador de nav) — nunca como color de fondo de una sección completa salvo la franja de peligro decorativa.

**The Functional Green Rule.** El verde de WhatsApp (`#25D366`) es un color funcional prestado de la marca WhatsApp, no un acento de TELVE. Se usa únicamente en los CTA de WhatsApp; no se mezcla con la paleta verde-petróleo/rojo del resto de la interfaz.

## Typography

**Display Font:** Anton (con fallback sans-serif)
**Body Font:** Barlow (con fallback sans-serif)
**Label/Mono Font:** Oswald para etiquetas; IBM Plex Mono para contenido técnico/placeholder

**Character:** Anton aporta el peso de rótulo industrial en los titulares; Oswald da a las etiquetas y la navegación una voz técnica, angosta y en mayúscula; Barlow mantiene el cuerpo de texto cálido y legible; IBM Plex Mono marca lo "no definitivo" (placeholders de fotos, pendientes) con una textura de ficha técnica.

### Hierarchy
- **Display** (400, 70px, line-height 0.98, uppercase): titular del hero de Inicio — el mensaje principal de la marca.
- **Headline** (400, 44px, line-height 1.05, uppercase): `h2` de cada sección — título de bloque.
- **Title** (600–700, 22–27px, uppercase): títulos de tarjeta y de servicio.
- **Body** (400, 15–16px, line-height 1.55–1.65): párrafos y descripciones; máximo ~680px de ancho en bloques largos.
- **Label** (500–600, 12–15px, letter-spacing 0.06–0.2em, uppercase): eyebrows, nav, botones, tags, etiquetas de contacto.
- **Mono** (400, 12–13px): marcador de contenido pendiente (`.pending`) y placeholders de imagen (`.ph`) — nunca para contenido final.

### Named Rules
**The All-Caps Label Rule.** Todo lo que sea funcional (nav, botón, tag, eyebrow, etiqueta de campo) va en Oswald, mayúscula, con tracking amplio. Todo lo que sea lectura corrida va en Barlow, minúscula normal. Nunca se mezclan los dos roles.

**The Heading Case Rule.** Un encabezado de contenido NO es una etiqueta funcional. Los títulos de tarjeta, de servicio y de paso van en Oswald pero en **caja normal**, no en mayúscula: nombran contenido, no rotulan un control. La mayúscula queda para los dos extremos — Anton en los titulares de sección y hero (el letrero de galpón), y Oswald en las etiquetas funcionales.

*Por qué:* Anton y Oswald son ambas condensadas. Cuando además casi todo iba en caja alta, la página no tenía un solo contraste de ancho y se leía dura. La caja normal en los encabezados intermedios devuelve ese contraste sin tocar la paleta ni las familias.

## Layout

Contenedor centrado con `max-width: 1280px`. El ritmo vertical es generoso: 78px de padding de sección en escritorio, bajando a 56px (≤900px) y 24px de margen lateral en móvil. Las cuadrículas de tarjetas van de 3 columnas → 2 columnas (≤900px) → 1 columna (≤560px). La navegación colapsa a menú hamburguesa por debajo de 860px. El layout es mayormente de bloques apilados de ancho completo (hero, franja de specs, bandas de color) intercalados con grids de tarjetas — nunca sidebars ni layouts asimétricos complejos.

## Elevation & Depth

El sistema es mayormente plano; la profundidad se transmite por capas tonales (bandas de color alternas: verde-petróleo-oscuro, verde-menta-pálido) más que por sombra. La sombra existe pero es discreta en reposo (`0 2px 10px rgba(27,59,59,.05)`) y solo se intensifica como respuesta a la interacción (hover).

### Shadow Vocabulary
- **ambient-card** (`box-shadow: 0 2px 10px rgba(27,59,59,.05)`): sombra de reposo de tarjetas, pasos del proceso y tarjetas de servicio.
- **hover-lift** (`box-shadow: 0 10px 24px rgba(27,59,59,.14)`): tarjetas y pasos al pasar el mouse, junto con `translateY(-4px)`.
- **hover-lift-client** (`box-shadow: 0 10px 22px rgba(0,0,0,.20)`): logos de cliente al pasar el mouse.
- **badge** (`box-shadow: 0 1px 4px rgba(0,0,0,.18)`): recuadros blancos del logo TELVE y el sello EASA en el nav.
- **action-btn** (`box-shadow: 0 2px 8px rgba(0,0,0,.25)`): botón flotante "Cómo llegar" sobre el mapa.

### Named Rules
**The Rest-Flat Rule.** Nada tiene sombra pronunciada en reposo. La sombra es la respuesta a un hover, no un estado por defecto.

## Shapes

Escala de radio de esquina según el peso del componente: 4px para chips/tags pequeños, 6px para botones/inputs, 8px para tarjetas/medios/mapa, 10px para tarjetas de servicio (el bloque más grande). El motivo geométrico recurrente y distintivo del sistema es la **franja de peligro diagonal** (`repeating-linear-gradient` a 45°, alternando rojo y verde-petróleo-oscuro) usada como barra estructural superior del hero y como fondo de los placeholders de imagen — es la firma visual de "taller industrial", no un adorno intercambiable.

### Named Rules
**The Hazard Stripe Rule.** La franja diagonal roja/oscura es exclusiva de: la barra superior del hero y los placeholders de imagen sin foto. No se usa como fondo decorativo genérico en otros lugares.

## Components

### Buttons
- **Shape:** radio 5–6px (`{rounded.md}`).
- **Primary:** fondo Rojo Señal, texto blanco, padding `15px 30px`, mayúscula, Oswald 600. Hover: `brightness(1.08)`. Active: `translateY(1px)`.
- **Ghost:** fondo transparente, borde blanco 2px al 50% de opacidad, texto blanco — usado sobre fondos oscuros (hero).
- **WhatsApp:** fondo Verde WhatsApp, texto casi-negro (`#04210f`) — exclusivo de los CTA de contacto.

### Cards
- **Corner Style:** 8px (`{rounded.lg}`).
- **Background:** Blanco Taller, borde 1px Gris Línea.
- **Accent:** borde superior de 3px en Rojo Señal — firma de "tarjeta de contenido" en todo el sitio.
- **Shadow Strategy:** ambient-card en reposo, hover-lift al interactuar (ver Elevation & Depth).
- **Internal Padding:** 32px (`{spacing.lg}`).

### Tags / Chips
- **Style:** transparente, borde 1px Verde Petróleo, texto Verde Petróleo Profundo, Oswald mayúscula, radio 4px.
- **State:** decorativos/informativos, sin estado de selección — son etiquetas de característica, no filtros interactivos.

### Navigation
- **Style:** barra fija (`sticky`) en Verde Petróleo, borde inferior 3px Rojo Señal. Enlaces en Oswald mayúscula; estado activo/hover en blanco puro sobre el gris-verde por defecto de los enlaces. Un indicador rojo se desliza bajo el enlace activo/con hover (`.nav__indicator`), con transición de posición y ancho.
- **Mobile:** colapsa a botón hamburguesa por debajo de 860px; el indicador deslizante se oculta en ese modo.

### Info Cards (Contacto)
- **Corner Style:** 8px.
- **Background:** Blanco Taller, borde 1px Gris Línea.
- **Accent:** borde izquierdo de 4px en Rojo Señal (variante lateral del mismo acento que usan las tarjetas de servicio).
- **Internal Padding:** 22px 26px.

## Do's and Don'ts

### Do:
- **Do** mantener el rojo como color de acento/acción exclusivamente — reservado para botones, eyebrows, bordes de acento y el indicador de navegación.
- **Do** mantener todo texto funcional (nav, botones, tags, eyebrows) en Oswald, mayúscula, con tracking amplio; todo texto corrido en Barlow, minúscula.
- **Do** conservar la franja de peligro diagonal como firma visual estructural (hero, placeholders), no como decoración genérica.
- **Do** dejar la sombra en reposo casi imperceptible (`ambient-card`) y reservar la elevación notable (`hover-lift`) para la interacción.

### Don't:
- **Don't** cambiar la paleta verde-petróleo/rojo-señal ni introducir un tercer color de marca — el usuario fijó explícitamente estos colores como intocables.
- **Don't** sustituir Anton, Oswald, Barlow o IBM Plex Mono por otras tipografías — son parte del compromiso de marca, no del alcance de este rediseño de estilo.
- **Don't** reemplazar las fotos reales (equipo, fachada, logos de clientes) o el copy existente por contenido genérico, stock o inventado — el rediseño es de estilo, no de contenido.
- **Don't** extender el Verde WhatsApp a otros elementos de la interfaz; es un color funcional, no un acento de marca.
