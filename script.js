//  PLAN DE MATERIAS
// ═══════════════════════════════════════════════════

// reqRegular  → deben estar REGULARIZADAS (o aprobadas) para poder cursar
// reqAprobada → deben estar APROBADAS para poder cursar
// Una vez cursada (regular), se puede rendir sin condiciones adicionales.
const materias = [
  { id: 1, nombre: "AM I", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 2, nombre: "Álgebra", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 3, nombre: "Física I", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 4, nombre: "Inglés I", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 5, nombre: "Lógica", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 6, nombre: "Algoritmos", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 7, nombre: "Arquitectura", nivel: 1, reqRegular: [], reqAprobada: [] },
  { id: 8, nombre: "Sist. y Procesos", nivel: 1, reqRegular: [], reqAprobada: [] },

  { id: 9, nombre: "AM II", nivel: 2, reqRegular: [1, 2], reqAprobada: [] },
  { id: 10, nombre: "Física II", nivel: 2, reqRegular: [1, 3], reqAprobada: [] },
  { id: 11, nombre: "Ing. y Sociedad", nivel: 2, reqRegular: [], reqAprobada: [] },
  { id: 12, nombre: "Inglés II", nivel: 2, reqRegular: [4], reqAprobada: [] },
  { id: 13, nombre: "Sintaxis", nivel: 2, reqRegular: [5, 6], reqAprobada: [] },
  { id: 14, nombre: "Paradigmas", nivel: 2, reqRegular: [5, 6], reqAprobada: [] },
  { id: 15, nombre: "S.O.", nivel: 2, reqRegular: [7], reqAprobada: [] },
  { id: 16, nombre: "ASI", nivel: 2, reqRegular: [6, 8], reqAprobada: [] },

  { id: 17, nombre: "Probabilidad", nivel: 3, reqRegular: [1, 2], reqAprobada: [] },
  { id: 18, nombre: "Economía", nivel: 3, reqRegular: [], reqAprobada: [1, 2] },
  { id: 19, nombre: "Bases de Datos", nivel: 3, reqRegular: [13, 16], reqAprobada: [5, 6] },
  { id: 20, nombre: "Desarrollo", nivel: 3, reqRegular: [14, 16], reqAprobada: [5, 6] },
  { id: 21, nombre: "Com. Datos", nivel: 3, reqRegular: [], reqAprobada: [3, 7] },
  { id: 22, nombre: "Análisis Num.", nivel: 3, reqRegular: [9], reqAprobada: [1, 2] },
  { id: 23, nombre: "DSI", nivel: 3, reqRegular: [14, 16], reqAprobada: [4, 6, 8] },

  { id: 24, nombre: "Legislación", nivel: 4, reqRegular: [11], reqAprobada: [] },
  { id: 25, nombre: "Ing. Calidad", nivel: 4, reqRegular: [19, 20, 23], reqAprobada: [13, 14] },
  { id: 26, nombre: "Redes", nivel: 4, reqRegular: [15, 21], reqAprobada: [] },
  { id: 27, nombre: "Inv. Operativa", nivel: 4, reqRegular: [17, 22], reqAprobada: [] },
  { id: 28, nombre: "Simulación", nivel: 4, reqRegular: [17], reqAprobada: [9] },
  { id: 29, nombre: "Automatización", nivel: 4, reqRegular: [10, 22], reqAprobada: [9] },
  { id: 30, nombre: "Admin SI", nivel: 4, reqRegular: [18, 23], reqAprobada: [16] },

  { id: 31, nombre: "IA", nivel: 5, reqRegular: [28], reqAprobada: [17, 22] },
  { id: 32, nombre: "Ciencia de Datos", nivel: 5, reqRegular: [28], reqAprobada: [17, 19] },
  { id: 33, nombre: "Sist. Gestión", nivel: 5, reqRegular: [18, 27], reqAprobada: [23] },
  { id: 34, nombre: "Gestión Gerencial", nivel: 5, reqRegular: [24, 30], reqAprobada: [18] },
  { id: 35, nombre: "Seguridad", nivel: 5, reqRegular: [26, 30], reqAprobada: [20, 21] },
  { id: 36, nombre: "Proyecto Final", nivel: 5, reqRegular: [25, 26, 30], reqAprobada: "TODAS" }
];

const materiaMap = {};
materias.forEach(m => materiaMap[m.id] = m);

// ═══════════════════════════════════════════════════
//  ESTADO (localStorage)
// ═══════════════════════════════════════════════════

let estados = JSON.parse(localStorage.getItem("planUTN_v2")) || {};

function guardar() { localStorage.setItem("planUTN_v2", JSON.stringify(estados)); }
function estado(id) { return estados[id] || "pendiente"; }

// ═══════════════════════════════════════════════════
//  VALIDACIONES
//  puedeRegular: reqRegular regularizadas + reqAprobada aprobadas
//  puedeAprobar: solo necesita estar regular
// ═══════════════════════════════════════════════════

function cumpleReqs(m) {
  if (m.reqAprobada === "TODAS") {
    return materias.slice(0, 35).every(x => estado(x.id) === "aprobada");
  }
  const regularOk = m.reqRegular.every(c => {
    const e = estado(c); return e === "regular" || e === "aprobada";
  });
  const aprobadaOk = m.reqAprobada.every(c => estado(c) === "aprobada");
  return regularOk && aprobadaOk;
}

function puedeRegular(m) { return cumpleReqs(m); }
function puedeAprobar(m) { return estado(m.id) === "regular"; }
function esCursable(m) { return estado(m.id) === "pendiente" && cumpleReqs(m); }
function esRendible(m) { return estado(m.id) === "regular"; }

// ═══════════════════════════════════════════════════
//  NODOS
// ═══════════════════════════════════════════════════

const nodes = new vis.DataSet(
  materias.map(m => ({
    id: m.id,
    label: m.nombre,
    level: m.nivel,
    shape: "box",
    borderRadius: 10,
    margin: { top: 11, bottom: 11, left: 16, right: 16 },
    color: { background: "#0f1e35", border: "#1e3252" },
    font: { color: "#4a6080", size: 13, face: "IBM Plex Mono" },
    borderWidth: 1.5,
    shadow: { enabled: true, color: "rgba(0,0,0,0.5)", size: 12, x: 0, y: 4 }
  }))
);

// ═══════════════════════════════════════════════════
//  EDGES con IDs explícitos y tipo
// ═══════════════════════════════════════════════════

let edgeId = 1;
const rawEdges = [];

materias.forEach(m => {
  m.reqRegular.forEach(c => {
    rawEdges.push({ id: edgeId++, from: c, to: m.id, tipo: "regular" });
  });
  if (m.reqAprobada !== "TODAS") {
    m.reqAprobada.forEach(c => {
      rawEdges.push({ id: edgeId++, from: c, to: m.id, tipo: "aprobada" });
    });
  }
});

const edges = new vis.DataSet(rawEdges.map(e => ({
  ...e,
  color: { color: "#1e3252", opacity: 0.8 },
  width: e.tipo === "aprobada" ? 2.2 : 1.4,
  dashes: false,
  arrows: { to: { enabled: true, scaleFactor: 0.45, type: "arrow" } },
  smooth: { type: "cubicBezier", roundness: 0.5 },
  hidden: false
})));

// ═══════════════════════════════════════════════════
//  RED
// ═══════════════════════════════════════════════════

const network = new vis.Network(
  document.getElementById("mynetwork"),
  { nodes, edges },
  {
    layout: {
      hierarchical: {
        enabled: true,
        direction: "UD",
        levelSeparation: 180,
        nodeSpacing: 160,
        treeSpacing: 200,
        sortMethod: "directed"
      }
    },
    physics: false,
    interaction: {
      selectConnectedEdges: false,
      hover: true,
      tooltipDelay: 9999
    },
    nodes: { chosen: false },
    edges: { chosen: false }
  }
);

// ═══════════════════════════════════════════════════
//  MODO DE ÁRBOL (filtro de edges)
// ═══════════════════════════════════════════════════

let edgeMode = "ambos";

function setEdgeMode(mode) {
  edgeMode = mode;
  ["btn-ambos", "btn-regular", "btn-aprobada"].forEach(id => {
    const btn = document.getElementById(id);
    btn.className = "btn";
    btn.setAttribute("aria-pressed", "false");
  });
  const map = { ambos: "btn-ambos", regular: "btn-regular", aprobada: "btn-aprobada" };
  const dNode = document.getElementById(map[mode]);
  dNode.className = "btn active";
  dNode.setAttribute("aria-pressed", "true");
  actualizar();
}

// ═══════════════════════════════════════════════════
//  ANIMACIÓN PULSE (requestAnimationFrame + Visibility)
// ═══════════════════════════════════════════════════

let pulseIDs = new Set();
let animFrame;
let isVisible = !document.hidden;

function renderPulse(timestamp) {
  if (!isVisible) return; // Suspender si pestaña inactiva

  const t = (Math.sin(timestamp / 200) + 1) / 2; // Suave sinte basado en marca de tiempo global

  if (pulseIDs.size > 0) {
    const updates = [];
    pulseIDs.forEach(id => {
      const m = materiaMap[id];
      if (!m) return;
      const isCurs = esCursable(m);
      const isRend = esRendible(m);
      if (!isCurs && !isRend) return;

      const col = isCurs ? "34,211,238" : "16,185,129";
      const glow = 4 + t * 12;

      updates.push({
        id,
        shadow: {
          enabled: true,
          color: `rgba(${col},${0.3 + t * 0.5})`,
          size: glow,
          x: 0, y: 0
        }
      });
    });
    // Se actualizan en un solo batch iterativo por cuadro
    nodes.update(updates);
  }

  animFrame = requestAnimationFrame(renderPulse);
}

// Empezar animación
animFrame = requestAnimationFrame(renderPulse);

// Escuchar cambios de visibilidad
document.addEventListener("visibilitychange", () => {
  isVisible = !document.hidden;
  if (isVisible) {
    animFrame = requestAnimationFrame(renderPulse);
  } else {
    cancelAnimationFrame(animFrame);
  }
});

// ═══════════════════════════════════════════════════
//  CASCADE RESET
//  Cuando una materia vuelve a "pendiente", invalida
//  recursivamente todas las que ya no cumplen requisitos.
// ═══════════════════════════════════════════════════

function cascadeReset(changedId) {
  let changed = true;
  while (changed) {
    changed = false;
    materias.forEach(m => {
      const est = estado(m.id);
      if (est === "pendiente") return;
      // Si ya no cumple los requisitos para haber sido cursada → reset
      if (!cumpleReqs(m)) {
        estados[m.id] = "pendiente";
        changed = true;
      }
    });
  }
}

// ═══════════════════════════════════════════════════
//  CLICK
// ═══════════════════════════════════════════════════

network.on("click", p => {
  if (!p.nodes.length) return;
  const id = p.nodes[0];
  const m = materiaMap[id];
  const actual = estado(id);

  if (actual === "pendiente") {
    if (!puedeRegular(m)) {
      const faltaReg = m.reqRegular
        .filter(c => { const e = estado(c); return e !== "regular" && e !== "aprobada"; })
        .map(c => materiaMap[c].nombre);
      const faltaApr = m.reqAprobada !== "TODAS"
        ? m.reqAprobada.filter(c => estado(c) !== "aprobada").map(c => materiaMap[c].nombre)
        : ["todas las materias"];
      const partes = [];
      if (faltaReg.length) partes.push(`Regularizar: ${faltaReg.join(", ")}`);
      if (faltaApr.length) partes.push(`Aprobar: ${faltaApr.join(", ")}`);
      showToast(partes.join(" · "));
      return;
    }
    estados[id] = "regular";
  }
  else if (actual === "regular") {
    estados[id] = "aprobada";
  }
  else {
    estados[id] = "pendiente";
    cascadeReset(id);
  }

  guardar();
  actualizar();
});

// ═══════════════════════════════════════════════════
//  TOOLTIP
// ═══════════════════════════════════════════════════

const tooltip = document.getElementById("tooltip");

network.on("hoverNode", p => {
  const m = materiaMap[p.node];
  if (!m) return;

  const est = estado(m.id);
  const estadoLabel = { pendiente: "⬜ Pendiente", regular: "🟡 Regular", aprobada: "🟢 Aprobada" }[est] || est;
  const cursable = esCursable(m);
  const estadoLabelClean = est === "aprobada" ? "Aprobada" : est === "regular" ? "Regular" : cursable ? "Cursable" : "No cursable";

  const reqRegNames = m.reqRegular.map(c => materiaMap[c].nombre).join(", ") || "Ninguna";
  const reqAprNames = m.reqAprobada === "TODAS"
    ? "Todas las materias"
    : m.reqAprobada.map(c => materiaMap[c].nombre).join(", ") || "Ninguna";

  let hint = "";
  if (est === "pendiente") {
    if (esCursable(m)) hint = `<b>Disponible para cursar</b> — click para marcar como Regular`;
    else {
      const faltaReg = m.reqRegular.filter(c => { const e = estado(c); return e !== "regular" && e !== "aprobada"; }).map(c => materiaMap[c].nombre);
      const faltaApr = m.reqAprobada !== "TODAS" ? m.reqAprobada.filter(c => estado(c) !== "aprobada").map(c => materiaMap[c].nombre) : ["todas las materias"];
      const partes = [];
      if (faltaReg.length) partes.push(`Regularizar: ${faltaReg.join(", ")}`);
      if (faltaApr.length) partes.push(`Aprobar: ${faltaApr.join(", ")}`);
      hint = partes.join("<br>");
    }
  } else if (est === "regular") {
    hint = `<b>Lista para rendir</b> — click para marcar como Aprobada`;
  } else {
    hint = `Click para resetear a Pendiente`;
  }

  document.getElementById("tt-name").textContent = m.nombre;
  document.getElementById("tt-code").textContent = `#${String(m.id).padStart(2, "0")}`;
  document.getElementById("tt-estado").textContent = estadoLabelClean;
  document.getElementById("tt-cursar").textContent = reqRegNames;
  document.getElementById("tt-rendir").textContent = reqAprNames;
  document.getElementById("tt-hint").innerHTML = hint;

  tooltip.classList.add("show");
  positionTooltip(p.event);
});

network.on("blurNode", () => tooltip.classList.remove("show"));

network.on("mouseMoved", p => {
  if (tooltip.classList.contains("show")) positionTooltip(p.event);
});

function positionTooltip(evt) {
  const x = evt.clientX || (evt.center && evt.center.x) || 0;
  const y = evt.clientY || (evt.center && evt.center.y) || 0;
  const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight;
  tooltip.style.left = Math.min(x + 14, vw - tw - 10) + "px";
  tooltip.style.top = Math.min(y + 14, vh - th - 10) + "px";
}

// ═══════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════

let toastTimer;
const toastEl = document.getElementById("toast");

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
}

// ═══════════════════════════════════════════════════
//  ACTUALIZAR VISUAL
// ═══════════════════════════════════════════════════

function actualizar() {
  pulseIDs.clear();

  // ── NODES
  materias.forEach(m => {
    const est = estado(m.id);
    const cursable = esCursable(m);
    const rendible = esRendible(m);

    let bg, border, fontColor, bw, shadow = false;

    if (est === "aprobada") {
      bg = "#071f14"; border = "#10b981"; fontColor = "#34d399"; bw = 2;
    } else if (est === "regular") {
      bg = "#1a1400"; border = "#f59e0b"; fontColor = "#fbbf24"; bw = 2;
      if (rendible) pulseIDs.add(m.id);
    } else {
      if (cursable) {
        bg = "#051520"; border = "#22d3ee"; fontColor = "#38bdf8"; bw = 2;
        pulseIDs.add(m.id);
      } else {
        bg = "#0f1e35"; border = "#1e3252"; fontColor = "#3d5070"; bw = 1.5;
      }
    }

    nodes.update({
      id: m.id,
      color: { background: bg, border: border },
      font: { color: fontColor, size: 13, face: "IBM Plex Mono" },
      borderWidth: bw,
      shadow: { enabled: true, color: "rgba(0,0,0,0.55)", size: 14, x: 0, y: 5 }
    });
  });

  // ── EDGES
  rawEdges.forEach(e => {
    const estFrom = estado(e.from);
    const hidden = edgeMode !== "ambos" && e.tipo !== edgeMode;

    let color = "#1e3252";
    const width = e.tipo === "aprobada" ? 2.2 : 1.4;

    if (!hidden) {
      if (e.tipo === "regular") {
        if (estFrom === "aprobada") color = "#10b981";
        else if (estFrom === "regular") color = "#22d3ee";
        else color = "#1e3252";
      } else {
        if (estFrom === "aprobada") color = "#f59e0b";
        else color = "#1e3252";
      }
    }

    edges.update({
      id: e.id,
      color: { color: hidden ? "transparent" : color },
      width,
      dashes: false
    });
  });

  // ── STATS
  const aprobadas = materias.filter(m => estado(m.id) === "aprobada").length;
  const regulares = materias.filter(m => estado(m.id) === "regular").length;
  const cursables = materias.filter(m => esCursable(m)).length;
  const total = materias.length;
  const pct = ((aprobadas / total) * 100).toFixed(1);

  document.getElementById("s-aprobadas").textContent = aprobadas;
  document.getElementById("s-regulares").textContent = regulares;
  document.getElementById("s-cursables").textContent = cursables;
  document.getElementById("p-label").textContent = `${aprobadas} / ${total} materias aprobadas`;
  document.getElementById("p-pct").textContent = pct + "%";
  document.getElementById("barra").style.width = pct + "%";
}

// ── INIT
network.once("afterDrawing", () => {
  actualizar();
});

// ═══════════════════════════════════════════════════
//  ELECTIVAS - Sistema completo
// ═══════════════════════════════════════════════════

const electivas = [
  // Nivel 2
  { id: 101, nombre: "Formación de Emprendedores", nivel: 2, tipo: "ANUAL", horasBase: 2, reqRegular: [], reqAprobada: [] },
  { id: 102, nombre: "Entornos Gráficos", nivel: 2, tipo: "Cuatr.", horasBase: 8, reqRegular: [5], reqAprobada: [6, 8] },
  { id: 103, nombre: "Análisis y Diseño de Datos e Información", nivel: 2, tipo: "Cuatr.", horasBase: 6, reqRegular: [8, 13], reqAprobada: [6] },
  { id: 104, nombre: "Sistemas de Información Geográfica", nivel: 2, tipo: "Cuatr.", horasBase: 6, reqRegular: [1, 6], reqAprobada: [2] },

  // Nivel 3
  { id: 105, nombre: "Algoritmos Genéticos", nivel: 3, tipo: "ANUAL", horasBase: 4, reqRegular: [13, 14], reqAprobada: [5, 6, 7, 8] },
  { id: 106, nombre: "Informática Jurídica", nivel: 3, tipo: "Cuatr.", horasBase: 6, reqRegular: [15], reqAprobada: [6, 7, 8] },
  { id: 107, nombre: "Lenguaje de Programación JAVA", nivel: 3, tipo: "ANUAL", horasBase: 4, reqRegular: [], reqAprobada: [14] },
  { id: 108, nombre: "Tecnologías de Desarrollo de Software IDE", nivel: 3, tipo: "ANUAL", horasBase: 4, reqRegular: [], reqAprobada: [5, 13, 14] },
  { id: 109, nombre: "Gestión Ingenieril", nivel: 3, tipo: "Cuatr.", horasBase: 4, reqRegular: [], reqAprobada: [8] },
  { id: 110, nombre: "Introducción a la Práctica Profesional", nivel: 3, tipo: "ANUAL", horasBase: 4, reqRegular: [], reqAprobada: [16] },

  // Nivel 4
  { id: 111, nombre: "Infraestructura Tecnológica", nivel: 4, tipo: "Cuatr.", horasBase: 4, reqRegular: [16], reqAprobada: [15] },
  { id: 112, nombre: "Metodología de Investigación", nivel: 4, tipo: "Cuatr.", horasBase: 4, reqRegular: [17], reqAprobada: [17] },
  { id: 113, nombre: "Soporte a la Gestión de Datos con Programación Visual", nivel: 4, tipo: "ANUAL", horasBase: 4, reqRegular: [19], reqAprobada: [13, 14] },
  { id: 114, nombre: "Metodologías Ágiles de Desarrollo de Software", nivel: 4, tipo: "Cuatr.", horasBase: 6, reqRegular: [], reqAprobada: [] },

  // Nivel 5
  { id: 115, nombre: "Informática de la Administración Pública", nivel: 5, tipo: "Cuatr.", horasBase: 4, reqRegular: [], reqAprobada: [16] },
  { id: 116, nombre: "Dirección de Recursos Humanos", nivel: 5, tipo: "Cuatr.", horasBase: 3, reqRegular: [30], reqAprobada: [] },
  { id: 117, nombre: "Seguridad en los Sistemas de Información", nivel: 5, tipo: "Cuatr.", horasBase: 6, reqRegular: [26, 30], reqAprobada: [21] },
  { id: 118, nombre: "Minería de Datos", nivel: 5, tipo: "Cuatr.", horasBase: 6, reqRegular: [28], reqAprobada: [17, 19] },
  { id: 119, nombre: "Sistemas de Información Integrados para la Industria", nivel: 5, tipo: "Cuatr.", horasBase: 4, reqRegular: [25, 27, 30], reqAprobada: [] },
  { id: 120, nombre: "Fabricación Aditiva", nivel: 5, tipo: "ANUAL", horasBase: 3, reqRegular: [28, 29, 30], reqAprobada: [7, 15, 18] }
];

// Calcular horas reales
electivas.forEach(e => {
  e.horas = e.tipo === "Cuatr." ? e.horasBase / 2 : e.horasBase;
});

const electivaMap = {};
electivas.forEach(e => electivaMap[e.id] = e);

// LocalStorage para electivas
const KEY_ELECTIVAS = "utn-sistemas-electivas";
let estadosElectivas = JSON.parse(localStorage.getItem(KEY_ELECTIVAS) || "{}");

function guardarElectivas() {
  localStorage.setItem(KEY_ELECTIVAS, JSON.stringify(estadosElectivas));
}

function estadoElectiva(id) {
  return estadosElectivas[id] || "pendiente";
}

function puedeRegularElectiva(e) {
  const cumpleRegular = e.reqRegular.every(c => {
    const est = estado(c);
    return est === "regular" || est === "aprobada";
  });
  const cumpleAprobada = e.reqAprobada.every(c => estado(c) === "aprobada");
  return cumpleRegular && cumpleAprobada;
}

function esElectivaCursable(e) {
  return estadoElectiva(e.id) === "pendiente" && puedeRegularElectiva(e);
}

function mostrarTooltipElectiva(e, ev) {
  const est = estadoElectiva(e.id);
  const cursable = esElectivaCursable(e);
  const estadoLabel = est === "aprobada" ? "Aprobada" : est === "regular" ? "Regular" : cursable ? "Cursable" : "No cursable";

  const reqRegNames = e.reqRegular.map(c => materiaMap[c].nombre).join(", ") || "Ninguna";
  const reqAprNames = e.reqAprobada.map(c => materiaMap[c].nombre).join(", ") || "Ninguna";

  let hint = "";
  if (est === "pendiente") {
    if (cursable) {
      hint = `<b>Disponible para cursar</b> — click para marcar como Regular`;
    } else {
      const faltaReg = e.reqRegular
        .filter(c => { const s = estado(c); return s !== "regular" && s !== "aprobada"; })
        .map(c => materiaMap[c].nombre);
      const faltaApr = e.reqAprobada
        .filter(c => estado(c) !== "aprobada")
        .map(c => materiaMap[c].nombre);
      const partes = [];
      if (faltaReg.length) partes.push(`Regularizar: ${faltaReg.join(", ")}`);
      if (faltaApr.length) partes.push(`Aprobar: ${faltaApr.join(", ")}`);
      hint = partes.join("<br>") || "Sin requisitos pendientes";
    }
  } else if (est === "regular") {
    hint = `<b>Lista para rendir</b> — click para marcar como Aprobada`;
  } else {
    hint = `Click para resetear a Pendiente`;
  }

  document.getElementById("tt-name").textContent = e.nombre;
  document.getElementById("tt-code").textContent = `${e.tipo} · ${e.horas}hs`;
  document.getElementById("tt-estado").textContent = estadoLabel;
  document.getElementById("tt-cursar").textContent = reqRegNames;
  document.getElementById("tt-rendir").textContent = reqAprNames;
  document.getElementById("tt-hint").innerHTML = hint;

  tooltip.classList.add("show");
  positionTooltip(ev);
}

function toggleElectivas() {
  const panel = document.getElementById("panel-electivas");
  const overlay = document.getElementById("panel-overlay");
  const btn = document.getElementById("btn-electivas");

  const isOpen = panel.classList.contains("open");

  if (isOpen) {
    panel.classList.remove("open");
    overlay.classList.remove("show");
    btn.classList.remove("active");
  } else {
    panel.classList.add("open");
    overlay.classList.add("show");
    btn.classList.add("active");
    renderElectivas();
  }
}

function renderElectivas() {
  const container = document.getElementById("electivas-content");
  container.innerHTML = "";

  const porNivel = {};
  electivas.forEach(e => {
    if (!porNivel[e.nivel]) porNivel[e.nivel] = [];
    porNivel[e.nivel].push(e);
  });

  Object.keys(porNivel).sort().forEach(nivel => {
    const div = document.createElement("div");
    div.className = "electiva-nivel";

    const title = document.createElement("div");
    title.className = "electiva-nivel-title";
    title.textContent = `Nivel ${nivel}`;
    div.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "electivas-grid";

    porNivel[nivel].forEach(e => {
      const nodo = document.createElement("div");
      const est = estadoElectiva(e.id);
      const cursable = esElectivaCursable(e);

      nodo.className = `electiva-nodo ${est}`;
      if (est === "pendiente" && cursable) {
        nodo.classList.add("cursable");
      }

      nodo.innerHTML = `
        <div class="electiva-nodo-nombre">${e.nombre}</div>
        <div class="electiva-nodo-footer">
          <span class="electiva-nodo-tipo">${e.tipo}</span>
          <span class="electiva-nodo-horas">${e.horas}hs</span>
        </div>
      `;

      nodo.onclick = () => clickElectiva(e.id);
      nodo.addEventListener("mouseenter", ev => mostrarTooltipElectiva(e, ev));
      nodo.addEventListener("mousemove", ev => positionTooltip(ev));
      nodo.addEventListener("mouseleave", () => tooltip.classList.remove("show"));

      grid.appendChild(nodo);
    });

    div.appendChild(grid);
    container.appendChild(div);
  });

  actualizarProgresElectivas();
}

function clickElectiva(id) {
  const e = electivaMap[id];
  const actual = estadoElectiva(id);

  if (actual === "pendiente") {
    if (!puedeRegularElectiva(e)) {
      const faltaReg = e.reqRegular.filter(c => {
        const est = estado(c);
        return est !== "regular" && est !== "aprobada";
      }).map(c => materiaMap[c].nombre);

      const faltaApr = e.reqAprobada.filter(c => estado(c) !== "aprobada").map(c => materiaMap[c].nombre);

      const partes = [];
      if (faltaReg.length) partes.push(`Regularizar: ${faltaReg.join(", ")}`);
      if (faltaApr.length) partes.push(`Aprobar: ${faltaApr.join(", ")}`);
      showToast(partes.join(" · "));
      return;
    }
    estadosElectivas[id] = "regular";
  } else if (actual === "regular") {
    estadosElectivas[id] = "aprobada";
  } else {
    estadosElectivas[id] = "pendiente";
  }

  guardarElectivas();
  renderElectivas();
  actualizar();
}

function actualizarProgresElectivas() {
  const aprobadas = electivas.filter(e => estadoElectiva(e.id) === "aprobada");
  const horasAcum = aprobadas.reduce((sum, e) => sum + e.horas, 0);
  const pct = Math.min((horasAcum / 20) * 100, 100).toFixed(1);

  document.getElementById("e-horas-actual").textContent = horasAcum.toFixed(1);
  document.getElementById("e-barra").style.width = pct + "%";
  document.getElementById("e-pct").textContent = pct + "%";
}

// Inicializar al cargar
setTimeout(() => {
  if (document.getElementById("e-horas-actual")) {
    actualizarProgresElectivas();
  }
}, 100);
