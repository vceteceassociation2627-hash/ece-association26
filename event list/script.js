/* =========================================================
   ECE Association — Event List logic
   - Renders events from localStorage (seeded with defaults)
   - Category filter + detail modal
   - Simple client-side admin gate to add/edit/delete events
   ========================================================= */

// ---- 1. Admin credentials -----------------------------------------
// NOTE: This runs entirely in the browser, so anyone who views the
// page source can read these values. It stops casual editing by
// visitors, but it is NOT real security. If you need a genuinely
// protected admin area, this needs a server-side login instead.
const ADMIN_ID = "eceadmin";
const ADMIN_PASS = "vcet@ece2025";

// ---- 2. Storage keys -------------------------------------------------
const STORAGE_KEY = "vcet_ece_events_v1";
const SESSION_KEY = "vcet_ece_admin_session";

// ---- 3. Default/seed events (first-time load only) --------------------
const DEFAULT_EVENTS = [
  { id: "e1", title: "Appointment of Office Bearers", date: "2025-07-08", category: "Association", desc: "Formal appointment of the newly elected ECE Association office bearers for 2025-2026.", image: "" },
  { id: "e2", title: "ECE Association Inauguration", date: "2025-07-16", category: "Association", desc: "Official inauguration ceremony of the ECE Association for the academic year.", image: "" },
  { id: "e3", title: 'Release of Department Magazine "The Window"', date: "2025-07-16", category: "Magazine", desc: "Launch of the department magazine, showcasing student and faculty contributions.", image: "" },
  { id: "e4", title: "Workshop on Interview Cracking Skills", date: "2025-07-21", category: "Workshop", desc: "Session covering interview skills, attitude, and behavior development for placements.", image: "" },
  { id: "e5", title: "Essay Writing Contest, II-ECE", date: "2025-07-28", category: "Contest", desc: "Essay writing competition open to second-year ECE students.", image: "" },
  { id: "e6", title: "JAM Talk Show, II-ECE", date: "2025-07-28", category: "Contest", desc: "Just-A-Minute talk show to build spontaneous speaking and confidence.", image: "" },
  { id: "e7", title: "Quiz Contest, II-ECE", date: "2025-07-29", category: "Contest", desc: "Technical and general knowledge quiz contest for second-year students.", image: "" },
  { id: "e8", title: "Circuit Building Competition", date: "2025-08-11", category: "Contest", desc: "Hands-on circuit design and building competition for ECE students.", image: "" },
  { id: "e9", title: 'Seminar on "AI and its Applications"', date: "2025-08-23", category: "Seminar", desc: "Seminar delivered by an ECE alumni covering AI concepts and real-world applications.", image: "" },
  { id: "e10", title: "VCET-ECE APP Challenge Contest", date: "2025-08-28", category: "Contest", desc: "App development challenge encouraging students to build practical mobile solutions.", image: "" },
  { id: "e11", title: "Hands-on Training on Ocean Optics Spectrometers", date: "2025-08-30", category: "Training", desc: "Training session with COMTEK Scientific Instruments, Bengaluru, on Ocean Optics spectrometers.", image: "" },
];

// ---- 4. State ----------------------------------------------------------
let events = [];
let activeCategory = "All";
let editingId = null;

// ---- 5. Persistence helpers ---------------------------------------------
function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      events = JSON.parse(raw);
      return;
    }
  } catch (e) {
    console.warn("Could not read saved events, using defaults.", e);
  }
  events = DEFAULT_EVENTS.slice();
  saveEvents();
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

// ---- 6. Rendering --------------------------------------------------------
function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getCategories() {
  const set = new Set(events.map(ev => ev.category).filter(Boolean));
  return ["All", ...Array.from(set).sort()];
}

function renderCategoryNav() {
  const nav = document.getElementById("category-nav");
  nav.innerHTML = "";
  getCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === activeCategory) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategoryNav();
      renderEvents();
    });
    nav.appendChild(btn);
  });
}

function renderEvents() {
  const container = document.getElementById("events-section");
  container.innerHTML = "";

  const list = events
    .filter(ev => activeCategory === "All" || ev.category === activeCategory)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (list.length === 0) {
    container.innerHTML = '<p class="event-empty">No events in this category yet.</p>';
    return;
  }

  list.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-cat">${escapeHtml(ev.category)}</div>
      <h4>${escapeHtml(ev.title)}</h4>
      <div class="event-date">${formatDate(ev.date)}</div>
      <div class="event-desc">${escapeHtml(ev.desc)}</div>
    `;
    card.addEventListener("click", () => openEventModal(ev));
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// ---- 7. Event detail modal -------------------------------------------
function openEventModal(ev) {
  document.getElementById("modalCategory").textContent = ev.category;
  document.getElementById("modalTitle").textContent = ev.title;
  document.getElementById("modalDate").textContent = formatDate(ev.date);
  const body = document.getElementById("modalBody");
  body.innerHTML = "";
  if (ev.image) {
    const img = document.createElement("img");
    img.src = ev.image;
    img.alt = ev.title;
    img.style.width = "100%";
    img.style.borderRadius = "12px";
    img.style.marginBottom = "16px";
    body.appendChild(img);
  }
  const p = document.createElement("p");
  p.textContent = ev.desc;
  body.appendChild(p);
  openModal("eventModal");
}

// ---- 8. Generic modal open/close -------------------------------------
function openModal(id) { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

document.getElementById("closeModal").addEventListener("click", () => closeModal("eventModal"));
document.getElementById("closeLogin").addEventListener("click", () => closeModal("loginModal"));
document.getElementById("closeAdmin").addEventListener("click", () => closeModal("adminModal"));

[["eventModal"], ["loginModal"], ["adminModal"]].forEach(([id]) => {
  document.getElementById(id).addEventListener("click", (e) => {
    if (e.target.id === id) closeModal(id);
  });
});

// ---- 9. Update button / login flow -----------------------------------
document.getElementById("updateBtn").addEventListener("click", () => {
  if (isLoggedIn()) {
    openAdminEditor();
  } else {
    document.getElementById("loginError").textContent = "";
    document.getElementById("loginForm").reset();
    openModal("loginModal");
  }
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("loginId").value.trim();
  const pass = document.getElementById("loginPass").value;
  if (id === ADMIN_ID && pass === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, "true");
    closeModal("loginModal");
    openAdminEditor();
  } else {
    document.getElementById("loginError").textContent = "Incorrect ID or passkey. Please try again.";
  }
});

// ---- 10. Admin editor --------------------------------------------------
function openAdminEditor() {
  resetForm();
  renderAdminList();
  openModal("adminModal");
}

function resetForm() {
  editingId = null;
  document.getElementById("eventForm").reset();
  document.getElementById("eventId").value = "";
  document.getElementById("deleteEventBtn").style.display = "none";
}

function renderAdminList() {
  const ul = document.getElementById("adminEventList");
  ul.innerHTML = "";
  events
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(ev => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${formatDate(ev.date)} — ${escapeHtml(ev.title)}</span>
        <button type="button" data-id="${ev.id}">Edit</button>
      `;
      li.querySelector("button").addEventListener("click", () => loadEventIntoForm(ev.id));
      ul.appendChild(li);
    });
}

function loadEventIntoForm(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  editingId = id;
  document.getElementById("eventId").value = ev.id;
  document.getElementById("fTitle").value = ev.title;
  document.getElementById("fDate").value = ev.date;
  document.getElementById("fCategory").value = ev.category;
  document.getElementById("fDesc").value = ev.desc;
  document.getElementById("fImage").value = ev.image || "";
  document.getElementById("deleteEventBtn").style.display = "inline-block";
}

document.getElementById("eventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("fTitle").value.trim();
  const date = document.getElementById("fDate").value;
  const category = document.getElementById("fCategory").value.trim();
  const desc = document.getElementById("fDesc").value.trim();
  const image = document.getElementById("fImage").value.trim();

  if (editingId) {
    const ev = events.find(e => e.id === editingId);
    Object.assign(ev, { title, date, category, desc, image });
  } else {
    events.push({
      id: "e" + Date.now(),
      title, date, category, desc, image,
    });
  }

  saveEvents();
  renderCategoryNav();
  renderEvents();
  renderAdminList();
  resetForm();
});

document.getElementById("deleteEventBtn").addEventListener("click", () => {
  if (!editingId) return;
  if (!confirm("Delete this event? This cannot be undone.")) return;
  events = events.filter(e => e.id !== editingId);
  saveEvents();
  renderCategoryNav();
  renderEvents();
  renderAdminList();
  resetForm();
});

// ---- 11. Mobile menu toggle (shared with contact page) -----------------
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// ---- 12. Init ------------------------------------------------------------
loadEvents();
renderCategoryNav();
renderEvents();