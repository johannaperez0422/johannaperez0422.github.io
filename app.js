const views = {
  inicio: "Inicio",
  proyectos: "Proyectos y protocolos",
  evidencias: "Evidencias documentales",
  etica: "Comité de Ética",
  tutorias: "Tutorías y seguimientos",
  evaluaciones: "Evaluaciones",
  comunicaciones: "Comunicaciones",
};

const projects = [
  { code: "SEM-2026-01", title: "Adherencia terapéutica en población adulta", stage: "JJI", ethics: "Aprobado", lead: "Equipo de investigación A", evidence: 8 },
  { code: "SEM-2026-02", title: "Calidad del sueño y desempeño académico", stage: "Presentación interna", ethics: "Con observaciones", lead: "Equipo de investigación B", evidence: 6 },
  { code: "SEM-2026-03", title: "Prácticas preventivas en atención primaria", stage: "Revisión ética", ethics: "En revisión", lead: "Equipo de investigación C", evidence: 4 },
  { code: "SEM-2026-04", title: "Bienestar emocional en estudiantes de salud", stage: "Tutoría", ethics: "Requiere corrección", lead: "Equipo de investigación D", evidence: 5 },
];

let evidence = [
  { code: "EVD-001", name: "Resolución institucional", type: "Resolución", project: "General", status: "Vigente", date: "16/04/2026" },
  { code: "EVD-008", name: "Protocolo de investigación", type: "Protocolo", project: "SEM-2026-01", status: "Vigente", date: "02/06/2026" },
  { code: "EVD-019", name: "Acta del Comité de Ética", type: "Acta CEI", project: "SEM-2026-02", status: "Vigente", date: "05/06/2026" },
  { code: "EVD-031", name: "Devolución técnica", type: "Seguimiento", project: "SEM-2026-03", status: "Observado", date: "21/06/2026" },
  { code: "EVD-042", name: "Constancia de presentación", type: "Evento", project: "SEM-2026-01", status: "Vigente", date: "27/07/2026" },
];

let demoNoticeAdded = false;
let activeView = "inicio";
let deferredInstallPrompt = null;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function statusTone(status) {
  if (["Aprobado", "Vigente", "Completado"].includes(status)) return "ok";
  if (["En revisión", "Programada"].includes(status)) return "info";
  return "warn";
}

function status(status) {
  return `<span class="status ${statusTone(status)}">${status}</span>`;
}

function progress(value) {
  return `<div class="progress" aria-label="${value}%"><span style="width:${value}%"></span></div>`;
}

function sectionHead(eyebrow, title, description, actions = "") {
  return `<header class="section-head"><div><p class="section-eyebrow">${eyebrow}</p><h2>${title}</h2><p class="section-description">${description}</p></div>${actions ? `<div class="section-actions">${actions}</div>` : ""}</header>`;
}

function miniStat(value, label, icon) {
  return `<article class="mini-stat"><span class="mini-icon">${icon}</span><div><strong>${value}</strong><span>${label}</span></div></article>`;
}

function dashboardTemplate() {
  const metrics = [
    ["15", "Protocolos éticos", "3 requieren seguimiento", "CE", "etica"],
    ["10", "Presentaciones internas", "Registros verificados", "PI", "proyectos"],
    ["7", "Trabajos JJI", "Seleccionados para seguimiento", "JJI", "proyectos"],
    ["42", "Evidencias", "Inventario documental", "EV", "evidencias"],
  ];
  return `<div class="view">
    <div class="metric-grid">
      ${metrics.map(([value, label, note, icon, view]) => `<button class="metric-card" data-go="${view}" type="button"><span class="metric-icon">${icon}</span><strong>${value}</strong><b>${label}</b><small>${note}</small></button>`).join("")}
    </div>
    <div class="dashboard-grid">
      <article class="panel">
        <div class="panel-head"><div><p class="section-eyebrow">Flujo institucional</p><h2>Estado del Semillero 2026</h2></div><span class="badge">Datos de demostración</span></div>
        <div class="flow-grid">
          ${[["01","Comité de Ética","15 protocolos","100%"],["02","Presentación interna","10 verificados","67%"],["03","Selección JJI","7 trabajos","47%"],["04","Seguimiento","En curso","36%"]].map(([n,title,detail,value]) => `<div class="flow-step"><span>${n}</span><b>${title}</b><small>${detail}</small><strong>${value}</strong></div>`).join("")}
        </div>
      </article>
      <article class="panel dark">
        <p class="section-eyebrow">Repositorio</p><h2>Cobertura documental</h2><div class="coverage">88%</div>${progress(88)}
        <p class="dark-copy">La maqueta simula 37 evidencias validadas y 5 pendientes de revisión técnica.</p>
        <button class="button button-secondary button-block" data-go="evidencias" type="button">Revisar repositorio</button>
      </article>
    </div>
    <div class="split-grid">
      <article class="panel"><div class="panel-head"><h2>Actividad reciente</h2><button class="button button-secondary" data-go="comunicaciones" type="button">Ver avisos</button></div>
        <div class="list">
          ${[["CE","Acta ética vinculada","SEM-2026-02","Hoy · 09:15"],["TU","Tutoría registrada","Equipo de investigación D","Ayer · 11:40"],["EV","Evidencia actualizada","EVD-031 · Devolución técnica","25 ago · 08:22"]].map(([icon,title,detail,time]) => `<div class="activity"><span class="activity-icon">${icon}</span><div class="activity-copy"><b>${title}</b><span>${detail}</span></div><time>${time}</time></div>`).join("")}
        </div>
      </article>
      <article class="panel"><div class="panel-head"><h2>Próximas acciones</h2><span>▣</span></div>
        <div class="list">
          ${[["28 AGO","Revisión de protocolos observados","Comité de Ética"],["02 SEP","Tutoría metodológica","Sala de Investigación"],["05 SEP","Cierre de actualización documental","Semillero 2026"]].map(([date,title,detail]) => `<div class="action-row"><span class="date-box">${date}</span><div><b>${title}</b><span>${detail}</span></div></div>`).join("")}
        </div>
      </article>
    </div>
  </div>`;
}

function projectRows(list) {
  return list.map((p) => `<tr><td><strong>${p.code}</strong></td><td><b>${p.title}</b><br><small>${p.lead}</small></td><td>${p.stage}</td><td>${status(p.ethics)}</td><td>${p.evidence}</td><td><button class="button button-secondary project-detail" data-code="${p.code}" type="button">Ver ficha</button></td></tr>`).join("");
}

function projectsTemplate() {
  return `<div class="view">
    ${sectionHead("Gestión de investigación", "Proyectos y protocolos", "Consulte el recorrido documental y académico de cada trabajo.", `<button id="new-project" class="button button-primary" type="button">＋ Nuevo proyecto demo</button>`)}
    <article class="panel">
      <div class="search-box"><input id="project-search" type="search" placeholder="Buscar código, título o etapa…" aria-label="Buscar proyectos"></div>
      <div class="table-wrap"><table><thead><tr><th>Código</th><th>Proyecto</th><th>Etapa</th><th>Ética</th><th>Evidencias</th><th></th></tr></thead><tbody id="project-rows">${projectRows(projects)}</tbody></table></div>
    </article>
  </div>`;
}

function evidenceRows(list) {
  return list.map((e) => `<article class="evidence-row"><span class="mini-icon">EV</span><div class="evidence-copy"><div><strong>${e.code}</strong>${status(e.status)}</div><b>${e.name}</b><small>${e.type} · ${e.project} · ${e.date}</small></div><button class="button button-secondary evidence-open" type="button">Abrir</button></article>`).join("");
}

function evidenceTemplate() {
  return `<div class="view">
    ${sectionHead("Repositorio privado", "Evidencias documentales", "La maqueta simula el inventario sin almacenar archivos reales.", `<button id="export-evidence" class="button button-secondary" type="button">⇩ Exportar índice</button><button id="add-evidence" class="button button-primary" type="button">＋ Simular evidencia</button>`)}
    <div class="stat-grid three">${miniStat("42","Inventariadas","EV")}${miniStat("37","Validadas","✓")}${miniStat("5","Por revisar","?")}</div>
    <article class="panel"><div class="search-box"><input id="evidence-search" type="search" placeholder="Buscar evidencia…" aria-label="Buscar evidencias"></div><div id="evidence-rows" class="evidence-list">${evidenceRows(evidence)}</div></article>
  </div>`;
}

function ethicsTemplate() {
  const cards = [["SEM-2026-01","Aprobado","Acta CEI-05/2026","Sin observaciones pendientes",100],["SEM-2026-02","Con observaciones","Acta CEI-05/2026","Ajustar consentimiento informado",70],["SEM-2026-03","En revisión","Sesión próxima","Revisión metodológica en curso",45]];
  return `<div class="view">
    ${sectionHead("Trazabilidad ética", "Comité de Ética", "Seguimiento de protocolos, dictámenes, observaciones y actas relacionadas.")}
    <div class="stat-grid">${miniStat("15","Protocolos revisados","CE")}${miniStat("9","Aprobados","✓")}${miniStat("4","Con observaciones","!")}${miniStat("2","En revisión","…")}</div>
    <div class="card-grid three">${cards.map(([code,state,act,note,value]) => `<article class="ethics-card"><div class="card-top"><strong>${code}</strong>${status(state)}</div><h3>${act}</h3><p>${note}</p>${progress(value)}<p><strong>${value}%</strong></p></article>`).join("")}</div>
    <div class="alert"><span>✓</span><div><strong>Control institucional</strong><p>Los estados representados son ficticios. En el sistema funcional, cada cambio quedará asociado al acta, al usuario responsable y a la fecha de validación.</p></div></div>
  </div>`;
}

function tutoringTemplate() {
  const cards = [["28 AGO","Revisión metodológica","SEM-2026-03","09:00","Programada"],["02 SEP","Ajustes del protocolo","SEM-2026-02","10:30","Programada"],["22 AGO","Preparación de exposición","SEM-2026-01","11:00","Completado"]];
  return `<div class="view">
    ${sectionHead("Acompañamiento académico", "Tutorías y seguimientos", "Agenda, acuerdos, responsables y próximos pasos de cada equipo.", `<button id="new-tutoring" class="button button-primary" type="button">＋ Programar tutoría demo</button>`)}
    <div class="card-grid three">${cards.map(([date,title,code,time,state]) => `<article class="project-card"><div class="card-top"><span class="date-box">${date}</span>${status(state)}</div><h3>${title}</h3><p>${code} · ${time}</p><p>Equipo y tutor asignado</p></article>`).join("")}</div>
    <article class="panel"><h2>Acuerdos recientes</h2><div class="list">${["Actualizar la matriz de variables antes de la siguiente sesión.","Adjuntar versión corregida del consentimiento informado.","Confirmar expositor y tiempo de presentación."].map((text,index) => `<div class="action-row"><span class="date-box">${index + 1}</span><div><b>${text}</b></div></div>`).join("")}</div></article>
  </div>`;
}

function evaluationsTemplate() {
  const rows = [["SEM-2026-01","3 evaluaciones","Pendiente de verificación",92],["SEM-2026-02","3 evaluaciones","Pendiente de verificación",78],["SEM-2026-03","2 evaluaciones","Datos incompletos",55],["SEM-2026-04","2 evaluaciones","Pendiente de verificación",84]];
  return `<div class="view">
    ${sectionHead("Resultados provisionales", "Evaluaciones", "Registro técnico separado de los resultados institucionalmente validados.")}
    <div class="alert"><span>!</span><div><strong>Ranking desactivado</strong><p>Los puntajes permanecen como pendientes de verificación. La maqueta no calcula posiciones ni declara resultados oficiales.</p></div></div>
    <article class="panel table-wrap"><table><thead><tr><th>Trabajo</th><th>Registros</th><th>Estado</th><th>Consistencia</th></tr></thead><tbody>${rows.map(([code,count,state,value]) => `<tr><td><strong>${code}</strong></td><td>${count}</td><td>${status(state)}</td><td>${progress(value)}<small>${value}%</small></td></tr>`).join("")}</tbody></table></article>
  </div>`;
}

function communicationsTemplate() {
  const notices = [
    ["Actualización documental del Semillero","Alta","Se solicita verificar los documentos asociados a cada protocolo antes del cierre del periodo.","26 AGO 2026"],
    ["Tutorías metodológicas","Normal","Ya se encuentra disponible el calendario preliminar de acompañamiento a los equipos.","24 AGO 2026"],
    ["Revisión de actas del Comité de Ética","Normal","Los registros serán conciliados con el inventario documental del sistema.","21 AGO 2026"],
  ];
  if (demoNoticeAdded) notices.push(["Aviso de demostración","Prueba","Este aviso fue creado durante la navegación y no se guardará al cerrar la página.","AHORA"]);
  return `<div class="view">
    ${sectionHead("Comunicación interna", "Avisos institucionales", "Información operativa dirigida a equipos, tutores y responsables.", `<button id="new-notice" class="button button-primary" type="button">＋ Publicar aviso demo</button>`)}
    <div class="card-grid two">${notices.map(([title,priority,body,date]) => `<article class="notice-card"><div class="card-top"><span class="status ${priority === "Alta" ? "warn" : "ok"}">${priority}</span><small>${date}</small></div><h3>${title}</h3><p>${body}</p><p><small>Dirección de Investigación · Todos los gestores</small></p></article>`).join("")}</div>
  </div>`;
}

const templates = { inicio: dashboardTemplate, proyectos: projectsTemplate, evidencias: evidenceTemplate, etica: ethicsTemplate, tutorias: tutoringTemplate, evaluaciones: evaluationsTemplate, comunicaciones: communicationsTemplate };

function navigate(view, updateHash = true) {
  if (!views[view]) view = "inicio";
  activeView = view;
  if (updateHash) history.replaceState(null, "", `#${view}`);
  $("#view-title").textContent = views[view];
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $("#view-content").innerHTML = templates[view]();
  bindViewEvents();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDialog({ eyebrow = "Ficha de demostración", title, body, confirm = false }) {
  $("#dialog-eyebrow").textContent = eyebrow;
  $("#dialog-title").textContent = title;
  $("#dialog-body").innerHTML = body;
  $("#dialog-confirm").hidden = !confirm;
  $("#demo-dialog").showModal();
}

function closeDialog() { $("#demo-dialog").close(); }

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  toastTimer = setTimeout(() => element.classList.remove("show"), 3200);
}

function exportEvidence() {
  const rows = [["Código","Nombre","Tipo","Proyecto","Estado","Fecha"], ...evidence.map((e) => [e.code,e.name,e.type,e.project,e.status,e.date])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "indice_evidencias_demo.csv";
  anchor.click();
  URL.revokeObjectURL(url);
  toast("Índice de demostración exportado.");
}

function bindViewEvents() {
  $$('[data-go]').forEach((button) => button.addEventListener("click", () => navigate(button.dataset.go)));
  if (activeView === "proyectos") {
    $("#project-search").addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase();
      $("#project-rows").innerHTML = projectRows(projects.filter((p) => `${p.code} ${p.title} ${p.stage}`.toLowerCase().includes(query)));
      bindProjectDetails();
    });
    $("#new-project").addEventListener("click", () => showDialog({ eyebrow: "Registro simulado", title: "Nuevo proyecto de demostración", confirm: true, body: `<div class="dialog-form"><input placeholder="Título del proyecto"><input placeholder="Responsable"><input placeholder="Línea de investigación"><p class="privacy-note">El formulario no almacena información.</p></div>` }));
    bindProjectDetails();
  }
  if (activeView === "evidencias") {
    $("#evidence-search").addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase();
      $("#evidence-rows").innerHTML = evidenceRows(evidence.filter((e) => `${e.code} ${e.name} ${e.type} ${e.project}`.toLowerCase().includes(query)));
      bindEvidenceOpen();
    });
    $("#add-evidence").addEventListener("click", () => {
      if (!evidence.some((e) => e.code === "EVD-DEMO")) evidence.unshift({ code: "EVD-DEMO", name: "Documento de demostración", type: "Prueba", project: "SEM-2026-04", status: "Por revisar", date: "Ahora" });
      navigate("evidencias", false);
      toast("Evidencia ficticia agregada temporalmente.");
    });
    $("#export-evidence").addEventListener("click", exportEvidence);
    bindEvidenceOpen();
  }
  if (activeView === "tutorias") $("#new-tutoring").addEventListener("click", () => toast("En el sistema real se abrirá el formulario de programación."));
  if (activeView === "comunicaciones") $("#new-notice").addEventListener("click", () => { demoNoticeAdded = true; navigate("comunicaciones", false); toast("Aviso ficticio agregado temporalmente."); });
}

function bindProjectDetails() {
  $$(".project-detail").forEach((button) => button.addEventListener("click", () => {
    const project = projects.find((p) => p.code === button.dataset.code);
    showDialog({ title: project.title, body: `<div class="info-list"><div class="info-row"><span>Código</span><strong>${project.code}</strong></div><div class="info-row"><span>Responsable</span><strong>${project.lead}</strong></div><div class="info-row"><span>Etapa actual</span><strong>${project.stage}</strong></div><div class="info-row"><span>Estado ético</span><strong>${project.ethics}</strong></div><div class="info-row"><span>Evidencias</span><strong>${project.evidence}</strong></div></div>` });
  }));
}

function bindEvidenceOpen() {
  $$(".evidence-open").forEach((button) => button.addEventListener("click", () => toast("Demostración: la descarga real requerirá autorización temporal.")));
}

function enterDemo() {
  $("#login-screen").hidden = true;
  $("#app-shell").hidden = false;
  const requested = location.hash.replace("#", "");
  navigate(views[requested] ? requested : "inicio", false);
}

function leaveDemo() {
  $("#app-shell").hidden = true;
  $("#login-screen").hidden = false;
  history.replaceState(null, "", location.pathname);
  $("#demo-email").focus();
}

$("#demo-login").addEventListener("submit", (event) => { event.preventDefault(); enterDemo(); });
$("#logout").addEventListener("click", leaveDemo);
$$(".nav-item").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
$("#dialog-close").addEventListener("click", closeDialog);
$("#dialog-cancel").addEventListener("click", closeDialog);
$("#dialog-confirm").addEventListener("click", () => { closeDialog(); toast("Registro simulado. No se guardó información."); });
$("#demo-dialog").addEventListener("click", (event) => { if (event.target === $("#demo-dialog")) closeDialog(); });
window.addEventListener("hashchange", () => { if (!$("#app-shell").hidden) navigate(location.hash.replace("#", ""), false); });

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#install-app").hidden = false;
});

$("#install-app").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#install-app").hidden = true;
});

window.addEventListener("appinstalled", () => toast("La maqueta se instaló correctamente."));
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
