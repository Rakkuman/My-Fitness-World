const routine = [
  {
    name: "Pecho + triceps",
    focus: "Empuje",
    exercises: [
      ["Press de pecho en maquina", "3 x 10-12"],
      ["Press inclinado con mancuernas", "3 x 10"],
      ["Aperturas en maquina o polea", "2 x 12-15"],
      ["Flexiones inclinadas", "2 x 8-12"],
      ["Triceps en polea", "3 x 12"],
      ["Extension de triceps sobre cabeza", "2 x 12"],
      ["Cardio suave", "10-15 min"]
    ]
  },
  {
    name: "Espalda + biceps",
    focus: "Tiron",
    exercises: [
      ["Jalon al pecho", "3 x 10-12"],
      ["Remo sentado en polea", "3 x 10-12"],
      ["Remo con pecho apoyado", "3 x 10"],
      ["Pullover en polea o maquina", "2 x 12"],
      ["Face pull", "2 x 15"],
      ["Curl biceps con mancuernas", "3 x 12"],
      ["Curl martillo", "2 x 12"],
      ["Cardio suave", "10-15 min"]
    ]
  },
  {
    name: "Piernas: cuadriceps",
    focus: "Pierna A",
    exercises: [
      ["Prensa de piernas", "3 x 10-12"],
      ["Sentadilla a caja o goblet squat", "3 x 8-10"],
      ["Extension de piernas", "3 x 12"],
      ["Zancadas asistidas o step-up bajo", "2 x 8 por pierna"],
      ["Elevacion de pantorrillas", "3 x 12-15"],
      ["Dead bug", "3 x 10 por lado"],
      ["Bicicleta suave", "10 min"]
    ]
  },
  {
    name: "Hombros + abdomen",
    focus: "Estabilidad",
    exercises: [
      ["Press hombros en maquina", "3 x 10"],
      ["Elevaciones laterales", "3 x 12-15"],
      ["Pajaros / reverse fly", "3 x 12-15"],
      ["Face pull", "2 x 15"],
      ["Encogimientos de trapecio", "2 x 12"],
      ["Pallof press", "3 x 10 por lado"],
      ["Plancha", "3 x 20-30 seg"],
      ["Caminata inclinada suave", "10-15 min"]
    ]
  },
  {
    name: "Piernas: gluteo/femoral",
    focus: "Pierna B",
    exercises: [
      ["Peso muerto rumano con mancuernas", "3 x 10"],
      ["Curl femoral sentado o acostado", "3 x 12"],
      ["Hip thrust en maquina o barra liviana", "3 x 10-12"],
      ["Prensa con pies un poco mas altos", "2 x 12"],
      ["Abduccion de cadera en maquina", "2 x 15"],
      ["Pantorrillas", "3 x 12-15"],
      ["Cardio suave", "10 min"]
    ]
  }
];

const storageKey = "registro-fit-v1";
const today = new Date().toISOString().slice(0, 10);
const state = loadState();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  const fallback = { sessions: [], body: [], selectedDay: 0, profile: { startWeight: 130 } };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(storageKey)) };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderDayOptions() {
  const select = $("#daySelect");
  select.innerHTML = routine
    .map((day, index) => `<option value="${index}">Dia ${index + 1}: ${day.name}</option>`)
    .join("");
  select.value = state.selectedDay;
}

function renderToday() {
  const day = routine[state.selectedDay];
  $("#todayTitle").textContent = day.name;
  $("#todayExercises").innerHTML = day.exercises
    .map(
      ([name, target]) => `
        <article class="exercise-card">
          <div class="exercise-row">
            <div>
              <h3>${name}</h3>
              <p>${target}</p>
            </div>
            <span class="tag">${day.focus}</span>
          </div>
        </article>`
    )
    .join("");
}

function renderPlan() {
  $("#planGrid").innerHTML = routine
    .map(
      (day, index) => `
        <article class="plan-card">
          <p class="eyebrow">Dia ${index + 1} · ${day.focus}</p>
          <h3>${day.name}</h3>
          <p>${day.exercises.map(([name, target]) => `${name} (${target})`).join(" · ")}</p>
        </article>`
    )
    .join("");
}

function renderBodyTable() {
  const rows = [...state.body].sort((a, b) => b.date.localeCompare(a.date));
  $("#bodyTable").innerHTML = rows.length
    ? rows
        .map(
          (entry) => `
            <tr>
              <td>${entry.date}</td>
              <td>${formatValue(entry.weight, "kg")}</td>
              <td>${formatValue(entry.waist, "cm")}</td>
              <td>${formatValue(entry.chest, "cm")}</td>
              <td>${formatValue(entry.hips, "cm")}</td>
              <td>${formatValue(entry.arm, "cm")}</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="6">Todavia no hay medidas guardadas.</td></tr>`;
}

function renderHistory() {
  const sessions = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
  $("#historyList").innerHTML = sessions.length
    ? sessions
        .map(
          (session) => `
            <article class="history-card">
              <div>
                <strong>${session.date} · ${session.dayName}</strong>
                <p>${session.duration} min · Energia ${session.energy}/5${session.notes ? ` · ${session.notes}` : ""}</p>
              </div>
              <button class="delete-button" data-delete="${session.id}" title="Eliminar sesion">x</button>
            </article>`
        )
        .join("")
    : `<article class="history-card"><p>No hay sesiones guardadas todavia.</p></article>`;
}

function renderSummary() {
  const latestBody = [...state.body].sort((a, b) => b.date.localeCompare(a.date))[0];
  $("#startWeight").textContent = `${state.profile.startWeight} kg`;
  $("#currentWeight").textContent = latestBody?.weight ? `${latestBody.weight} kg` : "--";
  $("#sessionCount").textContent = state.sessions.length;
  $("#streakCount").textContent = `${calculateStreak()} dias`;
}

function formatValue(value, unit) {
  return value ? `${value} ${unit}` : "--";
}

function calculateStreak() {
  const dates = new Set(state.sessions.map((session) => session.date));
  let streak = 0;
  const cursor = new Date(today);
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderAll() {
  renderDayOptions();
  renderToday();
  renderPlan();
  renderBodyTable();
  renderHistory();
  renderSummary();
}

function switchView(viewName) {
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewName));
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}View`));
}

function downloadJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `registro-fit-${today}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      Object.assign(state, imported);
      saveState();
      renderAll();
    } catch {
      alert("No pude importar ese archivo.");
    }
  };
  reader.readAsText(file);
}

function setupInstallPrompt() {
  let promptEvent;
  const button = $("#installButton");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    promptEvent = event;
    button.hidden = false;
  });
  button.addEventListener("click", async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    promptEvent = undefined;
    button.hidden = true;
  });
}

function bindEvents() {
  $("#sessionDate").value = today;
  $("#bodyDate").value = today;
  $("#weight").value = "";

  $$(".tab").forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  $("#daySelect").addEventListener("change", (event) => {
    state.selectedDay = Number(event.target.value);
    saveState();
    renderToday();
  });
  $("#sessionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const day = routine[state.selectedDay];
    state.sessions.push({
      id: crypto.randomUUID(),
      date: $("#sessionDate").value,
      dayIndex: state.selectedDay,
      dayName: day.name,
      energy: Number($("#energy").value),
      duration: Number($("#duration").value),
      notes: $("#notes").value.trim()
    });
    $("#notes").value = "";
    saveState();
    renderAll();
    switchView("history");
  });
  $("#bodyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.body.push({
      date: $("#bodyDate").value,
      weight: Number($("#weight").value),
      waist: Number($("#waist").value) || "",
      chest: Number($("#chest").value) || "",
      hips: Number($("#hips").value) || "",
      arm: Number($("#arm").value) || ""
    });
    saveState();
    renderAll();
  });
  $("#historyList").addEventListener("click", (event) => {
    const id = event.target.dataset.delete;
    if (!id) return;
    state.sessions = state.sessions.filter((session) => session.id !== id);
    saveState();
    renderAll();
  });
  $("#exportButton").addEventListener("click", downloadJson);
  $("#importFile").addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) importJson(file);
    event.target.value = "";
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

bindEvents();
renderAll();
setupInstallPrompt();
