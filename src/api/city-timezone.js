// It's best to serve from process.env
const API_BASE_URL = "http://localhost:15486/";

export async function getCitySuggestions(keyWord) {
  const searchRequest = await fetch(
    `${API_BASE_URL}/api/records/1.0/search/?q=${keyWord}&dataset=geonames-all-cities-with-a-population-1000@public`
  );
  const result = await searchRequest.json();

  return result;
}
