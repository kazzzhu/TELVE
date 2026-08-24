/* ===================================================================
   TELVE C.A. — Capa de idioma (español → inglés)
   ===================================================================

   IMPORTANTE PARA QUIEN EDITE EL SITIO
   ------------------------------------
   El español NO vive aquí: vive en index.html y es la fuente de verdad.
   Este archivo solo guarda la traducción al inglés, indexada por el texto
   en español exacto.

   Consecuencia práctica: si cambias una frase en index.html, su clave aquí
   deja de coincidir y esa frase se quedará en español al pasar a inglés.
   No se rompe nada — solo no se traduce. Abre la consola del navegador con
   el sitio en inglés y verás la lista de frases sin traducir.

   >>> LA TRADUCCIÓN AL INGLÉS ESTÁ PENDIENTE DE REVISIÓN <<<
   La redactó el asistente, no la empresa. Antes de publicar conviene que
   alguien de TELVE revise sobre todo los términos técnicos (rebobinado,
   alambre magneto, ensayos) y los nombres de los servicios.
   =================================================================== */

/* ===================================================================
   PARA AGREGAR UN IDIOMA NUEVO (ej. portugués)
   ------------------------------------------------------------------
   1. Añádelo a la lista "idiomas" de abajo:  { code: "pt", nombre: "Português" }
   2. Copia el bloque  en: { ... }  completo, renómbralo a  pt: { ... }
      y traduce los valores (las claves en español se dejan igual).
   No hay que tocar index.html: el desplegable se arma solo con esta lista.
   =================================================================== */

window.TELVE_I18N = {

  /* Idioma en el que está escrito index.html. No lleva diccionario:
     volver a él es restaurar el texto original del HTML. */
  base: "es",

  /* Orden en que aparecen en el desplegable. El nombre de cada idioma va
     escrito en ese idioma, como es costumbre en los selectores. */
  /* PARA PONER BANDERAS EN LA INSIGNIA DEL BOTÓN DE AJUSTES
     -----------------------------------------------------
     Basta con dejar los archivos en img/ con estos nombres exactos:

       img/bandera-es.png   (México, según eligió el cliente)
       img/bandera-en.png   (Estados Unidos)
       img/bandera-pt.png   (Brasil)
       img/bandera-it.png   (Italia)

     Tamaño sugerido: 40×28 px, PNG. En cuanto existan, la insignia las usa
     sola. Mientras no estén, muestra el código de dos letras (ES/EN/PT/IT).
     No hay que tocar código.

     Por qué archivos y no emoji: Windows no incluye banderas en su fuente
     de emoji, así que 🇲🇽 sale como un recuadro vacío en la mayoría de las
     máquinas de los clientes. Y no sirve dibujarlas en SVG simplificado:
     México e Italia son la misma tricolor verde-blanco-roja y solo las
     distingue el escudo del águila. */
  idiomas: [
    { code: "es", nombre: "Español" },
    { code: "en", nombre: "English" },
    { code: "pt", nombre: "Português" },
    { code: "it", nombre: "Italiano" }
  ],

  /* ---- No se traducen a propósito ----
     Nombres propios, marcas, clientes, unidades y datos de contacto. Están
     listados para que el aviso de "frases sin traducir" no los reporte como
     olvidos. Si añades un cliente o una marca nueva, agrégala aquí. */
  sinTraducir: [
    "WhatsApp", "TELVE C.A.", "telveca@gmail.com",
    "700 HP", "500 KVA",
    "SIDOR", "Corpoelec", "C.V.G. Bauxilum", "C.V.G. Cabelum",
    "Hidrobolívar", "Fapco", "Tubo Concreto", "Ciudad Orinoco",
    "WEG", "VOGES", "PEARL", "CALPEDA",
    "SKF", "FAG", "NACHI", "POLAN", "ELECTRIC DIAMOND"
  ],


/* ===================================================================
   INGLÉS
   =================================================================== */
en: {

  /* ---- Metadatos de la página ---- */
  meta: {
    title: "TELVE C.A. — Talleres Eléctricos Venezolanos | Electric motor and generator rewinding",
    description: "Talleres Eléctricos Venezolanos, C.A. (TELVE). Rewinding and repair of electric motors and generators up to 700 HP. Over 54 years in Ciudad Bolívar, Venezuela. Authorized distributor for WEG, VOGES, PEARL and CALPEDA."
  },

  /* Mensaje que se abre al pulsar los botones de WhatsApp. */
  whatsapp: "Hello TELVE C.A., I would like information about repair and/or rewinding of my electric motor or generator.",

  /* Textos que js/equipos.js escribe directo en el DOM (no pasan por el
     recorrido de cacharTextos porque no existen todavía cuando ese
     recorrido corre). Se consultan en vivo, ver TELVE_refrescarAuthUI. */
  auth: {
    login: "Log in",
    miCuenta: "My account",
    loginTitle: "Welcome back",
    registerTitle: "Create account",
    loginError: "Incorrect email or password.",
    yaRegistrado: "That email already has an account. Log in instead.",
    claveDebil: "The password must be at least 6 characters long.",
    correoInvalido: "That email address doesn't look valid.",
    muchosCorreos: "Too many emails sent. Wait a few minutes and try again.",
    registroCerrado: "New account registration is closed for now.",
    registroError: "The account could not be created. Please try again in a moment.",
    saveError: "The item could not be saved. Check the details and try again.",
    uploadError: "The photo could not be uploaded. Please try again.",
    fotoTipo: "The file must be an image.",
    fotoPeso: "The photo cannot be larger than 5 MB.",
    noConfirmado: "Your account is not confirmed yet. Check your email.",
    camposVacios: "Type your email and your password.",
    nuevaClaveTitle: "Choose a new password",
    escribeCorreo: "Type your email above and click again.",
    resetError: "The link could not be sent. Please try again in a moment.",
    claveIgual: "That is already your current password. Choose a different one.",
    captchaFallo: "Please complete the security check and try again.",
    claveError: "The password could not be changed. Please try again.",
    enlaceCaducado: "That link no longer works. Request a new one from “Forgot your password?”."
  },
  equipos: {
    marca: "Brand: ",
    modelo: "Model: ",
    potencia: "Power: ",
    voltaje: "Voltage: ",
    succion: "Suction dia.: ",
    salida: "Discharge dia.: ",
    eje: "Shaft dia.: ",
    borrar: "Delete item",
    borrarError: "The item could not be deleted. Please try again."
  },
  proceso: {
    numero: "Service #: ",
    etapaActual: "Current stage: ",
    notas: "Notes",
    agregarNota: "Add note",
    notaPlaceholder: "Note (optional)",
    guardarNota: "Save note",
    notaError: "The note could not be saved. Please try again.",
    etapaError: "The stage could not be updated.",
    registroError: "The record could not be saved. Check the details and try again."
  },

  /* ---- Atributos (alt, aria-label, title) ---- */
  attrs: {
    "Hola TELVE C.A., quiero consultar disponibilidad y precio de un equipo (motor, bomba o generador).":
      "Hello TELVE C.A., I would like to ask about the availability and price of a unit (motor, pump or generator).",
    "TELVE, C.A. — Talleres Eléctricos Venezolanos · RIF J-08002579-2":
      "TELVE, C.A. — Talleres Eléctricos Venezolanos · Tax ID J-08002579-2",
    "Miembro EASA — The Electro-Mechanical Authority":
      "EASA member — The Electro-Mechanical Authority",
    "TELVE, C.A. — ir al inicio": "TELVE, C.A. — go to home",
    "Abrir menú": "Open menu",
    "Cerrar menú": "Close menu",
    "Navegación principal": "Main navigation",
    "Ajustes de la página": "Page settings",
    "Pier Pianca, fundador de TELVE": "Pier Pianca, founder of TELVE",
    "Christian Pianca, gerente general de TELVE": "Christian Pianca, general manager of TELVE",
    "Gian Pier Pianca": "Gian Pier Pianca",
    "Fachada del taller TELVE": "TELVE workshop frontage",
    "Fachada del taller TELVE en Ciudad Bolívar": "TELVE workshop frontage in Ciudad Bolívar",
    "Ubicación de TELVE, C.A. en Ciudad Bolívar": "Location of TELVE, C.A. in Ciudad Bolívar",
    "Rebobinado de motores": "Motor rewinding",
    "Mantenimiento y análisis eléctrico": "Maintenance and electrical analysis",
    "Servicios de mecanizado": "Machining services",
    "Suministro y distribución": "Supply and distribution",
    "Cerrar": "Close",
    "Código": "Code",
    "Marca": "Brand",
    "Modelo": "Model",
    "Potencia (HP)": "Power (HP)",
    "Precio ($)": "Price ($)",
    "Diám. succión": "Suction dia.",
    "Diám. salida": "Discharge dia.",
    "Diám. eje": "Shaft dia."
  },

  /* ---- Texto visible ----
     Clave = español exacto (espacios normalizados). Lo que no aparece aquí
     se deja tal cual: nombres propios, marcas, cifras, teléfonos, correo. */
  text: {

    /* Navegación y accesos */
    "Saltar al contenido": "Skip to content",
    "Inicio": "Home",
    "Servicios": "Services",
    "Nosotros": "About us",
    "Contacto": "Contact",

    /* Hero de inicio */
    "Talleres Eléctricos Venezolanos · desde 1972": "Talleres Eléctricos Venezolanos · since 1972",
    "Mantenemos la industria en movimiento.": "We keep industry running.",
    "Reparación, mantenimiento y reconstrucción de equipos eléctricos industriales y residenciales. Rebobinado de motores eléctricos de media potencia hasta los 700 HP en baja tensión hasta los 600 V y de generadores eléctricos hasta los 500 Kva, con más de medio siglo de experiencia en nuestro ramo y brindándole nuestros servicios tanto a nuestra comunidad en Ciudad Bolívar como al resto del territorio nacional.":
      "Repair, maintenance and rebuilding of industrial and residential electrical equipment. Rewinding of medium-power electric motors up to 700 HP at low voltage up to 600 V, and of electric generators up to 500 KVA, with more than half a century of experience in our trade, serving both our community in Ciudad Bolívar and the rest of the country.",
    "Cotiza por WhatsApp": "Get a quote on WhatsApp",
    "Ver servicios": "View services",

    /* Franja de cifras */
    "Años en el mercado": "Years in business",
    "Motores eléctricos · baja tensión": "Electric motors · low voltage",
    "Generadores eléctricos · baja tensión": "Electric generators · low voltage",
    "Atención de emergencias": "Emergency service",

    /* Servicios (vista previa) */
    "Servicios especializados": "Specialized services",
    "Capacidad instalada disponible": "Available installed capacity",
    "Reparación general y rebobinado de equipos eléctricos rotativos":
      "General repair and rewinding of rotating electrical equipment",
    "Motores eléctricos hasta los 700 HP y generadores eléctricos hasta los 500 KVA, en manufactura de alambre magneto de cobre en sección redonda, tanto monofásicos como trifásicos, con una tensión máxima de alimentación de 600 Volts.":
      "Electric motors up to 700 HP and electric generators up to 500 KVA, built with round-section enameled copper magnet wire, single-phase and three-phase, with a maximum supply voltage of 600 volts.",
    "Planes de mantenimiento y análisis": "Maintenance and analysis plans",
    "Mantenimiento predictivo, preventivo y correctivo en máquinas eléctricas rotativas, con análisis eléctrico especializado, tanto estáticos como dinámicos (Megger, Ducter, Hi-Pot, Baker).":
      "Predictive, preventive and corrective maintenance on rotating electrical machines, with specialized electrical analysis, both static and dynamic (Megger, Ducter, Hi-Pot, Baker).",
    "Suministro y distribución de refacciones": "Parts supply and distribution",
    "Distribuidor autorizado de motores WEG y VOGES, bombas de agua PEARL y CALPEDA, grupos electrógenos, rodamientos y repuestos afines a las máquinas eléctricas rotativas.":
      "Authorized distributor of WEG and VOGES motors, PEARL and CALPEDA water pumps, generator sets, bearings and related spare parts for rotating electrical machines.",
    "Ver todos los servicios →": "View all services →",

    /* Por qué TELVE */
    "Navegación": "Navigation",
    "Distribuidor autorizado": "Authorised distributor",
    "Otras marcas que manejamos": "Other brands we carry",
    "Fundador": "Founder",
    "Generación de relevo": "Next generation",
    "Por qué TELVE, C.A.": "Why TELVE, C.A.",
    "Más de medio siglo de trabajo ininterrumpido, calidad y seriedad… siempre estamos innovando.":
      "More than half a century of uninterrupted work, quality and reliability… we are always innovating.",
    "Iniciamos actividades en 1972 con capital 100% venezolano y tecnología de los fabricantes originales de equipos eléctricos. Nuestra trayectoria y control de calidad nos permiten operar con un nivel de servicio de garantía menor del uno por ciento. Nos adaptamos a las exigencias de nuestros clientes y siempre buscaremos la forma de superar sus expectativas…":
      "We began operations in 1972 with 100% Venezuelan capital and technology from the original manufacturers of electrical equipment. Our track record and quality control let us operate with a warranty service rate below one percent. We adapt to our clients' requirements and will always look for ways to exceed their expectations…",
    "Conoce nuestra historia →": "Read our story →",

    /* Clientes */
    "Nos avalan": "Trusted by",
    "Clientela pública y privada": "Public and private sector clients",

    /* Ubicación */
    "Ubicación": "Location",
    "Visita nuestras instalaciones": "Visit our facilities",
    "Calle Columbo Silva Nro. 33, frente a la Escuela de Medicina de la UDO, Barrio Ajuro, Galpón Industrial TELVE.":
      "Calle Columbo Silva No. 33, opposite the UDO School of Medicine, Barrio Ajuro, TELVE Industrial Workshop.",
    "Ciudad Bolívar — Estado Bolívar.": "Ciudad Bolívar — Bolívar State, Venezuela.",
    "Cómo llegar": "Directions",

    /* Página de servicios */
    "Oferta de servicios": "Our services",
    "Todo lo que podemos reparar": "Everything we can repair",
    "Soluciones electromecánicas para industria, empresas, entidades públicas y hogares.":
      "Electromechanical solutions for industry, businesses, public institutions and homes.",
    "foto · rebobinado": "photo · rewinding",
    "foto · mantenimiento": "photo · maintenance",
    "foto · mecanizado": "photo · machining",
    "foto · suministro": "photo · supply",

    "Rebobinado y reparación en general de máquinas eléctricas rotativas":
      "Rewinding and general repair of rotating electrical machines",
    "Mantenimiento y rebobinado de equipos eléctricos de mediana potencia hasta 700 HP y de 600 V en corriente alterna, con alambre magneto de sección redonda en cobre esmaltado.":
      "Maintenance and rewinding of medium-power electrical equipment up to 700 HP and 600 V AC, using round-section enameled copper magnet wire.",
    "Motores eléctricos de todas las marcas, desde 1/3 HP hasta 700 HP":
      "Electric motors of all brands, from 1/3 HP to 700 HP",
    "Generadores eléctricos de baja tensión, desde 3 KVA hasta 500 KVA":
      "Low-voltage electric generators, from 3 KVA to 500 KVA",
    "Motores de inducción y síncronos": "Induction and synchronous motors",
    "Motores con rotor devanado": "Wound-rotor motors",
    "Motores con varias velocidades": "Multi-speed motors",
    "Transformadores secos": "Dry-type transformers",
    "Equipo eléctrico industrial y acondicionamiento de tableros de control":
      "Industrial electrical equipment and control panel reconditioning",
    "Monofásico": "Single-phase",
    "Trifásico": "Three-phase",
    "Hasta 700 HP": "Up to 700 HP",

    "Mantenimiento y análisis eléctrico / mecánico": "Electrical / mechanical maintenance and analysis",
    "Mantenimiento predictivo, preventivo y correctivo de máquinas eléctricas rotativas, con inspección, evaluación y análisis tanto eléctrico como mecánico especializado antes de devolver el equipo a su sitio de servicio.":
      "Predictive, preventive and corrective maintenance of rotating electrical machines, with specialized electrical and mechanical inspection, assessment and analysis before the equipment is returned to service.",
    "Megger motorizado y electrónico": "Motorized and electronic Megger",
    "Probador de baja resistencia (Ducter)": "Low-resistance tester (Ducter)",
    "Alto potencial (Hi-Pot) y Surge": "High potential (Hi-Pot) and Surge",
    "Análisis con equipo BAKER": "Analysis with BAKER equipment",
    "Balanceo dinámico y análisis de vibraciones": "Dynamic balancing and vibration analysis",
    "Estudio de termografía": "Thermographic survey",
    "Pruebas de motoreo y recálculo de bobinado según las necesidades del cliente":
      "Run testing and winding recalculation to suit the client's needs",
    "Predictivo": "Predictive",
    "Preventivo": "Preventive",
    "Correctivo": "Corrective",

    "Servicios de mecanizado": "Machining services",
    "Contamos con la maquinaria necesaria para resolver cualquier tipo de requerimiento en el ámbito mecánico que se necesite para normalizar cualquier falla por desgaste operativo que haya sufrido el equipo durante su ciclo de trabajo. Además, tenemos disponible el servicio de balanceo dinámico para rotores jaula de ardilla y bobinados.":
      "We have the machinery needed to handle any mechanical requirement involved in correcting wear-related failures the equipment may have suffered during its working life. We also offer dynamic balancing for squirrel-cage and wound rotors.",
    "Torno de bancada larga con amplio volteo": "Long-bed lathe with large swing",
    "Fresadora automática": "Automatic milling machine",
    "Prensa hidráulica horizontal de 100 Ton": "100-ton horizontal hydraulic press",
    "Análisis de vibraciones": "Vibration analysis",
    "Balanceo dinámico de rotores jaula de ardilla y/o bobinados":
      "Dynamic balancing of squirrel-cage and/or wound rotors",
    "Balanceo dinámico de impulsores o impelentes de bombas de agua":
      "Dynamic balancing of water pump impellers",
    "Calentador de inducción SKF": "SKF induction heater",
    "Torno": "Turning",
    "Fresado": "Milling",
    "Balanceo dinámico": "Dynamic balancing",

    "Suministro de refacciones y distribución": "Parts supply and distribution",
    "Distribuidor autorizado y centro de servicio de las principales marcas de motores, bombas de agua y accesorios mecánicos y eléctricos, con repuestos garantizados.":
      "Authorized distributor and service center for the leading brands of motors, water pumps and mechanical and electrical accessories, with guaranteed spare parts.",
    "Motores WEG y VOGES (hasta 600 HP)": "WEG and VOGES motors (up to 600 HP)",
    "Electro-bombas centrífugas PEARL y CALPEDA (hasta 30 HP)":
      "PEARL and CALPEDA centrifugal electric pumps (up to 30 HP)",
    "Grupos electrógenos de acuerdo a los requerimientos del cliente":
      "Generator sets built to the client's requirements",
    "Rodamientos SKF, FAG y NACHI": "SKF, FAG and NACHI bearings",
    "Sellos mecánicos para bombas de agua": "Mechanical seals for water pumps",
    "Barnices aislantes POLAN y ELECTRIC DIAMOND": "POLAN and ELECTRIC DIAMOND insulating varnishes",
    "Accesorios varios para motores eléctricos (aspas y protectores de ventilación, borneras, cáncamos, resistencias calefactoras, termistores, etc.)":
      "Assorted accessories for electric motors (fan blades and fan covers, terminal blocks, eyebolts, space heaters, thermistors, etc.)",

    /* Proceso */
    "Cómo trabajamos": "How we work",
    "El proceso": "The process",
    "Inspección y evaluación": "Inspection and assessment",
    "Al recibir el equipo en nuestras instalaciones se procede a realizar una inspección tanto externa como interna del mismo, detectando las fallas reales y los daños ocultos que pueda tener tanto a nivel eléctrico como mecánico, procediendo posteriormente a la emisión de un informe de daños encontrados junto al presupuesto ofrecido para la regulación del equipo.":
      "When the equipment arrives at our facilities we carry out both an external and an internal inspection, identifying the actual faults and any hidden electrical or mechanical damage, and then issue a damage report together with a quotation for restoring the equipment.",
    "Reparación y rebobinado": "Repair and rewinding",
    "De acuerdo a la inspección realizada inicialmente al equipo procedemos a aplicar el nivel de mantenimiento que este requiera, bien sea a nivel preventivo o de ser requerido a nivel correctivo, resolviendo los detalles tanto mecánicos como eléctricos en el mismo. Ejecutamos el trabajo con un estricto control de calidad, con materiales y repuestos garantizados.":
      "Based on that initial inspection we apply the level of maintenance the equipment requires, whether preventive or, where needed, corrective, resolving both its mechanical and its electrical issues. We carry out the work under strict quality control, with guaranteed materials and spare parts.",
    "Pruebas y entrega": "Testing and delivery",
    "Como paso final para garantizar la satisfacción de nuestros clientes, aplicamos a nuestro equipos repotenciados un tren de ensayos estáticos y dinámicos tanto en el ámbito mecánico como eléctrico, para dejar constancia de un equipo a entregar que cumplirá cabalmente con su función en su sitio de trabaja. Como punta de lanza para nosotros cumplir con los plazos de entrega exigidos por nuestros clientes es nuestra prioridad sin demeritar nuestra calidad ofrecida en el servicio aplicado a los equipos.":
      "As a final step in guaranteeing our clients' satisfaction, we put every overhauled unit through a series of static and dynamic tests, mechanical and electrical alike, to certify that the equipment we hand over will fully perform its job in the field. Meeting the delivery deadlines our clients require is a priority for us, never at the expense of the quality of the service we apply to the equipment.",
    "¿Tu motor o generador necesita servicio?": "Does your motor or generator need service?",

    /* Nosotros */
    "Más de 54 años reparando motores": "More than 54 years repairing motors",
    "Un oficio con trayectoria.": "A trade with a track record.",
    "Nuestra empresa es de base familiar, fundada por nuestro padre en el año de 1972 con capital propio, desde sus inicios se caracterizo por ser una empresa innovadora, con carácter de atención a los detalles y de atender las necesidades particulares de los clientes, con los años fue abarcando distintos ramos productivos del país, el sector industrial metalúrgico, cogeneración hidroeléctrica hasta el sector petrolero, afrontando crisis económicas y saliendo adelante con trabajo honesto y dedicado a mejorar día a día nuestro país.":
      "Ours is a family business, founded by our father in 1972 with his own capital. From the start it stood out as an innovative company, attentive to detail and to each client's particular needs. Over the years it reached into different productive sectors of the country — metallurgical industry, hydroelectric cogeneration and the oil sector — weathering economic crises and pressing on through honest work dedicated to improving our country day by day.",
    "Continuando con una larga tradición heredada de parte del fundador, la generación de relevo continuamos con el proceso de mejora continua, modernización, adaptabilidad a las nuevas exigencias de un mercado de servicios en donde nuestros clientes requieren que cubramos y rebasemos sus expectativas sobre el servicio que podamos ofrecerles.":
      "Carrying on a long tradition inherited from the founder, the next generation continues the process of ongoing improvement, modernization and adaptation to the new demands of a service market in which our clients expect us to meet and exceed their expectations.",
    "foto · fachada / equipo del taller": "photo · frontage / workshop team",
    "Misión": "Mission",
    "Rehabilitación de equipos con honestidad, eficiencia y calidad.":
      "Equipment restoration with honesty, efficiency and quality.",
    "Somos una empresa dinámica y entusiasta que ofrece a la industria la rehabilitación de motores y generadores eléctricos. Garantizamos el óptimo funcionamiento de los mismos, cubriendo las necesidades de nuestros clientes, trabajadores y proveedores, en la búsqueda constante de la superación de nuestras expectativas. Trabajamos basados en la experiencia, el desarrollo del personal y la actualización tecnológica.":
      "We are a dynamic and enthusiastic company offering industry the restoration of electric motors and generators. We guarantee their optimal operation, meeting the needs of our clients, workers and suppliers in a constant effort to surpass our own expectations. We work on the basis of experience, staff development and technological updating.",
    "Lo que nos diferencia": "What sets us apart",
    "+54 años": "+54 years",
    "Experiencia real en el mercado que respalda cada reparación.":
      "Real market experience backing every repair.",
    "Personal capacitado": "Trained personnel",
    "Técnicos calificados y una de las mejores infraestructuras de la región.":
      "Qualified technicians and one of the best facilities in the region.",
    "Control de calidad": "Quality control",
    "Estricto control entre operaciones y atención personalizada.":
      "Strict control between operations and personalized attention.",
    "Hablemos de tu equipo": "Let's talk about your equipment",
    "Escríbenos por WhatsApp": "Message us on WhatsApp",

    /* Contacto */
    "Hablemos": "Let's talk",
    "Escríbenos por WhatsApp, llámanos o visítanos en el taller en Ciudad Bolívar.":
      "Message us on WhatsApp, call us, or visit the workshop in Ciudad Bolívar.",
    "Dirección": "Address",
    "Recepción / WhatsApp": "Reception / WhatsApp",
    "Emergencias 24h": "24h emergencies",
    "Oficina": "Office",
    "Correo": "Email",
    "Correo:": "Email:",
    "Horario": "Hours",
    "Lun – Vie · 7:00 a.m. – 12:00 m. y 1:00 p.m. – 3:00 p.m.":
      "Mon – Fri · 7:00 a.m. – 12:00 p.m. and 1:00 p.m. – 3:00 p.m.",
    "Abrir chat de WhatsApp": "Open WhatsApp chat",
    "foto · fachada del taller": "photo · workshop frontage",

    /* Pie */
    "RIF: J-08002579-2": "Tax ID: J-08002579-2",
    "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motores · Generadores · Equipos industriales":
      "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motors · Generators · Industrial equipment",

    /* Panel de ajustes */
    "Animaciones": "Animations",
    "Completas": "Full",
    "Reducidas": "Reduced",
    "Reducidas detiene la franja y los carruseles automáticos.":
      "Reduced stops the stripe and the automatic carousels.",
    "Idioma": "Language",
    "Cambia el idioma o reduce las animaciones aquí.":
      "Change the language or reduce animations here.",
    "Entendido": "Got it",

    /* Equipos en venta */
    "Equipos": "Equipment",
    "Equipos en venta": "Equipment for sale",
    "Motores, bombas y generadores en stock": "Motors, pumps and generators in stock",
    "Motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores, listos para instalación.":
      "Single-phase and three-phase electric motors, PEARL and CALPEDA water pumps, and generators, ready to install.",
    "Todavía no hay equipos publicados": "No equipment listed yet",
    "Trabajamos con motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores. Si buscas algo puntual, escríbenos y te decimos si lo tenemos o te lo conseguimos.":
      "We work with single-phase and three-phase electric motors, PEARL and CALPEDA water pumps, and generators. If you are after something specific, write to us and we will tell you whether we have it or can source it for you.",
    "Pedir por WhatsApp": "Ask on WhatsApp",
    "No se pudo cargar el catálogo de equipos. Revisa tu conexión a internet y recarga la página.": "The equipment catalogue could not be loaded. Check your internet connection and reload the page.",
    "Administrador": "Administrator",
    "Agregar equipo": "Add item",
    "Foto (opcional)": "Photo (optional)",
    "Guardar equipo": "Save item",

    /* Modal de acceso */
    "Iniciar sesión": "Log in",
    "Registrarme": "Sign up",
    "Bienvenido de nuevo": "Welcome back",
    "Crear cuenta": "Create account",
    "Contraseña": "Password",
    "Entrar": "Log in",
    "Revisa tu correo para confirmar la cuenta.": "Check your email to confirm your account.",
    "¿Olvidaste tu contraseña?": "Forgot your password?",
    "Si ese correo tiene una cuenta, te enviamos un enlace para cambiar la contraseña. Revisa tu bandeja.": "If that email has an account, we've sent a link to change the password. Check your inbox.",
    "Contraseña nueva": "New password",
    "Guardar contraseña": "Save password",
    "Contraseña actualizada. Ya puedes entrar con ella.": "Password updated. You can log in with it now.",
    "Reenviar el correo de confirmación": "Resend the confirmation email",
    "Te reenviamos el correo de confirmación. Revisa tu bandeja.": "We've resent the confirmation email. Check your inbox.",
    "Cerrar sesión": "Log out",

    /* Mi equipo */
    "Mi equipo": "My equipment",
    "Seguimiento de tu reparación": "Track your repair",
    "Aquí ves en qué etapa está tu equipo y las notas que agregue el taller durante el proceso.":
      "Here you can see what stage your equipment is at, and any notes the shop adds along the way.",
    "Todavía no tienes equipos en proceso": "You don't have any equipment in progress yet",
    "Cuando traigas un equipo a reparar y quede registrado con este correo, vas a ver aquí en qué etapa está.":
      "Once you bring in equipment for repair and it's registered with this email, you'll see its stage here.",
    "Registrar equipo en proceso": "Register equipment in progress",
    "Correo del cliente": "Customer's email",
    "Número de servicio": "Service number",
    "Equipo (ej. Bomba centrífuga 5HP)": "Equipment (e.g. 5HP centrifugal pump)",
    "Registrar": "Register"
  }

},  /* ---- fin del inglés ---- */


/* ===================================================================
   PORTUGUÉS
   =================================================================== */
pt: {

  meta: {
    title: "TELVE C.A. — Talleres Eléctricos Venezolanos | Rebobinamento de motores e geradores",
    description: "Talleres Eléctricos Venezolanos, C.A. (TELVE). Rebobinamento e reparo de motores e geradores elétricos até 700 HP. Mais de 54 anos em Ciudad Bolívar, Venezuela. Distribuidor autorizado WEG, VOGES, PEARL e CALPEDA."
  },

  whatsapp: "Olá TELVE C.A., gostaria de informações sobre reparo e/ou rebobinamento do meu motor ou gerador elétrico.",

  auth: {
    login: "Entrar",
    miCuenta: "Minha conta",
    loginTitle: "Bem-vindo de volta",
    registerTitle: "Criar conta",
    loginError: "E-mail ou senha incorretos.",
    yaRegistrado: "Esse e-mail já tem uma conta. Faça login.",
    claveDebil: "A senha deve ter pelo menos 6 caracteres.",
    correoInvalido: "Esse e-mail não parece válido.",
    muchosCorreos: "Foram enviados e-mails demais. Aguarde alguns minutos e tente novamente.",
    registroCerrado: "O cadastro de novas contas está fechado por enquanto.",
    registroError: "Não foi possível criar a conta. Tente novamente em instantes.",
    saveError: "Não foi possível salvar o equipamento. Confira os dados e tente novamente.",
    uploadError: "Não foi possível enviar a foto. Tente novamente.",
    fotoTipo: "O arquivo deve ser uma imagem.",
    fotoPeso: "A foto não pode ter mais de 5 MB.",
    noConfirmado: "Sua conta ainda não está confirmada. Confira seu e-mail.",
    camposVacios: "Escreva seu e-mail e sua senha.",
    nuevaClaveTitle: "Escolha uma senha nova",
    escribeCorreo: "Escreva seu e-mail acima e clique de novo.",
    resetError: "Não foi possível enviar o link. Tente novamente em instantes.",
    claveIgual: "Essa já é a sua senha atual. Escolha outra.",
    captchaFallo: "Conclua a verificação de segurança e tente novamente.",
    claveError: "Não foi possível trocar a senha. Tente novamente.",
    enlaceCaducado: "Esse link não vale mais. Peça um novo em “Esqueceu sua senha?”."
  },
  equipos: {
    marca: "Marca: ",
    modelo: "Modelo: ",
    potencia: "Potência: ",
    voltaje: "Voltagem: ",
    succion: "Diâm. sucção: ",
    salida: "Diâm. saída: ",
    eje: "Diâm. eixo: ",
    borrar: "Excluir item",
    borrarError: "Não foi possível excluir o equipamento. Tente novamente."
  },
  proceso: {
    numero: "Nº de serviço: ",
    etapaActual: "Etapa atual: ",
    notas: "Notas",
    agregarNota: "Adicionar nota",
    notaPlaceholder: "Nota (opcional)",
    guardarNota: "Salvar nota",
    notaError: "Não foi possível salvar a nota. Tente novamente.",
    etapaError: "Não foi possível atualizar a etapa.",
    registroError: "Não foi possível salvar o registro. Confira os dados e tente novamente."
  },

  attrs: {
    "Hola TELVE C.A., quiero consultar disponibilidad y precio de un equipo (motor, bomba o generador).":
      "Olá TELVE C.A., quero consultar a disponibilidade e o preço de um equipamento (motor, bomba ou gerador).",
    "TELVE, C.A. — Talleres Eléctricos Venezolanos · RIF J-08002579-2":
      "TELVE, C.A. — Talleres Eléctricos Venezolanos · CNPJ J-08002579-2",
    "Miembro EASA — The Electro-Mechanical Authority":
      "Membro EASA — The Electro-Mechanical Authority",
    "TELVE, C.A. — ir al inicio": "TELVE, C.A. — ir para o início",
    "Abrir menú": "Abrir menu",
    "Cerrar menú": "Fechar menu",
    "Navegación principal": "Navegação principal",
    "Ajustes de la página": "Configurações da página",
    "Pier Pianca, fundador de TELVE": "Pier Pianca, fundador da TELVE",
    "Christian Pianca, gerente general de TELVE": "Christian Pianca, gerente geral da TELVE",
    "Gian Pier Pianca": "Gian Pier Pianca",
    "Fachada del taller TELVE": "Fachada da oficina TELVE",
    "Fachada del taller TELVE en Ciudad Bolívar": "Fachada da oficina TELVE em Ciudad Bolívar",
    "Ubicación de TELVE, C.A. en Ciudad Bolívar": "Localização da TELVE, C.A. em Ciudad Bolívar",
    "Rebobinado de motores": "Rebobinamento de motores",
    "Mantenimiento y análisis eléctrico": "Manutenção e análise elétrica",
    "Servicios de mecanizado": "Serviços de usinagem",
    "Suministro y distribución": "Fornecimento e distribuição",
    "Cerrar": "Fechar",
    "Código": "Código",
    "Marca": "Marca",
    "Modelo": "Modelo",
    "Potencia (HP)": "Potência (HP)",
    "Precio ($)": "Preço ($)",
    "Diám. succión": "Diâm. sucção",
    "Diám. salida": "Diâm. saída",
    "Diám. eje": "Diâm. eixo"
  },

  text: {
    "Saltar al contenido": "Ir para o conteúdo",
    "Inicio": "Início",
    "Servicios": "Serviços",
    "Nosotros": "Sobre nós",
    "Contacto": "Contato",

    "Talleres Eléctricos Venezolanos · desde 1972": "Talleres Eléctricos Venezolanos · desde 1972",
    "Mantenemos la industria en movimiento.": "Mantemos a indústria em movimento.",
    "Reparación, mantenimiento y reconstrucción de equipos eléctricos industriales y residenciales. Rebobinado de motores eléctricos de media potencia hasta los 700 HP en baja tensión hasta los 600 V y de generadores eléctricos hasta los 500 Kva, con más de medio siglo de experiencia en nuestro ramo y brindándole nuestros servicios tanto a nuestra comunidad en Ciudad Bolívar como al resto del territorio nacional.":
      "Reparo, manutenção e reconstrução de equipamentos elétricos industriais e residenciais. Rebobinamento de motores elétricos de média potência até 700 HP em baixa tensão até 600 V e de geradores elétricos até 500 KVA, com mais de meio século de experiência no ramo, atendendo tanto a nossa comunidade em Ciudad Bolívar quanto o restante do território nacional.",
    "Cotiza por WhatsApp": "Solicite orçamento no WhatsApp",
    "Ver servicios": "Ver serviços",

    "Años en el mercado": "Anos no mercado",
    "Motores eléctricos · baja tensión": "Motores elétricos · baixa tensão",
    "Generadores eléctricos · baja tensión": "Geradores elétricos · baixa tensão",
    "Atención de emergencias": "Atendimento de emergências",

    "Servicios especializados": "Serviços especializados",
    "Capacidad instalada disponible": "Capacidade instalada disponível",
    "Reparación general y rebobinado de equipos eléctricos rotativos":
      "Reparo geral e rebobinamento de equipamentos elétricos rotativos",
    "Motores eléctricos hasta los 700 HP y generadores eléctricos hasta los 500 KVA, en manufactura de alambre magneto de cobre en sección redonda, tanto monofásicos como trifásicos, con una tensión máxima de alimentación de 600 Volts.":
      "Motores elétricos até 700 HP e geradores elétricos até 500 KVA, fabricados com fio magnético de cobre esmaltado de seção redonda, tanto monofásicos quanto trifásicos, com tensão máxima de alimentação de 600 volts.",
    "Planes de mantenimiento y análisis": "Planos de manutenção e análise",
    "Mantenimiento predictivo, preventivo y correctivo en máquinas eléctricas rotativas, con análisis eléctrico especializado, tanto estáticos como dinámicos (Megger, Ducter, Hi-Pot, Baker).":
      "Manutenção preditiva, preventiva e corretiva em máquinas elétricas rotativas, com análise elétrica especializada, tanto estática quanto dinâmica (Megger, Ducter, Hi-Pot, Baker).",
    "Suministro y distribución de refacciones": "Fornecimento e distribuição de peças",
    "Distribuidor autorizado de motores WEG y VOGES, bombas de agua PEARL y CALPEDA, grupos electrógenos, rodamientos y repuestos afines a las máquinas eléctricas rotativas.":
      "Distribuidor autorizado de motores WEG e VOGES, bombas d'água PEARL e CALPEDA, grupos geradores, rolamentos e peças de reposição para máquinas elétricas rotativas.",
    "Ver todos los servicios →": "Ver todos os serviços →",

    "Navegación": "Navegação",
    "Distribuidor autorizado": "Distribuidor autorizado",
    "Otras marcas que manejamos": "Outras marcas que trabalhamos",
    "Fundador": "Fundador",
    "Generación de relevo": "Nova geração",
    "Por qué TELVE, C.A.": "Por que a TELVE, C.A.",
    "Más de medio siglo de trabajo ininterrumpido, calidad y seriedad… siempre estamos innovando.":
      "Mais de meio século de trabalho ininterrupto, qualidade e seriedade… estamos sempre inovando.",
    "Iniciamos actividades en 1972 con capital 100% venezolano y tecnología de los fabricantes originales de equipos eléctricos. Nuestra trayectoria y control de calidad nos permiten operar con un nivel de servicio de garantía menor del uno por ciento. Nos adaptamos a las exigencias de nuestros clientes y siempre buscaremos la forma de superar sus expectativas…":
      "Iniciamos as atividades em 1972 com capital 100% venezuelano e tecnologia dos fabricantes originais de equipamentos elétricos. Nossa trajetória e controle de qualidade nos permitem operar com um índice de serviço em garantia inferior a um por cento. Adaptamo-nos às exigências dos nossos clientes e sempre buscaremos maneiras de superar suas expectativas…",
    "Conoce nuestra historia →": "Conheça nossa história →",

    "Nos avalan": "Quem confia em nós",
    "Clientela pública y privada": "Clientes dos setores público e privado",

    "Ubicación": "Localização",
    "Visita nuestras instalaciones": "Visite nossas instalações",
    "Calle Columbo Silva Nro. 33, frente a la Escuela de Medicina de la UDO, Barrio Ajuro, Galpón Industrial TELVE.":
      "Calle Columbo Silva n.º 33, em frente à Faculdade de Medicina da UDO, Barrio Ajuro, Galpão Industrial TELVE.",
    "Ciudad Bolívar — Estado Bolívar.": "Ciudad Bolívar — Estado Bolívar, Venezuela.",
    "Cómo llegar": "Como chegar",

    "Oferta de servicios": "Nossos serviços",
    "Todo lo que podemos reparar": "Tudo o que podemos reparar",
    "Soluciones electromecánicas para industria, empresas, entidades públicas y hogares.":
      "Soluções eletromecânicas para a indústria, empresas, órgãos públicos e residências.",
    "foto · rebobinado": "foto · rebobinamento",
    "foto · mantenimiento": "foto · manutenção",
    "foto · mecanizado": "foto · usinagem",
    "foto · suministro": "foto · fornecimento",

    "Rebobinado y reparación en general de máquinas eléctricas rotativas":
      "Rebobinamento e reparo geral de máquinas elétricas rotativas",
    "Mantenimiento y rebobinado de equipos eléctricos de mediana potencia hasta 700 HP y de 600 V en corriente alterna, con alambre magneto de sección redonda en cobre esmaltado.":
      "Manutenção e rebobinamento de equipamentos elétricos de média potência até 700 HP e 600 V em corrente alternada, com fio magnético de seção redonda em cobre esmaltado.",
    "Motores eléctricos de todas las marcas, desde 1/3 HP hasta 700 HP":
      "Motores elétricos de todas as marcas, de 1/3 HP até 700 HP",
    "Generadores eléctricos de baja tensión, desde 3 KVA hasta 500 KVA":
      "Geradores elétricos de baixa tensão, de 3 KVA até 500 KVA",
    "Motores de inducción y síncronos": "Motores de indução e síncronos",
    "Motores con rotor devanado": "Motores de rotor bobinado",
    "Motores con varias velocidades": "Motores de várias velocidades",
    "Transformadores secos": "Transformadores a seco",
    "Equipo eléctrico industrial y acondicionamiento de tableros de control":
      "Equipamento elétrico industrial e recondicionamento de painéis de controle",
    "Monofásico": "Monofásico",
    "Trifásico": "Trifásico",
    "Hasta 700 HP": "Até 700 HP",

    "Mantenimiento y análisis eléctrico / mecánico": "Manutenção e análise elétrica / mecânica",
    "Mantenimiento predictivo, preventivo y correctivo de máquinas eléctricas rotativas, con inspección, evaluación y análisis tanto eléctrico como mecánico especializado antes de devolver el equipo a su sitio de servicio.":
      "Manutenção preditiva, preventiva e corretiva de máquinas elétricas rotativas, com inspeção, avaliação e análise elétrica e mecânica especializada antes de devolver o equipamento ao seu local de serviço.",
    "Megger motorizado y electrónico": "Megger motorizado e eletrônico",
    "Probador de baja resistencia (Ducter)": "Testador de baixa resistência (Ducter)",
    "Alto potencial (Hi-Pot) y Surge": "Alta tensão (Hi-Pot) e Surge",
    "Análisis con equipo BAKER": "Análise com equipamento BAKER",
    "Balanceo dinámico y análisis de vibraciones": "Balanceamento dinâmico e análise de vibrações",
    "Estudio de termografía": "Estudo de termografia",
    "Pruebas de motoreo y recálculo de bobinado según las necesidades del cliente":
      "Testes de funcionamento e recálculo de bobinagem conforme a necessidade do cliente",
    "Predictivo": "Preditiva",
    "Preventivo": "Preventiva",
    "Correctivo": "Corretiva",

    "Servicios de mecanizado": "Serviços de usinagem",
    "Contamos con la maquinaria necesaria para resolver cualquier tipo de requerimiento en el ámbito mecánico que se necesite para normalizar cualquier falla por desgaste operativo que haya sufrido el equipo durante su ciclo de trabajo. Además, tenemos disponible el servicio de balanceo dinámico para rotores jaula de ardilla y bobinados.":
      "Contamos com o maquinário necessário para atender qualquer exigência mecânica envolvida na correção de falhas por desgaste operacional que o equipamento tenha sofrido durante seu ciclo de trabalho. Além disso, oferecemos o serviço de balanceamento dinâmico para rotores gaiola de esquilo e bobinados.",
    "Torno de bancada larga con amplio volteo": "Torno de barramento longo com grande volteio",
    "Fresadora automática": "Fresadora automática",
    "Prensa hidráulica horizontal de 100 Ton": "Prensa hidráulica horizontal de 100 toneladas",
    "Análisis de vibraciones": "Análise de vibrações",
    "Balanceo dinámico de rotores jaula de ardilla y/o bobinados":
      "Balanceamento dinâmico de rotores gaiola de esquilo e/ou bobinados",
    "Balanceo dinámico de impulsores o impelentes de bombas de agua":
      "Balanceamento dinâmico de rotores de bombas d'água",
    "Calentador de inducción SKF": "Aquecedor por indução SKF",
    "Torno": "Torneamento",
    "Fresado": "Fresamento",
    "Balanceo dinámico": "Balanceamento dinâmico",

    "Suministro de refacciones y distribución": "Fornecimento de peças e distribuição",
    "Distribuidor autorizado y centro de servicio de las principales marcas de motores, bombas de agua y accesorios mecánicos y eléctricos, con repuestos garantizados.":
      "Distribuidor autorizado e centro de serviço das principais marcas de motores, bombas d'água e acessórios mecânicos e elétricos, com peças de reposição garantidas.",
    "Motores WEG y VOGES (hasta 600 HP)": "Motores WEG e VOGES (até 600 HP)",
    "Electro-bombas centrífugas PEARL y CALPEDA (hasta 30 HP)":
      "Eletrobombas centrífugas PEARL e CALPEDA (até 30 HP)",
    "Grupos electrógenos de acuerdo a los requerimientos del cliente":
      "Grupos geradores conforme os requisitos do cliente",
    "Rodamientos SKF, FAG y NACHI": "Rolamentos SKF, FAG e NACHI",
    "Sellos mecánicos para bombas de agua": "Selos mecânicos para bombas d'água",
    "Barnices aislantes POLAN y ELECTRIC DIAMOND": "Vernizes isolantes POLAN e ELECTRIC DIAMOND",
    "Accesorios varios para motores eléctricos (aspas y protectores de ventilación, borneras, cáncamos, resistencias calefactoras, termistores, etc.)":
      "Diversos acessórios para motores elétricos (pás e proteções de ventilação, réguas de bornes, olhais de içamento, resistências de aquecimento, termistores, etc.)",

    "Cómo trabajamos": "Como trabalhamos",
    "El proceso": "O processo",
    "Inspección y evaluación": "Inspeção e avaliação",
    "Al recibir el equipo en nuestras instalaciones se procede a realizar una inspección tanto externa como interna del mismo, detectando las fallas reales y los daños ocultos que pueda tener tanto a nivel eléctrico como mecánico, procediendo posteriormente a la emisión de un informe de daños encontrados junto al presupuesto ofrecido para la regulación del equipo.":
      "Ao receber o equipamento em nossas instalações, realizamos uma inspeção externa e interna, identificando as falhas reais e os danos ocultos que ele possa ter, tanto elétricos quanto mecânicos, emitindo em seguida um laudo dos danos encontrados junto com o orçamento para a recuperação do equipamento.",
    "Reparación y rebobinado": "Reparo e rebobinamento",
    "De acuerdo a la inspección realizada inicialmente al equipo procedemos a aplicar el nivel de mantenimiento que este requiera, bien sea a nivel preventivo o de ser requerido a nivel correctivo, resolviendo los detalles tanto mecánicos como eléctricos en el mismo. Ejecutamos el trabajo con un estricto control de calidad, con materiales y repuestos garantizados.":
      "Com base na inspeção inicial, aplicamos o nível de manutenção que o equipamento exige, seja preventiva ou, quando necessário, corretiva, resolvendo tanto as questões mecânicas quanto as elétricas. Executamos o trabalho sob rigoroso controle de qualidade, com materiais e peças garantidos.",
    "Pruebas y entrega": "Testes e entrega",
    "Como paso final para garantizar la satisfacción de nuestros clientes, aplicamos a nuestro equipos repotenciados un tren de ensayos estáticos y dinámicos tanto en el ámbito mecánico como eléctrico, para dejar constancia de un equipo a entregar que cumplirá cabalmente con su función en su sitio de trabaja. Como punta de lanza para nosotros cumplir con los plazos de entrega exigidos por nuestros clientes es nuestra prioridad sin demeritar nuestra calidad ofrecida en el servicio aplicado a los equipos.":
      "Como etapa final para garantir a satisfação dos nossos clientes, submetemos cada equipamento recuperado a uma série de ensaios estáticos e dinâmicos, mecânicos e elétricos, atestando que o equipamento entregue cumprirá plenamente sua função no local de trabalho. Cumprir os prazos de entrega exigidos pelos nossos clientes é prioridade para nós, sem jamais comprometer a qualidade do serviço aplicado aos equipamentos.",
    "¿Tu motor o generador necesita servicio?": "Seu motor ou gerador precisa de manutenção?",

    "Más de 54 años reparando motores": "Mais de 54 anos reparando motores",
    "Un oficio con trayectoria.": "Um ofício com trajetória.",
    "Nuestra empresa es de base familiar, fundada por nuestro padre en el año de 1972 con capital propio, desde sus inicios se caracterizo por ser una empresa innovadora, con carácter de atención a los detalles y de atender las necesidades particulares de los clientes, con los años fue abarcando distintos ramos productivos del país, el sector industrial metalúrgico, cogeneración hidroeléctrica hasta el sector petrolero, afrontando crisis económicas y saliendo adelante con trabajo honesto y dedicado a mejorar día a día nuestro país.":
      "Nossa empresa é de base familiar, fundada por nosso pai em 1972 com capital próprio. Desde o início destacou-se como uma empresa inovadora, atenta aos detalhes e às necessidades particulares de cada cliente. Com os anos passou a abranger diferentes setores produtivos do país — a indústria metalúrgica, a cogeração hidrelétrica e até o setor petrolífero — enfrentando crises econômicas e seguindo em frente com trabalho honesto e dedicado a melhorar nosso país dia após dia.",
    "Continuando con una larga tradición heredada de parte del fundador, la generación de relevo continuamos con el proceso de mejora continua, modernización, adaptabilidad a las nuevas exigencias de un mercado de servicios en donde nuestros clientes requieren que cubramos y rebasemos sus expectativas sobre el servicio que podamos ofrecerles.":
      "Dando continuidade a uma longa tradição herdada do fundador, a nova geração mantém o processo de melhoria contínua, modernização e adaptação às novas exigências de um mercado de serviços em que nossos clientes esperam que atendamos e superemos suas expectativas.",
    "foto · fachada / equipo del taller": "foto · fachada / equipe da oficina",
    "Misión": "Missão",
    "Rehabilitación de equipos con honestidad, eficiencia y calidad.":
      "Recuperação de equipamentos com honestidade, eficiência e qualidade.",
    "Somos una empresa dinámica y entusiasta que ofrece a la industria la rehabilitación de motores y generadores eléctricos. Garantizamos el óptimo funcionamiento de los mismos, cubriendo las necesidades de nuestros clientes, trabajadores y proveedores, en la búsqueda constante de la superación de nuestras expectativas. Trabajamos basados en la experiencia, el desarrollo del personal y la actualización tecnológica.":
      "Somos uma empresa dinâmica e entusiasta que oferece à indústria a recuperação de motores e geradores elétricos. Garantimos seu funcionamento ideal, atendendo às necessidades de nossos clientes, trabalhadores e fornecedores, na busca constante por superar nossas próprias expectativas. Trabalhamos com base na experiência, no desenvolvimento do pessoal e na atualização tecnológica.",
    "Lo que nos diferencia": "O que nos diferencia",
    "+54 años": "+54 anos",
    "Experiencia real en el mercado que respalda cada reparación.":
      "Experiência real de mercado respaldando cada reparo.",
    "Personal capacitado": "Equipe capacitada",
    "Técnicos calificados y una de las mejores infraestructuras de la región.":
      "Técnicos qualificados e uma das melhores infraestruturas da região.",
    "Control de calidad": "Controle de qualidade",
    "Estricto control entre operaciones y atención personalizada.":
      "Controle rigoroso entre operações e atendimento personalizado.",
    "Hablemos de tu equipo": "Vamos falar do seu equipamento",
    "Escríbenos por WhatsApp": "Fale conosco no WhatsApp",

    "Hablemos": "Vamos conversar",
    "Escríbenos por WhatsApp, llámanos o visítanos en el taller en Ciudad Bolívar.":
      "Fale conosco no WhatsApp, ligue ou visite nossa oficina em Ciudad Bolívar.",
    "Dirección": "Endereço",
    "Recepción / WhatsApp": "Recepção / WhatsApp",
    "Emergencias 24h": "Emergências 24h",
    "Oficina": "Escritório",
    "Correo": "E-mail",
    "Correo:": "E-mail:",
    "Horario": "Horário",
    "Lun – Vie · 7:00 a.m. – 12:00 m. y 1:00 p.m. – 3:00 p.m.":
      "Seg – Sex · 7h00 – 12h00 e 13h00 – 15h00",
    "Abrir chat de WhatsApp": "Abrir conversa no WhatsApp",
    "foto · fachada del taller": "foto · fachada da oficina",

    "RIF: J-08002579-2": "CNPJ: J-08002579-2",
    "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motores · Generadores · Equipos industriales":
      "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motores · Geradores · Equipamentos industriais",

    "Animaciones": "Animações",
    "Completas": "Completas",
    "Reducidas": "Reduzidas",
    "Reducidas detiene la franja y los carruseles automáticos.":
      "Reduzidas para a faixa e os carrosséis automáticos.",
    "Idioma": "Idioma",
    "Cambia el idioma o reduce las animaciones aquí.":
      "Mude o idioma ou reduza as animações aqui.",
    "Entendido": "Entendi",

    /* Equipos en venta */
    "Equipos": "Equipamentos",
    "Equipos en venta": "Equipamentos à venda",
    "Motores, bombas y generadores en stock": "Motores, bombas e geradores em estoque",
    "Motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores, listos para instalación.":
      "Motores elétricos monofásicos e trifásicos, bombas d'água PEARL e CALPEDA, e geradores, prontos para instalar.",
    "Todavía no hay equipos publicados": "Ainda não há equipamentos publicados",
    "Trabajamos con motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores. Si buscas algo puntual, escríbenos y te decimos si lo tenemos o te lo conseguimos.":
      "Trabalhamos com motores elétricos monofásicos e trifásicos, bombas d'água PEARL e CALPEDA, e geradores. Se você procura algo específico, escreva para nós e dizemos se temos ou se conseguimos para você.",
    "Pedir por WhatsApp": "Consultar pelo WhatsApp",
    "No se pudo cargar el catálogo de equipos. Revisa tu conexión a internet y recarga la página.": "Não foi possível carregar o catálogo de equipamentos. Verifique sua conexão com a internet e recarregue a página.",
    "Administrador": "Administrador",
    "Agregar equipo": "Adicionar item",
    "Foto (opcional)": "Foto (opcional)",
    "Guardar equipo": "Salvar item",

    /* Modal de acceso */
    "Iniciar sesión": "Entrar",
    "Registrarme": "Cadastrar-se",
    "Bienvenido de nuevo": "Bem-vindo de volta",
    "Crear cuenta": "Criar conta",
    "Contraseña": "Senha",
    "Entrar": "Entrar",
    "Revisa tu correo para confirmar la cuenta.": "Confira seu e-mail para confirmar a conta.",
    "¿Olvidaste tu contraseña?": "Esqueceu sua senha?",
    "Si ese correo tiene una cuenta, te enviamos un enlace para cambiar la contraseña. Revisa tu bandeja.": "Se esse e-mail tiver uma conta, enviamos um link para trocar a senha. Confira sua caixa de entrada.",
    "Contraseña nueva": "Senha nova",
    "Guardar contraseña": "Salvar senha",
    "Contraseña actualizada. Ya puedes entrar con ella.": "Senha atualizada. Já pode entrar com ela.",
    "Reenviar el correo de confirmación": "Reenviar o e-mail de confirmação",
    "Te reenviamos el correo de confirmación. Revisa tu bandeja.": "Reenviamos o e-mail de confirmação. Confira sua caixa de entrada.",
    "Cerrar sesión": "Sair",

    /* Mi equipo */
    "Mi equipo": "Meu equipamento",
    "Seguimiento de tu reparación": "Acompanhe seu reparo",
    "Aquí ves en qué etapa está tu equipo y las notas que agregue el taller durante el proceso.":
      "Aqui você vê em que etapa está seu equipamento e as notas que a oficina adicionar durante o processo.",
    "Todavía no tienes equipos en proceso": "Você ainda não tem equipamentos em processo",
    "Cuando traigas un equipo a reparar y quede registrado con este correo, vas a ver aquí en qué etapa está.":
      "Quando você trouxer um equipamento para reparo e ele for registrado com este e-mail, verá aqui em que etapa está.",
    "Registrar equipo en proceso": "Registrar equipamento em processo",
    "Correo del cliente": "E-mail do cliente",
    "Número de servicio": "Número de serviço",
    "Equipo (ej. Bomba centrífuga 5HP)": "Equipamento (ex. Bomba centrífuga 5HP)",
    "Registrar": "Registrar"
  }

},  /* ---- fin del portugués ---- */


/* ===================================================================
   ITALIANO
   =================================================================== */
it: {

  meta: {
    title: "TELVE C.A. — Talleres Eléctricos Venezolanos | Riavvolgimento di motori e generatori",
    description: "Talleres Eléctricos Venezolanos, C.A. (TELVE). Riavvolgimento e riparazione di motori e generatori elettrici fino a 700 HP. Oltre 54 anni a Ciudad Bolívar, Venezuela. Distributore autorizzato WEG, VOGES, PEARL e CALPEDA."
  },

  whatsapp: "Salve TELVE C.A., vorrei informazioni sulla riparazione e/o sul riavvolgimento del mio motore o generatore elettrico.",

  auth: {
    login: "Accedi",
    miCuenta: "Il mio account",
    loginTitle: "Bentornato",
    registerTitle: "Crea account",
    loginError: "Email o password errati.",
    yaRegistrado: "Questa email ha già un account. Accedi.",
    claveDebil: "La password deve avere almeno 6 caratteri.",
    correoInvalido: "Questa email non sembra valida.",
    muchosCorreos: "Sono state inviate troppe email. Attendi qualche minuto e riprova.",
    registroCerrado: "La registrazione di nuovi account è chiusa per ora.",
    registroError: "Non è stato possibile creare l'account. Riprova tra poco.",
    saveError: "Non è stato possibile salvare l'attrezzatura. Controlla i dati e riprova.",
    uploadError: "Non è stato possibile caricare la foto. Riprova.",
    fotoTipo: "Il file deve essere un'immagine.",
    fotoPeso: "La foto non può superare i 5 MB.",
    noConfirmado: "Il tuo account non è ancora confermato. Controlla la tua email.",
    camposVacios: "Scrivi la tua email e la tua password.",
    nuevaClaveTitle: "Scegli una nuova password",
    escribeCorreo: "Scrivi la tua email qui sopra e premi di nuovo.",
    resetError: "Non è stato possibile inviare il link. Riprova tra poco.",
    claveIgual: "Questa è già la tua password attuale. Scegline un'altra.",
    captchaFallo: "Completa la verifica di sicurezza e riprova.",
    claveError: "Non è stato possibile cambiare la password. Riprova.",
    enlaceCaducado: "Quel link non è più valido. Chiedine uno nuovo da “Hai dimenticato la password?”."
  },
  equipos: {
    marca: "Marca: ",
    modelo: "Modello: ",
    potencia: "Potenza: ",
    voltaje: "Voltaggio: ",
    succion: "Diam. aspirazione: ",
    salida: "Diam. mandata: ",
    eje: "Diam. albero: ",
    borrar: "Elimina articolo",
    borrarError: "Non è stato possibile eliminare l'attrezzatura. Riprova."
  },
  proceso: {
    numero: "Nº di servizio: ",
    etapaActual: "Fase attuale: ",
    notas: "Note",
    agregarNota: "Aggiungi nota",
    notaPlaceholder: "Nota (opzionale)",
    guardarNota: "Salva nota",
    notaError: "Non è stato possibile salvare la nota. Riprova.",
    etapaError: "Non è stato possibile aggiornare la fase.",
    registroError: "Non è stato possibile salvare il registro. Controlla i dati e riprova."
  },

  attrs: {
    "Hola TELVE C.A., quiero consultar disponibilidad y precio de un equipo (motor, bomba o generador).":
      "Ciao TELVE C.A., vorrei sapere disponibilità e prezzo di un'unità (motore, pompa o generatore).",
    "TELVE, C.A. — Talleres Eléctricos Venezolanos · RIF J-08002579-2":
      "TELVE, C.A. — Talleres Eléctricos Venezolanos · P. IVA J-08002579-2",
    "Miembro EASA — The Electro-Mechanical Authority":
      "Membro EASA — The Electro-Mechanical Authority",
    "TELVE, C.A. — ir al inicio": "TELVE, C.A. — vai alla home",
    "Abrir menú": "Apri menu",
    "Cerrar menú": "Chiudi menu",
    "Navegación principal": "Navigazione principale",
    "Ajustes de la página": "Impostazioni della pagina",
    "Pier Pianca, fundador de TELVE": "Pier Pianca, fondatore di TELVE",
    "Christian Pianca, gerente general de TELVE": "Christian Pianca, direttore generale di TELVE",
    "Gian Pier Pianca": "Gian Pier Pianca",
    "Fachada del taller TELVE": "Facciata dell'officina TELVE",
    "Fachada del taller TELVE en Ciudad Bolívar": "Facciata dell'officina TELVE a Ciudad Bolívar",
    "Ubicación de TELVE, C.A. en Ciudad Bolívar": "Sede di TELVE, C.A. a Ciudad Bolívar",
    "Rebobinado de motores": "Riavvolgimento di motori",
    "Mantenimiento y análisis eléctrico": "Manutenzione e analisi elettrica",
    "Servicios de mecanizado": "Servizi di lavorazione meccanica",
    "Suministro y distribución": "Fornitura e distribuzione",
    "Cerrar": "Chiudi",
    "Código": "Codice",
    "Marca": "Marca",
    "Modelo": "Modello",
    "Potencia (HP)": "Potenza (HP)",
    "Precio ($)": "Prezzo ($)",
    "Diám. succión": "Diam. aspirazione",
    "Diám. salida": "Diam. mandata",
    "Diám. eje": "Diam. albero"
  },

  text: {
    "Saltar al contenido": "Vai al contenuto",
    "Inicio": "Home",
    "Servicios": "Servizi",
    "Nosotros": "Chi siamo",
    "Contacto": "Contatti",

    "Talleres Eléctricos Venezolanos · desde 1972": "Talleres Eléctricos Venezolanos · dal 1972",
    "Mantenemos la industria en movimiento.": "Manteniamo l'industria in movimento.",
    "Reparación, mantenimiento y reconstrucción de equipos eléctricos industriales y residenciales. Rebobinado de motores eléctricos de media potencia hasta los 700 HP en baja tensión hasta los 600 V y de generadores eléctricos hasta los 500 Kva, con más de medio siglo de experiencia en nuestro ramo y brindándole nuestros servicios tanto a nuestra comunidad en Ciudad Bolívar como al resto del territorio nacional.":
      "Riparazione, manutenzione e ricostruzione di apparecchiature elettriche industriali e residenziali. Riavvolgimento di motori elettrici di media potenza fino a 700 HP in bassa tensione fino a 600 V e di generatori elettrici fino a 500 KVA, con oltre mezzo secolo di esperienza nel settore, al servizio sia della nostra comunità a Ciudad Bolívar sia del resto del paese.",
    "Cotiza por WhatsApp": "Richiedi un preventivo su WhatsApp",
    "Ver servicios": "Vedi i servizi",

    "Años en el mercado": "Anni di attività",
    "Motores eléctricos · baja tensión": "Motori elettrici · bassa tensione",
    "Generadores eléctricos · baja tensión": "Generatori elettrici · bassa tensione",
    "Atención de emergencias": "Servizio di emergenza",

    "Servicios especializados": "Servizi specializzati",
    "Capacidad instalada disponible": "Capacità installata disponibile",
    "Reparación general y rebobinado de equipos eléctricos rotativos":
      "Riparazione generale e riavvolgimento di apparecchiature elettriche rotanti",
    "Motores eléctricos hasta los 700 HP y generadores eléctricos hasta los 500 KVA, en manufactura de alambre magneto de cobre en sección redonda, tanto monofásicos como trifásicos, con una tensión máxima de alimentación de 600 Volts.":
      "Motori elettrici fino a 700 HP e generatori elettrici fino a 500 KVA, realizzati con filo di rame smaltato a sezione tonda, sia monofase sia trifase, con tensione massima di alimentazione di 600 volt.",
    "Planes de mantenimiento y análisis": "Piani di manutenzione e analisi",
    "Mantenimiento predictivo, preventivo y correctivo en máquinas eléctricas rotativas, con análisis eléctrico especializado, tanto estáticos como dinámicos (Megger, Ducter, Hi-Pot, Baker).":
      "Manutenzione predittiva, preventiva e correttiva su macchine elettriche rotanti, con analisi elettrica specializzata, sia statica sia dinamica (Megger, Ducter, Hi-Pot, Baker).",
    "Suministro y distribución de refacciones": "Fornitura e distribuzione di ricambi",
    "Distribuidor autorizado de motores WEG y VOGES, bombas de agua PEARL y CALPEDA, grupos electrógenos, rodamientos y repuestos afines a las máquinas eléctricas rotativas.":
      "Distributore autorizzato di motori WEG e VOGES, pompe dell'acqua PEARL e CALPEDA, gruppi elettrogeni, cuscinetti e ricambi per macchine elettriche rotanti.",
    "Ver todos los servicios →": "Vedi tutti i servizi →",

    "Navegación": "Navigazione",
    "Distribuidor autorizado": "Distributore autorizzato",
    "Otras marcas que manejamos": "Altri marchi che trattiamo",
    "Fundador": "Fondatore",
    "Generación de relevo": "Nuova generazione",
    "Por qué TELVE, C.A.": "Perché TELVE, C.A.",
    "Más de medio siglo de trabajo ininterrumpido, calidad y seriedad… siempre estamos innovando.":
      "Oltre mezzo secolo di lavoro ininterrotto, qualità e serietà… innoviamo di continuo.",
    "Iniciamos actividades en 1972 con capital 100% venezolano y tecnología de los fabricantes originales de equipos eléctricos. Nuestra trayectoria y control de calidad nos permiten operar con un nivel de servicio de garantía menor del uno por ciento. Nos adaptamos a las exigencias de nuestros clientes y siempre buscaremos la forma de superar sus expectativas…":
      "Abbiamo iniziato l'attività nel 1972 con capitale interamente venezuelano e tecnologia dei produttori originali di apparecchiature elettriche. La nostra esperienza e il controllo qualità ci permettono di operare con un tasso di interventi in garanzia inferiore all'uno per cento. Ci adattiamo alle esigenze dei nostri clienti e cercheremo sempre il modo di superare le loro aspettative…",
    "Conoce nuestra historia →": "Scopri la nostra storia →",

    "Nos avalan": "Ci danno fiducia",
    "Clientela pública y privada": "Clienti pubblici e privati",

    "Ubicación": "Dove siamo",
    "Visita nuestras instalaciones": "Visita la nostra sede",
    "Calle Columbo Silva Nro. 33, frente a la Escuela de Medicina de la UDO, Barrio Ajuro, Galpón Industrial TELVE.":
      "Calle Columbo Silva n. 33, di fronte alla Facoltà di Medicina dell'UDO, Barrio Ajuro, Capannone Industriale TELVE.",
    "Ciudad Bolívar — Estado Bolívar.": "Ciudad Bolívar — Stato di Bolívar, Venezuela.",
    "Cómo llegar": "Come arrivare",

    "Oferta de servicios": "I nostri servizi",
    "Todo lo que podemos reparar": "Tutto ciò che possiamo riparare",
    "Soluciones electromecánicas para industria, empresas, entidades públicas y hogares.":
      "Soluzioni elettromeccaniche per industria, aziende, enti pubblici e privati.",
    "foto · rebobinado": "foto · riavvolgimento",
    "foto · mantenimiento": "foto · manutenzione",
    "foto · mecanizado": "foto · lavorazione meccanica",
    "foto · suministro": "foto · fornitura",

    "Rebobinado y reparación en general de máquinas eléctricas rotativas":
      "Riavvolgimento e riparazione generale di macchine elettriche rotanti",
    "Mantenimiento y rebobinado de equipos eléctricos de mediana potencia hasta 700 HP y de 600 V en corriente alterna, con alambre magneto de sección redonda en cobre esmaltado.":
      "Manutenzione e riavvolgimento di apparecchiature elettriche di media potenza fino a 700 HP e 600 V in corrente alternata, con filo di rame smaltato a sezione tonda.",
    "Motores eléctricos de todas las marcas, desde 1/3 HP hasta 700 HP":
      "Motori elettrici di tutte le marche, da 1/3 HP fino a 700 HP",
    "Generadores eléctricos de baja tensión, desde 3 KVA hasta 500 KVA":
      "Generatori elettrici in bassa tensione, da 3 KVA fino a 500 KVA",
    "Motores de inducción y síncronos": "Motori a induzione e sincroni",
    "Motores con rotor devanado": "Motori a rotore avvolto",
    "Motores con varias velocidades": "Motori a più velocità",
    "Transformadores secos": "Trasformatori a secco",
    "Equipo eléctrico industrial y acondicionamiento de tableros de control":
      "Apparecchiature elettriche industriali e revisione di quadri di comando",
    "Monofásico": "Monofase",
    "Trifásico": "Trifase",
    "Hasta 700 HP": "Fino a 700 HP",

    "Mantenimiento y análisis eléctrico / mecánico": "Manutenzione e analisi elettrica / meccanica",
    "Mantenimiento predictivo, preventivo y correctivo de máquinas eléctricas rotativas, con inspección, evaluación y análisis tanto eléctrico como mecánico especializado antes de devolver el equipo a su sitio de servicio.":
      "Manutenzione predittiva, preventiva e correttiva di macchine elettriche rotanti, con ispezione, valutazione e analisi elettrica e meccanica specializzata prima di riconsegnare l'apparecchiatura al suo luogo di servizio.",
    "Megger motorizado y electrónico": "Megger motorizzato ed elettronico",
    "Probador de baja resistencia (Ducter)": "Tester di bassa resistenza (Ducter)",
    "Alto potencial (Hi-Pot) y Surge": "Alta tensione (Hi-Pot) e Surge",
    "Análisis con equipo BAKER": "Analisi con apparecchiatura BAKER",
    "Balanceo dinámico y análisis de vibraciones": "Equilibratura dinamica e analisi delle vibrazioni",
    "Estudio de termografía": "Indagine termografica",
    "Pruebas de motoreo y recálculo de bobinado según las necesidades del cliente":
      "Prove di funzionamento e ricalcolo dell'avvolgimento secondo le esigenze del cliente",
    "Predictivo": "Predittiva",
    "Preventivo": "Preventiva",
    "Correctivo": "Correttiva",

    "Servicios de mecanizado": "Servizi di lavorazione meccanica",
    "Contamos con la maquinaria necesaria para resolver cualquier tipo de requerimiento en el ámbito mecánico que se necesite para normalizar cualquier falla por desgaste operativo que haya sufrido el equipo durante su ciclo de trabajo. Además, tenemos disponible el servicio de balanceo dinámico para rotores jaula de ardilla y bobinados.":
      "Disponiamo dei macchinari necessari per rispondere a qualsiasi esigenza meccanica legata alla correzione dei guasti da usura che l'apparecchiatura abbia subito durante il suo ciclo di lavoro. Offriamo inoltre il servizio di equilibratura dinamica per rotori a gabbia di scoiattolo e avvolti.",
    "Torno de bancada larga con amplio volteo": "Tornio a bancale lungo con ampio volteggio",
    "Fresadora automática": "Fresatrice automatica",
    "Prensa hidráulica horizontal de 100 Ton": "Pressa idraulica orizzontale da 100 tonnellate",
    "Análisis de vibraciones": "Analisi delle vibrazioni",
    "Balanceo dinámico de rotores jaula de ardilla y/o bobinados":
      "Equilibratura dinamica di rotori a gabbia di scoiattolo e/o avvolti",
    "Balanceo dinámico de impulsores o impelentes de bombas de agua":
      "Equilibratura dinamica delle giranti delle pompe dell'acqua",
    "Calentador de inducción SKF": "Riscaldatore a induzione SKF",
    "Torno": "Tornitura",
    "Fresado": "Fresatura",
    "Balanceo dinámico": "Equilibratura dinamica",

    "Suministro de refacciones y distribución": "Fornitura di ricambi e distribuzione",
    "Distribuidor autorizado y centro de servicio de las principales marcas de motores, bombas de agua y accesorios mecánicos y eléctricos, con repuestos garantizados.":
      "Distributore autorizzato e centro assistenza delle principali marche di motori, pompe dell'acqua e accessori meccanici ed elettrici, con ricambi garantiti.",
    "Motores WEG y VOGES (hasta 600 HP)": "Motori WEG e VOGES (fino a 600 HP)",
    "Electro-bombas centrífugas PEARL y CALPEDA (hasta 30 HP)":
      "Elettropompe centrifughe PEARL e CALPEDA (fino a 30 HP)",
    "Grupos electrógenos de acuerdo a los requerimientos del cliente":
      "Gruppi elettrogeni secondo le esigenze del cliente",
    "Rodamientos SKF, FAG y NACHI": "Cuscinetti SKF, FAG e NACHI",
    "Sellos mecánicos para bombas de agua": "Tenute meccaniche per pompe dell'acqua",
    "Barnices aislantes POLAN y ELECTRIC DIAMOND": "Vernici isolanti POLAN e ELECTRIC DIAMOND",
    "Accesorios varios para motores eléctricos (aspas y protectores de ventilación, borneras, cáncamos, resistencias calefactoras, termistores, etc.)":
      "Accessori vari per motori elettrici (ventole e copriventole, morsettiere, golfari, resistenze anticondensa, termistori, ecc.)",

    "Cómo trabajamos": "Come lavoriamo",
    "El proceso": "Il processo",
    "Inspección y evaluación": "Ispezione e valutazione",
    "Al recibir el equipo en nuestras instalaciones se procede a realizar una inspección tanto externa como interna del mismo, detectando las fallas reales y los daños ocultos que pueda tener tanto a nivel eléctrico como mecánico, procediendo posteriormente a la emisión de un informe de daños encontrados junto al presupuesto ofrecido para la regulación del equipo.":
      "Al ricevimento dell'apparecchiatura presso la nostra sede procediamo a un'ispezione sia esterna sia interna, individuando i guasti reali e i danni nascosti, elettrici e meccanici, per poi emettere una relazione sui danni riscontrati insieme al preventivo per il ripristino dell'apparecchiatura.",
    "Reparación y rebobinado": "Riparazione e riavvolgimento",
    "De acuerdo a la inspección realizada inicialmente al equipo procedemos a aplicar el nivel de mantenimiento que este requiera, bien sea a nivel preventivo o de ser requerido a nivel correctivo, resolviendo los detalles tanto mecánicos como eléctricos en el mismo. Ejecutamos el trabajo con un estricto control de calidad, con materiales y repuestos garantizados.":
      "In base all'ispezione iniziale applichiamo il livello di manutenzione richiesto dall'apparecchiatura, preventiva oppure, se necessario, correttiva, risolvendone gli aspetti sia meccanici sia elettrici. Eseguiamo il lavoro con un rigoroso controllo qualità, con materiali e ricambi garantiti.",
    "Pruebas y entrega": "Collaudo e consegna",
    "Como paso final para garantizar la satisfacción de nuestros clientes, aplicamos a nuestro equipos repotenciados un tren de ensayos estáticos y dinámicos tanto en el ámbito mecánico como eléctrico, para dejar constancia de un equipo a entregar que cumplirá cabalmente con su función en su sitio de trabaja. Como punta de lanza para nosotros cumplir con los plazos de entrega exigidos por nuestros clientes es nuestra prioridad sin demeritar nuestra calidad ofrecida en el servicio aplicado a los equipos.":
      "Come passaggio finale per garantire la soddisfazione dei nostri clienti, sottoponiamo ogni apparecchiatura revisionata a una serie di prove statiche e dinamiche, meccaniche ed elettriche, a conferma che l'apparecchiatura consegnata assolverà pienamente la propria funzione sul luogo di lavoro. Rispettare i tempi di consegna richiesti dai nostri clienti è per noi una priorità, senza mai penalizzare la qualità del servizio applicato alle apparecchiature.",
    "¿Tu motor o generador necesita servicio?": "Il tuo motore o generatore ha bisogno di assistenza?",

    "Más de 54 años reparando motores": "Oltre 54 anni a riparare motori",
    "Un oficio con trayectoria.": "Un mestiere con una storia.",
    "Nuestra empresa es de base familiar, fundada por nuestro padre en el año de 1972 con capital propio, desde sus inicios se caracterizo por ser una empresa innovadora, con carácter de atención a los detalles y de atender las necesidades particulares de los clientes, con los años fue abarcando distintos ramos productivos del país, el sector industrial metalúrgico, cogeneración hidroeléctrica hasta el sector petrolero, afrontando crisis económicas y saliendo adelante con trabajo honesto y dedicado a mejorar día a día nuestro país.":
      "La nostra è un'azienda a base familiare, fondata da nostro padre nel 1972 con capitale proprio. Fin dagli inizi si è distinta come un'impresa innovativa, attenta ai dettagli e alle esigenze particolari di ogni cliente. Negli anni ha esteso la propria attività a diversi settori produttivi del paese — l'industria metallurgica, la cogenerazione idroelettrica e il settore petrolifero — affrontando le crisi economiche e andando avanti con un lavoro onesto e dedicato a migliorare giorno dopo giorno il nostro paese.",
    "Continuando con una larga tradición heredada de parte del fundador, la generación de relevo continuamos con el proceso de mejora continua, modernización, adaptabilidad a las nuevas exigencias de un mercado de servicios en donde nuestros clientes requieren que cubramos y rebasemos sus expectativas sobre el servicio que podamos ofrecerles.":
      "Proseguendo una lunga tradizione ereditata dal fondatore, la nuova generazione porta avanti il processo di miglioramento continuo, modernizzazione e adattamento alle nuove esigenze di un mercato dei servizi in cui i nostri clienti si aspettano che soddisfiamo e superiamo le loro aspettative.",
    "foto · fachada / equipo del taller": "foto · facciata / squadra dell'officina",
    "Misión": "Missione",
    "Rehabilitación de equipos con honestidad, eficiencia y calidad.":
      "Ripristino di apparecchiature con onestà, efficienza e qualità.",
    "Somos una empresa dinámica y entusiasta que ofrece a la industria la rehabilitación de motores y generadores eléctricos. Garantizamos el óptimo funcionamiento de los mismos, cubriendo las necesidades de nuestros clientes, trabajadores y proveedores, en la búsqueda constante de la superación de nuestras expectativas. Trabajamos basados en la experiencia, el desarrollo del personal y la actualización tecnológica.":
      "Siamo un'azienda dinamica ed entusiasta che offre all'industria il ripristino di motori e generatori elettrici. Ne garantiamo il funzionamento ottimale, rispondendo alle necessità dei nostri clienti, lavoratori e fornitori, nella costante ricerca di superare le nostre stesse aspettative. Lavoriamo sulla base dell'esperienza, della crescita del personale e dell'aggiornamento tecnologico.",
    "Lo que nos diferencia": "Ciò che ci distingue",
    "+54 años": "+54 anni",
    "Experiencia real en el mercado que respalda cada reparación.":
      "Esperienza reale sul mercato a sostegno di ogni riparazione.",
    "Personal capacitado": "Personale qualificato",
    "Técnicos calificados y una de las mejores infraestructuras de la región.":
      "Tecnici qualificati e una delle migliori strutture della regione.",
    "Control de calidad": "Controllo qualità",
    "Estricto control entre operaciones y atención personalizada.":
      "Controllo rigoroso tra le lavorazioni e assistenza personalizzata.",
    "Hablemos de tu equipo": "Parliamo della tua apparecchiatura",
    "Escríbenos por WhatsApp": "Scrivici su WhatsApp",

    "Hablemos": "Parliamone",
    "Escríbenos por WhatsApp, llámanos o visítanos en el taller en Ciudad Bolívar.":
      "Scrivici su WhatsApp, chiamaci o vieni a trovarci in officina a Ciudad Bolívar.",
    "Dirección": "Indirizzo",
    "Recepción / WhatsApp": "Reception / WhatsApp",
    "Emergencias 24h": "Emergenze 24h",
    "Oficina": "Ufficio",
    "Correo": "E-mail",
    "Correo:": "E-mail:",
    "Horario": "Orari",
    "Lun – Vie · 7:00 a.m. – 12:00 m. y 1:00 p.m. – 3:00 p.m.":
      "Lun – Ven · 7:00 – 12:00 e 13:00 – 15:00",
    "Abrir chat de WhatsApp": "Apri la chat WhatsApp",
    "foto · fachada del taller": "foto · facciata dell'officina",

    "RIF: J-08002579-2": "P. IVA: J-08002579-2",
    "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motores · Generadores · Equipos industriales":
      "© 2026 Talleres Eléctricos Venezolanos, C.A. · Motori · Generatori · Apparecchiature industriali",

    "Animaciones": "Animazioni",
    "Completas": "Complete",
    "Reducidas": "Ridotte",
    "Reducidas detiene la franja y los carruseles automáticos.":
      "Ridotte ferma la fascia e i caroselli automatici.",
    "Idioma": "Lingua",
    "Cambia el idioma o reduce las animaciones aquí.":
      "Cambia lingua o riduci le animazioni qui.",
    "Entendido": "Ho capito",

    /* Equipos en venta */
    "Equipos": "Attrezzature",
    "Equipos en venta": "Attrezzature in vendita",
    "Motores, bombas y generadores en stock": "Motori, pompe e generatori disponibili",
    "Motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores, listos para instalación.":
      "Motori elettrici monofase e trifase, pompe dell'acqua PEARL e CALPEDA, e generatori, pronti per l'installazione.",
    "Todavía no hay equipos publicados": "Non ci sono ancora attrezzature pubblicate",
    "Trabajamos con motores eléctricos monofásicos y trifásicos, bombas de agua PEARL y CALPEDA, y generadores. Si buscas algo puntual, escríbenos y te decimos si lo tenemos o te lo conseguimos.":
      "Lavoriamo con motori elettrici monofase e trifase, pompe dell'acqua PEARL e CALPEDA e generatori. Se cerchi qualcosa di preciso, scrivici e ti diciamo se ce l'abbiamo o se possiamo procurartelo.",
    "Pedir por WhatsApp": "Richiedi su WhatsApp",
    "No se pudo cargar el catálogo de equipos. Revisa tu conexión a internet y recarga la página.": "Non è stato possibile caricare il catalogo delle attrezzature. Controlla la connessione a internet e ricarica la pagina.",
    "Administrador": "Amministratore",
    "Agregar equipo": "Aggiungi articolo",
    "Foto (opcional)": "Foto (facoltativa)",
    "Guardar equipo": "Salva articolo",

    /* Modal de acceso */
    "Iniciar sesión": "Accedi",
    "Registrarme": "Registrati",
    "Bienvenido de nuevo": "Bentornato",
    "Crear cuenta": "Crea account",
    "Contraseña": "Password",
    "Entrar": "Accedi",
    "Revisa tu correo para confirmar la cuenta.": "Controlla la tua email per confermare l'account.",
    "¿Olvidaste tu contraseña?": "Hai dimenticato la password?",
    "Si ese correo tiene una cuenta, te enviamos un enlace para cambiar la contraseña. Revisa tu bandeja.": "Se quell'email ha un account, ti abbiamo inviato un link per cambiare la password. Controlla la posta.",
    "Contraseña nueva": "Nuova password",
    "Guardar contraseña": "Salva password",
    "Contraseña actualizada. Ya puedes entrar con ella.": "Password aggiornata. Ora puoi accedere con questa.",
    "Reenviar el correo de confirmación": "Invia di nuovo l'email di conferma",
    "Te reenviamos el correo de confirmación. Revisa tu bandeja.": "Ti abbiamo inviato di nuovo l'email di conferma. Controlla la posta.",
    "Cerrar sesión": "Esci",

    /* Mi equipo */
    "Mi equipo": "La mia attrezzatura",
    "Seguimiento de tu reparación": "Segui la tua riparazione",
    "Aquí ves en qué etapa está tu equipo y las notas que agregue el taller durante el proceso.":
      "Qui vedi a che punto è la tua attrezzatura e le note che l'officina aggiunge durante il processo.",
    "Todavía no tienes equipos en proceso": "Non hai ancora attrezzature in lavorazione",
    "Cuando traigas un equipo a reparar y quede registrado con este correo, vas a ver aquí en qué etapa está.":
      "Quando porterai un'attrezzatura da riparare e verrà registrata con questa email, vedrai qui a che punto è.",
    "Registrar equipo en proceso": "Registra attrezzatura in lavorazione",
    "Correo del cliente": "Email del cliente",
    "Número de servicio": "Numero di servizio",
    "Equipo (ej. Bomba centrífuga 5HP)": "Attrezzatura (es. Pompa centrifuga 5HP)",
    "Registrar": "Registra"
  }

}   /* ---- fin del italiano. El siguiente idioma va aquí, al mismo nivel ---- */

};
