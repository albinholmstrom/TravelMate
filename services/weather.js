// /services/weather.js
//service for fetching and caching weather dataa from OpenWeather API.
//provides current weather and short-term forecast with simple in-memory caching.

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

//cache durations
const TTL_CURRENT_MS = 10 * 60 * 1000; // 10 min
const TTL_FORECAST_MS = 30 * 60 * 1000; // 30 min

//buidl a stable cache key based on lat/lng rounded to 3 decimals
function keyCurrent(lat, lng) {
  return `WEATHER_CURRENT_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}
function keyForecast(lat, lng) {
  return `WEATHER_FORECAST_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}

//attempt to read and return cached data if not expired
async function getCached(key, ttlMs) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at < ttlMs) return data;
  } catch {}
  return null;
}

//save data with timestamp to storage.
async function setCached(key, data) {
  await AsyncStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
}

//fetch current weather data for given lat/lng
export async function fetchCurrentWeather(lat, lng) {
  if (!API_KEY) throw new Error("Missing OpenWeather API Key");
  const cacheKey = keyCurrent(lat, lng);
  const cached = await getCached(cacheKey, TTL_CURRENT_MS);
  if (cached) return cached;

  const url = `${BASE}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=sv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch current weather");
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

//fetch forecast (3h, intervals for 5d) and return normalized list
export async function fetchForecast(lat, lng) {
  if (!API_KEY) throw new Error("Missing OpenWeather API Key");
  const cacheKey = keyForecast(lat, lng);
  const cached = await getCached(cacheKey, TTL_FORECAST_MS);
  if (cached) return cached;

  const url = `${BASE}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=sv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch weather forecast");
  const json = await res.json();

  const items = (json.list || []).map((it) => ({
    dt: it.dt * 1000,
    temp: Math.round(it.main?.temp ?? 0),
    icon: it.weather?.[0]?.icon ?? "01d",
    description: it.weather?.[0]?.description ?? "",
  }));

  await setCached(cacheKey, items);
  return items;
}

export function iconUrl(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}
