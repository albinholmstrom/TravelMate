// /hooks/useWeather.js
//a custom hook that fetches current weather and forecast data for a given place.
//handles loading, error state and exposes function for refreshing and loading forecasts

import * as React from "react";
import { fetchCurrentWeather, fetchForecast } from "../services/weather";

export function useWeather(place) {
  const [current, setCurrent] = React.useState(null);
  const [forecast, setForecast] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  //determine if a location with valid coordinates is provided
  const hasCoords = !!(place?.lat && place?.lng);

  //fetch current weather data
  const load = React.useCallback(async () => {
    if (!hasCoords) return;
    setLoading(true);
    setErr(null);

    try {
      //fetch current weather only (forecast is loaded separately)
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

  //fetch forecast (does not manage loading or error UI.)
  const loadForecast = React.useCallback(async () => {
    if (!hasCoords) return;
    try {
      const items = await fetchForecast(place.lat, place.lng);
      setForecast(items);
    } catch (e) {}
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
