// /services/weather.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";
const TTL_CURRENT_MS = 10 * 60 * 1000; // 10 min
const TTL_FORECAST_MS = 30 * 60 * 1000; // 30 min

function keyCurrent(lat, lng) {
  return `WEATHER_CURRENT_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}
function keyForecast(lat, lng) {
  return `WEATHER_FORECAST_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}

async function getCached(key, ttlMs) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at < ttlMs) return data;
  } catch {}
  return null;
}

async function setCached(key, data) {
  await AsyncStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
}

export async function fetchCurrentWeather(lat, lng) {
  if (!API_KEY) throw new Error("Saknar OpenWeather API Key");
  const cacheKey = keyCurrent(lat, lng);
  const cached = await getCached(cacheKey, TTL_CURRENT_MS);
  if (cached) return cached;

  const url = `${BASE}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=sv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunde inte hämta väder");
  const json = await res.json();

  const data = {
    temp: Math.round(json.main?.temp ?? 0),
    description: json.weather?.[0]?.description ?? "",
    icon: json.weather?.[0]?.icon ?? "01d", // OpenWeather icon code
    dt: json.dt * 1000,
  };
  await setCached(cacheKey, data);
  return data;
}

export async function fetchForecast(lat, lng) {
  if (!API_KEY) throw new Error("Saknar OpenWeather API Key");
  const cacheKey = keyForecast(lat, lng);
  const cached = await getCached(cacheKey, TTL_FORECAST_MS);
  if (cached) return cached;

  // 5-dygn / 3h prognos
  const url = `${BASE}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=sv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunde inte hämta prognos");
  const json = await res.json();

  // Normalisera: [{dt, temp, icon, description}]
  const items = (json.list || []).map((it) => ({
    dt: it.dt * 1000,
    temp: Math.round(it.main?.temp ?? 0),
    icon: it.weather?.[0]?.icon ?? "01d",
    description: it.weather?.[0]?.description ?? "",
  }));

  await setCached(cacheKey, items);
  return items;
}

// Hjälp att mappa openweather ikon -> url (om du vill visa bild)
// Alternativt kan du mappa till Ionicons i UI-komponent.
export function iconUrl(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}
