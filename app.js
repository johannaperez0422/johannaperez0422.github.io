const views = {
  inicio: "Inicio",
  inscripcion: "Inscripción de protocolo",
  mesa: "Mesa de entrada",
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
let demoRole = "team";
let formStep = 1;
const applicantDraft = {};
let submissions = [
  { code: "SOL-DEMO-2026-003", title: "Calidad del sueño y desempeño académico", applicant: "Equipo de investigación B", date: "26/08/2026", status: "Por revisar", email: "equipo.demo@ejemplo.test", completeness: 82 },
  { code: "SOL-DEMO-2026-002", title: "Prácticas preventivas en atención primaria", applicant: "Equipo de investigación C", date: "25/08/2026", status: "Corrección solicitada", email: "investigacion.demo@ejemplo.test", completeness: 68 },
  { code: "SOL-DEMO-2026-001", title: "Adherencia terapéutica en población adulta", applicant: "Equipo de investigación A", date: "22/08/2026", status: "Admitido", email: "responsable.demo@ejemplo.test", completeness: 100 },
];
let deferredInstallPrompt = null;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function statusTone(status) {
  if (["Aprobado", "Vigente", "Completado", "Admitido"].includes(status)) return "ok";
  if (["En revisión", "Programada", "Por revisar"].includes(status)) return "info";
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

const protocolSteps = [
  {
    title: "Identificación",
    description: "Datos de responsables y medios de contacto.",
    fields: [
      ["responsables", "Nombres y apellidos de los responsables", "textarea", "Un responsable por línea"],
      ["coordinador", "Coordinador/a de la investigación", "text", "Nombre completo"],
      ["celularCoordinador", "Celular del coordinador/a", "tel", "Ej.: 0981 000 000"],
      ["tutor", "Tutor/a de la investigación", "text", "Nombre completo"],
      ["celularTutor", "Celular del tutor/a", "tel", "Ej.: 0981 000 000"],
      ["correo", "Correo principal para notificaciones", "email", "correo@ejemplo.test"],
      ["telefono", "Teléfono alternativo de contacto", "tel", "Número de contacto"],
      ["asignaturas", "Asignaturas involucradas", "text", "Asignatura o departamento"],
      ["programa", "Programa", "select", "Grado|Postgrado"],
      ["fecha", "Fecha de presentación", "date", ""],
    ],
  },
  {
    title: "Planteamiento",
    description: "Definición académica y antecedentes del trabajo.",
    fields: [
      ["titulo", "Título de la investigación", "textarea", "Título provisorio"],
      ["linea", "Línea de investigación", "text", "Línea institucional"],
      ["pregunta", "Pregunta general", "textarea", "Pregunta principal"],
      ["objetivoGeneral", "Objetivo general", "textarea", "Objetivo general"],
      ["objetivosEspecificos", "Objetivos específicos", "textarea", "Un objetivo por línea"],
      ["justificacion", "Justificación", "textarea", "Relevancia y aporte esperado"],
      ["antecedentes", "Antecedentes de la investigación", "textarea", "Síntesis de antecedentes"],
    ],
  },
  {
    title: "Metodología",
    description: "Diseño, población, variables y criterios.",
    fields: [
      ["materialMetodos", "Material y métodos", "textarea", "Enfoque general"],
      ["diseno", "Diseño del estudio", "textarea", "Tipo y diseño"],
      ["ambito", "Ámbito del estudio", "textarea", "Lugar y periodo"],
      ["poblacion", "Población de estudio", "textarea", "Población objetivo"],
      ["inclusion", "Criterios de inclusión", "textarea", "Un criterio por línea"],
      ["exclusion", "Criterios de exclusión", "textarea", "Un criterio por línea"],
      ["muestra", "Tamaño muestral", "textarea", "Cálculo o estimación"],
      ["variables", "Variables del estudio", "textarea", "Variables previstas"],
      ["dependientesPrincipales", "Variables dependientes principales", "textarea", "Desenlaces principales"],
      ["dependientesSecundarias", "Variables dependientes secundarias", "textarea", "Desenlaces secundarios"],
      ["definiciones", "Definiciones operacionales de desenlaces", "textarea", "Definiciones y medición"],
    ],
  },
  {
    title: "Análisis y ética",
    description: "Recolección, análisis, control y viabilidad.",
    fields: [
      ["instrumento", "Instrumento de recolección de datos", "textarea", "Descripción del instrumento"],
      ["procedimiento", "Procedimiento de recolección", "textarea", "Pasos de recolección"],
      ["calidad", "Control de calidad de los datos", "textarea", "Controles previstos"],
      ["analisis", "Plan de análisis estadístico", "textarea", "Métodos de análisis"],
      ["faltantes", "Manejo de datos faltantes", "textarea", "Criterios de manejo"],
      ["sesgos", "Sesgos y estrategias de control", "textarea", "Sesgos previstos y mitigación"],
      ["etica", "Consideraciones éticas", "textarea", "Riesgos, consentimiento y confidencialidad"],
      ["presupuesto", "Presupuesto y cronograma", "textarea", "Recursos, actividades y plazos"],
      ["bibliografia", "Bibliografía", "textarea", "Referencias principales"],
    ],
  },
  { title: "Anexos y envío", description: "Revise la solicitud y simule su presentación.", fields: [] },
];

function renderProtocolField([name, label, type, placeholder]) {
  const value = escapeHtml(applicantDraft[name] || "");
  if (type === "textarea") return `<label class="form-field form-field-wide"><span>${label}</span><textarea data-field="${name}" placeholder="${placeholder}">${value}</textarea></label>`;
  if (type === "select") return `<label class="form-field"><span>${label}</span><select data-field="${name}"><option value="">Seleccione…</option>${placeholder.split("|").map((option) => `<option${value === option ? " selected" : ""}>${option}</option>`).join("")}</select></label>`;
  return `<label class="form-field"><span>${label}</span><input data-field="${name}" type="${type}" value="${value}" placeholder="${placeholder}"></label>`;
}

function applicantSummary() {
  const items = [
    ["Responsable", applicantDraft.coordinador || "Sin completar"],
    ["Correo", applicantDraft.correo || "Sin completar"],
    ["Programa", applicantDraft.programa || "Sin completar"],
    ["Título", applicantDraft.titulo || "Sin completar"],
    ["Línea", applicantDraft.linea || "Sin completar"],
    ["Tutor/a", applicantDraft.tutor || "Sin completar"],
  ];
  return `<div class="review-grid">${items.map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>`;
}

function registrationTemplate() {
  const step = protocolSteps[formStep - 1];
  const stepLabels = protocolSteps.map((item, index) => `<button class="step-dot ${formStep === index + 1 ? "active" : ""} ${formStep > index + 1 ? "complete" : ""}" data-step="${index + 1}" type="button"><span>${formStep > index + 1 ? "✓" : index + 1}</span><small>${item.title}</small></button>`).join("");
  const content = formStep < 5
    ? `<div class="protocol-fields">${step.fields.map(renderProtocolField).join("")}</div>`
    : `<div class="submission-review">
        ${applicantSummary()}
        <div class="upload-grid">
          <label class="upload-card"><span>▣</span><strong>Protocolo completo</strong><small>PDF o DOCX · simulación</small><input class="demo-file" type="file" accept=".pdf,.doc,.docx"></label>
          <label class="upload-card"><span>▤</span><strong>Instrumento de recolección</strong><small>PDF o DOCX · simulación</small><input class="demo-file" type="file" accept=".pdf,.doc,.docx"></label>
        </div>
        <label class="declaration"><input id="declaration" type="checkbox"> <span>Declaro que revisé la información y comprendo que esta maqueta no envía ni almacena datos reales.</span></label>
      </div>`;
  return `<div class="view registration-view">
    ${sectionHead("Ruta de ingreso", "Inscripción de protocolo de investigación", "Complete la versión digital por etapas o descargue el formulario institucional en Word.", `<a class="button button-secondary" href="Formulario_Inscripcion_Protocolo_Investigacion_2025.docx" download>⇩ Descargar Word</a>`)}
    <div class="alert privacy-alert"><span>i</span><div><strong>Formulario de demostración</strong><p>No use nombres, correos, teléfonos ni documentos reales. La versión funcional requerirá autenticación, base privada y envío institucional.</p></div></div>
    <article class="panel protocol-panel">
      <div class="stepper" aria-label="Etapas del formulario">${stepLabels}</div>
      <div class="form-stage"><p class="section-eyebrow">Paso ${formStep} de 5</p><h2>${step.title}</h2><p>${step.description}</p>${content}</div>
      <div class="form-actions">
        <button id="form-back" class="button button-secondary" type="button" ${formStep === 1 ? "disabled" : ""}>← Anterior</button>
        ${formStep < 5 ? `<button id="form-next" class="button button-primary" type="button">Guardar y continuar →</button>` : `<button id="submit-protocol" class="button button-primary" type="button">Simular presentación del protocolo</button>`}
      </div>
    </article>
  </div>`;
}

function submissionRows() {
  return submissions.map((item) => `<tr><td><strong>${item.code}</strong><br><small>${item.date}</small></td><td><b>${escapeHtml(item.title)}</b><br><small>${escapeHtml(item.applicant)}</small></td><td>${item.completeness}% ${progress(item.completeness)}</td><td>${status(item.status)}</td><td><button class="button button-secondary review-submission" data-code="${item.code}" type="button">Revisar</button></td></tr>`).join("");
}

function intakeTemplate() {
  const pending = submissions.filter((item) => item.status === "Por revisar").length;
  const corrections = submissions.filter((item) => item.status === "Corrección solicitada").length;
  const admitted = submissions.filter((item) => item.status === "Admitido").length;
  return `<div class="view">
    ${sectionHead("Control interno", "Mesa de entrada de Investigación", "Bandeja ficticia para recibir, verificar, observar y admitir protocolos.", `<button class="button button-primary" data-go="inscripcion" type="button">＋ Nueva inscripción demo</button>`)}
    <div class="stat-grid">${miniStat(submissions.length,"Solicitudes recibidas","IN")}${miniStat(pending,"Por revisar","?")}${miniStat(corrections,"Con correcciones","!")}${miniStat(admitted,"Admitidas","✓")}</div>
    <article class="panel">
      <div class="panel-head"><div><p class="section-eyebrow">Bandeja interna</p><h2>Solicitudes de protocolo</h2></div><span class="badge">Simulación local</span></div>
      <div class="table-wrap"><table class="intake-table"><thead><tr><th>Solicitud</th><th>Trabajo</th><th>Integridad</th><th>Estado</th><th></th></tr></thead><tbody>${submissionRows()}</tbody></table></div>
    </article>
    <div class="workflow-note"><span>1</span><p><strong>Recepción</strong> del formulario y anexos</p><b>→</b><span>2</span><p><strong>Revisión</strong> técnica y documental</p><b>→</b><span>3</span><p><strong>Admisión</strong> y envío de invitación por correo</p></div>
  </div>`;
}

const templates = { inicio: dashboardTemplate, inscripcion: registrationTemplate, mesa: intakeTemplate, proyectos: projectsTemplate, evidencias: evidenceTemplate, etica: ethicsTemplate, tutorias: tutoringTemplate, evaluaciones: evaluationsTemplate, comunicaciones: communicationsTemplate };

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
  if (activeView === "inscripcion") {
    $$('[data-field]').forEach((field) => field.addEventListener("input", () => { applicantDraft[field.dataset.field] = field.value; }));
    $$('.step-dot').forEach((button) => button.addEventListener("click", () => { formStep = Number(button.dataset.step); navigate("inscripcion", false); }));
    $("#form-back")?.addEventListener("click", () => { if (formStep > 1) { formStep -= 1; navigate("inscripcion", false); } });
    $("#form-next")?.addEventListener("click", () => { if (formStep < 5) { formStep += 1; navigate("inscripcion", false); } });
    $$('.demo-file').forEach((input) => input.addEventListener("change", () => toast("Archivo seleccionado solo para la simulación; no se cargó.")));
    $("#submit-protocol")?.addEventListener("click", simulateSubmission);
  }
  if (activeView === "mesa") bindSubmissionReview();
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

function simulateSubmission() {
  if (!$("#declaration")?.checked) {
    toast("Marque la declaración de demostración para continuar.");
    return;
  }
  const code = `SOL-DEMO-2026-${String(submissions.length + 1).padStart(3, "0")}`;
  submissions.unshift({
    code,
    title: applicantDraft.titulo || "Protocolo nuevo de demostración",
    applicant: applicantDraft.coordinador || "Solicitante de demostración",
    date: "Ahora",
    status: "Por revisar",
    email: applicantDraft.correo || "correo.demo@ejemplo.test",
    completeness: 74,
  });
  showDialog({
    eyebrow: "Presentación simulada",
    title: `Solicitud ${code}`,
    body: `<div class="success-message"><span>✓</span><h3>La solicitud ingresó a la mesa de entrada ficticia.</h3><p>En el sistema real, la Dirección revisaría el protocolo y enviaría al correo declarado una invitación de acceso de un solo uso. Aquí no se guardó ni se envió información.</p><button class="button button-secondary" data-dialog-go="mesa" type="button">Ver mesa de entrada</button></div>`,
  });
  $("[data-dialog-go]")?.addEventListener("click", () => { closeDialog(); demoRole = "team"; updateProfile(); navigate("mesa"); });
}

function bindSubmissionReview() {
  $$('.review-submission').forEach((button) => button.addEventListener("click", () => {
    const item = submissions.find((submission) => submission.code === button.dataset.code);
    showDialog({
      eyebrow: "Control de admisión",
      title: item.code,
      body: `<div class="info-list"><div class="info-row"><span>Trabajo</span><strong>${escapeHtml(item.title)}</strong></div><div class="info-row"><span>Solicitante</span><strong>${escapeHtml(item.applicant)}</strong></div><div class="info-row"><span>Canal de contacto</span><strong>${escapeHtml(item.email)}</strong></div><div class="info-row"><span>Estado</span><strong>${item.status}</strong></div></div><fieldset class="checklist"><legend>Lista de control ficticia</legend><label><input type="checkbox" checked> Identificación y contacto</label><label><input type="checkbox" checked> Planteamiento y objetivos</label><label><input type="checkbox"> Metodología completa</label><label><input type="checkbox"> Anexos e instrumento</label></fieldset><div class="review-actions"><button class="button button-secondary submission-action" data-action="Corrección solicitada" type="button">Solicitar corrección</button><button class="button button-primary submission-action" data-action="Admitido" type="button">Admitir y simular invitación</button></div>`,
    });
    $$('.submission-action', $("#dialog-body")).forEach((action) => action.addEventListener("click", () => {
      item.status = action.dataset.action;
      if (item.status === "Admitido") item.completeness = 100;
      closeDialog();
      navigate("mesa", false);
      toast(item.status === "Admitido" ? "Admisión simulada. No se envió ningún correo." : "Solicitud marcada para corrección.");
    }));
  }));
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

function updateProfile() {
  const isApplicant = demoRole === "applicant";
  $("#profile-name").textContent = isApplicant ? "Solicitante de demostración" : "Gestora de demostración";
  $("#profile-role").textContent = isApplicant ? "Portal de inscripción" : "Equipo de Investigación";
  $(".avatar").textContent = isApplicant ? "SD" : "GD";
}

function enterDemo(role = "team", destination = "inicio") {
  demoRole = role;
  $("#login-screen").hidden = true;
  $("#app-shell").hidden = false;
  updateProfile();
  const requested = location.hash.replace("#", "");
  navigate(views[requested] ? requested : destination, false);
}

function leaveDemo() {
  $("#app-shell").hidden = true;
  $("#login-screen").hidden = false;
  history.replaceState(null, "", location.pathname);
  $("#applicant-entry").focus();
}

$("#applicant-entry").addEventListener("click", () => enterDemo("applicant", "inscripcion"));
$("#team-entry").addEventListener("click", () => enterDemo("team", "mesa"));
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
