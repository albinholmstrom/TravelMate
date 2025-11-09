// /storage/trips.js
// handles storage of trips using AsyncStorage.
//handles import, export, and photo management.

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const KEY = "TRAVELMATE_TRIPS_V1";

//helper functions
//normalizes date objects to alywayys ahve the same structure. Ensures both start and end are strings or null.
function normalizeDates(d) {
  if (!d || typeof d !== "object") return { start: null, end: null };
  return {
    start: d.start ? String(d.start) : null,
    end: d.end ? String(d.end) : null,
  };
}

//normalizes the place object to enure valid coordinates and name. supports different property names like (lat/lng, lon, longitude)
function normalizePlace(p) {
  if (!p || typeof p !== "object") return null;
  const lat = Number(p.lat);
  const lng = Number(p.lng ?? p.lon ?? p.longitude); // stöd olika key-namn
  const name = p.name ? String(p.name) : null;
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng, name };
  return null;
}

//Get & Save

//retrieve all trips from storage
export async function getTrips() {
  const json = await AsyncStorage.getItem(KEY);
  const arr = json ? JSON.parse(json) : [];
  return arr.map((t) => {
    if (t && typeof t === "object" && typeof t.dates === "string") {
      const legacy = t.dates;
      return {
        ...t,
        notes: t.notes
          ? `${t.notes}\n(OBS: äldre textdatum: ${legacy})`
          : `(OBS: äldre textdatum: ${legacy})`,
        dates: { start: null, end: null },
        place: normalizePlace(t.place),
      };
    }
    return {
      ...t,
      dates: normalizeDates(t.dates),
      place: normalizePlace(t.place),
    };
  });
}

//save all trips to storage
async function saveTrips(trips) {
  await AsyncStorage.setItem(KEY, JSON.stringify(trips));
}

//CRUD Operations

//adds a new trip with normalized data and a unique id
export async function addTrip({
  title = "",
  dates = {},
  notes = "",
  place = null,
}) {
  const trips = await getTrips();
  const newTrip = {
    id: Date.now().toString(),
    title: title.trim() || "Untitled trip",
    dates: normalizeDates(dates),
    notes: String(notes ?? "").trim(),
    photos: [],
    place: normalizePlace(place), // <— NYTT
  };
  const next = [newTrip, ...trips];
  await saveTrips(next);
  return newTrip;
}

//updates and existing trip based on its ID and a patch object with new data
export async function updateTrip(id, patch) {
  const trips = await getTrips();
  const next = trips.map((t) => {
    if (t.id !== id) return t;
    const merged = { ...t, ...patch };
    if (patch && "dates" in patch) merged.dates = normalizeDates(patch.dates);
    if (patch && "place" in patch) merged.place = normalizePlace(patch.place);
    if (!merged.dates) merged.dates = { start: null, end: null };
    return merged;
  });
  await saveTrips(next);
  return next.find((t) => t.id === id);
}

//removes a trip by its ID
export async function removeTrip(id) {
  const trips = await getTrips();
  const next = trips.filter((t) => t.id !== id);
  await saveTrips(next);
}

//clears all trips from storage
export async function clearTrips() {
  await AsyncStorage.removeItem(KEY);
}

//Export & Import

//exports all trips to a JSON file and shares it using the device's sharing options
export async function exportTripsToJsonFile() {
  const trips = await getTrips();
  const json = JSON.stringify(trips, null, 2);

  const fileUri =
    FileSystem.cacheDirectory + `travelmate-trips-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(fileUri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
  return fileUri;
}

//imports trips from a selected JSON file, merging them with existing trips while avoiding duplicates
export async function importTripsFromJsonFile() {
  const res = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (res.canceled) return { imported: 0 };

  const file = res.assets?.[0];
  if (!file?.uri) return { imported: 0 };

  const content = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  let parsed = [];
  try {
    parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
  } catch {
    throw new Error("Ogiltig JSON-fil (förväntade en array av resor).");
  }

  const current = await getTrips();
  const existingIds = new Set(current.map((t) => t.id));

  const sanitized = parsed
    .filter((t) => t && typeof t === "object")
    .map((t) => {
      const id = String(t.id ?? Date.now() + Math.random());
      const title = String(t.title ?? "Untitled trip");
      const notes = String(t.notes ?? "");

      let dates = null;
      let finalNotes = notes;
      if (typeof t.dates === "string") {
        finalNotes = finalNotes
          ? `${finalNotes}\n(OBS: äldre textdatum: ${t.dates})`
          : `(OBS: äldre textdatum: ${t.dates})`;
        dates = { start: null, end: null };
      } else {
        dates = normalizeDates(t.dates);
      }

      return { id, title, dates, notes: finalNotes };
    })
    .filter((t) => !existingIds.has(t.id));

  const next = [...sanitized, ...current];
  await saveTrips(next);
  return { imported: sanitized.length };
}

//Photo Management

//adds new photos to a trip. each photo is represented by its URI.
export async function addTripPhotos(tripId, photoUris = []) {
  if (!Array.isArray(photoUris) || photoUris.length === 0) return [];
  const trips = await getTrips();
  const next = trips.map((t) => {
    if (t.id !== tripId) return t;
    const existing = Array.isArray(t.photos) ? t.photos : [];
    const stamp = new Date().toISOString();
    const additions = photoUris.map((uri) => ({ uri, addedAt: stamp }));
    return { ...t, photos: [...additions, ...existing] };
  });
  await saveTrips(next);
  const updated = next.find((t) => t.id === tripId);
  return updated?.photos ?? [];
}

//removes photo from the trip by its URI
export async function removeTripPhoto(tripId, uri) {
  const trips = await getTrips();
  const next = trips.map((t) => {
    if (t.id !== tripId) return t;
    const filtered = (t.photos || []).filter((p) => p.uri !== uri);
    return { ...t, photos: filtered };
  });
  await saveTrips(next);
}
