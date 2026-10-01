// OpenStreetMap's free geocoder. Its usage policy allows at most one request
// per second and no search-as-you-type, so search only runs on submit.
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

// Only search inside Mongolia.
const COUNTRY_CODES = "mn";

// display_name ends with the postcode and country, which a courier
// doesn't need.
function shortLabel(place) {
  const { postcode, country } = place.address ?? {};
  return place.display_name
    .split(", ")
    .filter((part) => part !== postcode && part !== country)
    .join(", ");
}

async function nominatim(path, params, signal) {
  const query = new URLSearchParams({ format: "jsonv2", ...params });
  const response = await fetch(`${NOMINATIM_URL}${path}?${query}`, { signal });
  if (!response.ok) throw new Error(`Nominatim ${response.status}`);
  return response.json();
}

// Returns up to 5 matches: [{ label, lat, lng }].
export async function searchPlaces(text, signal) {
  const places = await nominatim(
    "/search",
    { q: text, limit: "5", addressdetails: "1", countrycodes: COUNTRY_CODES },
    signal,
  );
  return places.map((place) => ({
    label: shortLabel(place),
    lat: Number(place.lat),
    lng: Number(place.lon),
  }));
}

// Returns the street address at a point, or "" when there is none.
export async function lookupAddress({ lat, lng }, signal) {
  const place = await nominatim(
    "/reverse",
    { lat: String(lat), lon: String(lng), zoom: "18" },
    signal,
  );
  return place?.display_name ? shortLabel(place) : "";
}
