const roles = [
  {
    id: "importer",
    label: "Importer",
    initials: "IM",
    description: "Create import DOs, detention details, and plant delivery inputs.",
    fields: ["Import DO ID", "Plant Location", "Free Days", "ETA", "Hazard Status", "CHA Contact"]
  },
  {
    id: "exporter",
    label: "Exporter",
    initials: "EX",
    description: "Enter export DO demand, factory slots, and stuffing readiness.",
    fields: ["Export DO ID", "Factory Location", "Stuffing Date", "Cargo Type", "Required Size", "Cut-off Time"]
  },
  {
    id: "transporter",
    label: "Transporter",
    initials: "TR",
    description: "Assign trucks, trailer capacity, driver status, and trip ETA.",
    fields: ["Truck Number", "Trailer Type", "Driver Name", "Current Location", "Factory ETA", "Return Plan"]
  },
  {
    id: "inspection",
    label: "Inspection",
    initials: "IN",
    description: "Capture container condition, hazard approval, and survey remarks.",
    fields: ["Seal Status", "Container Grade", "Damage Notes", "Hazard Approval", "Surveyor", "Inspection Time"]
  },
  {
    id: "linker",
    label: "Linker",
    initials: "LK",
    description: "Approve triangulation matches and link import containers to export DOs.",
    fields: ["Match Reference", "Line Approval", "Distance Override", "Priority", "Approval Notes", "Link Status"]
  }
];

let activeRole = roles[0];

const sampleContainerRows = [
  ["CMA", "SEKU6270218"],
  ["CMA", "CMAU4915999"],
  ["CMA", "TRHU7870465"],
  ["CORTEN", "TCNU9386380"],
  ["CORTEN", "YMLU8481077"],
  ["CORTEN", "TCNU9440048"],
  ["EMIRATES", "ESDU5000767"],
  ["EMIRATES", "ESDU7055645"],
  ["EMIRATES", "ESDU4065491"],
  ["EVERGREEN", "GAOU6421081"],
  ["EVERGREEN", "TIIU5458412"],
  ["EVERGREEN", "EGHU9336730"],
  ["EVERGREEN", "TIIU5890494"],
  ["EVERGREEN", "EMCU0106221"],
  ["EVERGREEN", "TLLU7654268"],
  ["EVERGREEN", "TGBU9972014"],
  ["EVERGREEN", "EITU9577379"],
  ["HAPAG", "CAIU4408076"],
  ["HAPAG", "HAMU3264090"],
  ["HAPAG", "UACU5959762"],
  ["HAPAG", "FCIU9208989"],
  ["MAERSK", "CAIU7223081"],
  ["MAERSK", "MRKU3964940"],
  ["MAERSK", "MRKU5224727"],
  ["MAERSK", "TRHU4052423"],
  ["MAERSK", "TCNU7594050"],
  ["MAERSK", "MRKU4982281"],
  ["MSC", "TGBU4307325"],
  ["MSC", "CAAU5818513"],
  ["MSC", "FFAU4139070"],
  ["MSC", "DFSU7503063"],
  ["ONE", "ONEU6542480"],
  ["ONE", "TCLU3794896"],
  ["PIL", "PCIU9051919"],
  ["PIL", "CAAU9052278"],
  ["PIL", "FFAU4333609"],
  ["PIL", "PIDU4595065"],
  ["SILMAR SHIPPING", "CXDU1011546"],
  ["SILMAR SHIPPING", "TCLU9446080"],
  ["WANHAI", "WHSU6685032"],
  ["WANHAI", "TIIU6343594"],
  ["WANHAI", "WHSU8491925"]
];

const exactContainerMap = Object.fromEntries(sampleContainerRows.map(([line, container]) => [container, line]));

const prefixRules = {
  CMAU: "CMA CGM",
  SEKU: "CMA CGM / Seaco",
  TRHU: "Triton leased container",
  TCNU: "Triton / Corten pool",
  YMLU: "Yang Ming / Corten pool",
  ESDU: "Emirates Shipping",
  GAOU: "Evergreen",
  TIIU: "Evergreen / leased pool",
  EGHU: "Evergreen",
  EMCU: "Evergreen",
  TLLU: "Evergreen / leased pool",
  TGBU: "Evergreen or MSC leased pool",
  EITU: "Evergreen",
  CAIU: "Hapag-Lloyd or Maersk leased pool",
  HAMU: "Hapag-Lloyd",
  UACU: "Hapag-Lloyd leased pool",
  FCIU: "Hapag-Lloyd or PIL leased pool",
  MRKU: "Maersk",
  MSCU: "MSC",
  CAAU: "MSC or PIL leased pool",
  FFAU: "MSC or PIL leased pool",
  DFSU: "MSC",
  ONEU: "Ocean Network Express",
  TCLU: "ONE or Silmar leased pool",
  PCIU: "Pacific International Lines",
  PIDU: "Pacific International Lines",
  CXDU: "Silmar Shipping",
  WHSU: "Wan Hai"
};

const importDOs = [
  {
    id: "IMP-NS-24081",
    line: "Maersk",
    container: "MSKU7823410",
    type: "40HC",
    hazard: "Non-Haz",
    eta: "11 May, 09:40",
    freeDays: 2,
    plant: "Chakan, Pune",
    truck: "MH12 VX 4831",
    status: "On Road"
  },
  {
    id: "IMP-NS-24082",
    line: "CMA CGM",
    container: "CMAU4409217",
    type: "20GP",
    hazard: "Haz Class 3",
    eta: "11 May, 14:10",
    freeDays: 1,
    plant: "Talegaon, Pune",
    truck: "MH14 KT 9022",
    status: "Risk"
  },
  {
    id: "IMP-MU-24083",
    line: "MSC",
    container: "MSCU8841205",
    type: "40GP",
    hazard: "Non-Haz",
    eta: "12 May, 07:30",
    freeDays: 5,
    plant: "Sanand, Ahmedabad",
    truck: "GJ01 RB 7741",
    status: "At Port"
  },
  {
    id: "IMP-HZ-24084",
    line: "Hapag-Lloyd",
    container: "HLBU1198452",
    type: "40HC",
    hazard: "Non-Haz",
    eta: "12 May, 16:00",
    freeDays: 3,
    plant: "Vapi, Gujarat",
    truck: "GJ15 CX 1208",
    status: "Matched"
  },
  {
    id: "IMP-NS-24085",
    line: "ONE",
    container: "ONEY7734021",
    type: "20GP",
    hazard: "Non-Haz",
    eta: "13 May, 10:20",
    freeDays: 4,
    plant: "Nashik MIDC",
    truck: "MH15 FU 2190",
    status: "Pending"
  },
  {
    id: "IMP-MU-24086",
    line: "Maersk",
    container: "MRKU2291144",
    type: "40GP",
    hazard: "Haz Class 8",
    eta: "13 May, 18:45",
    freeDays: 1,
    plant: "Aurangabad",
    truck: "MH20 DE 6619",
    status: "Risk"
  }
];

const exportDOs = [
  {
    id: "EXP-PN-58120",
    line: "Maersk",
    requirement: "Electronics spares",
    size: "40HC",
    factory: "Ranjangaon, Pune",
    stuffing: "12 May, 08:30",
    truck: "MH12 VX 4831",
    status: "Ready"
  },
  {
    id: "EXP-GJ-58121",
    line: "MSC",
    requirement: "Auto components",
    size: "40GP",
    factory: "Sanand, Ahmedabad",
    stuffing: "13 May, 11:00",
    truck: "Pending",
    status: "Pending"
  },
  {
    id: "EXP-VP-58122",
    line: "Hapag-Lloyd",
    requirement: "Speciality chemicals",
    size: "40HC",
    factory: "Vapi, Gujarat",
    stuffing: "13 May, 17:30",
    truck: "GJ15 CX 1208",
    status: "Matched"
  },
  {
    id: "EXP-NS-58123",
    line: "ONE",
    requirement: "Wine bottles",
    size: "20GP",
    factory: "Nashik MIDC",
    stuffing: "14 May, 09:00",
    truck: "Pending",
    status: "Pending"
  },
  {
    id: "EXP-TA-58124",
    line: "CMA CGM",
    requirement: "Pharma packaging",
    size: "20GP",
    factory: "Talegaon, Pune",
    stuffing: "12 May, 15:00",
    truck: "MH14 KT 9022",
    status: "Ready"
  }
];

const triangulationMatches = [
  {
    importContainer: "MSKU7823410 / IMP-NS-24081",
    exportMatch: "EXP-PN-58120",
    lineCompatibility: "Same line",
    distance: "42 km",
    etaFactory: "1h 20m",
    trailerMatch: "40 ft skeletal",
    score: 94
  },
  {
    importContainer: "HLBU1198452 / IMP-HZ-24084",
    exportMatch: "EXP-VP-58122",
    lineCompatibility: "Same line",
    distance: "18 km",
    etaFactory: "45m",
    trailerMatch: "40 ft hydraulic",
    score: 91
  },
  {
    importContainer: "CMAU4409217 / IMP-NS-24082",
    exportMatch: "EXP-TA-58124",
    lineCompatibility: "Same line, haz allowed",
    distance: "26 km",
    etaFactory: "55m",
    trailerMatch: "20 ft skeletal",
    score: 88
  },
  {
    importContainer: "MSCU8841205 / IMP-MU-24083",
    exportMatch: "EXP-GJ-58121",
    lineCompatibility: "Carrier-approved swap",
    distance: "63 km",
    etaFactory: "2h 05m",
    trailerMatch: "40 ft skeletal",
    score: 81
  },
  {
    importContainer: "ONEY7734021 / IMP-NS-24085",
    exportMatch: "EXP-NS-58123",
    lineCompatibility: "Same alliance",
    distance: "51 km",
    etaFactory: "1h 50m",
    trailerMatch: "20 ft skeletal",
    score: 74
  },
  {
    importContainer: "MRKU2291144 / IMP-MU-24086",
    exportMatch: "EXP-GJ-58121",
    lineCompatibility: "Manual approval",
    distance: "118 km",
    etaFactory: "3h 35m",
    trailerMatch: "40 ft skeletal",
    score: 66
  }
];

const charts = {
  emptyKm: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [14200, 12800, 11950, 10400, 9300, 8200],
    color: "#22d3ee"
  },
  utilization: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [64, 68, 73, 79, 82, 86],
    color: "#22c55e"
  },
  lineUsage: [
    { label: "Maersk", value: 28, color: "#3b82f6" },
    { label: "MSC", value: 22, color: "#22d3ee" },
    { label: "CMA CGM", value: 18, color: "#f59e0b" },
    { label: "Hapag-Lloyd", value: 17, color: "#8b5cf6" },
    { label: "ONE", value: 15, color: "#22c55e" }
  ]
};

const elements = {
  loginScreen: document.getElementById("loginScreen"),
  roleGrid: document.getElementById("roleGrid"),
  loginForm: document.getElementById("loginForm"),
  userName: document.getElementById("userName"),
  profileButton: document.getElementById("profileButton"),
  sidebar: document.querySelector(".sidebar"),
  navLinks: document.querySelectorAll(".nav-link"),
  sections: document.querySelectorAll(".section"),
  menuToggle: document.querySelector(".menu-toggle"),
  globalSearch: document.getElementById("globalSearch"),
  lineFilter: document.getElementById("lineFilter"),
  statusFilter: document.getElementById("statusFilter"),
  kpiGrid: document.getElementById("kpiGrid"),
  importBody: document.getElementById("importTableBody"),
  exportBody: document.getElementById("exportTableBody"),
  importCount: document.getElementById("importCount"),
  exportCount: document.getElementById("exportCount"),
  detentionList: document.getElementById("detentionList"),
  matchGrid: document.getElementById("matchGrid"),
  scoreRange: document.getElementById("scoreRange"),
  scoreValue: document.getElementById("scoreValue"),
  containerInput: document.getElementById("containerInput"),
  detectContainers: document.getElementById("detectContainers"),
  loadSampleContainers: document.getElementById("loadSampleContainers"),
  detectedContainerGrid: document.getElementById("detectedContainerGrid"),
  roleDetailFields: document.getElementById("roleDetailFields"),
  detailFormTitle: document.getElementById("detailFormTitle")
};

function renderRoles() {
  elements.roleGrid.innerHTML = roles
    .map((role) => `
      <button class="role-card ${role.id === activeRole.id ? "active" : ""}" type="button" data-role="${role.id}">
        <strong>${role.label}</strong>
        <span>${role.description}</span>
      </button>
    `)
    .join("");
}

function setRole(roleId) {
  activeRole = roles.find((role) => role.id === roleId) || roles[0];
  renderRoles();
  renderRoleFields();
  elements.profileButton.textContent = activeRole.initials;
}

function renderRoleFields() {
  elements.detailFormTitle.textContent = `Details requested from ${activeRole.label}`;
  elements.roleDetailFields.innerHTML = activeRole.fields
    .map((field) => {
      const id = field.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const isSelect = ["Hazard Status", "Required Size", "Trailer Type", "Priority", "Link Status", "Container Grade"].includes(field);
      const options = {
        "Hazard Status": ["Non-Haz", "Haz Class 3", "Haz Class 8"],
        "Required Size": ["20GP", "40GP", "40HC"],
        "Trailer Type": ["20 ft skeletal", "40 ft skeletal", "40 ft hydraulic"],
        Priority: ["High", "Medium", "Low"],
        "Link Status": ["Draft", "Submitted", "Approved"],
        "Container Grade": ["A", "B", "C", "Hold"]
      };

      if (isSelect) {
        return `
          <div class="form-field">
            <label for="${id}">${field}</label>
            <select id="${id}">
              ${options[field].map((option) => `<option>${option}</option>`).join("")}
            </select>
          </div>
        `;
      }

      return `
        <div class="form-field">
          <label for="${id}">${field}</label>
          <input id="${id}" type="text" placeholder="Enter ${field.toLowerCase()}">
        </div>
      `;
    })
    .join("");
}

function containerCheckDigit(container) {
  const values = {
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20, K: 21, L: 23, M: 24,
    N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31, U: 32, V: 34, W: 35, X: 36, Y: 37, Z: 38
  };
  const base = container.slice(0, 10);
  const sum = [...base].reduce((total, char, index) => {
    const numeric = Number.isNaN(Number(char)) ? values[char] : Number(char);
    return total + numeric * 2 ** index;
  }, 0);
  const remainder = sum % 11;
  return remainder === 10 ? 0 : remainder;
}

function analyzeContainer(rawValue) {
  const container = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const formatValid = /^[A-Z]{3}U\d{7}$/.test(container);
  const expectedDigit = formatValid ? containerCheckDigit(container) : null;
  const actualDigit = formatValid ? Number(container.at(-1)) : null;
  const checkDigitValid = formatValid && expectedDigit === actualDigit;
  const ownerPrefix = container.slice(0, 4);
  const exactLine = exactContainerMap[container];
  const inferredLine = exactLine || prefixRules[ownerPrefix] || "Unknown - enter line manually";

  return {
    container,
    ownerPrefix,
    line: exactLine || inferredLine,
    source: exactLine ? "Spreadsheet sample" : prefixRules[ownerPrefix] ? "Prefix rule" : "Manual review",
    formatValid,
    checkDigitValid
  };
}

function renderDetectedContainers() {
  const entries = elements.containerInput.value
    .split(/[\s,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!entries.length) {
    elements.detectedContainerGrid.innerHTML = `
      <article class="detected-card">
        <h4>No containers entered</h4>
        <p class="helper-text">Paste one or more container numbers to identify shipping lines.</p>
      </article>
    `;
    return;
  }

  elements.detectedContainerGrid.innerHTML = entries
    .map(analyzeContainer)
    .map((item) => `
      <article class="detected-card">
        <div class="card-header">
          <h4>${item.container}</h4>
          ${createBadge(item.checkDigitValid ? "Valid" : item.formatValid ? "Check digit" : "Format")}
        </div>
        <dl>
          <dt>Line</dt>
          <dd>${item.line}</dd>
          <dt>Prefix</dt>
          <dd>${item.ownerPrefix}</dd>
          <dt>Source</dt>
          <dd>${item.source}</dd>
          <dt>Action</dt>
          <dd>${activeRole.label} to complete details</dd>
        </dl>
      </article>
    `)
    .join("");
}

function badgeClass(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes("risk") || normalized.includes("reject")) return "danger";
  if (normalized.includes("pending") || normalized.includes("port")) return "warning";
  if (normalized.includes("matched") || normalized.includes("ready") || normalized.includes("road")) return "success";
  return "info";
}

function createBadge(status) {
  return `<span class="status-badge ${badgeClass(status)}">${status}</span>`;
}

function matchesFilters(record) {
  const query = elements.globalSearch.value.trim().toLowerCase();
  const selectedLine = elements.lineFilter.value;
  const selectedStatus = elements.statusFilter.value;
  const searchable = Object.values(record).join(" ").toLowerCase();
  const lineMatch = selectedLine === "all" || record.line === selectedLine;
  const statusMatch = selectedStatus === "all" || record.status === selectedStatus;
  const queryMatch = !query || searchable.includes(query);
  return lineMatch && statusMatch && queryMatch;
}

function renderKpis(imports, exports) {
  const nearDetention = imports.filter((item) => item.freeDays <= 2).length;
  const matched = triangulationMatches.filter((item) => item.score >= 80).length;
  const kpis = [
    ["Active Import Containers", imports.length, "+8% vs last week"],
    ["Active Export DOs", exports.length, "12 departures planned"],
    ["Matched Triangulations", matched, "High-confidence matches"],
    ["Empty KM Saved", "8,420", "This month"],
    ["Trailer Utilization %", "82%", "+6 pts month over month"],
    ["Containers Near Detention", nearDetention, "Requires dispatch action"]
  ];

  elements.kpiGrid.innerHTML = kpis
    .map(([label, value, delta]) => `
      <article class="kpi-card">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${delta}</small>
      </article>
    `)
    .join("");
}

function renderImportTable(rows) {
  elements.importCount.textContent = `${rows.length} records`;
  elements.importBody.innerHTML = rows
    .map((item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.line}</td>
        <td>${item.container}</td>
        <td>${item.type}</td>
        <td>${createBadge(item.hazard)}</td>
        <td>${item.eta}</td>
        <td>${item.freeDays}</td>
        <td>${item.plant}</td>
        <td>${item.truck}</td>
        <td>${createBadge(item.status)}</td>
      </tr>
    `)
    .join("");
}

function renderExportTable(rows) {
  elements.exportCount.textContent = `${rows.length} records`;
  elements.exportBody.innerHTML = rows
    .map((item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.line}</td>
        <td>${item.requirement}</td>
        <td>${item.size}</td>
        <td>${item.factory}</td>
        <td>${item.stuffing}</td>
        <td>${item.truck}</td>
        <td>${createBadge(item.status)}</td>
      </tr>
    `)
    .join("");
}

function renderDetentionList(imports) {
  elements.detentionList.innerHTML = imports
    .filter((item) => item.freeDays <= 2)
    .map((item) => `
      <div class="alert-row">
        <div>
          <strong>${item.container}</strong>
          <span>${item.plant} - ${item.line}</span>
        </div>
        ${createBadge(`${item.freeDays} days`)}
      </div>
    `)
    .join("");
}

function renderMatches() {
  const minScore = Number(elements.scoreRange.value);
  elements.scoreValue.textContent = `${minScore}%`;
  elements.matchGrid.innerHTML = triangulationMatches
    .filter((match) => match.score >= minScore)
    .map((match) => `
      <article class="match-card">
        <div class="match-top">
          <div>
            <span class="eyebrow">Recommended Pair</span>
            <h3>${match.exportMatch}</h3>
          </div>
          <div class="score-ring" style="--score: ${match.score}%">${match.score}%</div>
        </div>
        <div class="match-detail">
          <div class="detail-chip">
            <span>Import Container</span>
            <strong>${match.importContainer}</strong>
          </div>
          <div class="detail-chip">
            <span>Shipping Line Compatibility</span>
            <strong>${match.lineCompatibility}</strong>
          </div>
          <div class="detail-chip">
            <span>Distance</span>
            <strong>${match.distance}</strong>
          </div>
          <div class="detail-chip">
            <span>ETA to Factory</span>
            <strong>${match.etaFactory}</strong>
          </div>
          <div class="detail-chip">
            <span>Trailer Capacity Match</span>
            <strong>${match.trailerMatch}</strong>
          </div>
          <div class="detail-chip">
            <span>Match Score</span>
            <strong>${match.score}%</strong>
          </div>
        </div>
        <div class="match-actions">
          <button class="primary-button" type="button">Match</button>
          <button class="danger-button" type="button">Reject</button>
        </div>
      </article>
    `)
    .join("");
}

function renderLineFilter() {
  const lines = [...new Set([...importDOs, ...exportDOs].map((item) => item.line))].sort();
  elements.lineFilter.insertAdjacentHTML(
    "beforeend",
    lines.map((line) => `<option value="${line}">${line}</option>`).join("")
  );
}

function drawBarChart(canvasId, chart, formatter = (value) => value) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.height;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  const padding = 34;
  const max = Math.max(...chart.values) * 1.15;
  const barWidth = (width - padding * 2) / chart.values.length - 14;

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = padding + i * ((height - padding * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  chart.values.forEach((value, index) => {
    const x = padding + index * (barWidth + 14) + 8;
    const barHeight = ((height - padding * 2) * value) / max;
    const y = height - padding - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
    gradient.addColorStop(0, chart.color);
    gradient.addColorStop(1, "rgba(255,255,255,0.12)");
    ctx.fillStyle = gradient;
    roundedRect(ctx, x, y, barWidth, barHeight, 7);
    ctx.fill();

    ctx.fillStyle = "#dbeafe";
    ctx.font = "700 11px Inter";
    ctx.textAlign = "center";
    ctx.fillText(formatter(value), x + barWidth / 2, y - 8);

    ctx.fillStyle = "#9bb0c8";
    ctx.font = "600 11px Inter";
    ctx.fillText(chart.labels[index], x + barWidth / 2, height - 10);
  });
}

function drawPieChart() {
  const canvas = document.getElementById("linePieChart");
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.height;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  const total = charts.lineUsage.reduce((sum, item) => sum + item.value, 0);
  const radius = Math.min(width, height) * 0.34;
  const cx = width / 2;
  const cy = height / 2;
  let start = -Math.PI / 2;

  charts.lineUsage.forEach((item) => {
    const angle = (item.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    start += angle;
  });

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = "#0b1d36";
  ctx.fill();
  ctx.fillStyle = "#f7fbff";
  ctx.font = "800 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText("Usage", cx, cy - 2);
  ctx.fillStyle = "#9bb0c8";
  ctx.font = "600 12px Inter";
  ctx.fillText("by line", cx, cy + 16);

  document.getElementById("lineLegend").innerHTML = charts.lineUsage
    .map((item) => `
      <span class="legend-item">
        <span class="legend-dot" style="background:${item.color}"></span>
        ${item.label} ${item.value}%
      </span>
    `)
    .join("");
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function redrawCharts() {
  drawBarChart("emptyKmChart", charts.emptyKm, (value) => `${Math.round(value / 100) / 10}k`);
  drawBarChart("utilizationChart", charts.utilization, (value) => `${value}%`);
  drawPieChart();
}

function applyFilters() {
  const imports = importDOs.filter(matchesFilters);
  const exports = exportDOs.filter(matchesFilters);
  renderKpis(imports, exports);
  renderImportTable(imports);
  renderExportTable(exports);
  renderDetentionList(imports);
}

function showSection(sectionId) {
  elements.sections.forEach((section) => section.classList.toggle("active", section.id === sectionId));
  elements.navLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === sectionId));
  elements.sidebar.classList.remove("open");
  if (sectionId === "analytics") {
    requestAnimationFrame(redrawCharts);
  }
}

function initEvents() {
  elements.roleGrid.addEventListener("click", (event) => {
    const roleCard = event.target.closest("[data-role]");
    if (roleCard) {
      setRole(roleCard.dataset.role);
    }
  });

  elements.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.userName.value.trim();
    elements.profileButton.textContent = name
      ? name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()
      : activeRole.initials;
    elements.loginScreen.classList.add("hidden");
  });

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showSection(link.dataset.section);
    });
  });

  document.querySelectorAll("[data-section-jump]").forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.sectionJump));
  });

  elements.menuToggle.addEventListener("click", () => {
    elements.sidebar.classList.toggle("open");
  });

  [elements.globalSearch, elements.lineFilter, elements.statusFilter].forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });

  elements.scoreRange.addEventListener("input", renderMatches);
  elements.detectContainers.addEventListener("click", renderDetectedContainers);
  elements.loadSampleContainers.addEventListener("click", () => {
    elements.containerInput.value = sampleContainerRows.map(([, container]) => container).join("\n");
    renderDetectedContainers();
  });
  elements.containerInput.addEventListener("input", renderDetectedContainers);
  window.addEventListener("resize", redrawCharts);
}

function init() {
  renderRoles();
  renderRoleFields();
  renderLineFilter();
  applyFilters();
  renderMatches();
  renderDetectedContainers();
  redrawCharts();
  initEvents();
}

init();
