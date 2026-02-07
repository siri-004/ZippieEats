/* ===========================
   CONSTANTS
=========================== */
const SEARCH_RADIUS = 400;
const defaultLat = 17.385044;
const defaultLng = 78.486671;

/* ===========================
   MAP INITIALIZATION
=========================== */
const map = L.map("map").setView([defaultLat, defaultLng], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

/* ===========================
   GLOBAL VARIABLES
=========================== */
let userMarker = null;
let routeLayer = null;
let restaurantLayer = L.layerGroup().addTo(map);
window.userLocation = null;

/* ===========================
   USE CURRENT LOCATION
=========================== */
document.getElementById("useCurrentBtn")?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      window.userLocation = { lat, lon };

      // Fill start input like Rapido
      document.getElementById("startInput").value = "Current Location";

      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("📍 Current Location")
        .openPopup();

      map.setView([lat, lon], 14);
    },
    () => alert("Unable to get current location")
  );
});

/* ===========================
   OVERPASS API
=========================== */
async function fetchNearbyRestaurants(lat, lng, radius) {
  const query = `
    [out:json];
    node(around:${radius},${lat},${lng})
    ["amenity"~"restaurant|fast_food|cafe"];
    out body;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await res.json();
  return data.elements || [];
}

/* ===========================
   MAP MARKERS
=========================== */
function addRestaurantMarkers(restaurants) {
  restaurantLayer.clearLayers();

  restaurants.forEach((p) => {
    if (!p.lat || !p.lon) return;

    L.marker([p.lat, p.lon])
      .addTo(restaurantLayer)
      .bindPopup(`🍽️ ${p.tags?.name || "Unnamed Restaurant"}`);
  });
}

/* ===========================
   RESTAURANT LIST
=========================== */
function renderRestaurantList(restaurants) {
  const list = document.getElementById("restaurantList");
  list.innerHTML = "";

  if (!restaurants.length) {
    list.innerHTML = "<p>No restaurants found along the route.</p>";
    return;
  }

  restaurants.forEach((p) => {
    const card = document.createElement("div");
    card.className = "restaurant-card";
    card.textContent = "🍽️ " + (p.tags?.name || "Unnamed Restaurant");
    card.onclick = () => map.setView([p.lat, p.lon], 16);
    list.appendChild(card);
  });
}

/* ===========================
   GEOCODING
=========================== */
async function geocodePlace(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.length) return null;
  return { lat: +data[0].lat, lon: +data[0].lon };
}

/* ===========================
   ROUTING (OSRM)
=========================== */
async function getRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  return data.routes[0].geometry;
}

function drawRoute(geojson) {
  if (routeLayer) map.removeLayer(routeLayer);

  routeLayer = L.geoJSON(geojson, {
    style: { color: "#ff652f", weight: 5 },
  }).addTo(map);

  map.fitBounds(routeLayer.getBounds());
}

/* ===========================
   RESTAURANTS ALONG ROUTE
=========================== */
async function fetchRestaurantsAlongRoute(route) {
  const coords = route.coordinates.filter((_, i) => i % 25 === 0);

  let query = `
    [out:json][timeout:25];
    (
  `;

  coords.forEach(([lon, lat]) => {
    query += `
      node(around:${SEARCH_RADIUS},${lat},${lon})
      ["amenity"~"restaurant|fast_food|cafe"];
    `;
  });

  query += `); out body;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await res.json();
  return [...new Map((data.elements || []).map(p => [p.id, p])).values()];
}

/* ===========================
   ROUTE BUTTON
=========================== */
document.getElementById("routeBtn")?.addEventListener("click", async () => {
  const startText = document.getElementById("startInput").value.trim();
  const destText = document.getElementById("destInput").value.trim();

  if (!startText || !destText) {
    alert("Please enter both start and destination");
    return;
  }

  let start;

  // If user selected current location
  if (startText === "Current Location") {
    if (!window.userLocation) {
      alert("Current location not available");
      return;
    }
    start = window.userLocation;
  } else {
    start = await geocodePlace(startText);
  }

  const end = await geocodePlace(destText);

  if (!start || !end) {
    alert("Invalid locations");
    return;
  }

  const route = await getRoute(start, end);
  drawRoute(route);

  const restaurants = await fetchRestaurantsAlongRoute(route);
  renderRestaurantList(restaurants);
  addRestaurantMarkers(restaurants);
});
