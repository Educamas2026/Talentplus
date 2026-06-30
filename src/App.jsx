import { useState, useCallback } from "react";

// ============================================================
// CATÁLOGO — agrega opciones aquí libremente
// ============================================================
const EXP_LABELS = ["Recién egresado","Menos de 1 año","1–2 años","2–3 años","3–5 años","Más de 5 años"];

// SECTORES — categoría grande → subcategorías (lista completa proporcionada)
const SECTORES = [
  { g: "Agropecuario y rural", i: ["Agricultura","Ganadería","Avicultura","Porcicultura","Piscicultura y acuicultura","Floricultura","Caficultura","Cultivos de frutas y hortalizas","Cultivos de cacao","Cultivos de palma","Silvicultura","Pesca","Agroindustria","Insumos agrícolas","Maquinaria agrícola"] },
  { g: "Alimentos y bebidas", i: ["Producción de alimentos","Procesamiento de alimentos","Panadería y repostería","Lácteos","Cárnicos","Bebidas no alcohólicas","Bebidas alcohólicas","Restaurantes","Catering","Refrigerios y alimentación institucional","Comidas rápidas","Alimentos saludables","Snacks","Conservas","Distribución de alimentos"] },
  { g: "Comercio", i: ["Comercio mayorista","Comercio minorista","Tiendas de barrio","Supermercados","Minimercados","Ferreterías","Papelerías","Droguerías","Distribuidoras","Comercio electrónico","Ventas por catálogo","Importadoras","Exportadoras","Marketplace"] },
  { g: "Textil, confección y moda", i: ["Confección","Textiles","Moda","Calzado","Marroquinería","Uniformes","Ropa deportiva","Accesorios","Bisutería","Diseño de moda","Estampados","Bordados","Producción de merchandising"] },
  { g: "Industria y manufactura", i: ["Manufactura","Metalurgia","Plásticos","Empaques","Muebles","Productos químicos","Productos farmacéuticos","Cosméticos","Papel y cartón","Vidrio","Cerámica","Caucho","Autopartes","Electrodomésticos","Maquinaria y equipos","Producción industrial"] },
  { g: "Construcción e infraestructura", i: ["Construcción de vivienda","Obras civiles","Infraestructura vial","Acueducto y alcantarillado","Remodelaciones","Arquitectura","Ingeniería civil","Diseño de interiores","Materiales de construcción","Acabados","Pintura","Carpintería","Electricidad","Plomería","Mantenimiento locativo"] },
  { g: "Tecnología y software", i: ["Desarrollo de software","Aplicaciones móviles","Páginas web","Inteligencia artificial","Ciencia de datos","Ciberseguridad","Soporte técnico","Infraestructura tecnológica","Cloud computing","Automatización de procesos","Internet de las cosas","Videojuegos","Plataformas educativas","SaaS","Fintech","Govtech","Edtech","Healthtech","Agrotech","Proptech"] },
  { g: "Telecomunicaciones", i: ["Internet","Telefonía móvil","Telefonía fija","Redes","Fibra óptica","Servicios satelitales","Call center","Contact center","Instalación de redes","Soporte de telecomunicaciones"] },
  { g: "Servicios empresariales", i: ["Consultoría","Asesoría empresarial","Contabilidad","Auditoría","Gestión humana","Selección de personal","Outsourcing","Servicios jurídicos","Servicios administrativos","BPO","Servicios generales","Seguridad privada","Aseo empresarial","Mensajería","Gestión documental"] },
  { g: "Educación y formación", i: ["Colegios","Universidades","Institutos técnicos","Formación para el trabajo","Academias","Capacitación empresarial","Educación virtual","Cursos de idiomas","Formación tecnológica","Formación en habilidades blandas","Tutorías","Jardines infantiles","Educación inclusiva"] },
  { g: "Salud y bienestar", i: ["Clínicas","Hospitales","IPS","EPS","Laboratorios clínicos","Odontología","Psicología","Terapias","Medicina ocupacional","Centros de estética","Gimnasios","Bienestar corporativo","Cuidado de adultos mayores","Cuidado domiciliario","Farmacias","Dispositivos médicos"] },
  { g: "Finanzas y seguros", i: ["Bancos","Cooperativas financieras","Microcrédito","Fintech","Seguros","Corredores de seguros","Fondos de inversión","Fiduciarias","Casas de cambio","Leasing","Factoring","Contabilidad financiera","Asesoría tributaria"] },
  { g: "Transporte y logística", i: ["Transporte de carga","Transporte de pasajeros","Logística","Mensajería","Última milla","Bodegaje","Almacenamiento","Distribución","Transporte escolar","Transporte especial","Transporte urbano","Transporte intermunicipal","Puertos","Aeropuertos","Operadores logísticos"] },
  { g: "Turismo, hotelería y entretenimiento", i: ["Hoteles","Hostales","Agencias de viajes","Turismo rural","Ecoturismo","Restaurantes turísticos","Bares","Discotecas","Eventos","Recreación","Parques temáticos","Guías turísticos","Operadores turísticos","Producción de eventos","Entretenimiento familiar"] },
  { g: "Cultura, creatividad y comunicaciones", i: ["Publicidad","Marketing digital","Diseño gráfico","Producción audiovisual","Fotografía","Música","Artes escénicas","Editoriales","Medios de comunicación","Radio","Televisión","Prensa digital","Creación de contenido","Influencer marketing","Animación","Diseño multimedia"] },
  { g: "Energía y medio ambiente", i: ["Energía eléctrica","Energías renovables","Energía solar","Energía eólica","Gas","Petróleo","Minería","Gestión ambiental","Reciclaje","Economía circular","Tratamiento de residuos","Tratamiento de aguas","Consultoría ambiental","Reforestación","Sostenibilidad empresarial"] },
  { g: "Minería e hidrocarburos", i: ["Carbón","Oro","Esmeraldas","Petróleo","Gas natural","Servicios petroleros","Exploración minera","Explotación minera","Maquinaria minera","Seguridad minera","Transporte de minerales"] },
  { g: "Inmobiliario", i: ["Constructoras","Inmobiliarias","Administración de propiedad horizontal","Avalúos","Arriendos","Venta de inmuebles","Proptech","Corretaje inmobiliario","Mantenimiento de inmuebles"] },
  { g: "Automotor", i: ["Venta de vehículos","Talleres mecánicos","Autopartes","Motos","Concesionarios","Lavaderos de carros","Alquiler de vehículos","Transporte automotor","Repuestos","Servicios de diagnóstico"] },
  { g: "Sector público, social y comunitario", i: ["Entidades públicas","Alcaldías","Gobernaciones","Fundaciones","ONG","Cooperación internacional","Organizaciones comunitarias","Asociaciones","Juntas de acción comunal","Programas sociales","Organizaciones juveniles","Organizaciones de mujeres"] },
  { g: "Seguridad y defensa", i: ["Seguridad privada","Vigilancia","Monitoreo","Cámaras de seguridad","Alarmas","Control de acceso","Seguridad informática","Seguridad industrial","Gestión del riesgo"] },
  { g: "Servicios personales", i: ["Peluquerías","Barberías","Estética","Spa","Lavanderías","Reparaciones","Modistería","Cuidado infantil","Cuidado de mascotas","Servicios domésticos","Entrenadores personales"] },
  { g: "Mascotas y veterinaria", i: ["Clínicas veterinarias","Tiendas de mascotas","Alimentos para mascotas","Guarderías caninas","Peluquería canina","Adiestramiento","Servicios funerarios para mascotas"] },
  { g: "Deporte y recreación", i: ["Clubes deportivos","Escuelas deportivas","Gimnasios","Canchas sintéticas","Eventos deportivos","Ropa deportiva","Artículos deportivos","Entrenamiento personalizado","Recreación comunitaria"] },
  { g: "Legal, jurídico y trámites", i: ["Abogados","Notarías","Consultoría legal","Propiedad intelectual","Derecho laboral","Derecho comercial","Trámites empresariales","Gestión de documentos","Asesoría contractual"] },
  { g: "Investigación, innovación y desarrollo", i: ["Centros de investigación","Laboratorios","Innovación empresarial","Transferencia tecnológica","Startups","Incubadoras","Aceleradoras","Consultoría en innovación","Investigación social","Investigación de mercados"] },
  { g: "Servicios para el hogar", i: ["Reparaciones locativas","Electricistas","Plomeros","Carpinteros","Jardinería","Limpieza","Fumigación","Instalación de electrodomésticos","Domótica","Seguridad residencial"] },
  { g: "Economía popular y emprendimientos", i: ["Ventas informales","Emprendimientos familiares","Negocios de barrio","Producción artesanal","Manualidades","Gastronomía casera","Ropa y accesorios","Belleza","Comercio local","Servicios comunitarios"] },
  { g: "Sectores emergentes", i: ["Inteligencia artificial","Automatización","Blockchain","Realidad virtual","Realidad aumentada","Biotecnología","Nanotecnología","Movilidad eléctrica","Energía limpia","Economía plateada","Economía del cuidado","Economía naranja","Economía circular","Plataformas digitales","Trabajo remoto","Ciberseguridad"] },
  { g: "Otros sectores", i: ["Artesanías","Joyería","Religioso","Funerario","Editorial","Logística humanitaria","Gestión de riesgos","Cooperativas","Asociaciones productivas","Cámaras de comercio","Gremios","Servicios sindicales","Actividades políticas","Actividades culturales comunitarias"] },
  { g: "Otro", i: [] }, // input libre
];

// ÁREAS de la empresa — categoría grande → subcategorías
const AREAS = [
  { g: "Dirección / Gerencia", i: ["Dirección general","Gerencia estratégica","Toma de decisiones","Planeación corporativa"] },
  { g: "Administración", i: ["Procesos internos","Gestión documental","Coordinación operativa"] },
  { g: "Finanzas", i: ["Presupuesto","Pagos y cobros","Flujo de caja","Control financiero"] },
  { g: "Contabilidad", i: ["Registro contable","Estados financieros","Facturación","Obligaciones tributarias"] },
  { g: "Talento Humano", i: ["Selección de personal","Contratación","Nómina","Bienestar laboral","Capacitación"] },
  { g: "Comercial / Ventas", i: ["Búsqueda de clientes","Cierre de ventas","Seguimiento comercial","Cumplimiento de metas"] },
  { g: "Mercadeo / Marketing", i: ["Estrategia de marca","Campañas","Publicidad","Investigación de mercado","Posicionamiento"] },
  { g: "Comunicaciones", i: ["Comunicación interna","Comunicación externa","Redes sociales","Relación con públicos"] },
  { g: "Servicio al Cliente", i: ["Atención de solicitudes","Quejas y reclamos","Soporte al cliente","Fidelización"] },
  { g: "Operaciones", i: ["Ejecución diaria","Coordinación de procesos","Control de recursos"] },
  { g: "Producción", i: ["Fabricación","Control de insumos","Estándares de producción"] },
  { g: "Logística", i: ["Transporte","Entregas","Almacenamiento","Inventarios","Distribución"] },
  { g: "Compras / Abastecimiento", i: ["Compra de insumos","Relación con proveedores","Negociación de precios","Control de calidad"] },
  { g: "Tecnología / Sistemas", i: ["Soporte técnico","Software","Hardware","Seguridad informática","Plataformas digitales"] },
  { g: "Innovación", i: ["Mejora de procesos","Nuevos productos/servicios","Transformación digital","Automatización"] },
  { g: "Calidad", i: ["Verificación de estándares","Mejora continua","Control de procesos"] },
  { g: "Jurídica / Legal", i: ["Contratos","Cumplimiento normativo","Asuntos laborales","Protección legal"] },
  { g: "Planeación / Estrategia", i: ["Diseño de planes","Seguimiento a indicadores","Definición de objetivos"] },
  { g: "Proyectos", i: ["Formulación","Ejecución","Seguimiento","Reportes","Gestión de recursos"] },
  { g: "Alianzas / Relaciones Institucionales", i: ["Convenios","Cooperación","Articulación con entidades"] },
  { g: "Investigación y Desarrollo", i: ["Estudios","Pruebas","Desarrollo de soluciones","Análisis de tendencias"] },
  { g: "Sostenibilidad / Gestión Ambiental", i: ["Manejo de residuos","Uso de recursos","Responsabilidad ambiental"] },
  { g: "Seguridad y Salud en el Trabajo", i: ["Prevención de riesgos","Bienestar físico y mental","SG-SST"] },
  { g: "Mantenimiento", i: ["Mantenimiento de equipos","Infraestructura","Reparaciones"] },
  { g: "Gestión de Datos / Analítica", i: ["Bases de datos","Indicadores","Reportes","Tableros de control"] },
];

const SKILLS = [
  { g: "Frontend", i: ["HTML / CSS","JavaScript","TypeScript","React","Vue.js","Angular","Next.js","Svelte","Tailwind CSS","Figma / Adobe XD","Diseño responsivo","Accesibilidad web (WCAG)"] },
  { g: "Backend", i: ["Node.js","Python (Django / Flask / FastAPI)","Java (Spring Boot)","C# (.NET)","PHP (Laravel)","Ruby on Rails","Go","Rust","APIs REST","GraphQL","Microservicios","Serverless"] },
  { g: "Full Stack", i: ["MERN Stack","MEAN Stack","LAMP Stack","JAMstack","Next.js Full Stack"] },
  { g: "Análisis de datos", i: ["SQL","Excel avanzado","Power BI","Tableau","Looker","Google Analytics","Metabase","ETL y pipelines","Apache Spark","Hadoop"] },
  { g: "Ciencia de datos / IA", i: ["Python (Pandas, NumPy, Scikit-learn)","Machine learning","Deep learning (TensorFlow / PyTorch)","NLP / procesamiento de lenguaje","Computer vision","Estadística aplicada","R","MLOps","LLMs y prompting","Análisis predictivo"] },
  { g: "DevOps / Cloud", i: ["AWS","Google Cloud Platform","Microsoft Azure","Docker","Kubernetes","CI/CD (GitHub Actions, Jenkins)","Terraform / IaC","Linux / Bash","Git / GitHub / GitLab","Datadog / Grafana"] },
  { g: "Bases de datos", i: ["PostgreSQL","MySQL","MongoDB","Redis","Cassandra","Elasticsearch","Firebase","BigQuery","Snowflake"] },
  { g: "Desarrollo móvil", i: ["React Native","Flutter","Swift (iOS)","Kotlin (Android)"] },
  { g: "Gestión y metodologías", i: ["Scrum / Agile","Kanban","Jira / Confluence","PMP","ITIL","Lean / Six Sigma","SAP","Salesforce","HubSpot CRM"] },
  { g: "Marketing y negocio", i: ["SEO / SEM","Google Ads / Meta Ads","Email marketing","Marketing de contenidos","E-commerce (Shopify, WooCommerce)","CRO y A/B testing"] },
];

const BLANDAS = ["Liderazgo","Trabajo en equipo","Comunicación efectiva","Pensamiento crítico","Adaptabilidad","Creatividad e innovación","Orientación a resultados","Autonomía y autogestión","Empatía","Resolución de problemas","Gestión del tiempo","Toma de decisiones","Negociación","Inteligencia emocional","Pensamiento analítico"];
const FORMACION = ["Indiferente","Técnico","Tecnólogo","Profesional (pregrado)","Especialización","Maestría","Doctorado"];
const INGLES = [{c:"N/A",l:"No req.",d:"—"},{c:"A1",l:"A1",d:"Básico"},{c:"A2",l:"A2",d:"Elemental"},{c:"B1",l:"B1",d:"Intermedio"},{c:"B2",l:"B2",d:"Int. alto"},{c:"C1",l:"C1",d:"Avanzado"},{c:"C2",l:"C2",d:"Dominio"}];
const DISC_TIPOS = ["Cualquier tipo","Física / motriz","Visual","Auditiva","Cognitiva","Psicosocial","Múltiple"];
const MODALIDADES = ["Presencial","Híbrido","Remoto","Indiferente"];
const CONTRATOS = ["Término indefinido","Término fijo","Prestación de servicios","Pasantía / práctica","Tiempo parcial"];
const SALARIOS = ["Hasta $2.000.000","$2.000.000 – $4.000.000","$4.000.000 – $7.000.000","$7.000.000 – $12.000.000","Más de $12.000.000","A convenir"];
const TAMANIOS = ["Startup (1–10)","Pequeña (11–50)","Mediana (51–200)","Grande (200+)"];

// ── Egresados de demo ────────────────────────────────────────
const DEMO_EGRESADOS = [
  { nombre:"Laura Martínez", carrera:"Ingeniería de sistemas", skills:"Python, SQL, Machine learning", exp:"1–2 años", ciudad:"Bogotá", modalidad:"Híbrido", fecha:"2026-06-01" },
  { nombre:"Carlos Pérez", carrera:"Administración de empresas", skills:"Excel avanzado, Power BI, HubSpot", exp:"2–3 años", ciudad:"Medellín", modalidad:"Presencial", fecha:"2026-05-15" },
  { nombre:"Sofía Ramírez", carrera:"Diseño gráfico e interactivo", skills:"Figma, Adobe XD, CSS, UX Research", exp:"Menos de 1 año", ciudad:"Cali", modalidad:"Remoto", fecha:"2026-06-10" },
  { nombre:"Andrés Torres", carrera:"Ingeniería electrónica", skills:"JavaScript, React, Node.js, AWS", exp:"1–2 años", ciudad:"Bogotá", modalidad:"Indiferente", fecha:"2026-06-18" },
  { nombre:"Valentina López", carrera:"Marketing digital", skills:"SEO, SEM, Google Ads, Analytics, Inglés B2", exp:"2–3 años", ciudad:"Barranquilla", modalidad:"Remoto", fecha:"2026-06-20" },
];

// ── Helpers ──────────────────────────────────────────────────
const ini = (n) => n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const loadDB = (k, def) => { try { return JSON.parse(localStorage.getItem(k) || "null") || def; } catch { return def; } };
const saveDB = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ── URL de Google Sheets (fija, no editable por el usuario) ──
const SHEETS_URL = "https://script.google.com/macros/s/AKfycby1n-oE3aBOYXU6aIoycVVKMe8NcXrZPfeBLQrYyYVbpK540Yw1gr9cuPAqKed8DyMc/exec";

// ── Flag para mostrar/ocultar IA (código queda listo para reactivar) ──
const MOSTRAR_IA = false;

// ── Estado inicial empresa ───────────────────────────────────
const FORM_INIT = {
  nombre:"", sectorCategoria:"", sector:"", sectorOtro:"", tamanio:"", ciudad:"",
  areas:[], areaVacantes:{}, // { "Comercial / Ventas": { cantidad: 3, cargos: ["...","...","..."] } }
  skills:[], blandas:[],
  exp:0, modalidad:"Indiferente", contrato:"Término indefinido", salario:"A convenir",
  formacion:"Indiferente", ingles:"N/A",
  pcd:"No", cert:"No", tipoDisc:"Cualquier tipo",
  contexto:"",
};

// ────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("empresa");
  const [form, setForm]         = useState(FORM_INIT);
  const [aiOut, setAiOut]       = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast]       = useState({ msg:"", type:"ok", target:"" });
  const [busqArea, setBusqArea] = useState("");
  const [busqSkill, setBusqSkill] = useState("");
  const [areaAbierta, setAreaAbierta] = useState(null); // qué categoría de área está desplegada

  const [empresas, setEmpresas] = useState(() => loadDB("em_empresas", []));
  const [egresados, setEgresados] = useState(() => loadDB("em_egresados", DEMO_EGRESADOS));

  const [matchIdx, setMatchIdx]     = useState(-1);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);

  // sheetsUrl now hardcoded as SHEETS_URL constant above

  // Egresado form
  const [egForm, setEgForm] = useState({ nombre:"", carrera:"", skills:"", exp:"Sin experiencia", ciudad:"", modalidad:"Presencial" });

  // ── Helpers de estado ──────────────────────────────────────
  const setF = (k, v) => setForm(p => ({...p, [k]: v}));
  const toggleArr = (k, v) => setForm(p => ({...p, [k]: p[k].includes(v) ? p[k].filter(x=>x!==v) : [...p[k], v]}));

  // Sector: elegir categoría grande → resetea subcategoría elegida
  const elegirCategoriaSector = (cat) => {
    setForm(p => ({...p, sectorCategoria: cat, sector: "", sectorOtro: ""}));
  };
  const elegirSubSector = (sub) => setF("sector", sub);

  // Área: toggle de selección de área grande. Al activarla, se abre para preguntar vacantes.
  const toggleAreaGrande = (g) => {
    setForm(p => {
      const yaSeleccionada = p.areas.includes(g);
      let nuevasAreas = yaSeleccionada ? p.areas.filter(a=>a!==g) : [...p.areas, g];
      let nuevoVac = {...p.areaVacantes};
      if (yaSeleccionada) delete nuevoVac[g];
      else nuevoVac[g] = { cantidad: 1, cargos: [""] };
      return {...p, areas: nuevasAreas, areaVacantes: nuevoVac};
    });
    setAreaAbierta(prev => prev === g ? null : g);
  };

  const setCantidadVacantes = (g, cantidad) => {
    setForm(p => {
      const actual = p.areaVacantes[g] || { cantidad:1, cargos:[""] };
      let cargos = [...actual.cargos];
      if (cantidad > cargos.length) { while (cargos.length < cantidad) cargos.push(""); }
      else cargos = cargos.slice(0, cantidad);
      return {...p, areaVacantes: {...p.areaVacantes, [g]: { cantidad, cargos }}};
    });
  };

  const setCargoVacante = (g, idx, valor) => {
    setForm(p => {
      const actual = p.areaVacantes[g] || { cantidad:1, cargos:[""] };
      const cargos = [...actual.cargos];
      cargos[idx] = valor;
      return {...p, areaVacantes: {...p.areaVacantes, [g]: { ...actual, cargos }}};
    });
  };
  const showToast = (msg, type="ok", target="global") => {
    setToast({msg, type, target});
    setTimeout(() => setToast({msg:"", type:"ok", target:""}), 3500);
  };

  const saveEmpresas = (arr) => { setEmpresas(arr); saveDB("em_empresas", arr); };
  const saveEgresados = (arr) => { setEgresados(arr); saveDB("em_egresados", arr); };

  // ── IA: generar perfil ─────────────────────────────────────
  const generarPerfil = async () => {
    if (!form.nombre || !form.sector) { alert("Completa al menos el nombre y el sector."); return; }
    setAiLoading(true); setAiOut("");
    const prompt = `Eres experto en RRHH para Educamás Colombia. Genera un perfil de talento detallado.

EMPRESA: ${form.nombre} | Sector: ${form.sector} | Tamaño: ${form.tamanio||"N/E"} | Ciudad: ${form.ciudad||"N/E"}
Áreas: ${form.areas.join(", ")||"no especificado"}
Skills técnicas: ${form.skills.join(", ")||"no especificado"}
Habilidades blandas: ${form.blandas.join(", ")||"no especificado"}
Experiencia: ${EXP_LABELS[form.exp]} | Modalidad: ${form.modalidad} | Contrato: ${form.contrato} | Salario: ${form.salario}
Nivel de formación: ${form.formacion} | Inglés: ${form.ingles}
Vacante PcD: ${form.pcd} | Cert. discapacidad: ${form.cert} | Tipo discapacidad: ${form.pcd==="Sí"?form.tipoDisc:"N/A"}
Contexto: ${form.contexto||"No proporcionado"}

Genera en texto plano (sin asteriscos ni markdown) con estas secciones:
PERFIL DEL CARGO IDEAL
COMPETENCIAS CLAVE (5 numeradas)
NIVEL DE SENIORIDAD RECOMENDADO
INGLÉS Y COMUNICACIÓN (según nivel ${form.ingles})
${form.pcd==="Sí"?"INCLUSIÓN Y ACCESIBILIDAD\n":""}SEÑALES DE ALERTA
RECOMENDACIÓN DE BÚSQUEDA EN COLOMBIA
Máximo 280 palabras.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setAiOut(data.content?.find(b => b.type === "text")?.text || "Sin respuesta.");
    } catch { setAiOut("Error al conectar con la IA."); }
    setAiLoading(false);
  };

  // ── Guardar empresa ────────────────────────────────────────
  const guardarEmpresa = () => {
    const sectorFinal = form.sector === "" && form.sectorOtro ? form.sectorOtro : form.sector;
    const vacantesTexto = Object.entries(form.areaVacantes)
      .map(([area, v]) => `${area} (${v.cantidad}): ${v.cargos.filter(Boolean).join(", ")||"sin nombrar"}`)
      .join(" | ");
    const emp = {
      ...form,
      sectorCategoria: form.sectorCategoria,
      sector: sectorFinal,
      areas: form.areas.join(" | "),
      vacantes: vacantesTexto,
      skills: form.skills.join(" | "), blandas: form.blandas.join(" | "),
      exp: EXP_LABELS[form.exp], perfil_ia: aiOut, fecha: new Date().toLocaleDateString("es-CO"),
    };
    const arr = [...empresas];
    const idx = arr.findIndex(e => e.nombre === emp.nombre);
    if (idx >= 0) arr[idx] = emp; else arr.push(emp);
    saveEmpresas(arr);
    fetch(`${SHEETS_URL}?${new URLSearchParams({action:"guardarEmpresa",data:JSON.stringify(emp)})}`).catch(()=>{});
    showToast("✓ Empresa guardada correctamente.", "ok", "empresa");
  };

  // ── Agregar egresado ───────────────────────────────────────
  const agregarEgresado = () => {
    if (!egForm.nombre.trim()) { alert("Ingresa el nombre del egresado."); return; }
    const eg = { ...egForm, fecha: new Date().toLocaleDateString("es-CO") };
    const arr = [...egresados, eg];
    saveEgresados(arr);
    fetch(`${SHEETS_URL}?${new URLSearchParams({action:"guardarEgresado",data:JSON.stringify(eg)})}`).catch(()=>{});
    setEgForm({ nombre:"", carrera:"", skills:"", exp:"Sin experiencia", ciudad:"", modalidad:"Presencial" });
    showToast("✓ Egresado registrado.", "ok", "egresados");
  };

  // ── Sincronizar desde Sheets ───────────────────────────────
  const sincronizar = async () => {
    try {
      const res = await fetch(`${SHEETS_URL}?action=leerEgresados`);
      const data = await res.json();
      if (Array.isArray(data)) { saveEgresados(data); showToast("✓ Egresados sincronizados.", "ok", "egresados"); }
    } catch { showToast("Error al sincronizar.", "err", "egresados"); }
  };

  // ── Matching ───────────────────────────────────────────────
  const hacerMatching = async () => {
    if (matchIdx < 0 || !egresados.length) return;
    setMatchLoading(true); setMatchResults([]);
    const emp = empresas[matchIdx];
    const lista = egresados.map((e,i) => `${i+1}. ${e.nombre} | ${e.carrera||""} | Skills: ${e.skills||""} | Exp: ${e.exp||""} | Ciudad: ${e.ciudad||""} | Modalidad: ${e.modalidad||""}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content:
          `Analiza compatibilidad empresa-egresados para Educamás Colombia.
EMPRESA: ${emp.nombre} | Sector: ${emp.sector} | Áreas: ${emp.areas} | Skills: ${emp.skills} | Exp: ${emp.exp} | Modalidad: ${emp.modalidad} | Inglés: ${emp.ingles||"N/A"} | PcD: ${emp.pcd}
CANDIDATOS:\n${lista}
Devuelve SOLO JSON array válido sin texto extra: [{"indice":0,"score":85,"nivel":"alto","razon":"razón en una línea"}]
"nivel": "alto"(>70), "medio"(40-70), "bajo"(<40). Ordena de mayor a menor score.` }] }),
      });
      const data = await res.json();
      let text = data.content?.find(b => b.type === "text")?.text || "[]";
      text = text.replace(/```json|```/g, "").trim();
      setMatchResults(JSON.parse(text));
    } catch { showToast("Error al procesar el matching.", "err", "matching"); }
    setMatchLoading(false);
  };

  // ── Exportar CSV ────────────────────────────────────────────
  const exportarCSV = (filename, headers, rows) => {
    const BOM = "\uFEFF";
    const csv = BOM + [headers, ...rows].map(r => r.map(c => `"${(c||"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = filename; a.click();
  };

  const exportarEgresados = () => {
    if (!egresados.length) { alert("No hay egresados para exportar."); return; }
    exportarCSV("egresados_educamas.csv",
      ["Nombre","Carrera","Habilidades","Experiencia","Ciudad","Modalidad","Fecha"],
      egresados.map(e=>[e.nombre,e.carrera,e.skills,e.exp,e.ciudad,e.modalidad,e.fecha])
    );
  };

  const exportarEmpresas = () => {
    if (!empresas.length) { alert("No hay empresas para exportar."); return; }
    exportarCSV("empresas_educamas.csv",
      ["Nombre","Sector","Tamaño","Ciudad","Áreas","Skills","Blandas","Experiencia","Modalidad","Contrato","Salario","Formación","Inglés","PcD","Cert.Disc","TipoDisc","Contexto","Perfil IA","Fecha"],
      empresas.map(e=>[e.nombre,e.sector,e.tamanio,e.ciudad,e.areas,e.skills,e.blandas,e.exp,e.modalidad,e.contrato,e.salario,e.formacion,e.ingles,e.pcd,e.cert_disc,e.tipo_disc,e.contexto,e.perfil_ia,e.fecha])
    );
  };

  // ── Probar conexión ────────────────────────────────────────
  const probarConexion = async () => {
    try { await fetch(`${SHEETS_URL}?action=ping`); showToast("✓ Conexión exitosa.", "ok", "config"); }
    catch { showToast("No se pudo conectar.", "err", "config"); }
  };

  // ── Toast helper ───────────────────────────────────────────
  const Toast = ({ target }) => toast.target === target && toast.msg ? (
    <div className={`em-toast ${toast.type}`} style={{marginTop:12}}>{toast.msg}</div>
  ) : null;

  // ── Chip components ────────────────────────────────────────
  const Chip = ({ label, on, onClick, dark=false, sub=null }) => (
    <span className={`em-chip ${on?"on":""} ${dark?"dark":""}`} onClick={onClick} style={{minWidth: sub ? 52 : undefined, textAlign: sub ? "center" : undefined}}>
      {label}
      {sub && <span className="sub">{sub}</span>}
    </span>
  );

  const Toggle = ({ val, current, onChange, icon }) => (
    <div className={`em-toggle ${current===val?"on":""}`} onClick={()=>onChange(val)}>
      <div className="em-toggle-icon">{icon}</div>
      <div className="em-toggle-lbl">{val}</div>
    </div>
  );

  // ── Filtrar áreas y skills ─────────────────────────────────
  const areasFilt = AREAS.map(g => ({...g, i: g.i.filter(x => !busqArea || x.toLowerCase().includes(busqArea.toLowerCase()))})).filter(g=>g.i.length);
  const skillsFilt = SKILLS.map(g => ({...g, i: g.i.filter(x => !busqSkill || x.toLowerCase().includes(busqSkill.toLowerCase()))})).filter(g=>g.i.length);

  // ════════════════════════════════════════════════════════════
  return (
    <div>
      {/* HEADER */}
      <header className="em-header">
        <div>
          <div className="em-logo"><span className="l">Educa</span><span className="b">más</span></div>
          <div className="em-header-sub">Plataforma de conexión de talento</div>
        </div>
        <div className="em-header-stat">
          <strong>{empresas.length}</strong>empresas registradas
        </div>
      </header>

      {/* TABS */}
      <div className="em-tabs">
        {[["empresa","📋 Empresa"],["egresados","👥 Egresados"],["matching","🔗 Matching"]].map(([k,l])=>(
          <button key={k} className={`em-tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ══ EMPRESA ══════════════════════════════════════════════ */}
      <div className={`em-page ${tab==="empresa"?"active":""}`}>
        <div className="em-hero" style={{margin:"-24px -24px 20px",padding:"28px 24px"}}>
          <h1>Mapeo de necesidades de talento</h1>
          <p>Completa el formulario · la IA genera el perfil de talento ideal para tu empresa.</p>
        </div>

        {/* 01 Datos */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">01</div><span className="em-card-title">Datos de la empresa</span></div>
          <div className="em-card-body">
            <div className="g2">
              <div className="em-field"><label className="em-label">Nombre de la empresa</label><input className="em-inp" placeholder="Empresa ABC S.A.S." value={form.nombre} onChange={e=>setF("nombre",e.target.value)}/></div>
              <div className="em-field"><label className="em-label">Categoría del sector</label>
                <select className="em-inp" value={form.sectorCategoria} onChange={e=>elegirCategoriaSector(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {SECTORES.map(s=><option key={s.g} value={s.g}>{s.g}</option>)}
                </select>
              </div>

              {/* Subcategoría — solo aparece si hay categoría elegida y NO es "Otro" */}
              {form.sectorCategoria && form.sectorCategoria !== "Otro" && (
                <div className="em-field" style={{gridColumn:"1 / -1"}}>
                  <label className="em-label">Subcategoría — {form.sectorCategoria}</label>
                  <select className="em-inp" value={form.sector} onChange={e=>elegirSubSector(e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {SECTORES.find(s=>s.g===form.sectorCategoria)?.i.map(x=><option key={x}>{x}</option>)}
                  </select>
                </div>
              )}

              {/* Input libre — solo si elige "Otro" */}
              {form.sectorCategoria === "Otro" && (
                <div className="em-field" style={{gridColumn:"1 / -1"}}>
                  <label className="em-label">Escribe el sector de tu empresa</label>
                  <input className="em-inp" placeholder="Describe el sector..." value={form.sectorOtro} onChange={e=>setF("sectorOtro",e.target.value)}/>
                </div>
              )}

              <div className="em-field"><label className="em-label">Tamaño</label>
                <select className="em-inp" value={form.tamanio} onChange={e=>setF("tamanio",e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {TAMANIOS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="em-field"><label className="em-label">Ciudad / País</label><input className="em-inp" placeholder="Bogotá, Colombia" value={form.ciudad} onChange={e=>setF("ciudad",e.target.value)}/></div>
            </div>
          </div>
        </div>

        {/* 02 Áreas */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">02</div><span className="em-card-title">Áreas que necesitan refuerzo</span></div>
          <div className="em-card-body">
            <p style={{fontSize:12,color:"var(--gm)",marginBottom:10}}>Selecciona el área. Si tiene vacantes abiertas, te preguntamos cuántas y para qué cargos.</p>
            <div className="em-chips">
              {AREAS.map(g=><Chip key={g.g} label={g.g} on={form.areas.includes(g.g)} onClick={()=>toggleAreaGrande(g.g)}/>)}
            </div>

            {/* Panel de vacantes por área seleccionada */}
            {form.areas.filter(a => areaAbierta === a || form.areaVacantes[a]).map(g => (
              <div key={g} style={{marginTop:14,background:"#FFFBE6",border:"1.5px solid var(--y)",borderRadius:"var(--r)",padding:14}}>
                <div style={{fontSize:13,fontWeight:900,marginBottom:8}}>{g}</div>

                {/* Subcategorías de esta área, informativas */}
                <div className="em-chips" style={{marginBottom:12}}>
                  {AREAS.find(a=>a.g===g)?.i.map(sub=><span key={sub} className="em-tag" style={{background:"#fff"}}>{sub}</span>)}
                </div>

                <div className="em-field" style={{maxWidth:220,marginBottom:10}}>
                  <label className="em-label">¿Cuántas vacantes tienen?</label>
                  <input type="number" min={1} max={20} className="em-inp"
                    value={form.areaVacantes[g]?.cantidad || 1}
                    onChange={e=>setCantidadVacantes(g, Math.max(1, parseInt(e.target.value)||1))}/>
                </div>

                {/* Si son más de 2, pedir nombre de cargo por cada vacante */}
                {(form.areaVacantes[g]?.cantidad || 1) > 2 ? (
                  <div>
                    <label className="em-label" style={{display:"block",marginBottom:6}}>Nombre de cada cargo</label>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {(form.areaVacantes[g]?.cargos || []).map((c,idx)=>(
                        <input key={idx} className="em-inp" placeholder={`Cargo vacante ${idx+1}`} value={c}
                          onChange={e=>setCargoVacante(g, idx, e.target.value)}/>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="em-field">
                    <label className="em-label">Nombre del cargo</label>
                    <input className="em-inp" placeholder="Ej: Analista de datos" value={form.areaVacantes[g]?.cargos?.[0] || ""}
                      onChange={e=>setCargoVacante(g, 0, e.target.value)}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 03 Skills */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">03</div><span className="em-card-title">Habilidades técnicas requeridas</span></div>
          <div className="em-card-body">
            <input className="em-chip-search" placeholder="🔍 Buscar skill..." value={busqSkill} onChange={e=>setBusqSkill(e.target.value)}/>
            {skillsFilt.map(g=>(
              <div key={g.g}><div className="em-group-label">{g.g}</div>
                <div className="em-chips">{g.i.map(x=><Chip key={x} label={x} on={form.skills.includes(x)} onClick={()=>toggleArr("skills",x)}/>)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 04 Blandas */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">04</div><span className="em-card-title">Habilidades blandas importantes</span></div>
          <div className="em-card-body">
            <div className="em-chips">{BLANDAS.map(x=><Chip key={x} label={x} on={form.blandas.includes(x)} onClick={()=>toggleArr("blandas",x)}/>)}</div>
          </div>
        </div>

        {/* 05 Condiciones */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">05</div><span className="em-card-title">Condiciones laborales</span></div>
          <div className="em-card-body">
            <div className="g2">
              <div className="em-field"><label className="em-label">Nivel de experiencia</label>
                <div className="em-range-row">
                  <input type="range" min="0" max="5" value={form.exp} onChange={e=>setF("exp",parseInt(e.target.value))}/>
                  <span className="em-range-val">{EXP_LABELS[form.exp]}</span>
                </div>
              </div>
              <div className="em-field"><label className="em-label">Modalidad</label>
                <select className="em-inp" value={form.modalidad} onChange={e=>setF("modalidad",e.target.value)}>
                  {MODALIDADES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="em-field"><label className="em-label">Tipo de contrato</label>
                <select className="em-inp" value={form.contrato} onChange={e=>setF("contrato",e.target.value)}>
                  {CONTRATOS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="em-field"><label className="em-label">Rango salarial (COP/mes)</label>
                <select className="em-inp" value={form.salario} onChange={e=>setF("salario",e.target.value)}>
                  {SALARIOS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 06 Formación */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">06</div><span className="em-card-title">Nivel de formación requerido</span></div>
          <div className="em-card-body">
            <div className="em-chips">{FORMACION.map(x=><Chip key={x} label={x} on={form.formacion===x} onClick={()=>setF("formacion",x)}/>)}</div>
          </div>
        </div>

        {/* 07 Inglés */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">07</div><span className="em-card-title">Nivel de inglés requerido</span></div>
          <div className="em-card-body">
            <div className="em-chips">{INGLES.map(x=><Chip key={x.c} label={x.l} sub={x.d} on={form.ingles===x.c} dark onClick={()=>setF("ingles",x.c)}/>)}</div>
          </div>
        </div>

        {/* 08 Inclusión */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">08</div><span className="em-card-title">Inclusión y discapacidad</span></div>
          <div className="em-card-body">
            <div className="em-incl">
              <div className="em-incl-head">
                <div className="em-incl-icon">♿</div>
                <div><div className="em-incl-title">Política de inclusión laboral</div><div className="em-incl-sub">Indica si la vacante tiene consideraciones de accesibilidad</div></div>
              </div>
              <div className="g2" style={{marginBottom:16}}>
                <div className="em-field"><label className="em-label" style={{color:"#7A5A00"}}>¿Vacante para persona con discapacidad?</label>
                  <div className="em-toggle-g">
                    <Toggle val="Sí" current={form.pcd} onChange={v=>setF("pcd",v)} icon="✓"/>
                    <Toggle val="No" current={form.pcd} onChange={v=>setF("pcd",v)} icon="✕"/>
                    <Toggle val="Indiferente" current={form.pcd} onChange={v=>setF("pcd",v)} icon="–"/>
                  </div>
                </div>
                <div className="em-field"><label className="em-label" style={{color:"#7A5A00"}}>¿Requiere certificación de discapacidad?</label>
                  <div className="em-toggle-g">
                    <Toggle val="Sí" current={form.cert} onChange={v=>setF("cert",v)} icon="✓"/>
                    <Toggle val="No" current={form.cert} onChange={v=>setF("cert",v)} icon="✕"/>
                  </div>
                </div>
              </div>
              <div className="em-field">
                <label className="em-label" style={{color:"#7A5A00",marginBottom:6}}>Tipo de discapacidad aceptada</label>
                <div className={form.pcd !== "Sí" ? "em-disabled" : ""}>
                  <div className="em-chips">
                    {DISC_TIPOS.map(x=>(
                      <span key={x} className={`em-chip ${form.tipoDisc===x?"on":""}`}
                        style={{borderColor:"#e0c860", color:"#7A5A00", ...(form.tipoDisc===x?{background:"var(--b)",borderColor:"var(--b)",color:"var(--y)"}:{})}}
                        onClick={()=>form.pcd==="Sí"&&setF("tipoDisc",x)}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`em-nota ${form.pcd==="Sí"?"si":"no"}`}>
                {form.pcd==="Sí" ? "✅ Vacante dirigida especialmente a personas con discapacidad. Se priorizarán candidatos con el perfil seleccionado." : "ℹ️ La vacante no está dirigida específicamente a PcD, pero puede postularse cualquier candidato que cumpla el perfil."}
              </div>
            </div>
          </div>
        </div>

        {/* 09 Contexto */}
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">09</div><span className="em-card-title">Contexto del cargo ✦ Usado por IA</span></div>
          <div className="em-card-body">
            <textarea className="em-inp" rows={4} placeholder="Describe el proyecto o desafío donde necesitas apoyo..." value={form.contexto} onChange={e=>setF("contexto",e.target.value)}/>
          </div>
        </div>

        <div className="em-btn-row">
          <button className="em-btn ghost" onClick={()=>{setForm(FORM_INIT);setAiOut("");}}>Limpiar</button>
          {MOSTRAR_IA && (
            <button className="em-btn primary" onClick={generarPerfil} disabled={aiLoading}>
              {aiLoading ? <><span className="em-spinner"/> Analizando...</> : "✦ Analizar con IA"}
            </button>
          )}
          <button className="em-btn primary" onClick={guardarEmpresa}>💾 Guardar en base de datos</button>
        </div>

        {MOSTRAR_IA && (aiOut || aiLoading) && (
          <div className="em-ai-block">
            <div style={{marginBottom:12}}><span className="em-ai-badge">✦ Perfil generado por IA</span></div>
            <div className="em-ai-out">{aiLoading ? "Generando perfil de talento..." : aiOut}</div>
          </div>
        )}
        <Toast target="empresa"/>
      </div>

      {/* ══ EGRESADOS ════════════════════════════════════════════ */}
      <div className={`em-page ${tab==="egresados"?"active":""}`}>
        <div className="em-stats">
          <div className="em-stat"><div className="em-stat-n">{egresados.length}</div><div className="em-stat-l">Egresados</div></div>
          <div className="em-stat"><div className="em-stat-n">{new Set(egresados.map(e=>e.ciudad).filter(Boolean)).size}</div><div className="em-stat-l">Ciudades</div></div>
          <div className="em-stat"><div className="em-stat-n">{new Set(egresados.map(e=>e.carrera).filter(Boolean)).size}</div><div className="em-stat-l">Carreras</div></div>
        </div>

        <div className="em-upload" onClick={sincronizar}>
          <div style={{fontSize:28,color:"var(--y)",marginBottom:6}}>📥</div>
          <p style={{fontSize:14,fontWeight:700}}>Cargar egresados desde Google Sheets</p>
          <p style={{fontSize:12,color:"var(--gm)",marginTop:4}}>Clic para sincronizar · requiere URL configurada en Config</p>
        </div>

        <div className="em-eg-table">
          <div className="em-eg-banner">
            <span>Listado de egresados · {egresados.length} registros</span>
            <button className="em-btn green" style={{padding:"5px 12px",fontSize:12}} onClick={exportarEgresados}>📊 Exportar Excel</button>
          </div>
          {egresados.length === 0 ? (
            <div style={{padding:20,textAlign:"center",color:"var(--gm)",fontSize:13}}>Sin registros aún. Agrega egresados abajo.</div>
          ) : egresados.map((e,i) => (
            <div key={i} className="em-eg-row">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="em-eg-init">{ini(e.nombre)}</div>
                <div><div className="em-eg-name">{e.nombre}</div><div className="em-eg-meta">{e.carrera} · {e.ciudad}</div></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,fontWeight:700}}>{e.exp}</div>
                <div className="em-eg-meta">{e.modalidad}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">+</div><span className="em-card-title">Agregar egresado manualmente</span></div>
          <div className="em-card-body">
            <div className="g2" style={{marginBottom:12}}>
              <div className="em-field"><label className="em-label">Nombre completo</label><input className="em-inp" placeholder="María García" value={egForm.nombre} onChange={e=>setEgForm(p=>({...p,nombre:e.target.value}))}/></div>
              <div className="em-field"><label className="em-label">Carrera / programa</label><input className="em-inp" placeholder="Ingeniería de sistemas" value={egForm.carrera} onChange={e=>setEgForm(p=>({...p,carrera:e.target.value}))}/></div>
              <div className="em-field"><label className="em-label">Habilidades técnicas (separadas por coma)</label><input className="em-inp" placeholder="Python, SQL, Power BI" value={egForm.skills} onChange={e=>setEgForm(p=>({...p,skills:e.target.value}))}/></div>
              <div className="em-field"><label className="em-label">Años de experiencia</label>
                <select className="em-inp" value={egForm.exp} onChange={e=>setEgForm(p=>({...p,exp:e.target.value}))}>
                  {["Sin experiencia","Menos de 1 año","1–2 años","3–5 años","Más de 5 años"].map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
              <div className="em-field"><label className="em-label">Ciudad</label><input className="em-inp" placeholder="Medellín" value={egForm.ciudad} onChange={e=>setEgForm(p=>({...p,ciudad:e.target.value}))}/></div>
              <div className="em-field"><label className="em-label">Modalidad preferida</label>
                <select className="em-inp" value={egForm.modalidad} onChange={e=>setEgForm(p=>({...p,modalidad:e.target.value}))}>
                  {MODALIDADES.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div className="em-btn-row" style={{marginTop:0}}>
              <button className="em-btn primary" onClick={agregarEgresado}>👤+ Agregar egresado</button>
            </div>
            <Toast target="egresados"/>
          </div>
        </div>
      </div>

      {/* ══ MATCHING ════════════════════════════════════════════ */}
      <div className={`em-page ${tab==="matching"?"active":""}`}>
        <div className="em-card">
          <div className="em-card-head"><div className="em-step-n">🔗</div><span className="em-card-title">Motor de matching IA</span></div>
          <div className="em-card-body">
            <div className="em-field" style={{marginBottom:16}}>
              <label className="em-label">Selecciona la empresa</label>
              <select className="em-inp" value={matchIdx} onChange={e=>{setMatchIdx(parseInt(e.target.value));setMatchResults([]);}}>
                <option value={-1}>— Elige una empresa registrada —</option>
                {empresas.map((e,i)=><option key={i} value={i}>{e.nombre} · {e.sector}</option>)}
              </select>
            </div>

            {matchIdx >= 0 && (
              <div style={{background:"#FFFBE6",border:"1.5px solid var(--y)",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:16,fontSize:13}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:4}}>
                  <strong>{empresas[matchIdx]?.nombre}</strong>
                  <span style={{background:"var(--y)",color:"var(--b)",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20}}>{empresas[matchIdx]?.sector}</span>
                  {empresas[matchIdx]?.pcd==="Sí" && <span style={{background:"#E6F9EE",color:"#1A7A3C",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,border:"1px solid #1A7A3C"}}>♿ PcD</span>}
                </div>
                <div style={{color:"#555",fontSize:12}}>📍 {empresas[matchIdx]?.ciudad||"—"} · {empresas[matchIdx]?.modalidad} · {empresas[matchIdx]?.exp}</div>
              </div>
            )}

            {matchIdx < 0 ? (
              <div className="em-toast info">ℹ️ Selecciona una empresa para comenzar el análisis de compatibilidad.</div>
            ) : (
              <button className="em-btn primary" onClick={hacerMatching} disabled={matchLoading}>
                {matchLoading ? <><span className="em-spinner"/> Analizando compatibilidad...</> : "✦ Buscar egresados compatibles"}
              </button>
            )}
          </div>
        </div>

        {matchResults.length > 0 && (
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <span style={{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Resultados · {matchResults.length} candidatos</span>
              <span className="em-ai-badge">✦ IA</span>
            </div>
            {matchResults.map((m,i) => {
              const eg = egresados[m.indice];
              if (!eg) return null;
              const cls = m.nivel==="alto"?"hi":m.nivel==="medio"?"mi":"lo";
              const tags = [eg.carrera,eg.ciudad,eg.modalidad,eg.exp].filter(Boolean);
              const stags = (eg.skills||"").split(",").slice(0,4).map(s=>s.trim()).filter(Boolean);
              return (
                <div key={i} className="em-match-card">
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className="em-match-av">{ini(eg.nombre)}</div>
                      <div><div style={{fontWeight:900,fontSize:15}}>{eg.nombre}</div><div style={{fontSize:12,color:"var(--gm)"}}>{eg.carrera}</div></div>
                    </div>
                    <span className={`em-score ${cls}`}>{m.score}%</span>
                  </div>
                  <div className="em-tags">
                    {tags.map(t=><span key={t} className="em-tag">{t}</span>)}
                    {stags.map(s=><span key={s} className="em-tag yellow">{s}</span>)}
                  </div>
                  <div className="em-match-reason">✦ {m.razon}</div>
                </div>
              );
            })}
          </div>
        )}
        <Toast target="matching"/>
      </div>
    </div>
  );
}
