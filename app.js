const STORAGE_KEY = "horarios_facultad_2026_v3";
const OLD_STORAGE_KEY = "horarios_facultad_2026_v2";
const THEME_KEY = "horarios_facultad_theme";
const APP_DATA_VERSION = "github-pages-default-2026-06-16";

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = [
  "8:00-9:00",
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00"
];

const tiposClase = [
  "",
  "Teoría",
  "Práctica",
  "Teórico-Práctica",
  "Coloquio",
  "Consulta",
  "Laboratorio",
  "Parcial",
  "Otro"
];

const materiasIniciales = [
  { id: "mate-basica", nombre: "Mate Básica", aulaDefault: "Aula 9", color: "#6aa58a" },
  { id: "algebra", nombre: "Álgebra", aulaDefault: "Aula 10", color: "#c45a3d" },
  { id: "cdd1", nombre: "CDD1", aulaDefault: "Aula 10", color: "#355f8a" }
];

const docentesIniciales = [
  { id: "doc-1", contacto: "lpopamela@gmail.com | jcatoni@sinc.unl.edu.ar | lucasmansilla12@gmail.com", detalle: "Aula 10" },
  { id: "doc-2", contacto: "cabanagusti@gmail.com | cgomez@fiq.unl.edu.ar", detalle: "" },
  { id: "doc-3", contacto: "pabloquijanoar@gmail.com", detalle: "" },
  { id: "doc-4", contacto: "itazocola@gmail.com", detalle: "Aula 9" },
  { id: "doc-5", contacto: "pmorin@fiq.unl.edu.ar", detalle: "" }
];

const estadoBase = {
  titulo: "Horarios de primer cuatrimestre 2026",
  materias: materiasIniciales,
  docentes: docentesIniciales,
  horario: crearHorarioInicial()
};

let estado = cargarEstado();
let celdaSeleccionada = null;

const $ = (selector) => document.querySelector(selector);

function crearHorarioInicial() {
  const horario = {};

  cargarRango(horario, "Lunes", ["14:00-15:00", "15:00-16:00"], "mate-basica", "Teoría", "Aula 9");
  cargarRango(horario, "Lunes", ["16:00-17:00", "17:00-18:00"], "algebra", "Teoría", "Aula 10");
  cargarRango(horario, "Martes", ["10:00-11:00", "11:00-12:00", "12:00-13:00"], "mate-basica", "Práctica", "Aula 9");
  cargarRango(horario, "Martes", ["15:00-16:00", "16:00-17:00", "17:00-18:00"], "cdd1", "Teórico-Práctica", "Aula 10");
  cargarRango(horario, "Miércoles", ["14:00-15:00", "15:00-16:00", "16:00-17:00"], "algebra", "Teoría", "Aula 10");
  cargarRango(horario, "Jueves", ["12:00-13:00", "13:00-14:00", "14:00-15:00"], "mate-basica", "Práctica", "Aula 9");
  cargarRango(horario, "Jueves", ["15:00-16:00", "16:00-17:00", "17:00-18:00"], "cdd1", "Teórico-Práctica", "Aula 10");
  cargarRango(horario, "Viernes", ["14:00-15:00", "15:00-16:00", "16:00-17:00"], "algebra", "Teoría", "Aula 10");

  return horario;
}

function cargarRango(horario, dia, bloques, materiaId, tipoClase, aula) {
  bloques.forEach((hora) => {
    horario[claveCelda(hora, dia)] = { materiaId, tipoClase, aula };
  });
}

function cargarEstado() {
  const rawActual = localStorage.getItem(STORAGE_KEY);
  const rawViejo = !rawActual ? localStorage.getItem(OLD_STORAGE_KEY) : null;
  const raw = rawActual || rawViejo;

  if (!raw) return clonar(estadoBase);

  try {
    const parsed = JSON.parse(raw);
    if (parsed.__appVersion !== APP_DATA_VERSION) {
      const estadoInicial = clonar(estadoBase);
      persistirEstado(estadoInicial);
      return estadoInicial;
    }

    const migrado = migrarEstado(parsed);
    persistirEstado(migrado);
    return migrado;
  } catch {
    const estadoInicial = clonar(estadoBase);
    persistirEstado(estadoInicial);
    return estadoInicial;
  }
}

function migrarEstado(data) {
  const materias = (data.materias?.length ? data.materias : estadoBase.materias).map((materia) => ({
    id: materia.id || crearId(),
    nombre: materia.nombre || "Materia sin nombre",
    aulaDefault: materia.aulaDefault ?? materia.aula ?? "",
    color: materia.color || "#2563eb"
  }));

  const horario = {};
  Object.entries(data.horario || estadoBase.horario).forEach(([key, valor]) => {
    if (!valor?.materiaId) return;
    horario[normalizarClaveHorario(key)] = {
      materiaId: valor.materiaId,
      tipoClase: valor.tipoClase || "",
      aula: valor.aula || ""
    };
  });

  return {
    __appVersion: APP_DATA_VERSION,
    titulo: data.titulo || estadoBase.titulo,
    materias,
    docentes: data.docentes || clonar(estadoBase.docentes),
    horario
  };
}

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function guardarEstado() {
  persistirEstado(estado);
}

function persistirEstado(valor) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...valor,
    __appVersion: APP_DATA_VERSION
  }));
}

function claveCelda(hora, dia) {
  return `${hora}__${dia}`;
}

function normalizarClaveHorario(key) {
  return String(key)
    .replaceAll("Miercoles", "Miércoles")
    .replaceAll("MiÃ©rcoles", "Miércoles");
}

function buscarMateria(id) {
  return estado.materias.find((materia) => materia.id === id);
}

function aulaDeCelda(valor, materia) {
  return valor?.aula || materia?.aulaDefault || "";
}

function colorTextoPara(fondo) {
  const hex = String(fondo || "#ffffff").replace("#", "");
  const normalizado = hex.length === 3
    ? hex.split("").map((char) => char + char).join("")
    : hex.padEnd(6, "0").slice(0, 6);
  const r = parseInt(normalizado.slice(0, 2), 16);
  const g = parseInt(normalizado.slice(2, 4), 16);
  const b = parseInt(normalizado.slice(4, 6), 16);
  const brillo = (r * 299 + g * 587 + b * 114) / 1000;
  return brillo < 145 ? "#ffffff" : "#111827";
}

function claseTipo(tipoClase) {
  return `class-${normalizarClase(tipoClase || "Otro")}`;
}

function normalizarClase(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function aplicarTemaInicial() {
  const temaGuardado = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.dataset.theme = temaGuardado;
  actualizarBotonTema();
}

function alternarTema() {
  const actual = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const siguiente = actual === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = siguiente;
  localStorage.setItem(THEME_KEY, siguiente);
  actualizarBotonTema();
}

function actualizarBotonTema() {
  const esOscuro = document.documentElement.dataset.theme === "dark";
  $("#btnTema").textContent = esOscuro ? "Modo claro" : "Modo oscuro";
}

function renderTodo() {
  $("#tituloPrincipal").textContent = estado.titulo;
  renderHorario();
  renderMaterias();
  renderDocentes();
  renderSelects();
  renderEditorCelda();
}

function renderHorario() {
  const body = $("#scheduleBody");
  body.innerHTML = "";

  horas.forEach((hora) => {
    const tr = document.createElement("tr");
    const horaTd = document.createElement("td");
    horaTd.textContent = hora;
    tr.appendChild(horaTd);

    dias.forEach((dia) => {
      const key = claveCelda(hora, dia);
      const valor = estado.horario[key];
      const materia = buscarMateria(valor?.materiaId);
      const aula = aulaDeCelda(valor, materia);
      const td = document.createElement("td");
      td.className = "schedule-cell";
      td.dataset.key = key;
      td.dataset.hora = hora;
      td.dataset.dia = dia;

      if (celdaSeleccionada === key) td.classList.add("selected");

      if (materia) {
        const texto = colorTextoPara(materia.color);
        const tipo = valor?.tipoClase || "";
        td.innerHTML = `
          <div class="cell-content" style="background:${escapeAttr(materia.color)};color:${texto}">
            <span class="cell-subject">${escapeHtml(materia.nombre)}</span>
            ${tipo ? `<span class="class-badge ${claseTipo(tipo)}">${escapeHtml(tipo)}</span>` : ""}
            ${aula ? `<span class="cell-room">${escapeHtml(aula)}</span>` : ""}
          </div>
        `;
      } else {
        td.innerHTML = "";
      }

      td.addEventListener("click", () => seleccionarCelda(key));
      tr.appendChild(td);
    });

    body.appendChild(tr);
  });
}

function seleccionarCelda(key) {
  celdaSeleccionada = key;
  renderHorario();
  renderEditorCelda();
}

function renderEditorCelda() {
  const select = $("#selectCeldaMateria");
  const selectTipo = $("#selectCeldaTipo");
  const inputAula = $("#inputCeldaAula");
  const btnGuardar = $("#btnGuardarCelda");
  const btnLimpiar = $("#btnLimpiarCelda");
  const empty = $("#editorEmpty");
  const badge = $("#cellEditorBadge");

  select.innerHTML = opcionesMaterias();
  selectTipo.innerHTML = opcionesTipos();

  const activa = Boolean(celdaSeleccionada);
  select.disabled = !activa;
  selectTipo.disabled = !activa;
  inputAula.disabled = !activa;
  btnGuardar.disabled = !activa;
  btnLimpiar.disabled = !activa;
  empty.style.display = activa ? "none" : "block";

  if (!activa) {
    badge.textContent = "Ninguna";
    inputAula.value = "";
    selectTipo.value = "";
    return;
  }

  const [hora, dia] = celdaSeleccionada.split("__");
  const valor = estado.horario[celdaSeleccionada];
  const materiaInicial = valor?.materiaId || estado.materias[0]?.id || "";

  badge.textContent = `${dia} ${hora}`;
  select.value = materiaInicial;
  selectTipo.value = valor?.tipoClase || "";
  inputAula.value = valor?.aula || "";
  sugerirPlaceholderAula();
}

function renderMaterias() {
  const body = $("#materiasBody");
  body.innerHTML = "";

  estado.materias.forEach((materia, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-tipo="materia-nombre" data-index="${index}" value="${escapeAttr(materia.nombre)}" placeholder="Nombre"></td>
      <td><input data-tipo="materia-aula-default" data-index="${index}" value="${escapeAttr(materia.aulaDefault)}" placeholder="Aula predeterminada"></td>
      <td><input class="color-input" type="color" data-tipo="materia-color" data-index="${index}" value="${escapeAttr(materia.color || "#2563eb")}"></td>
      <td><button class="delete-btn" data-tipo="borrar-materia" data-index="${index}" title="Borrar materia" type="button">X</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderDocentes() {
  const body = $("#docentesBody");
  body.innerHTML = "";

  estado.docentes.forEach((docente, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-tipo="docente-contacto" data-index="${index}" value="${escapeAttr(docente.contacto)}" placeholder="mail@dominio.com"></td>
      <td><input data-tipo="docente-detalle" data-index="${index}" value="${escapeAttr(docente.detalle)}" placeholder="Aula o detalle"></td>
      <td><button class="delete-btn" data-tipo="borrar-docente" data-index="${index}" title="Borrar contacto" type="button">X</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderSelects() {
  $("#selectMateria").innerHTML = opcionesMaterias();
  $("#selectCeldaMateria").innerHTML = opcionesMaterias();
  $("#selectBloqueTipo").innerHTML = opcionesTipos();
  $("#selectCeldaTipo").innerHTML = opcionesTipos();
  $("#selectDesde").innerHTML = horas.map((hora) => `<option value="${hora}">${hora}</option>`).join("");
  $("#selectHasta").innerHTML = horas.map((hora) => `<option value="${hora}">${hora}</option>`).join("");
  $("#selectHasta").selectedIndex = Math.min(1, horas.length - 1);
  actualizarPlaceholderAulaBloque();
}

function opcionesMaterias() {
  return estado.materias
    .map((materia) => `<option value="${escapeAttr(materia.id)}">${escapeHtml(materia.nombre)}</option>`)
    .join("");
}

function opcionesTipos() {
  return tiposClase
    .map((tipo) => `<option value="${escapeAttr(tipo)}">${tipo ? escapeHtml(tipo) : "Sin especificar"}</option>`)
    .join("");
}

function sugerirPlaceholderAula() {
  const materia = buscarMateria($("#selectCeldaMateria").value);
  const textoAyuda = materia?.aulaDefault
    ? `Predeterminada: ${materia.aulaDefault}`
    : "Sin aula predeterminada";
  $("#inputCeldaAula").placeholder = materia?.aulaDefault
    ? `Predeterminada: ${materia.aulaDefault}`
    : "Sin aula predeterminada";
  $("#aulaCeldaHelp").textContent = `${textoAyuda}. Si queda vacío, se usa el aula predeterminada de la materia.`;
}

function actualizarPlaceholderAulaBloque() {
  const materia = buscarMateria($("#selectMateria").value);
  const textoAyuda = materia?.aulaDefault
    ? `Predeterminada: ${materia.aulaDefault}`
    : "Sin aula predeterminada";
  $("#inputAulaBloque").placeholder = textoAyuda;
  $("#aulaBloqueHelp").textContent = `${textoAyuda}. Si queda vacío, se usa el aula predeterminada de la materia.`;
}

function guardarCelda(e) {
  e.preventDefault();
  if (!celdaSeleccionada) return;

  const materiaId = $("#selectCeldaMateria").value;
  if (!materiaId) return;

  estado.horario[celdaSeleccionada] = {
    materiaId,
    tipoClase: $("#selectCeldaTipo").value,
    aula: $("#inputCeldaAula").value.trim()
  };

  guardarEstado();
  renderHorario();
  renderEditorCelda();
}

function limpiarCelda() {
  if (!celdaSeleccionada) return;
  delete estado.horario[celdaSeleccionada];
  guardarEstado();
  renderHorario();
  renderEditorCelda();
}

function cargarBloque(e) {
  e.preventDefault();

  const materiaId = $("#selectMateria").value;
  const tipoClase = $("#selectBloqueTipo").value;
  const dia = $("#selectDia").value;
  const desdeIndex = horas.indexOf($("#selectDesde").value);
  const hastaIndex = horas.indexOf($("#selectHasta").value);
  const aulaManual = $("#inputAulaBloque").value.trim();

  if (!materiaId || desdeIndex < 0 || hastaIndex < 0) return;

  const inicio = Math.min(desdeIndex, hastaIndex);
  const fin = Math.max(desdeIndex, hastaIndex);

  for (let i = inicio; i <= fin; i++) {
    estado.horario[claveCelda(horas[i], dia)] = { materiaId, tipoClase, aula: aulaManual };
  }

  $("#inputAulaBloque").value = "";
  guardarEstado();
  renderHorario();
}

function agregarMateria() {
  estado.materias.push({
    id: crearId(),
    nombre: "Nueva materia",
    aulaDefault: "",
    color: "#2563eb"
  });
  guardarEstado();
  renderTodo();
}

function agregarDocente() {
  estado.docentes.push({
    id: crearId(),
    contacto: "",
    detalle: ""
  });
  guardarEstado();
  renderDocentes();
}

function crearId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function manejarInputCatalogos(e) {
  const el = e.target;
  const tipo = el.dataset.tipo;
  const index = Number(el.dataset.index);

  if (!tipo || Number.isNaN(index)) return;

  if (tipo === "materia-nombre") estado.materias[index].nombre = el.value;
  if (tipo === "materia-aula-default") estado.materias[index].aulaDefault = el.value;
  if (tipo === "materia-color") estado.materias[index].color = el.value;
  if (tipo === "docente-contacto") estado.docentes[index].contacto = el.value;
  if (tipo === "docente-detalle") estado.docentes[index].detalle = el.value;

  guardarEstado();

  if (tipo.startsWith("materia")) {
    renderSelects();
    renderHorario();
    renderEditorCelda();
  }
}

function manejarClicks(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const tipo = btn.dataset.tipo;
  const index = Number(btn.dataset.index);

  if (tipo === "borrar-materia") {
    if (!confirm("Borrar esta materia también limpia sus celdas cargadas. ¿Continuar?")) return;
    const materiaId = estado.materias[index]?.id;
    estado.materias.splice(index, 1);
    Object.keys(estado.horario).forEach((key) => {
      if (estado.horario[key]?.materiaId === materiaId) delete estado.horario[key];
    });
    if (estado.materias.length === 0) {
      estado.materias.push({
        id: crearId(),
        nombre: "Nueva materia",
        aulaDefault: "",
        color: "#2563eb"
      });
    }
    guardarEstado();
    renderTodo();
  }

  if (tipo === "borrar-docente") {
    estado.docentes.splice(index, 1);
    guardarEstado();
    renderDocentes();
  }
}

function limpiarTodo() {
  if (!confirm("¿Restaurar los datos iniciales de ejemplo?")) return;
  localStorage.removeItem(STORAGE_KEY);
  estado = clonar(estadoBase);
  celdaSeleccionada = null;
  guardarEstado();
  renderTodo();
}

function escapeHtml(texto) {
  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(texto) {
  return escapeHtml(texto).replaceAll("`", "&#096;");
}

aplicarTemaInicial();

$("#btnTema").addEventListener("click", alternarTema);
$("#formCelda").addEventListener("submit", guardarCelda);
$("#btnLimpiarCelda").addEventListener("click", limpiarCelda);
$("#selectCeldaMateria").addEventListener("change", sugerirPlaceholderAula);
$("#selectMateria").addEventListener("change", actualizarPlaceholderAulaBloque);
$("#formBloque").addEventListener("submit", cargarBloque);
$("#btnAgregarMateria").addEventListener("click", agregarMateria);
$("#btnAgregarDocente").addEventListener("click", agregarDocente);
$("#btnLimpiar").addEventListener("click", limpiarTodo);
$("#materiasBody").addEventListener("input", manejarInputCatalogos);
$("#docentesBody").addEventListener("input", manejarInputCatalogos);
$("#materiasBody").addEventListener("click", manejarClicks);
$("#docentesBody").addEventListener("click", manejarClicks);

renderTodo();
