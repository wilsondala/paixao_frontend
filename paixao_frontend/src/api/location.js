export async function searchAddress(query) {
  if (!query) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ", Angola"
    )}&addressdetails=1&limit=5`
  );

  const data = await response.json();
  return data;
}
