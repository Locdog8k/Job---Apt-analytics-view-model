const STORAGE_KEY = "australia-job-apartment-analytics-v1";

const AUSTRALIA_BOUNDS = {
  minLat: -44.5,
  maxLat: -10,
  minLng: 112,
  maxLng: 154.5,
};

const DEFAULT_DATA = {
  jobs: [
    {
      id: crypto.randomUUID(),
      name: "Barista",
      company: "Harbour Cafe",
      location: "Sydney NSW",
      hourlyPay: 31,
      hoursPerWeek: 38,
      notes: "Busy cafe, close to public transport",
    },
    {
      id: crypto.randomUUID(),
      name: "Warehouse assistant",
      company: "West Coast Logistics",
      location: "Perth WA",
      hourlyPay: 34,
      hoursPerWeek: 40,
      notes: "Morning shift",
    },
    {
      id: crypto.randomUUID(),
      name: "Hotel receptionist",
      company: "River Stay",
      location: "Brisbane QLD",
      hourlyPay: 29,
      hoursPerWeek: 35,
      notes: "Weekend availability useful",
    },
  ],
  apartments: [
    {
      id: crypto.randomUUID(),
      name: "Studio near Central",
      location: "Sydney NSW",
      monthlyPrice: 2600,
      bedrooms: 1,
      link: "",
      notes: "High rent, very central",
    },
    {
      id: crypto.randomUUID(),
      name: "Shared apartment",
      location: "Perth WA",
      monthlyPrice: 1500,
      bedrooms: 2,
      link: "",
      notes: "Good value if sharing",
    },
    {
      id: crypto.randomUUID(),
      name: "Unit close to CBD",
      location: "Brisbane QLD",
      monthlyPrice: 1900,
      bedrooms: 1,
      link: "",
      notes: "Walkable to work areas",
    },
  ],
};

const CITY_COORDS = [
  { aliases: ["sydney", "sydney nsw", "nsw"], lat: -33.8688, lng: 151.2093, label: "Sydney, NSW" },
  { aliases: ["melbourne", "melbourne vic", "vic"], lat: -37.8136, lng: 144.9631, label: "Melbourne, VIC" },
  { aliases: ["brisbane", "brisbane qld", "qld"], lat: -27.4698, lng: 153.0251, label: "Brisbane, QLD" },
  { aliases: ["perth", "perth wa", "wa"], lat: -31.9523, lng: 115.8613, label: "Perth, WA" },
  { aliases: ["adelaide", "adelaide sa", "sa"], lat: -34.9285, lng: 138.6007, label: "Adelaide, SA" },
  { aliases: ["hobart", "hobart tas", "tas"], lat: -42.8821, lng: 147.3272, label: "Hobart, TAS" },
  { aliases: ["darwin", "darwin nt", "nt"], lat: -12.4634, lng: 130.8456, label: "Darwin, NT" },
  { aliases: ["canberra", "canberra act", "act"], lat: -35.2809, lng: 149.13, label: "Canberra, ACT" },
  { aliases: ["gold coast", "surfers paradise"], lat: -28.0167, lng: 153.4, label: "Gold Coast, QLD" },
  { aliases: ["newcastle"], lat: -32.9283, lng: 151.7817, label: "Newcastle, NSW" },
  { aliases: ["wollongong"], lat: -34.4278, lng: 150.8931, label: "Wollongong, NSW" },
  { aliases: ["geelong"], lat: -38.1499, lng: 144.3617, label: "Geelong, VIC" },
  { aliases: ["cairns"], lat: -16.9186, lng: 145.7781, label: "Cairns, QLD" },
  { aliases: ["townsville"], lat: -19.2589, lng: 146.8169, label: "Townsville, QLD" },
  { aliases: ["sunshine coast", "maroochydore", "noosa"], lat: -26.65, lng: 153.0667, label: "Sunshine Coast, QLD" },
  { aliases: ["toowoomba"], lat: -27.5598, lng: 151.9507, label: "Toowoomba, QLD" },
  { aliases: ["ballarat"], lat: -37.5622, lng: 143.8503, label: "Ballarat, VIC" },
  { aliases: ["bendigo"], lat: -36.757, lng: 144.2794, label: "Bendigo, VIC" },
  { aliases: ["alice springs"], lat: -23.698, lng: 133.8807, label: "Alice Springs, NT" },
  { aliases: ["launceston"], lat: -41.4332, lng: 147.1441, label: "Launceston, TAS" },
  { aliases: ["fremantle"], lat: -32.0569, lng: 115.7439, label: "Fremantle, WA" },
  { aliases: ["parramatta"], lat: -33.815, lng: 151.0011, label: "Parramatta, NSW" },
  { aliases: ["bondi", "bondi beach"], lat: -33.8915, lng: 151.2767, label: "Bondi, NSW" },
  { aliases: ["newtown"], lat: -33.8971, lng: 151.178, label: "Newtown, NSW" },
  { aliases: ["st kilda", "saint kilda"], lat: -37.8676, lng: 144.9809, label: "St Kilda, VIC" },
  { aliases: ["carlton"], lat: -37.8001, lng: 144.9671, label: "Carlton, VIC" },
  { aliases: ["southbank"], lat: -37.823, lng: 144.9654, label: "Southbank, VIC" },
  { aliases: ["docklands"], lat: -37.8176, lng: 144.9465, label: "Docklands, VIC" },
  { aliases: ["richmond vic"], lat: -37.8199, lng: 145.0027, label: "Richmond, VIC" },
  { aliases: ["fortitude valley"], lat: -27.4565, lng: 153.0344, label: "Fortitude Valley, QLD" },
  { aliases: ["south brisbane"], lat: -27.4766, lng: 153.0167, label: "South Brisbane, QLD" },
  { aliases: ["west end brisbane"], lat: -27.4796, lng: 153.0124, label: "West End, QLD" },
  { aliases: ["northbridge"], lat: -31.9476, lng: 115.858, label: "Northbridge, WA" },
  { aliases: ["subiaco"], lat: -31.9485, lng: 115.8268, label: "Subiaco, WA" },
  { aliases: ["chatswood"], lat: -33.7969, lng: 151.1856, label: "Chatswood, NSW" },
];

const dom = {
  jobsTable: document.querySelector("#jobsTable"),
  apartmentsTable: document.querySelector("#apartmentsTable"),
  mapMarkers: document.querySelector("#mapMarkers"),
  addJob: document.querySelector("#addJob"),
  addApartment: document.querySelector("#addApartment"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  resetData: document.querySelector("#resetData"),
  jobCount: document.querySelector("#jobCount"),
  apartmentCount: document.querySelector("#apartmentCount"),
  avgHourly: document.querySelector("#avgHourly"),
  avgRent: document.querySelector("#avgRent"),
  bestLocation: document.querySelector("#bestLocation"),
  bestLocationDetail: document.querySelector("#bestLocationDetail"),
  matchedCount: document.querySelector("#matchedCount"),
  unmatchedLocations: document.querySelector("#unmatchedLocations"),
};

let state = loadData();

dom.addJob.addEventListener("click", () => {
  state.jobs.push({
    id: crypto.randomUUID(),
    name: "New job",
    company: "",
    location: "",
    hourlyPay: 0,
    hoursPerWeek: 38,
    notes: "",
  });
  saveAndRender();
});

dom.addApartment.addEventListener("click", () => {
  state.apartments.push({
    id: crypto.randomUUID(),
    name: "New apartment",
    location: "",
    monthlyPrice: 0,
    bedrooms: 1,
    link: "",
    notes: "",
  });
  saveAndRender();
});

dom.exportData.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "australia-job-apartment-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

dom.importData.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    state = normalizeImportedData(imported);
    saveAndRender();
  } catch (error) {
    alert("Could not import that JSON file. Please check the format and try again.");
    console.error(error);
  } finally {
    event.target.value = "";
  }
});

dom.resetData.addEventListener("click", () => {
  if (!confirm("Reset the dashboard to the demo data? Your current browser data will be replaced.")) {
    return;
  }

  state = cloneDefaultData();
  saveAndRender();
});

render();

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return cloneDefaultData();
  }

  try {
    return normalizeImportedData(JSON.parse(saved));
  } catch (error) {
    console.warn("Saved data was invalid, loading demo data instead.", error);
    return cloneDefaultData();
  }
}

function cloneDefaultData() {
  return {
    jobs: DEFAULT_DATA.jobs.map((job) => ({ ...job, id: crypto.randomUUID() })),
    apartments: DEFAULT_DATA.apartments.map((apartment) => ({
      ...apartment,
      id: crypto.randomUUID(),
    })),
  };
}

function normalizeImportedData(imported) {
  return {
    jobs: Array.isArray(imported.jobs)
      ? imported.jobs.map((job) => ({
          id: String(job.id || crypto.randomUUID()),
          name: String(job.name || ""),
          company: String(job.company || ""),
          location: String(job.location || ""),
          hourlyPay: toNumber(job.hourlyPay),
          hoursPerWeek: toNumber(job.hoursPerWeek || 38),
          notes: String(job.notes || ""),
        }))
      : [],
    apartments: Array.isArray(imported.apartments)
      ? imported.apartments.map((apartment) => ({
          id: String(apartment.id || crypto.randomUUID()),
          name: String(apartment.name || ""),
          location: String(apartment.location || ""),
          monthlyPrice: toNumber(apartment.monthlyPrice),
          bedrooms: toNumber(apartment.bedrooms || 1),
          link: String(apartment.link || ""),
          notes: String(apartment.notes || ""),
        }))
      : [],
  };
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function render() {
  renderJobsTable();
  renderApartmentsTable();
  renderMap();
  renderDashboard();
}

function renderJobsTable() {
  dom.jobsTable.innerHTML = "";

  if (state.jobs.length === 0) {
    dom.jobsTable.appendChild(emptyRow("No jobs yet. Add one to start comparing income.", 7));
    return;
  }

  state.jobs.forEach((job) => {
    const row = document.createElement("tr");
    const location = geocodeLocation(job.location);

    row.append(
      editableCell(job, "name", "text", "Job name"),
      editableCell(job, "company", "text", "Company"),
      locationCell(job, "jobs", location),
      editableCell(job, "hourlyPay", "number", "Hourly pay", { min: 0, step: 0.5 }),
      editableCell(job, "hoursPerWeek", "number", "Hours per week", { min: 0, step: 1 }),
      editableCell(job, "notes", "textarea", "Notes"),
      deleteCell("jobs", job.id, "Delete job")
    );
    dom.jobsTable.appendChild(row);
  });
}

function renderApartmentsTable() {
  dom.apartmentsTable.innerHTML = "";

  if (state.apartments.length === 0) {
    dom.apartmentsTable.appendChild(
      emptyRow("No apartments yet. Add one to compare monthly rent.", 7)
    );
    return;
  }

  state.apartments.forEach((apartment) => {
    const row = document.createElement("tr");
    const location = geocodeLocation(apartment.location);

    row.append(
      editableCell(apartment, "name", "text", "Apartment name"),
      locationCell(apartment, "apartments", location),
      editableCell(apartment, "monthlyPrice", "number", "Monthly price", { min: 0, step: 50 }),
      editableCell(apartment, "bedrooms", "number", "Bedrooms", { min: 0, step: 1 }),
      editableCell(apartment, "link", "url", "Link"),
      editableCell(apartment, "notes", "textarea", "Notes"),
      deleteCell("apartments", apartment.id, "Delete apartment")
    );
    dom.apartmentsTable.appendChild(row);
  });
}

function editableCell(item, key, type, label, options = {}) {
  const cell = document.createElement("td");
  const input = type === "textarea" ? document.createElement("textarea") : document.createElement("input");

  if (input instanceof HTMLInputElement) {
    input.type = type;
    if (options.min !== undefined) input.min = String(options.min);
    if (options.step !== undefined) input.step = String(options.step);
  }

  input.value = item[key] ?? "";
  input.ariaLabel = label;
  input.addEventListener("change", () => {
    item[key] = type === "number" ? toNumber(input.value) : input.value.trim();
    saveAndRender();
  });

  cell.appendChild(input);
  return cell;
}

function locationCell(item, group, location) {
  const cell = document.createElement("td");
  const input = document.createElement("input");
  const status = document.createElement("span");

  input.type = "text";
  input.value = item.location;
  input.ariaLabel = "Location";
  input.placeholder = "Example: Sydney NSW";
  input.addEventListener("change", () => {
    item.location = input.value.trim();
    saveAndRender();
  });

  status.className = location ? "location-status" : "location-status warning";
  status.textContent = location ? `Mapped to ${location.label}` : "Not mapped yet";
  status.dataset.group = group;

  cell.append(input, status);
  return cell;
}

function deleteCell(group, id, label) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete-button";
  button.textContent = "Delete";
  button.ariaLabel = label;
  button.addEventListener("click", () => {
    state[group] = state[group].filter((item) => item.id !== id);
    saveAndRender();
  });
  cell.appendChild(button);
  return cell;
}

function emptyRow(message, columns) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "empty-state";
  cell.colSpan = columns;
  cell.textContent = message;
  row.appendChild(cell);
  return row;
}

function renderMap() {
  dom.mapMarkers.innerHTML = "";
  const markers = [
    ...state.jobs.map((job) => ({
      type: "job",
      title: job.name || "Untitled job",
      detail: `${job.company || "Unknown company"} - ${formatCurrency(job.hourlyPay)} / hour`,
      location: geocodeLocation(job.location),
    })),
    ...state.apartments.map((apartment) => ({
      type: "apartment",
      title: apartment.name || "Untitled apartment",
      detail: `${formatCurrency(apartment.monthlyPrice)} / month`,
      location: geocodeLocation(apartment.location),
    })),
  ].filter((marker) => marker.location);

  markers.forEach((marker, index) => {
    const point = coordinatesToMapPoint(marker.location);
    const wrap = document.createElement("button");
    const pin = document.createElement("span");
    const label = document.createElement("span");

    wrap.type = "button";
    wrap.className = "marker-wrap";
    wrap.style.left = `calc(${point.x}% + ${offsetForStack(index)}px)`;
    wrap.style.top = `calc(${point.y}% + ${offsetForStack(index + 2)}px)`;
    wrap.title = `${marker.title} - ${marker.location.label}`;

    pin.className = `marker ${marker.type}`;
    label.className = "marker-label";
    label.textContent = `${marker.title} | ${marker.location.label} | ${marker.detail}`;

    wrap.append(pin, label);
    dom.mapMarkers.appendChild(wrap);
  });
}

function renderDashboard() {
  const mappedJobs = state.jobs.filter((job) => geocodeLocation(job.location));
  const mappedApartments = state.apartments.filter((apartment) => geocodeLocation(apartment.location));
  const allRows = [...state.jobs, ...state.apartments];
  const unmatched = allRows
    .filter((row) => row.location && !geocodeLocation(row.location))
    .map((row) => row.location);

  dom.jobCount.textContent = String(state.jobs.length);
  dom.apartmentCount.textContent = String(state.apartments.length);
  dom.avgHourly.textContent = `Average hourly pay: ${formatCurrency(average(state.jobs.map((job) => job.hourlyPay)))}`;
  dom.avgRent.textContent = `Average rent: ${formatCurrency(
    average(state.apartments.map((apartment) => apartment.monthlyPrice))
  )} / month`;
  dom.matchedCount.textContent = `${mappedJobs.length + mappedApartments.length}/${allRows.length}`;
  dom.unmatchedLocations.textContent =
    unmatched.length > 0
      ? `Missing: ${[...new Set(unmatched)].slice(0, 4).join(", ")}`
      : "All known locations mapped";

  const bestOption = calculateBestNetOption();
  if (!bestOption) {
    dom.bestLocation.textContent = "Add more data";
    dom.bestLocationDetail.textContent = "Needs at least one mapped job and apartment in the same city.";
    return;
  }

  dom.bestLocation.textContent = bestOption.location;
  dom.bestLocationDetail.textContent = `${formatCurrency(bestOption.net)} estimated left / month (${bestOption.jobName} minus ${bestOption.apartmentName}).`;
}

function calculateBestNetOption() {
  const options = [];

  state.jobs.forEach((job) => {
    const jobLocation = geocodeLocation(job.location);
    if (!jobLocation) return;

    state.apartments.forEach((apartment) => {
      const apartmentLocation = geocodeLocation(apartment.location);
      if (!apartmentLocation || apartmentLocation.label !== jobLocation.label) return;

      const monthlyIncome = toNumber(job.hourlyPay) * toNumber(job.hoursPerWeek) * 4.33;
      options.push({
        location: jobLocation.label,
        net: monthlyIncome - toNumber(apartment.monthlyPrice),
        jobName: job.name || "job",
        apartmentName: apartment.name || "apartment",
      });
    });
  });

  return options.sort((a, b) => b.net - a.net)[0] || null;
}

function geocodeLocation(rawLocation) {
  if (!rawLocation) return null;

  const normalized = normalizeText(rawLocation);
  const matches = CITY_COORDS.flatMap((city) =>
    city.aliases.map((alias) => ({ ...city, alias: normalizeText(alias) }))
  ).sort((a, b) => b.alias.length - a.alias.length);

  return matches.find((city) => containsLocationToken(normalized, city.alias)) || null;
}

function containsLocationToken(location, alias) {
  if (alias.length <= 3) {
    return new RegExp(`(^|\\s)${escapeRegex(alias)}($|\\s)`).test(location);
  }

  return location.includes(alias);
}

function coordinatesToMapPoint({ lat, lng }) {
  const x = ((lng - AUSTRALIA_BOUNDS.minLng) / (AUSTRALIA_BOUNDS.maxLng - AUSTRALIA_BOUNDS.minLng)) * 100;
  const y = ((AUSTRALIA_BOUNDS.maxLat - lat) / (AUSTRALIA_BOUNDS.maxLat - AUSTRALIA_BOUNDS.minLat)) * 100;

  return {
    x: clamp(x, 4, 96),
    y: clamp(y, 6, 94),
  };
}

function offsetForStack(index) {
  return ((index % 5) - 2) * 7;
}

function average(values) {
  const usable = values.map(toNumber).filter((value) => value > 0);
  if (usable.length === 0) return 0;
  return usable.reduce((sum, value) => sum + value, 0) / usable.length;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
