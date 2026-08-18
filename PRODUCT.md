# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served equally:
- **Clientes industriales/institucionales** en Venezuela — empresas y entes públicos (ej. SIDOR, Corpoelec, C.V.G. Bauxilum, C.V.G. Cabelum, Hidrobolívar, Fapco, Tubo Concreto, Ciudad Orinoco) que necesitan rebobinado/reparación de motores y generadores de mediana-alta potencia, mantenimiento predictivo/preventivo/correctivo, y repuestos de marcas distribuidas.
- **Clientes residenciales/particulares** en Ciudad Bolívar y alrededores que necesitan reparación de motores o generadores eléctricos de menor escala.

## Product Purpose

TELVE, C.A. (Talleres Eléctricos Venezolanos) repara, mantiene y rebobina motores eléctricos (hasta 700 HP, hasta 600 V) y generadores (hasta 500 KVA) para industria y hogares, además de distribuir repuestos y equipos afines. El sitio busca, por igual: (a) generar contactos nuevos vía WhatsApp, y (b) reforzar la imagen de marca/credibilidad ante clientes industriales e institucionales ya existentes.

## Positioning

Más de 54 años operando de forma ininterrumpida desde 1972, con capital 100% venezolano y base familiar. Miembro de EASA (The Electro-Mechanical Authority) y distribuidor autorizado de motores WEG y VOGES, bombas PEARL y CALPEDA. Tasa de reclamos de garantía menor al 1%. Cartera de clientes que incluye industria pesada y entes públicos de la región.

## Operating Context

- Taller físico en Calle Columbo Silva Nro. 33, Barrio Ajuro, Ciudad Bolívar, Estado Bolívar, Venezuela; atiende tanto a la comunidad local como al resto del territorio nacional.
- Canales de contacto: WhatsApp (recepción y línea de emergencias 24h), teléfono de oficina, correo (telveca@gmail.com).
- Horario de atención: lunes a viernes, 7:00 a.m.–12:00 m. y 1:00 p.m.–3:00 p.m. (la línea de emergencias opera 24/7).
- El sitio es estático (HTML/CSS/JS sin framework ni backend) y se despliega en GitHub Pages.

## Capabilities and Constraints

- Sitio 100% estático, sin backend ni formulario propio: el "formulario de contacto" reenvía a WhatsApp (`wa.me`).
- Sin build/CI: lo que está en `docs/index.html`, `docs/css/styles.css` y `docs/js/script.js` es exactamente lo que se publica.
- **Alcance del trabajo pedido: rediseño de estilo/visual únicamente.** El usuario fue explícito: mantener la información ya redactada (todos los textos de servicios, misión, historia, contacto, etc.), mantener los colores representativos de la marca, y mantener las imágenes (logo, fotos de clientes, fotos del equipo/fachada). Solo el estilo visual (layout, tipografía, composición, motion, etc.) está abierto a rediseño — esto no es un rebranding.

## Brand Commitments

- Nombre: TELVE, C.A. — Talleres Eléctricos Venezolanos. RIF: J-08002579-2.
- Logo (`docs/img/logo-telve.png`, `docs/img/logo-telve-full.png`) y sello de miembro EASA (`docs/img/easa-member.png`) se mantienen tal cual.
- Paleta de colores de marca actual (definida en `docs/css/styles.css`) se mantiene — no se rediseña la paleta.
- Todo el copy existente en español (misión, historia, descripciones de servicios, textos de contacto) se preserva sin reescritura de contenido.

## Evidence on Hand

- Logos de clientes reales en `docs/img/cliente-*.jpeg|png` (SIDOR, Corpoelec, Bauxilum, Cabelum, Hidrobolívar, Fapco, Tubo Concreto, Ciudad Orinoco).
- Fotos de fundador/equipo (`docs/img/equipo-*.jpg`), fachada (`docs/img/fachada.JPG`), motor WEG (`docs/img/motor-weg.png`).
- Dirección, teléfonos y correo reales ya publicados en el sitio (ver sección Contacto de `docs/index.html`).
- Sin testimonios, casos de estudio, cifras de desempeño adicionales, ni certificaciones más allá de la membresía EASA — no inventar ninguno de estos.

## Product Principles

1. Es un restyle, no un rebrand: la identidad de marca (nombre, logo, colores, copy) es intocable; el rediseño vive en layout, tipografía, jerarquía visual, espaciado y motion.
2. Servir a dos audiencias por igual (industrial/institucional y residencial) sin que el diseño favorezca visualmente a una sobre la otra.
3. Toda ruta relevante del sitio debe llevar fácilmente a un contacto por WhatsApp.
4. Las señales de credibilidad (54+ años, membresía EASA, marcas distribuidas, cartera de clientes) deben permanecer prominentes — son el argumento de venta principal.
5. El sitio debe seguir funcionando como HTML/CSS/JS estático desplegable en GitHub Pages, sin backend ni build step.
