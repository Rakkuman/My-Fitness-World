import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5FEwH59Z_nWzQ0M7kpJkvnBcfTBwI2B0",
  authDomain: "my-fitness-world.firebaseapp.com",
  projectId: "my-fitness-world",
  storageBucket: "my-fitness-world.firebasestorage.app",
  messagingSenderId: "1023020459633",
  appId: "1:1023020459633:web:b175223108470e1464ddd0",
  measurementId: "G-237K7M3WZ3"
};

const routine = [
  {
    name: "Pecho + triceps",
    focus: "Empuje",
    exercises: [
      {
        name: "Press de pecho en maquina",
        target: "3 series x 10-12 repeticiones",
        rest: "Descanso: 75-90 segundos",
        description: "Empuja con el pecho, manteniendo la espalda apoyada y los hombros abajo. No bloquees los codos con fuerza al final.",
        cue: "Termina con 2 repeticiones en reserva."
      },
      {
        name: "Press inclinado con mancuernas",
        target: "3 series x 10 repeticiones",
        rest: "Descanso: 75-90 segundos",
        description: "Trabaja la zona superior del pecho. Baja las mancuernas controlado hasta que los codos queden cerca de la linea del pecho.",
        cue: "Si los hombros molestan, reduce inclinacion o carga."
      },
      {
        name: "Aperturas en maquina o polea",
        target: "2 series x 12-15 repeticiones",
        rest: "Descanso: 60 segundos",
        description: "Abre y cierra los brazos como si abrazaras un arbol. Busca sentir estiramiento en pecho, no dolor en hombro.",
        cue: "Movimiento lento, sin rebotes."
      },
      {
        name: "Flexiones inclinadas",
        target: "2 series x 8-12 repeticiones",
        rest: "Descanso: 60-75 segundos",
        description: "Apoya las manos en banco o barra alta. MantÃ©n abdomen firme y baja el pecho hacia el apoyo.",
        cue: "Mientras mas alto el apoyo, mas facil."
      },
      {
        name: "Triceps en polea",
        target: "3 series x 12 repeticiones",
        rest: "Descanso: 60 segundos",
        description: "MantÃ©n los codos pegados al cuerpo y empuja la cuerda o barra hacia abajo hasta extender los brazos.",
        cue: "No balancees el tronco."
      },
      {
        name: "Extension de triceps sobre cabeza",
        target: "2 series x 12 repeticiones",
        rest: "Descanso: 60 segundos",
        description: "Lleva la cuerda o mancuerna por detras de la cabeza y extiende. MantÃ©n costillas abajo y abdomen firme.",
        cue: "Debe sentirse el triceps, no la espalda baja."
      },
      {
        name: "Cardio suave",
        target: "10-15 minutos",
        rest: "Intensidad: comoda",
        description: "Caminata, bicicleta o eliptica suave para terminar la sesion y mejorar condicion sin castigar articulaciones.",
        cue: "Respira agitado, pero aun puedes hablar."
      }
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

const challengeCatalog = [
  {
    id: "seal-basic-calisthenics",
    force: "SEALs",
    style: "calistenia",
    level: "principiante",
    title: "Base anfibia",
    goal: "Resistencia muscular sin equipamiento.",
    work: ["Flexiones inclinadas x 10", "Sentadillas a caja x 15", "Plancha 20 seg", "Caminata rapida 8 min"],
    rounds: "3 rondas",
    safety: "Mantén respiracion controlada. Si hay dolor de rodilla/hombro, reduce rango."
  },
  {
    id: "seal-intermediate-conditioning",
    force: "SEALs",
    style: "calistenia",
    level: "intermedio",
    title: "Circuito de playa",
    goal: "Capacidad de trabajo con peso corporal.",
    work: ["Flexiones x 15", "Zancadas x 10 por pierna", "Mountain climbers x 20", "Plancha 35 seg", "Caminata/carrera suave 10 min"],
    rounds: "4 rondas",
    safety: "No hagas sprints si hay sobrecarga articular."
  },
  {
    id: "sas-ruck-mixed",
    force: "SAS",
    style: "mixto",
    level: "principiante",
    title: "Marcha controlada",
    goal: "Resistencia de bajo impacto.",
    work: ["Caminata 25-35 min", "Mochila liviana opcional", "Step-up bajo x 8 por pierna", "Bird dog x 10 por lado"],
    rounds: "1 bloque continuo",
    safety: "Mochila liviana: 3-5 kg maximo al inicio."
  },
  {
    id: "sas-hill-prep",
    force: "SAS",
    style: "mixto",
    level: "intermedio",
    title: "Preparacion de colina",
    goal: "Piernas, pulmones y tolerancia al esfuerzo.",
    work: ["Caminata inclinada 12 min", "Step-up x 12 por pierna", "Farmer carry con bolsas/mancuernas 30 m", "Plancha 30 seg"],
    rounds: "3 rondas",
    safety: "Evita impacto. Prioriza inclinacion y control."
  },
  {
    id: "lautaro-functional",
    force: "Lautaro",
    style: "mixto",
    level: "principiante",
    title: "Movilidad operativa",
    goal: "Moverte mejor, resistir mas, cuidar articulaciones.",
    work: ["Sentadilla a caja x 12", "Remo con banda/mochila x 12", "Caminata rapida 10 min", "Dead bug x 10 por lado"],
    rounds: "3 rondas",
    safety: "Ritmo firme, no maximo."
  },
  {
    id: "spetsnaz-strength-gym",
    force: "Spetsnaz",
    style: "gym",
    level: "intermedio",
    title: "Fuerza austera",
    goal: "Fuerza basica con movimientos grandes.",
    work: ["Prensa x 10", "Remo sentado x 10", "Press pecho maquina x 10", "Farmer walk x 30 m", "Bicicleta 8 min"],
    rounds: "3-4 rondas",
    safety: "Carga moderada. RPE 7-8, sin fallo."
  },
  {
    id: "royal-marines-gym",
    force: "Royal Marines",
    style: "gym",
    level: "principiante",
    title: "Circuito comando base",
    goal: "Fuerza general y cardio controlado.",
    work: ["Jalon al pecho x 12", "Prensa x 12", "Press hombros maquina x 10", "Caminata inclinada 8 min"],
    rounds: "3 rondas",
    safety: "Descansa 60-90 seg entre estaciones."
  },
  {
    id: "legion-mixed",
    force: "Legion extranjera",
    style: "mixto",
    level: "intermedio",
    title: "Resistencia de patrulla",
    goal: "Constancia mental y capacidad aerobica.",
    work: ["Caminata rapida 20 min", "Flexiones inclinadas x 12", "Zancadas asistidas x 10 por pierna", "Carry con mochila 40 m"],
    rounds: "2 bloques",
    safety: "Manten postura alta con mochila."
  },
  {
    id: "delta-gym",
    force: "Delta Force",
    style: "gym",
    level: "avanzado",
    title: "Fuerza y motor",
    goal: "Combinar fuerza, agarre y cardio.",
    work: ["Peso muerto rumano x 8", "Press pecho x 8", "Remo x 10", "Farmer carry 40 m", "Remo/bici 10 min"],
    rounds: "4 rondas",
    safety: "Solo si dominas tecnica. No usar cargas maximas."
  }
];

const specialForcesLibrary = [
  { id: "us-navy-seals", flag: "🇺🇸", country: "Estados Unidos", force: "Navy SEALs", baseDifficulty: 5 },
  { id: "us-delta-force", flag: "🇺🇸", country: "Estados Unidos", force: "Delta Force", baseDifficulty: 5 },
  { id: "us-green-berets", flag: "🇺🇸", country: "Estados Unidos", force: "Green Berets", baseDifficulty: 4 },
  { id: "uk-sas", flag: "🇬🇧", country: "Reino Unido", force: "SAS", baseDifficulty: 5 },
  { id: "uk-sbs", flag: "🇬🇧", country: "Reino Unido", force: "SBS", baseDifficulty: 5 },
  { id: "uk-royal-marines", flag: "🇬🇧", country: "Reino Unido", force: "Royal Marines Commandos", baseDifficulty: 4 },
  { id: "cl-lautaro", flag: "🇨🇱", country: "Chile", force: "Brigada Lautaro", baseDifficulty: 5 },
  { id: "cl-boinas-negras", flag: "🇨🇱", country: "Chile", force: "Comandos / Boinas Negras", baseDifficulty: 4 },
  { id: "ru-spetsnaz", flag: "🇷🇺", country: "Rusia", force: "Spetsnaz", baseDifficulty: 5 },
  { id: "fr-gign", flag: "🇫🇷", country: "Francia", force: "GIGN", baseDifficulty: 4 },
  { id: "fr-commando-marine", flag: "🇫🇷", country: "Francia", force: "Commandos Marine", baseDifficulty: 5 },
  { id: "de-ksk", flag: "🇩🇪", country: "Alemania", force: "KSK", baseDifficulty: 5 },
  { id: "it-col-moschin", flag: "🇮🇹", country: "Italia", force: "Col Moschin", baseDifficulty: 5 },
  { id: "es-goe", flag: "🇪🇸", country: "España", force: "GOE", baseDifficulty: 4 },
  { id: "pl-grom", flag: "🇵🇱", country: "Polonia", force: "GROM", baseDifficulty: 5 },
  { id: "il-sayeret-matkal", flag: "🇮🇱", country: "Israel", force: "Sayeret Matkal", baseDifficulty: 5 },
  { id: "in-marcosp", flag: "🇮🇳", country: "India", force: "MARCOS", baseDifficulty: 5 },
  { id: "pk-ssg", flag: "🇵🇰", country: "Pakistan", force: "SSG", baseDifficulty: 4 },
  { id: "au-sasr", flag: "🇦🇺", country: "Australia", force: "SASR", baseDifficulty: 5 },
  { id: "nz-sas", flag: "🇳🇿", country: "Nueva Zelanda", force: "NZSAS", baseDifficulty: 5 },
  { id: "ca-jtf2", flag: "🇨🇦", country: "Canada", force: "JTF2", baseDifficulty: 5 },
  { id: "br-grumec", flag: "🇧🇷", country: "Brasil", force: "GRUMEC", baseDifficulty: 5 },
  { id: "br-para-sar", flag: "🇧🇷", country: "Brasil", force: "PARA-SAR", baseDifficulty: 4 },
  { id: "mx-fes", flag: "🇲🇽", country: "Mexico", force: "FES", baseDifficulty: 4 },
  { id: "co-afespeciales", flag: "🇨🇴", country: "Colombia", force: "Fuerzas Especiales", baseDifficulty: 4 },
  { id: "ar-601", flag: "🇦🇷", country: "Argentina", force: "Compania de Comandos 601", baseDifficulty: 4 },
  { id: "pe-foes", flag: "🇵🇪", country: "Peru", force: "FOES", baseDifficulty: 4 },
  { id: "za-recce", flag: "🇿🇦", country: "Sudafrica", force: "Recces", baseDifficulty: 5 },
  { id: "jp-sfgp", flag: "🇯🇵", country: "Japon", force: "SFGp", baseDifficulty: 4 },
  { id: "kr-707", flag: "🇰🇷", country: "Corea del Sur", force: "707th Special Mission Group", baseDifficulty: 5 },
  { id: "id-kopassus", flag: "🇮🇩", country: "Indonesia", force: "Kopassus", baseDifficulty: 4 },
  { id: "tr-mak", flag: "🇹🇷", country: "Turquia", force: "MAK", baseDifficulty: 4 },
  { id: "eg-777", flag: "🇪🇬", country: "Egipto", force: "Unit 777", baseDifficulty: 4 }
];

const appVersion = "1.9.0";
const releaseNote = "Seccion de retos militares inspirados por estilo: calistenia, gym y mixto.";
const storageKey = "registro-fit-v1";
const today = new Date().toISOString().slice(0, 10);
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

let currentUser = null;
let cloudSaveTimer = null;
let sessionMode = "locked";
const state = defaultState();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function defaultState() {
  return {
    sessions: [],
    body: [],
    assessments: [],
    selectedDay: 0,
    completedDays: {},
    completedChallenges: [],
    profile: {
      name: "",
      age: "",
      sex: "masculino",
      height: 185,
      startWeight: 130,
      level: "principiante",
      goal: "Bajar grasa, ganar musculo, fuerza, salud y rendimiento.",
      trainingDays: 5,
      trainingPlace: "gimnasio",
      trainingStyle: "maquinas",
      equipment: ["maquinas", "mancuernas", "poleas", "banco"],
      nutritionMethod: "recomposicion",
      mealCount: 4,
      appetiteLevel: "normal",
      availableFoods: "",
      foodRestrictions: "",
      dislikedFoods: "",
      limitations: "",
      habits: "",
      onboardingComplete: false,
      seenVersion: ""
    }
  };
}

function loadState() {
  const fallback = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
    return { ...fallback, ...saved, profile: { ...fallback.profile, ...saved.profile } };
  } catch {
    return fallback;
  }
}

function saveState({ syncCloud = true } = {}) {
  if (sessionMode === "guest" || sessionMode === "locked") return;
  localStorage.setItem(storageKey, JSON.stringify(state));
  if (syncCloud && currentUser) queueCloudSave();
}

function replaceState(nextState = defaultState()) {
  const fallback = defaultState();
  Object.assign(state, {
    ...fallback,
    ...nextState,
    profile: { ...fallback.profile, ...nextState.profile }
  });
}

function showWelcome() {
  $("#welcomeView").hidden = false;
  $("#appShell").hidden = true;
}

function showApp() {
  $("#welcomeView").hidden = true;
  $("#appShell").hidden = false;
}

function showOnboarding() {
  $("#onboardingView").hidden = false;
}

function hideOnboarding() {
  $("#onboardingView").hidden = true;
}

function userDocRef() {
  return doc(db, "users", currentUser.uid);
}

async function loadCloudState(user) {
  currentUser = user;
  sessionMode = "account";
  setAccountStatus("Sincronizando perfil...");
  const snapshot = await getDoc(userDocRef());
  let isNewProfile = false;
  if (snapshot.exists()) {
    replaceState(snapshot.data());
    saveState({ syncCloud: false });
  } else {
    isNewProfile = true;
    replaceState(loadState());
    await saveCloudNow();
  }
  setAccountStatus(`Conectado como ${user.email}. Tus datos se guardan en la nube.`);
  showApp();
  renderAll();
  if (isNewProfile || !state.profile.onboardingComplete) {
    populateOnboarding();
    showOnboarding();
  }
}

function queueCloudSave() {
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveCloudNow, 650);
}

async function saveCloudNow() {
  if (!currentUser) return;
  await setDoc(
    userDocRef(),
    {
      sessions: state.sessions,
      body: state.body,
      assessments: state.assessments,
      selectedDay: state.selectedDay,
      completedDays: state.completedDays,
      completedChallenges: state.completedChallenges,
      profile: state.profile,
      appVersion,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

function setAccountStatus(message) {
  $("#accountStatus").textContent = message;
}

function setAppAccountStatus(message) {
  $("#appAccountStatus").textContent = message;
}

function renderAccount() {
  const isSignedIn = Boolean(currentUser);
  const isGuest = sessionMode === "guest";
  $("#accountTitle").textContent = isSignedIn ? state.profile.name || "Perfil activo" : "Invitado";
  $("#accountEyebrow").textContent = isSignedIn ? "Cuenta sincronizada" : "Sesion temporal";
  $("#logoutButton").hidden = !isSignedIn;
  $("#exitGuestButton").hidden = !isGuest;
  if (isSignedIn) {
    setAppAccountStatus(`Conectado como ${currentUser.email}. Tus datos se guardan en Firebase.`);
  } else if (isGuest) {
    setAppAccountStatus("Modo invitado: puedes probar la app, pero nada se guardara al salir.");
  }
}

function renderDayOptions() {
  updateSuggestedTrainingDay();
}

function renderToday() {
  updateSuggestedTrainingDay();
  const activeDay = getActiveTrainingDayIndex();
  const day = activeDay === null ? null : getPersonalizedDay(activeDay);
  $("#todayTitle").textContent = day?.name || "Descanso";
  $("#todayExercises").innerHTML = day
    ? day.exercises.map((exercise) => {
      const item = normalizeExercise(exercise);
      return `
        <article class="exercise-card">
          <div class="exercise-row">
            <div>
              <h3>${item.name}</h3>
              <p class="exercise-target">${item.target}</p>
              ${item.description ? `<p>${item.description}</p>` : ""}
              <div class="exercise-meta">
                ${item.rest ? `<span>${item.rest}</span>` : ""}
                ${item.cue ? `<span>${item.cue}</span>` : ""}
              </div>
            </div>
            <span class="tag">${day.focus}</span>
          </div>
        </article>`;
    })
    .join("")
    : `<article class="history-card"><p>Hoy no hay entrenamiento activo. La app volvera automaticamente al Dia 1 el proximo lunes.</p></article>`;
  renderTrainingStatus();
}

function updateSuggestedTrainingDay() {
  const activeDay = getActiveTrainingDayIndex();
  if (activeDay !== null) state.selectedDay = activeDay;
}

function renderTrainingStatus() {
  const now = new Date();
  const weekKey = getWeekKey(now);
  const scheduledDay = getScheduledTrainingDayIndex(now);
  const missedDays = getMissedTrainingDays(now);
  const recoveryDay = getSaturdayRecoveryDayIndex(now);
  const activeDay = getActiveTrainingDayIndex(now);
  const completedToday = activeDay !== null && isTrainingDayCompleted(activeDay, weekKey);
  const isRestDay = activeDay === null;
  $("#completeDayButton").hidden = isRestDay || completedToday;
  const status = $("#trainingStatus");
  const weeklyItems = routine
    .map((day, index) => {
      const done = isTrainingDayCompleted(index, weekKey);
      return `<span class="week-pill ${done ? "is-done" : ""}">${done ? "OK " : ""}Dia ${index + 1}</span>`;
    })
    .concat(recoveryDay !== null ? [`<span class="week-pill recovery-pill">Dia 6 recuperacion</span>`] : [])
    .join("");
  let title = "Plan de la semana";
  let message = "La app selecciona automaticamente el entrenamiento que toca segun tu semana.";
  if (recoveryDay !== null) {
    title = `Dia 6: recuperar Dia ${recoveryDay + 1}`;
    message = "Sabado se activa solo porque quedo exactamente un entrenamiento pendiente esta semana.";
  } else if (now.getDay() === 6 && missedDays.length > 1) {
    title = "Semana incompleta";
    message = "Quedaron varios dias pendientes. No se activa Dia 6; el lunes la app reinicia el plan en Dia 1.";
  } else if (activeDay !== null && scheduledDay !== null && activeDay < scheduledDay) {
    title = `Recuperar Dia ${activeDay + 1}`;
    message = "Hay un entrenamiento anterior sin completar. Hazlo primero para recuperar el orden antes de avanzar.";
  } else if (scheduledDay === null) {
    title = now.getDay() === 0 ? "Cierre de semana" : "Descanso programado";
    message = now.getDay() === 0
      ? "Domingo queda como descanso. El proximo lunes la app vuelve automaticamente al Dia 1."
      : "Hoy no hay rutina fija. Puedes descansar o hacer movilidad suave.";
  } else if (completedToday) {
    title = `Dia ${activeDay + 1} completado`;
    message = "Buen trabajo. El siguiente dia de entrenamiento se activara automaticamente.";
  } else {
    title = `Hoy toca Dia ${activeDay + 1}`;
    message = "Completa y guarda la sesion para marcar este dia como cumplido.";
  }
  status.innerHTML = `
    <div>
      <p class="eyebrow">${title}</p>
      <h2>${activeDay === null ? "Descanso" : routine[activeDay].name}</h2>
      <p class="muted-text">${message}</p>
    </div>
    <div class="week-progress">${weeklyItems}</div>
  `;
}
function getScheduledTrainingDayIndex(date = new Date()) {
  const day = date.getDay();
  if (day >= 1 && day <= 5) return day - 1;
  return null;
}

function getActiveTrainingDayIndex(date = new Date()) {
  const recoveryDay = getSaturdayRecoveryDayIndex(date);
  if (recoveryDay !== null) return recoveryDay;
  const scheduled = getScheduledTrainingDayIndex(date);
  if (scheduled === null) return null;
  const missedDay = getFirstMissedTrainingDay(date);
  return missedDay ?? scheduled;
}

function getFirstMissedTrainingDay(date = new Date()) {
  const missedDays = getMissedTrainingDays(date);
  return missedDays[0] ?? null;
}

function getMissedTrainingDays(date = new Date()) {
  const scheduled = getScheduledTrainingDayIndex(date);
  const day = date.getDay();
  const lastRequiredExclusive = day === 6 ? 5 : scheduled;
  if (lastRequiredExclusive === null || day === 0) return [];
  const weekKey = getWeekKey(date);
  const missed = [];
  for (let index = 0; index < lastRequiredExclusive; index += 1) {
    if (!isTrainingDayCompleted(index, weekKey)) missed.push(index);
  }
  return missed;
}

function getSaturdayRecoveryDayIndex(date = new Date()) {
  if (date.getDay() !== 6) return null;
  const missedDays = getMissedTrainingDays(date);
  return missedDays.length === 1 ? missedDays[0] : null;
}

function isTrainingDayCompleted(dayIndex, weekKey = getWeekKey(new Date())) {
  return Boolean(state.completedDays?.[weekKey]?.[dayIndex]);
}

function markTrainingDayCompleted(dayIndex, dateValue) {
  const weekKey = getWeekKey(new Date(`${dateValue}T12:00:00`));
  state.completedDays = state.completedDays || {};
  state.completedDays[weekKey] = state.completedDays[weekKey] || {};
  state.completedDays[weekKey][dayIndex] = true;
}

function getWeekKey(date) {
  const cursor = new Date(date);
  cursor.setHours(12, 0, 0, 0);
  const day = cursor.getDay() || 7;
  cursor.setDate(cursor.getDate() + 4 - day);
  const yearStart = new Date(cursor.getFullYear(), 0, 1);
  const week = Math.ceil((((cursor - yearStart) / 86400000) + 1) / 7);
  return `${cursor.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function normalizeExercise(exercise) {
  if (Array.isArray(exercise)) {
    return { name: exercise[0], target: exercise[1], rest: "", description: "", cue: "" };
  }
  return exercise;
}

function getPersonalizedDay(dayIndex) {
  const day = routine[dayIndex];
  const variant = getRoutineVariant(dayIndex, resolveTrainingStyle());
  return variant ? { ...day, exercises: variant } : day;
}

function resolveTrainingStyle() {
  const place = state.profile.trainingPlace || "gimnasio";
  const style = state.profile.trainingStyle || "maquinas";
  const equipment = state.profile.equipment || [];
  const hasMachines = equipment.includes("maquinas") || equipment.includes("poleas");
  const hasWeights = equipment.includes("mancuernas") || equipment.includes("barra");
  const bodyOnly = equipment.length === 0 || equipment.every((item) => item === "peso-corporal" || item === "bandas");

  if (style === "calistenia") return "calistenia";
  if (style === "maquinas" && hasMachines) return "maquinas";
  if (style === "pesas" && hasWeights) return "pesas";
  if (place === "casa" && bodyOnly) return "calistenia";
  if (place === "casa" && hasWeights) return "pesas";
  if (place === "gimnasio" && hasMachines) return "maquinas";
  if (place === "gimnasio" && hasWeights) return "pesas";
  if (style === "mixto" && hasMachines) return "maquinas";
  if (style === "mixto" && hasWeights) return "pesas";
  return "calistenia";
}

function getRoutineVariant(dayIndex, style) {
  const variants = {
    0: {
      maquinas: routine[0].exercises,
      pesas: [
        ["Press banca con mancuernas", "3 x 10-12"],
        ["Press inclinado con mancuernas", "3 x 10"],
        ["Aperturas con mancuernas", "2 x 12-15"],
        ["Flexiones inclinadas", "2 x 8-12"],
        ["Press frances con mancuerna", "3 x 12"],
        ["Extension de triceps con mancuerna", "2 x 12"],
        ["Cardio suave", "10-15 min"]
      ],
      calistenia: [
        ["Flexiones inclinadas", "4 x 8-12"],
        ["Flexiones con rodillas o normales", "3 x 6-10"],
        ["Fondos asistidos en banco", "3 x 8-12"],
        ["Plancha alta con toque de hombro", "2 x 10 por lado"],
        ["Extension de triceps en pared", "2 x 10-12"],
        ["Caminata suave", "10-15 min"]
      ]
    },
    1: {
      maquinas: routine[1].exercises,
      pesas: [
        ["Remo con mancuerna apoyado", "3 x 10-12"],
        ["Remo inclinado con mancuernas", "3 x 10"],
        ["Pullover con mancuerna", "2 x 12"],
        ["Reverse fly con mancuernas", "2 x 12-15"],
        ["Curl biceps con mancuernas", "3 x 12"],
        ["Curl martillo", "2 x 12"],
        ["Cardio suave", "10-15 min"]
      ],
      calistenia: [
        ["Remo invertido asistido", "3 x 6-10"],
        ["Superman controlado", "3 x 12"],
        ["Y-T-W en el suelo", "2 x 8 cada letra"],
        ["Curl con banda o mochila", "3 x 12"],
        ["Isometria de espalda", "2 x 20 seg"],
        ["Caminata suave", "10-15 min"]
      ]
    },
    2: {
      maquinas: routine[2].exercises,
      pesas: [
        ["Goblet squat", "3 x 8-10"],
        ["Zancadas asistidas", "3 x 8 por pierna"],
        ["Step-up bajo con mancuernas", "2 x 8 por pierna"],
        ["Sentadilla a caja", "3 x 10"],
        ["Pantorrillas con mancuernas", "3 x 12-15"],
        ["Dead bug", "3 x 10 por lado"]
      ],
      calistenia: [
        ["Sentadilla a caja", "4 x 8-12"],
        ["Zancada atras asistida", "3 x 8 por pierna"],
        ["Step-up bajo", "3 x 8 por pierna"],
        ["Wall sit", "3 x 20-30 seg"],
        ["Pantorrillas de pie", "3 x 15"],
        ["Dead bug", "3 x 10 por lado"]
      ]
    },
    3: {
      maquinas: routine[3].exercises,
      pesas: [
        ["Press hombros con mancuernas", "3 x 10"],
        ["Elevaciones laterales", "3 x 12-15"],
        ["Pajaros con mancuernas", "3 x 12-15"],
        ["Encogimientos con mancuernas", "2 x 12"],
        ["Pallof press con banda", "3 x 10 por lado"],
        ["Plancha", "3 x 20-30 seg"]
      ],
      calistenia: [
        ["Pike push-up inclinado", "3 x 6-10"],
        ["Elevacion lateral con banda", "3 x 12"],
        ["Plancha con toque de hombro", "3 x 10 por lado"],
        ["Bird dog", "3 x 10 por lado"],
        ["Plancha", "3 x 20-30 seg"],
        ["Caminata inclinada suave", "10 min"]
      ]
    },
    4: {
      maquinas: routine[4].exercises,
      pesas: [
        ["Peso muerto rumano con mancuernas", "3 x 10"],
        ["Hip thrust con mancuerna", "3 x 10-12"],
        ["Buenos dias con banda", "2 x 12"],
        ["Puente de gluteo", "3 x 12"],
        ["Abduccion con banda", "2 x 15"],
        ["Pantorrillas", "3 x 12-15"]
      ],
      calistenia: [
        ["Puente de gluteo", "4 x 12"],
        ["Hip thrust en sofa/banco", "3 x 10-12"],
        ["Peso muerto a una pierna asistido", "3 x 8 por pierna"],
        ["Curl femoral deslizante", "2 x 8-10"],
        ["Abduccion lateral acostado", "2 x 15"],
        ["Pantorrillas", "3 x 15"]
      ]
    }
  };
  const dayVariants = variants[dayIndex];
  if (!dayVariants) return null;
  if (style === "mixto") return null;
  return dayVariants[style] || dayVariants.maquinas;
}

function renderPlan() {
  $("#planGrid").innerHTML = routine
    .map(
      (day, index) => `
        <article class="plan-card">
          <p class="eyebrow">Dia ${index + 1} / ${day.focus}</p>
          <h3>${getPersonalizedDay(index).name}</h3>
          <p>${getPersonalizedDay(index).exercises.map((exercise) => {
            const item = normalizeExercise(exercise);
            return `${item.name} (${item.target})`;
          }).join(" / ")}</p>
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
                <strong>${session.date} / ${session.dayName}</strong>
                <p>${session.duration} min / Energia ${session.energy}/5${session.notes ? ` / ${session.notes}` : ""}</p>
              </div>
              <button class="delete-button" data-delete="${session.id}" title="Eliminar sesion">x</button>
            </article>`
        )
        .join("")
    : `<article class="history-card"><p>No hay sesiones guardadas todavia.</p></article>`;
}

function renderAnalysis() {
  const assessments = [...state.assessments].sort((a, b) => b.date.localeCompare(a.date));
  const latest = assessments[0];
  const previousSameLift = latest
    ? assessments.find((entry) => entry.id !== latest.id && entry.lift === latest.lift)
    : null;
  const bodyRows = [...state.body].sort((a, b) => b.date.localeCompare(a.date));
  const latestBody = bodyRows[0];
  const previousBody = bodyRows.find((entry) => entry.date !== latestBody?.date);

  $("#analysisSummary").innerHTML = `
    <article class="metric analysis-card">
      <span>Peso mensual</span>
      <strong>${bodyTrendText(latestBody, previousBody)}</strong>
      <p>${bodyRecommendation(latestBody, previousBody)}</p>
    </article>
    <article class="metric analysis-card">
      <span>Fuerza estimada</span>
      <strong>${latest ? `${latest.estimatedMax} kg` : "--"}</strong>
      <p>${strengthRecommendation(latest, previousSameLift)}</p>
    </article>
    <article class="metric analysis-card">
      <span>Resistencia</span>
      <strong>${latest?.cardioPace || "--"}</strong>
      <p>${cardioRecommendation(latest)}</p>
    </article>
  `;

  $("#assessmentHistory").innerHTML = assessments.length
    ? assessments
        .map(
          (entry) => `
            <article class="history-card">
              <div>
                <strong>${entry.date} / ${entry.lift}</strong>
                <p>${entry.load} kg x ${entry.reps} reps / RPE ${entry.rpe} / 1RM est. ${entry.estimatedMax} kg${entry.notes ? ` / ${entry.notes}` : ""}</p>
              </div>
              <button class="delete-button" data-delete-assessment="${entry.id}" title="Eliminar chequeo">x</button>
            </article>`
        )
        .join("")
    : `<article class="history-card"><p>No hay chequeos mensuales guardados todavia.</p></article>`;
}

function renderCoachInsights() {
  const insights = buildCoachInsights();
  $("#coachInsights").innerHTML = insights
    .map(
      (item) => `
        <article class="coach-card ${item.priority}">
          <p class="eyebrow">${item.period}</p>
          <h3>${item.title}</h3>
          <p>${item.message}</p>
          <strong>${item.action}</strong>
        </article>`
    )
    .join("");
}

function buildCoachInsights() {
  const insights = [];
  const now = new Date();
  const weekKey = getWeekKey(now);
  const completedThisWeek = Object.values(state.completedDays?.[weekKey] || {}).filter(Boolean).length;
  const lastSessions = getRecentByDate(state.sessions, 14);
  const lastAssessments = getRecentByDate(state.assessments, 90);
  const bodyRows = [...state.body].sort((a, b) => b.date.localeCompare(a.date));
  const latestBody = bodyRows[0];
  const previousBody = bodyRows.find((entry) => entry.date !== latestBody?.date);
  const latestAssessment = lastAssessments[0];
  const previousSameLift = latestAssessment
    ? lastAssessments.find((entry) => entry.id !== latestAssessment.id && entry.lift === latestAssessment.lift)
    : null;
  const avgEnergy = average(lastSessions.map((session) => Number(session.energy)).filter(Boolean));
  const goal = `${state.profile.goal || ""}`.toLowerCase();

  insights.push({
    period: "Semana",
    priority: completedThisWeek >= 4 ? "good" : completedThisWeek >= 2 ? "watch" : "risk",
    title: `Adherencia: ${completedThisWeek}/5 dias`,
    message: completedThisWeek >= 4
      ? "La semana va estable. Puedes mantener el plan y buscar pequenas mejoras tecnicas."
      : completedThisWeek >= 2
        ? "La semana va a medias. Prioriza completar los dias pendientes antes de subir volumen."
        : "Hay baja adherencia. Conviene reducir friccion: sesiones mas cortas y foco en llegar al gimnasio.",
    action: completedThisWeek >= 4 ? "Mantener plan semanal." : "Recuperar consistencia antes de aumentar carga."
  });

  insights.push({
    period: "Recuperacion",
    priority: avgEnergy >= 4 ? "good" : avgEnergy >= 3 ? "watch" : "risk",
    title: avgEnergy ? `Energia promedio: ${avgEnergy.toFixed(1)}/5` : "Sin datos de energia",
    message: avgEnergy
      ? recoveryMessage(avgEnergy)
      : "Registra energia al guardar sesion para que el coach pueda detectar fatiga.",
    action: avgEnergy && avgEnergy < 3 ? "Bajar 10-20% la carga esta semana." : "Seguir monitoreando energia."
  });

  insights.push({
    period: "Mes",
    priority: bodyPriority(latestBody, previousBody, goal),
    title: "Peso y tendencia corporal",
    message: bodyRecommendation(latestBody, previousBody),
    action: bodyAction(latestBody, previousBody, goal)
  });

  insights.push({
    period: "Fuerza",
    priority: strengthPriority(latestAssessment, previousSameLift),
    title: latestAssessment ? `${latestAssessment.lift}: 1RM est. ${latestAssessment.estimatedMax} kg` : "Sin prueba de fuerza",
    message: strengthRecommendation(latestAssessment, previousSameLift),
    action: strengthAction(latestAssessment, previousSameLift)
  });

  insights.push({
    period: "Seguridad",
    priority: state.profile.limitations ? "watch" : "good",
    title: state.profile.limitations ? "Limitaciones declaradas" : "Sin limitaciones registradas",
    message: state.profile.limitations
      ? `Considerar: ${state.profile.limitations}. Evita progresar agresivamente si aparece dolor articular.`
      : "No hay lesiones registradas. Mantener tecnica limpia y progresion gradual.",
    action: state.profile.limitations ? "Priorizar tecnica, rango sin dolor y maquinas estables." : "Progresar con margen de 2 repeticiones."
  });

  insights.push({
    period: "Anual",
    priority: state.assessments.length >= 6 ? "good" : "watch",
    title: "Base de datos a largo plazo",
    message: state.assessments.length >= 6
      ? "Ya hay suficientes chequeos para ver ciclos de progreso y estancamiento."
      : "Aun faltan chequeos mensuales para analizar tendencias anuales confiables.",
    action: "Guardar un chequeo completo cada mes."
  });

  return insights;
}

function getRecentByDate(items, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return [...items]
    .filter((item) => new Date(`${item.date}T12:00:00`) >= cutoff)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function recoveryMessage(avgEnergy) {
  if (avgEnergy >= 4) return "Buena recuperacion. Si la tecnica esta limpia, puedes progresar poco a poco.";
  if (avgEnergy >= 3) return "Recuperacion normal. Mantener cargas y observar sueno, hambre y dolor muscular.";
  return "Fatiga alta. Conviene descargar volumen, caminar suave y priorizar sueno.";
}

function bodyPriority(latest, previous, goal) {
  if (!latest || !previous) return "watch";
  const diff = Number(latest.weight) - Number(previous.weight);
  if ((goal.includes("bajar") || goal.includes("grasa")) && diff > 0.5) return "risk";
  if ((goal.includes("musculo") || goal.includes("fuerza")) && diff < -1) return "watch";
  return "good";
}

function bodyAction(latest, previous, goal) {
  if (!latest || !previous) return "Registrar medidas mensuales.";
  const diff = Number(latest.weight) - Number(previous.weight);
  if ((goal.includes("bajar") || goal.includes("grasa")) && diff > 0.5) return "Ajustar nutricion y aumentar pasos.";
  if (Math.abs(diff) < 0.5) return "Mantener o hacer ajuste pequeno.";
  return "Continuar y revisar cintura.";
}

function strengthPriority(latest, previous) {
  if (!latest) return "watch";
  if (Number(latest.rpe) >= 9) return "watch";
  if (previous && Number(latest.estimatedMax) > Number(previous.estimatedMax)) return "good";
  return "watch";
}

function strengthAction(latest, previous) {
  if (!latest) return "Hacer una prueba submaxima este mes.";
  if (Number(latest.rpe) <= 8 && Number(latest.reps) >= 10) return "Subir 2.5% a 5% la proxima sesion.";
  if (previous && Number(latest.estimatedMax) > Number(previous.estimatedMax)) return "Mantener progresion gradual.";
  return "Mantener carga y mejorar reps/tecnica.";
}

function renderNutrition() {
  $("#nutritionMethod").value = state.profile.nutritionMethod || "recomposicion";
  $("#mealCount").value = String(state.profile.mealCount || 4);
  $("#appetiteLevel").value = state.profile.appetiteLevel || "normal";
  $("#availableFoods").value = state.profile.availableFoods || "";
  $("#foodRestrictions").value = state.profile.foodRestrictions || "";
  $("#dislikedFoods").value = state.profile.dislikedFoods || "";
  renderNutritionWarning();
  renderMealPlan();
}

function renderChallenges() {
  const selected = $("#challengeStyle").value || "auto";
  const style = selected === "auto" ? resolveChallengeStyle() : selected;
  const readiness = getChallengeReadiness();
  const visible = specialForcesLibrary.map((unit) => buildSpecialForcesChallenge(unit, style, readiness));
  $("#challengeGrid").innerHTML = visible
    .map((challenge) => {
      const done = state.completedChallenges.includes(challenge.id);
      const locked = challenge.difficulty > readiness.score + 1;
      return `
        <article class="challenge-card ${done ? "is-done" : ""} ${locked ? "is-locked" : ""}">
          <p class="eyebrow">${challenge.flag} ${challenge.country} / ${challenge.force}</p>
          <h3>${challenge.title}</h3>
          <div class="difficulty-row">
            <span>Dificultad ${challenge.difficulty}/5</span>
            <span>${locked ? "Preparacion requerida" : "Recomendado para tu perfil"}</span>
          </div>
          <p>${challenge.goal}</p>
          <ul>
            ${challenge.work.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <strong>${challenge.rounds}</strong>
          <p class="challenge-safety">${challenge.safety}</p>
          <button class="${done ? "ghost-button" : "primary-button"}" data-challenge="${challenge.id}" type="button" ${locked ? "disabled" : ""}>
            ${done ? "Completado" : "Marcar reto"}
          </button>
        </article>
      `;
    })
    .join("");
}

function getChallengeReadiness() {
  const levelScore = { principiante: 1, intermedio: 3, avanzado: 5 }[state.profile.level] || 1;
  const weekKey = getWeekKey(new Date());
  const completedThisWeek = Object.values(state.completedDays?.[weekKey] || {}).filter(Boolean).length;
  const consistencyBonus = completedThisWeek >= 5 ? 1 : completedThisWeek >= 3 ? 0.5 : 0;
  return {
    score: Math.min(5, Math.max(1, Math.round(levelScore + consistencyBonus))),
    completedThisWeek
  };
}

function buildSpecialForcesChallenge(unit, style, readiness) {
  const difficulty = Math.min(5, Math.max(1, unit.baseDifficulty));
  const scaledDifficulty = Math.min(difficulty, readiness.score + 1);
  const plan = challengePlanByStyle(style, scaledDifficulty);
  return {
    id: unit.id,
    flag: unit.flag,
    country: unit.country,
    force: unit.force,
    difficulty,
    title: `${unit.force}: reto ${challengeDifficultyName(difficulty)}`,
    goal: `Inspirado en ${unit.force}. Adaptado a perfil ${state.profile.level || "principiante"} y constancia ${readiness.completedThisWeek}/5 esta semana.`,
    work: plan.work,
    rounds: plan.rounds,
    safety: `${plan.safety} Apto para mujeres y hombres: ajusta carga, rango y descanso segun tecnica, dolor y energia.`
  };
}

function challengePlanByStyle(style, difficulty) {
  const reps = difficulty <= 2 ? { push: 8, legs: 12, core: 20, carry: 20, cardio: 8 } :
    difficulty <= 4 ? { push: 12, legs: 16, core: 35, carry: 30, cardio: 12 } :
    { push: 18, legs: 20, core: 45, carry: 45, cardio: 18 };
  if (style === "gym") {
    return {
      work: [
        `Press o empuje en maquina x ${reps.push}`,
        `Prensa o sentadilla guiada x ${reps.legs}`,
        `Remo/jalon x ${reps.push}`,
        `Farmer carry ${reps.carry} m`,
        `Bicicleta o caminata inclinada ${reps.cardio} min`
      ],
      rounds: difficulty >= 4 ? "4 rondas" : "3 rondas",
      safety: "Usa RPE 7-8, sin cargas maximas."
    };
  }
  if (style === "calistenia") {
    return {
      work: [
        `Flexiones inclinadas o normales x ${reps.push}`,
        `Sentadillas o zancadas x ${reps.legs}`,
        `Plancha ${reps.core} seg`,
        `Mountain climbers x ${reps.push}`,
        `Caminata rapida ${reps.cardio} min`
      ],
      rounds: difficulty >= 4 ? "4 rondas" : "3 rondas",
      safety: "Prioriza tecnica y evita impacto si hay molestias."
    };
  }
  return {
    work: [
      `Mochila/carry liviano ${reps.carry} m`,
      `Step-up bajo x ${Math.max(6, Math.round(reps.legs / 2))} por pierna`,
      `Remo con banda/mochila x ${reps.push}`,
      `Dead bug x ${Math.max(8, Math.round(reps.push / 2))} por lado`,
      `Caminata rapida ${reps.cardio} min`
    ],
    rounds: difficulty >= 4 ? "3-4 rondas" : "3 rondas",
    safety: "Carga de mochila moderada y postura alta."
  };
}

function challengeDifficultyName(difficulty) {
  if (difficulty <= 2) return "base";
  if (difficulty === 3) return "intermedio";
  if (difficulty === 4) return "alto";
  return "elite";
}

function resolveChallengeStyle() {
  const place = state.profile.trainingPlace || "gimnasio";
  const style = resolveTrainingStyle();
  if (style === "maquinas" || style === "pesas") return "gym";
  if (style === "calistenia") return "calistenia";
  if (place === "casa") return "mixto";
  return "mixto";
}

function toggleChallenge(id) {
  state.completedChallenges = state.completedChallenges || [];
  if (state.completedChallenges.includes(id)) {
    state.completedChallenges = state.completedChallenges.filter((challengeId) => challengeId !== id);
  } else {
    state.completedChallenges.push(id);
  }
  saveState();
  renderChallenges();
}

function renderNutritionWarning() {
  const risks = detectNutritionRisks();
  $("#nutritionWarning").innerHTML = risks.length
    ? `<strong>Atencion:</strong> ${risks.join(" ")}`
    : "Estas recomendaciones son generales y no reemplazan a un nutricionista o medico.";
}

function detectNutritionRisks() {
  const text = `${state.profile.foodRestrictions || ""}`.toLowerCase();
  const risks = [];
  if (text.includes("diabetes") || text.includes("resistencia a la insulina")) risks.push("Si hay diabetes o resistencia a la insulina, controla carbohidratos con un profesional.");
  if (text.includes("hipertension") || text.includes("presion alta")) risks.push("Si hay hipertension, cuida sodio, ultraprocesados y embutidos.");
  if (text.includes("celia") || text.includes("gluten")) risks.push("Si hay celiaquia, evita gluten y contaminacion cruzada.");
  if (text.includes("tca") || text.includes("atracon") || text.includes("bulimia") || text.includes("anorexia")) risks.push("Si hay trastorno de conducta alimentaria, no uses deficit agresivo sin equipo clinico.");
  if (text.includes("renal") || text.includes("rinon")) risks.push("Si hay enfermedad renal, la proteina debe indicarla un profesional.");
  return risks;
}

function renderMealPlan() {
  const plan = buildMealPlan();
  renderNutritionTargets(plan.targets);
  $("#mealPlan").innerHTML = `
    <article class="meal-card">
      <p class="eyebrow">${plan.methodLabel}</p>
      <h3>Plan sugerido del dia</h3>
      <p>${plan.summary}</p>
      <strong>${plan.targets.calories} kcal aprox. / ${plan.targets.protein} g proteina</strong>
    </article>
    ${plan.meals.map((meal, index) => `
      <article class="meal-card meal-card-action" data-meal-index="${index}">
        <p class="eyebrow">${meal.time}</p>
        <h3>${meal.title}</h3>
        <p>${meal.items.join(" + ")}</p>
        <strong>Cantidad: ${meal.portion}</strong>
        <strong>Objetivo: ${meal.purpose}</strong>
        <p class="swap-text">Cambios posibles: ${meal.swaps.join(" / ")}</p>
        <button class="quiet-button" type="button">Ver recetas</button>
      </article>
    `).join("")}
  `;
  $("#recipePanel").hidden = true;
}

function buildMealPlan() {
  const method = state.profile.nutritionMethod || "recomposicion";
  const mealCount = Number(state.profile.mealCount) || 4;
  const foods = parseFoodList(state.profile.availableFoods);
  const disliked = parseFoodList(state.profile.dislikedFoods);
  const restrictions = `${state.profile.foodRestrictions || ""}`.toLowerCase();
  const pools = buildFoodPools(foods, disliked, restrictions);
  const targets = calculateNutritionTargets(method);
  const meals = [
    buildMeal("Desayuno", "Base proteica para empezar", pools, method, targets, 0.25),
    buildMeal("Almuerzo", "Comida principal", pools, method, targets, 0.35),
    buildMeal("Once / Cena", "Cierre del dia", pools, method, targets, mealCount >= 4 ? 0.3 : 0.4)
  ];
  if (mealCount >= 4) meals.splice(2, 0, buildSnack("Snack", pools, method, targets, 0.1));
  return { methodLabel: nutritionMethodLabel(method), summary: nutritionSummary(method), meals, targets };
}

function calculateNutritionTargets(method) {
  const weight = Number(getLatestWeight()) || Number(state.profile.startWeight) || 80;
  const height = Number(state.profile.height) || 175;
  const age = Number(state.profile.age) || 25;
  const sex = state.profile.sex || "masculino";
  const base = sex === "femenino"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  const maintenance = Math.round(base * 1.35);
  const calories = {
    deficit: maintenance - 450,
    mantenimiento: maintenance,
    "volumen-controlado": maintenance + 250,
    recomposicion: maintenance - 200
  }[method] || maintenance;
  const protein = Math.round(weight * 1.8);
  const fat = Math.round(weight * 0.8);
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories: Math.round(calories), protein, carbs, fat };
}

function getLatestWeight() {
  const latest = [...state.body].sort((a, b) => b.date.localeCompare(a.date))[0];
  return latest?.weight || state.profile.startWeight;
}

function renderNutritionTargets(targets) {
  $("#nutritionTargets").innerHTML = `
    <article class="metric">
      <span>Calorias</span>
      <strong>${targets.calories}</strong>
    </article>
    <article class="metric">
      <span>Proteina</span>
      <strong>${targets.protein} g</strong>
    </article>
    <article class="metric">
      <span>Carbohidratos</span>
      <strong>${targets.carbs} g</strong>
    </article>
    <article class="metric">
      <span>Grasas</span>
      <strong>${targets.fat} g</strong>
    </article>
  `;
}

function parseFoodList(text) {
  return `${text || ""}`.toLowerCase().split(/,|\n/).map((item) => item.trim()).filter(Boolean);
}

function buildFoodPools(available, disliked, restrictions) {
  const defaults = {
    proteins: ["pollo", "huevos", "atun", "carne magra", "yogur griego", "legumbres"],
    carbs: ["arroz", "avena", "papa", "pan integral", "fruta", "legumbres"],
    fats: ["palta", "aceite de oliva", "frutos secos", "huevo"],
    vegetables: ["ensalada", "brocoli", "zanahoria", "tomate", "verduras salteadas"]
  };
  const all = available.length ? available : Object.values(defaults).flat();
  const allowed = all.filter((food) => isFoodAllowed(food, disliked, restrictions));
  return {
    proteins: pickMatching(allowed, defaults.proteins),
    carbs: pickMatching(allowed, defaults.carbs),
    fats: pickMatching(allowed, defaults.fats),
    vegetables: pickMatching(allowed, defaults.vegetables)
  };
}

function isFoodAllowed(food, disliked, restrictions) {
  if (disliked.some((item) => food.includes(item) || item.includes(food))) return false;
  if ((restrictions.includes("lactosa") || restrictions.includes("leche")) && (food.includes("yogur") || food.includes("leche"))) return false;
  if ((restrictions.includes("celia") || restrictions.includes("gluten")) && (food.includes("pan") || food.includes("avena"))) return false;
  if (restrictions.includes("hipertension") && (food.includes("embutido") || food.includes("jamon"))) return false;
  return true;
}

function pickMatching(available, defaults) {
  const matches = defaults.filter((food) => available.some((item) => item.includes(food) || food.includes(item)));
  return matches.length ? matches : defaults;
}

function buildMeal(time, title, pools, method, targets, ratio) {
  const protein = pools.proteins[0] || "";
  const carb = method === "deficit" ? `${pools.carbs[0] || ""} porcion controlada` : pools.carbs[0] || "";
  const fat = method === "deficit" ? `${pools.fats[0] || ""} pequeno` : pools.fats[0] || "";
  const vegetable = pools.vegetables[0] || "";
  const grams = mealPortionTargets(targets, ratio);
  return {
    time,
    title,
    items: [protein, carb, vegetable, fat].filter(Boolean),
    portion: `${grams.protein} g proteina / ${grams.carbs} g carbos / ${grams.fat} g grasas aprox.`,
    purpose: mealPurpose(method),
    swaps: buildSwaps(protein, carb, fat, vegetable),
    recipes: buildRecipes(time, protein, carb, fat, vegetable, grams)
  };
}

function buildSnack(time, pools, method, targets, ratio) {
  const protein = pools.proteins[0] || "";
  const carb = method === "volumen-controlado" ? `media porcion de ${pools.carbs[0] || "avena"}` : "fruta";
  const grams = mealPortionTargets(targets, ratio);
  return {
    time,
    title: "Snack ligero",
    items: [protein, carb].filter(Boolean),
    portion: `${grams.protein} g proteina / ${grams.carbs} g carbos / ${grams.fat} g grasas aprox.`,
    purpose: "Controlar hambre sin transformarlo en otra comida grande.",
    swaps: [`${protein} por ${pools.proteins[1] || "huevos"}`, `${carb} por ${pools.carbs[1] || "avena"}`],
    recipes: buildRecipes(time, protein, carb, "", "", grams)
  };
}

function mealPortionTargets(targets, ratio) {
  return {
    protein: Math.max(15, Math.round(targets.protein * ratio)),
    carbs: Math.max(10, Math.round(targets.carbs * ratio)),
    fat: Math.max(5, Math.round(targets.fat * ratio))
  };
}

function buildRecipes(time, protein, carb, fat, vegetable, grams) {
  const isSnack = time === "Snack";
  if (isSnack) {
    return [
      {
        name: `${protein} con ${carb}`,
        steps: [`Usa una porcion pequena de ${protein}.`, `Agrega ${carb}.`, "Manténlo simple para no convertirlo en otra comida grande."],
        portions: `${grams.protein} g proteina aprox.`
      },
      {
        name: `Snack alternativo alto en proteina`,
        steps: ["Elige yogur griego, huevos, atun o legumbres segun lo disponible.", "Acompana con fruta o una porcion pequena de carbohidrato."],
        portions: `${grams.protein} g proteina / ${grams.carbs} g carbos aprox.`
      }
    ];
  }
  return [
    {
      name: `${protein} con ${carb} y ${vegetable}`,
      steps: [`Prepara ${protein} como base.`, `Agrega ${carb} en la porcion indicada.`, `Suma ${vegetable} para volumen y saciedad.`, fat ? `Agrega ${fat} como grasa saludable.` : "Evita agregar grasa extra si estas en deficit."],
      portions: `${grams.protein} g proteina / ${grams.carbs} g carbos / ${grams.fat} g grasas aprox.`
    },
    {
      name: `Bowl rapido de ${time.toLowerCase()}`,
      steps: [`Base: ${carb}.`, `Proteina: ${protein}.`, `Verduras: ${vegetable}.`, `Grasa: ${fat || "opcional segun objetivo"}.`],
      portions: `${grams.protein}P / ${grams.carbs}C / ${grams.fat}G aprox.`
    }
  ];
}

function showMealRecipes(index) {
  const plan = buildMealPlan();
  const meal = plan.meals[index];
  if (!meal) return;
  const webRecipes = buildWebRecipeLinks(meal);
  $("#recipePanel").hidden = false;
  $("#recipePanel").innerHTML = `
    <p class="eyebrow">${meal.time}</p>
    <h2>Recetas posibles</h2>
    <div class="recipe-grid">
      ${meal.recipes.map((recipe) => `
        <article class="recipe-card">
          <h3>${recipe.name}</h3>
          <p><strong>Porcion objetivo:</strong> ${recipe.portions}</p>
          <ol>
            ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </article>
      `).join("")}
    </div>
    <div class="web-recipes">
      <h3>Buscar recetas en internet</h3>
      <p>Estos enlaces abren busquedas externas con tus ingredientes. La app no copia recetas completas de otros sitios.</p>
      <div class="web-recipe-links">
        ${webRecipes.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
      </div>
    </div>
  `;
}

function buildWebRecipeLinks(meal) {
  const ingredients = meal.items
    .join(" ")
    .replace(/porcion controlada|pequeno|media porcion de/g, "")
    .trim();
  const baseQuery = `${meal.time} saludable ${ingredients}`.trim();
  const restrictions = `${state.profile.foodRestrictions || ""}`.trim();
  const query = restrictions ? `${baseQuery} ${restrictions}` : baseQuery;
  return [
    { label: "Google recetas", url: `https://www.google.com/search?q=${encodeURIComponent(`${query} receta`)}` },
    { label: "YouTube preparacion", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} receta saludable`)}` },
    { label: "Recetas chilenas saludables", url: `https://www.google.com/search?q=${encodeURIComponent(`${query} receta saludable chile`)}` }
  ];
}

function buildSwaps(protein, carb, fat, vegetable) {
  return [
    `${protein} por pollo/huevos/atun/legumbres`,
    `${carb} por arroz/papa/avena/fruta`,
    `${fat} por palta/aceite de oliva/frutos secos`,
    `${vegetable} por cualquier verdura disponible`
  ];
}

function nutritionMethodLabel(method) {
  return {
    deficit: "Deficit calorico",
    mantenimiento: "Mantenimiento",
    "volumen-controlado": "Volumen controlado",
    recomposicion: "Recomposicion corporal"
  }[method] || "Nutricion";
}

function nutritionSummary(method) {
  return {
    deficit: "Prioriza proteina, verduras, saciedad y porciones controladas de carbohidratos y grasas.",
    mantenimiento: "Mantiene energia estable para entrenar y sostener peso.",
    "volumen-controlado": "Aumenta energia sin subir demasiado rapido la grasa corporal.",
    recomposicion: "Busca bajar grasa y ganar fuerza con proteina alta y carbohidratos alrededor del entrenamiento."
  }[method] || "Busca equilibrio entre proteina, energia y adherencia.";
}

function mealPurpose(method) {
  if (method === "deficit") return "Saciedad, proteina y control calorico.";
  if (method === "volumen-controlado") return "Energia para progresar sin exceso.";
  if (method === "mantenimiento") return "Energia estable y recuperacion.";
  return "Proteina alta y energia suficiente para recomposicion.";
}

function bodyTrendText(latest, previous) {
  if (!latest) return "--";
  if (!previous) return `${latest.weight} kg`;
  const diff = Number(latest.weight) - Number(previous.weight);
  const sign = diff > 0 ? "+" : "";
  return `${latest.weight} kg (${sign}${diff.toFixed(1)} kg)`;
}

function bodyRecommendation(latest, previous) {
  if (!latest || !previous) return "Guarda al menos dos chequeos para ver tendencia real.";
  const diff = Number(latest.weight) - Number(previous.weight);
  const goal = `${state.profile.goal || ""}`.toLowerCase();
  if (goal.includes("bajar") || goal.includes("grasa")) {
    if (diff <= -0.5) return "Vas en direccion correcta. Mantener plan y cuidar recuperacion.";
    if (Math.abs(diff) < 0.5) return "Peso estable: revisar pasos, sueno, porciones y adherencia antes de hacer cambios grandes.";
    return "Peso subiendo: ajustar alimentacion y cardio suave antes de aumentar intensidad.";
  }
  if (goal.includes("musculo") || goal.includes("fuerza")) {
    if (diff >= 0 && diff <= 2) return "Subida controlada. Buena senal si la fuerza tambien mejora.";
    if (diff > 2) return "Subida rapida: vigilar cintura y calidad de comida.";
    return "Peso bajando: puede faltar energia para ganar fuerza.";
  }
  return "Usa esta tendencia junto con energia, cintura y rendimiento.";
}

function strengthRecommendation(latest, previous) {
  if (!latest) return "Guarda una prueba de fuerza para recibir una recomendacion.";
  if (Number(latest.rpe) <= 8 && Number(latest.reps) >= 10) {
    return "Puedes subir la carga 2.5% a 5% la proxima vez si la tecnica fue limpia.";
  }
  if (Number(latest.rpe) >= 9) {
    return "Mantener carga y buscar mejor tecnica o mas reps antes de subir.";
  }
  if (previous && Number(latest.estimatedMax) > Number(previous.estimatedMax)) {
    return "Hay progreso de fuerza. Sube poco a poco, sin perder control.";
  }
  return "Mantener carga y consolidar repeticiones.";
}

function cardioRecommendation(latest) {
  if (!latest || !latest.cardioMinutes) return "Agrega tiempo y distancia de cardio para analizar resistencia.";
  if (latest.cardioDistance) return "Busca mejorar distancia al mismo tiempo o mantener distancia con menor esfuerzo.";
  return "Registra distancia para comparar ritmo mensual.";
}

function renderSummary() {
  const latestBody = [...state.body].sort((a, b) => b.date.localeCompare(a.date))[0];
  $("#startWeight").textContent = `${state.profile.startWeight || 130} kg`;
  $("#currentWeight").textContent = latestBody?.weight ? `${latestBody.weight} kg` : "--";
  $("#sessionCount").textContent = state.sessions.length;
  $("#streakCount").textContent = `${calculateStreak()} dias`;
}

function renderProfile() {
  $("#profileName").value = state.profile.name || "";
  $("#profileAge").value = state.profile.age || "";
  $("#profileSex").value = state.profile.sex || "";
  $("#profileHeight").value = state.profile.height || "";
  $("#profileStartWeight").value = state.profile.startWeight || "";
  $("#profileLevel").value = state.profile.level || "principiante";
  $("#profileTrainingPlace").value = state.profile.trainingPlace || "gimnasio";
  $("#profileTrainingStyle").value = state.profile.trainingStyle || "maquinas";
  setCheckedValues("equipment", state.profile.equipment || []);
  $("#profileGoal").value = state.profile.goal || "";
}

function populateOnboarding() {
  $("#onboardName").value = state.profile.name || "";
  $("#onboardAge").value = state.profile.age || "";
  $("#onboardSex").value = state.profile.sex || "";
  $("#onboardHeight").value = state.profile.height || "";
  $("#onboardWeight").value = state.profile.startWeight || "";
  $("#onboardLevel").value = state.profile.level || "principiante";
  $("#onboardDays").value = String(state.profile.trainingDays || 5);
  $("#onboardPlace").value = state.profile.trainingPlace || "gimnasio";
  $("#onboardStyle").value = state.profile.trainingStyle || "maquinas";
  setCheckedValues("onboardEquipment", state.profile.equipment || []);
  $("#onboardGoal").value = state.profile.goal || "";
  $("#onboardLimitations").value = state.profile.limitations || "";
  $("#onboardHabits").value = state.profile.habits || "";
}

function getCheckedValues(name) {
  return $$(`input[name="${name}"]:checked`).map((input) => input.value);
}

function setCheckedValues(name, values) {
  $$(`input[name="${name}"]`).forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function updateTrainingPreferencesFromProfile() {
  state.profile = {
    ...state.profile,
    trainingPlace: $("#profileTrainingPlace").value,
    trainingStyle: $("#profileTrainingStyle").value,
    equipment: getCheckedValues("equipment")
  };
  saveState();
  renderToday();
  renderPlan();
}

function updateNutritionPreferences() {
  state.profile = {
    ...state.profile,
    nutritionMethod: $("#nutritionMethod").value,
    mealCount: Number($("#mealCount").value) || 4,
    appetiteLevel: $("#appetiteLevel").value,
    availableFoods: $("#availableFoods").value.trim(),
    foodRestrictions: $("#foodRestrictions").value.trim(),
    dislikedFoods: $("#dislikedFoods").value.trim()
  };
  saveState();
  renderNutrition();
}

function renderUpdateNotice() {
  const notice = $("#updateNotice");
  const hasSeenVersion = state.profile.seenVersion === appVersion;
  notice.hidden = hasSeenVersion;
  $("#updateText").textContent = `Version ${appVersion}: ${releaseNote}`;
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
  renderAccount();
  renderDayOptions();
  renderToday();
  renderPlan();
  renderBodyTable();
  renderHistory();
  renderAnalysis();
  renderCoachInsights();
  renderNutrition();
  renderChallenges();
  renderSummary();
  renderProfile();
  renderUpdateNotice();
}

function switchView(viewName) {
  $$("[data-view]").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewName));
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}View`));
}

function switchProfileSubview(viewName) {
  $$(".profile-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.profileView === viewName));
  $$(".profile-subview").forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}Subview`));
}

function mountProfileSections() {
  const targets = [
    ["bodyView", "bodySubview"],
    ["analysisView", "analysisSubview"],
    ["coachView", "coachSubview"],
    ["historyView", "historySubview"]
  ];
  targets.forEach(([sectionId, targetId]) => {
    const section = $(`#${sectionId}`);
    const target = $(`#${targetId}`);
    if (section && target && !target.contains(section)) {
      section.classList.remove("view");
      section.classList.add("embedded-section");
      target.appendChild(section);
    }
  });
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

function readAuthFields() {
  return {
    email: $("#authEmail").value.trim(),
    password: $("#authPassword").value
  };
}

async function handleAuth(action) {
  const { email, password } = readAuthFields();
  if (!email || password.length < 6) {
    setAccountStatus("Escribe un correo y una contrasena de al menos 6 caracteres.");
    return;
  }
  try {
    setAccountStatus(action === "create" ? "Creando cuenta..." : "Entrando...");
    if (action === "create") {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    $("#authPassword").value = "";
  } catch (error) {
    setAccountStatus(authErrorMessage(error.code));
  }
}

function continueAsGuest() {
  currentUser = null;
  sessionMode = "guest";
  replaceState(defaultState());
  showApp();
  renderAll();
  switchView("profile");
}

function authErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Prueba entrar.",
    "auth/invalid-email": "El correo no parece valido.",
    "auth/invalid-credential": "Correo o contrasena incorrectos.",
    "auth/weak-password": "La contrasena debe tener al menos 6 caracteres.",
    "auth/operation-not-allowed": "Activa Email/Password en Firebase Authentication."
  };
  return messages[code] || "No se pudo completar la accion. Revisa Firebase y vuelve a intentar.";
}

function estimateOneRepMax(load, reps) {
  return Math.round((Number(load) * (1 + Number(reps) / 30)) * 10) / 10;
}

function calculateCardioPace(minutes, distance) {
  if (!minutes || !distance) return "";
  const pace = Number(minutes) / Number(distance);
  if (!Number.isFinite(pace)) return "";
  return `${pace.toFixed(1)} min/km`;
}

function bindEvents() {
  $("#sessionDate").value = today;
  $("#bodyDate").value = today;
  $("#assessmentDate").value = today;
  $("#weight").value = "";

  $$("[data-view]").forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  $$(".profile-tab").forEach((tab) => tab.addEventListener("click", () => switchProfileSubview(tab.dataset.profileView)));
  $("#authForm").addEventListener("submit", (event) => {
    event.preventDefault();
    handleAuth("login");
  });
  $("#createAccountButton").addEventListener("click", () => handleAuth("create"));
  $("#guestButton").addEventListener("click", continueAsGuest);
  $("#exitGuestButton").addEventListener("click", () => {
    sessionMode = "locked";
    replaceState(defaultState());
    showWelcome();
    setAccountStatus("Crea una cuenta para guardar tus datos o entra con una cuenta existente.");
  });
  $("#logoutButton").addEventListener("click", () => signOut(auth));
  $("#dismissUpdateButton").addEventListener("click", () => {
    state.profile.seenVersion = appVersion;
    saveState();
    renderUpdateNotice();
  });
  $("#completeDayButton").addEventListener("click", () => {
    const day = routine[state.selectedDay];
    const sessionDate = $("#sessionDate").value || today;
    state.sessions.push({
      id: crypto.randomUUID(),
      date: sessionDate,
      dayIndex: state.selectedDay,
      dayName: day.name,
      energy: Number($("#energy").value),
      duration: Number($("#duration").value),
      notes: $("#notes").value.trim() || "Marcado como completado"
    });
    markTrainingDayCompleted(state.selectedDay, sessionDate);
    $("#notes").value = "";
    saveState();
    renderAll();
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
    markTrainingDayCompleted(state.selectedDay, $("#sessionDate").value);
    $("#notes").value = "";
    saveState();
    renderAll();
    switchView("profile");
    switchProfileSubview("history");
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
  $("#assessmentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const assessmentWeight = Number($("#assessmentWeight").value);
    const assessmentWaist = Number($("#assessmentWaist").value) || "";
    const load = Number($("#assessmentLoad").value);
    const reps = Number($("#assessmentReps").value);
    const cardioMinutes = Number($("#assessmentCardioMinutes").value) || "";
    const cardioDistance = Number($("#assessmentCardioDistance").value) || "";
    state.assessments.push({
      id: crypto.randomUUID(),
      date: $("#assessmentDate").value,
      weight: assessmentWeight,
      waist: assessmentWaist,
      lift: $("#assessmentLift").value,
      load,
      reps,
      rpe: Number($("#assessmentRpe").value),
      estimatedMax: estimateOneRepMax(load, reps),
      cardioMinutes,
      cardioDistance,
      cardioPace: calculateCardioPace(cardioMinutes, cardioDistance),
      notes: $("#assessmentNotes").value.trim()
    });
    state.body.push({
      date: $("#assessmentDate").value,
      weight: assessmentWeight,
      waist: assessmentWaist,
      chest: "",
      hips: "",
      arm: ""
    });
    $("#assessmentNotes").value = "";
    saveState();
    renderAll();
  });
  $("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.profile = {
      ...state.profile,
      name: $("#profileName").value.trim(),
      age: Number($("#profileAge").value) || "",
      sex: $("#profileSex").value,
      height: Number($("#profileHeight").value) || "",
      startWeight: Number($("#profileStartWeight").value) || 130,
      level: $("#profileLevel").value,
      trainingPlace: $("#profileTrainingPlace").value,
      trainingStyle: $("#profileTrainingStyle").value,
      equipment: getCheckedValues("equipment"),
      goal: $("#profileGoal").value.trim()
    };
    saveState();
    renderAll();
  });
  $("#onboardingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const currentWeight = Number($("#onboardWeight").value) || 130;
    state.profile = {
      ...state.profile,
      name: $("#onboardName").value.trim(),
      age: Number($("#onboardAge").value) || "",
      sex: $("#onboardSex").value,
      height: Number($("#onboardHeight").value) || "",
      startWeight: currentWeight,
      level: $("#onboardLevel").value,
      trainingDays: Number($("#onboardDays").value) || 5,
      trainingPlace: $("#onboardPlace").value,
      trainingStyle: $("#onboardStyle").value,
      equipment: getCheckedValues("onboardEquipment"),
      goal: $("#onboardGoal").value.trim(),
      limitations: $("#onboardLimitations").value.trim(),
      habits: $("#onboardHabits").value.trim(),
      onboardingComplete: true
    };
    if (!state.body.some((entry) => entry.date === today && Number(entry.weight) === currentWeight)) {
      state.body.push({ date: today, weight: currentWeight, waist: "", chest: "", hips: "", arm: "" });
    }
    saveState();
    hideOnboarding();
    renderAll();
    switchView("today");
  });
  $("#historyList").addEventListener("click", (event) => {
    const id = event.target.dataset.delete;
    if (!id) return;
    state.sessions = state.sessions.filter((session) => session.id !== id);
    saveState();
    renderAll();
  });
  $("#assessmentHistory").addEventListener("click", (event) => {
    const id = event.target.dataset.deleteAssessment;
    if (!id) return;
    state.assessments = state.assessments.filter((assessment) => assessment.id !== id);
    saveState();
    renderAll();
  });
  $("#refreshCoachButton").addEventListener("click", renderCoachInsights);
  $("#nutritionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    updateNutritionPreferences();
  });
  $("#generateMealPlanButton").addEventListener("click", updateNutritionPreferences);
  $("#mealPlan").addEventListener("click", (event) => {
    const card = event.target.closest("[data-meal-index]");
    if (!card) return;
    showMealRecipes(Number(card.dataset.mealIndex));
  });
  $("#challengeStyle").addEventListener("change", renderChallenges);
  $("#challengeGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-challenge]");
    if (!button) return;
    toggleChallenge(button.dataset.challenge);
  });
  $("#profileTrainingPlace").addEventListener("change", updateTrainingPreferencesFromProfile);
  $("#profileTrainingStyle").addEventListener("change", updateTrainingPreferencesFromProfile);
  $$('input[name="equipment"]').forEach((input) => {
    input.addEventListener("change", updateTrainingPreferencesFromProfile);
  });
  $("#exportButton").addEventListener("click", downloadJson);
  $("#importFile").addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) importJson(file);
    event.target.value = "";
  });
}

onAuthStateChanged(auth, async (user) => {
  try {
    if (user) {
      await loadCloudState(user);
      return;
    }
    currentUser = null;
    if (sessionMode !== "guest") {
      sessionMode = "locked";
      replaceState(defaultState());
      setAccountStatus("Crea una cuenta para guardar tus datos o entra como invitado para explorar.");
      showWelcome();
    }
  } catch {
    setAccountStatus("Tu cuenta entro, pero falta revisar Firestore o sus reglas.");
    showApp();
    renderAll();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

mountProfileSections();
bindEvents();
showWelcome();
setupInstallPrompt();

