async function fetchNearbyRestaurants(lat, lng) {
  const radius = 8000; // meters (2km)

  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      node["amenity"="fast_food"](around:${radius},${lat},${lng});
    );
    out;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });

    const data = await response.json();
    return data.elements;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}
