/* ===========================
   CONSTANTS
=========================== */
const SEARCH_RADIUS = 5000; // 5 km
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
let showUserMarker = false;
window.userLocation = null;

/* ===========================
   USER LOCATION
=========================== */
function getUserLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      setUserLocation(defaultLat, defaultLng);
    }
  );
}

function setUserLocation(lat, lng) {
  window.userLocation = { lat, lng };
  map.setView([lat, lng], 14);

  if (showUserMarker) {
    if (!userMarker) {
      userMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();
    } else {
      userMarker.setLatLng([lat, lng]);
    }
  } else if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
}

/* ===========================
   OVERPASS API
=========================== */
async function fetchNearbyRestaurants(lat, lng, radius) {
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="fast_food"](around:${radius},${lat},${lng});
      node["amenity"="cafe"](around:${radius},${lat},${lng});
    );
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

    const name = p.tags?.name || "Unnamed Restaurant";

    L.marker([p.lat, p.lon])
      .addTo(restaurantLayer)
      .bindPopup(`🍽️ ${name}`);
  });
}

/* ===========================
   RESTAURANT LIST
=========================== */
function renderRestaurantList(restaurants) {
  const list = document.getElementById("restaurantList");
  list.innerHTML = "";

  if (!restaurants.length) {
    list.innerHTML = "<p>No restaurants found.</p>";
    return;
  }

  restaurants.forEach((p) => {
    const card = document.createElement("div");
    card.className = "restaurant-card";
    card.textContent = "🍽️ " + (p.tags?.name || "Unnamed Restaurant");
    card.addEventListener("click", () => {
      map.setView([p.lat, p.lon], 16);
    });
    list.appendChild(card);
  });
}

/* ===========================
   GEOCODING
=========================== */
async function geocodePlace(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.length) return null;

  return {
    lat: +data[0].lat,
    lon: +data[0].lon,
  };
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
    style: { weight: 5, color: "#ff652f" },
  }).addTo(map);

  map.fitBounds(routeLayer.getBounds());
}

/* ===========================
   RESTAURANTS ALONG ROUTE
=========================== */
async function fetchRestaurantsAlongRoute(route) {
  const coords = route.coordinates.filter((_, i) => i % 5 === 0);
  let all = [];

  for (let [lon, lat] of coords) {
    const res = await fetchNearbyRestaurants(lat, lon, 2000);
    all.push(...res);
  }

  return [...new Map(all.map(p => [p.id, p])).values()];
}

/* ===========================
   BUTTON EVENTS
=========================== */
document.getElementById("useCurrentBtn")?.addEventListener("click", () => {
  showUserMarker = true;
  getUserLocation();
});

document.getElementById("routeBtn").addEventListener("click", async () => {
  const startText = document.getElementById("startInput").value.trim();
  const destText = document.getElementById("destInput").value.trim();

  if (!destText) {
    alert("Enter destination");
    return;
  }

  showUserMarker = !startText;

  const start = startText
    ? await geocodePlace(startText)
    : (getUserLocation(), await new Promise(r => {
        const check = setInterval(() => {
          if (window.userLocation) {
            clearInterval(check);
            r(window.userLocation);
          }
        }, 100);
      }));

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
