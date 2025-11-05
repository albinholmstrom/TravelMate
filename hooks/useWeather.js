// /hooks/useWeather.js
import * as React from "react";
import { fetchCurrentWeather, fetchForecast } from "../services/weather";

export function useWeather(place) {
  const [current, setCurrent] = React.useState(null);
  const [forecast, setForecast] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const hasCoords = !!(place?.lat && place?.lng);

  const load = React.useCallback(async () => {
    if (!hasCoords) return;
    setLoading(true);
    setErr(null);
    try {
      const [c] = await Promise.all([
        fetchCurrentWeather(place.lat, place.lng),
      ]);
      setCurrent(c);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [place?.lat, place?.lng, hasCoords]);

  const loadForecast = React.useCallback(async () => {
    if (!hasCoords) return;
    try {
      const items = await fetchForecast(place.lat, place.lng);
      setForecast(items);
    } catch (e) {
      // tyst fel – visa bara ingen prognos
    }
  }, [place?.lat, place?.lng, hasCoords]);

  React.useEffect(() => {
    load();
  }, [load]);

  return {
    current,
    forecast,
    loading,
    error: err,
    refresh: load,
    loadForecast,
  };
}
