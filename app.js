const STORAGE_KEY = "australia-job-apartment-analytics-v1";

const AUSTRALIA_CENTER = [-25.2744, 133.7751];
const AUSTRALIA_MAP_BOUNDS = [
  [-44.5, 111.5],
  [-9.5, 155.5],
];
const LOCATION_SUGGESTION_LIMIT = 12;
const STATE_ALIASES = {
  ACT: ["act", "australian capital territory"],
  NSW: ["nsw", "new south wales"],
  NT: ["nt", "northern territory"],
  QLD: ["qld", "queensland"],
  SA: ["sa", "south australia"],
  TAS: ["tas", "tasmania"],
  VIC: ["vic", "victoria"],
  WA: ["wa", "western australia"],
  JBT: ["jbt", "jervis bay territory"],
};

const DEFAULT_DATA = {
  jobs: [
    {
      id: createId(),
      name: "Barista",
      company: "Harbour Cafe",
      location: "Sydney NSW",
      hourlyPay: 31,
      hoursPerWeek: 38,
      notes: "Busy cafe, close to public transport",
    },
    {
      id: createId(),
      name: "Warehouse assistant",
      company: "West Coast Logistics",
      location: "Perth WA",
      hourlyPay: 34,
      hoursPerWeek: 40,
      notes: "Morning shift",
    },
    {
      id: createId(),
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
      id: createId(),
      name: "Studio near Central",
      location: "Sydney NSW",
      monthlyPrice: 2600,
      bedrooms: 1,
      link: "",
      notes: "High rent, very central",
    },
    {
      id: createId(),
      name: "Shared apartment",
      location: "Perth WA",
      monthlyPrice: 1500,
      bedrooms: 2,
      link: "",
      notes: "Good value if sharing",
    },
    {
      id: createId(),
      name: "Unit close to CBD",
      location: "Brisbane QLD",
      monthlyPrice: 1900,
      bedrooms: 1,
      link: "",
      notes: "Walkable to work areas",
    },
  ],
};

const AUSTRALIA_PLACES = Array.isArray(window.AUSTRALIA_PLACES) ? window.AUSTRALIA_PLACES : [];

let map;
let markerLayer;
let placeIndex;

const dom = {
  jobsTable: document.querySelector("#jobsTable"),
  apartmentsTable: document.querySelector("#apartmentsTable"),
  map: document.querySelector("#map"),
  mapFallback: document.querySelector("#mapFallback"),
  locationDatabaseCount: document.querySelector("#locationDatabaseCount"),
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

initializeMap();
renderLocationDatabaseCount();

dom.addJob.addEventListener("click", () => {
  state.jobs.push({
    id: createId(),
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
    id: createId(),
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
    jobs: DEFAULT_DATA.jobs.map((job) => ({ ...job, id: createId() })),
    apartments: DEFAULT_DATA.apartments.map((apartment) => ({
      ...apartment,
      id: createId(),
    })),
  };
}

function normalizeImportedData(imported) {
  const source = imported && typeof imported === "object" ? imported : {};

  return {
    jobs: Array.isArray(source.jobs)
      ? source.jobs.map((job) => ({
          id: String(job.id || createId()),
          name: String(job.name || ""),
          company: String(job.company || ""),
          location: String(job.location || ""),
          hourlyPay: toNumber(job.hourlyPay),
          hoursPerWeek: toNumber(job.hoursPerWeek || 38),
          notes: String(job.notes || ""),
        }))
      : [],
    apartments: Array.isArray(source.apartments)
      ? source.apartments.map((apartment) => ({
          id: String(apartment.id || createId()),
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

function initializeMap() {
  if (!dom.map || !window.L) {
    if (dom.mapFallback) dom.mapFallback.hidden = false;
    return;
  }

  map = L.map(dom.map, {
    center: AUSTRALIA_CENTER,
    zoom: 4,
    minZoom: 3,
    maxBounds: AUSTRALIA_MAP_BOUNDS,
    maxBoundsViscosity: 0.7,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  setTimeout(() => map.invalidateSize(), 0);
}

function renderLocationDatabaseCount() {
  if (dom.locationDatabaseCount) {
    dom.locationDatabaseCount.textContent = `${AUSTRALIA_PLACES.length.toLocaleString("en-AU")}`;
  }
}

function markerIcon(type) {
  return L.divIcon({
    className: "",
    html: `<span class="custom-pin ${type}"></span>`,
    iconAnchor: [11, 22],
    iconSize: [22, 22],
    popupAnchor: [0, -22],
  });
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
  const selector = document.createElement("div");
  const input = document.createElement("input");
  const suggestions = document.createElement("div");
  const status = document.createElement("span");

  selector.className = "location-selector";
  input.type = "text";
  input.value = item.location;
  input.ariaLabel = "Location";
  input.placeholder = "Example: Sydney NSW";
  input.autocomplete = "off";
  input.addEventListener("input", () => {
    renderLocationSuggestions(input.value, suggestions, (place) => {
      item.location = place.label;
      saveAndRender();
    });
  });
  input.addEventListener("change", () => {
    item.location = input.value.trim();
    saveAndRender();
  });
  input.addEventListener("focus", () => {
    renderLocationSuggestions(input.value, suggestions, (place) => {
      item.location = place.label;
      saveAndRender();
    });
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      suggestions.hidden = true;
    }
  });
  input.addEventListener("blur", () => {
    setTimeout(() => {
      suggestions.hidden = true;
    }, 120);
  });

  suggestions.className = "location-suggestions";
  suggestions.hidden = true;

  status.className = location ? "location-status" : "location-status warning";
  status.textContent = location ? `Mapped to ${location.label}` : "Not mapped yet";
  status.dataset.group = group;

  selector.append(input, suggestions);
  cell.append(selector, status);
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

function renderLocationSuggestions(query, container, onSelect) {
  const matches = findLocationSuggestions(query);
  container.innerHTML = "";

  if (matches.length === 0) {
    container.hidden = true;
    return;
  }

  const list = document.createElement("ul");
  list.setAttribute("aria-label", "Australian city and town suggestions");

  matches.forEach((place) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const population = place.p ? `Population ${place.p.toLocaleString("en-AU")}` : "Population unavailable";

    button.type = "button";
    button.className = "location-suggestion";
    button.innerHTML = `
      <strong>${escapeHtml(place.n)}</strong>
      <span>${escapeHtml(place.s || "Australia")} - ${escapeHtml(population)}</span>
    `;
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      onSelect(place);
    });

    item.appendChild(button);
    list.appendChild(item);
  });

  container.appendChild(list);
  container.hidden = false;
}

function findLocationSuggestions(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const preferredState = detectPreferredState(normalizedQuery);
  const queryWithoutState = removeStateAliases(normalizedQuery, preferredState);
  const searchableQuery = queryWithoutState || normalizedQuery;

  return getPlaceIndex()
    .filter((place) => {
      if (preferredState && place.s !== preferredState) return false;
      return place.nameKey.startsWith(searchableQuery) || place.labelKey.startsWith(searchableQuery);
    })
    .slice(0, LOCATION_SUGGESTION_LIMIT);
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
  if (!map || !markerLayer) return;

  markerLayer.clearLayers();
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

  const bounds = [];

  markers.forEach((marker) => {
    const latLng = [marker.location.lat, marker.location.lng];
    bounds.push(latLng);

    L.marker(latLng, { icon: markerIcon(marker.type), title: `${marker.title} - ${marker.location.label}` })
      .bindPopup(
        `<div class="marker-popup">
          <strong>${escapeHtml(marker.title)}</strong>
          <span>${marker.type === "job" ? "Job" : "Apartment"} - ${escapeHtml(marker.location.label)}</span><br />
          ${escapeHtml(marker.detail)}
        </div>`
      )
      .addTo(markerLayer);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 11 });
  } else {
    map.setView(AUSTRALIA_CENTER, 4);
  }
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
  const preferredState = detectPreferredState(normalized);
  const normalizedWithoutState = removeStateAliases(normalized, preferredState);
  const places = getPlaceIndex();

  const exact = places.find((place) => {
    if (preferredState && place.s !== preferredState) return false;
    return place.nameKey === normalized || place.nameKey === normalizedWithoutState;
  });

  if (exact) return placeToLocation(exact);

  const partial = places.find((place) => {
    if (preferredState && place.s !== preferredState) return false;
    return containsLocationToken(normalizedWithoutState || normalized, place.nameKey);
  });

  return partial ? placeToLocation(partial) : null;
}

function getPlaceIndex() {
  if (!placeIndex) {
    placeIndex = AUSTRALIA_PLACES.map((place) => ({
      ...place,
      label: `${place.n}${place.s ? `, ${place.s}` : ""}`,
      nameKey: normalizeText(place.n),
      labelKey: normalizeText(`${place.n} ${place.s || ""}`),
    })).sort((a, b) => {
      if ((b.p || 0) !== (a.p || 0)) return (b.p || 0) - (a.p || 0);
      return a.label.localeCompare(b.label);
    });
  }

  return placeIndex;
}

function detectPreferredState(normalizedLocation) {
  return (
    Object.entries(STATE_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => containsLocationToken(normalizedLocation, alias))
    )?.[0] || ""
  );
}

function removeStateAliases(normalizedLocation, state) {
  if (!state) return normalizedLocation;

  return STATE_ALIASES[state]
    .reduce(
      (location, alias) =>
        location.replace(new RegExp(`(^|\\s)${escapeRegex(alias)}($|\\s)`, "g"), " "),
      normalizedLocation
    )
    .replace(/\s+/g, " ")
    .trim();
}

function containsLocationToken(location, placeName) {
  if (!location || !placeName) return false;
  if (placeName.length <= 2) return location === placeName;
  return new RegExp(`(^|\\s)${escapeRegex(placeName)}($|\\s)`).test(location);
}

function placeToLocation(place) {
  return {
    lat: place.lat,
    lng: place.lng,
    label: place.label,
    population: place.p || 0,
    feature: place.f,
  };
}

function average(values) {
  const usable = values.map(toNumber).filter((value) => value > 0);
  if (usable.length === 0) return 0;
  return usable.reduce((sum, value) => sum + value, 0) / usable.length;
}

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
