//useTrips.js
//a custom hook that mangaes CRUD operations for trip data. inluding auto-refreshing when scrreens regains focus. provides helpers for creating, updating, deleting and modifying trip photos.

import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  getTrips,
  addTrip,
  updateTrip,
  removeTrip,
  addTripPhotos,
  removeTripPhoto,
} from "../storage/trips";

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  //fetch trips from storage and update local state
  const load = useCallback(async () => {
    setLoading(true);
    const data = await getTrips();
    setTrips(data);
    setLoading(false);
  }, []);

  //reload trips whenever the screen is using this hook gains focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  //create a new trip and add it to local state
  const create = async (data) => {
    const newTrip = await addTrip(data);
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  };

  //update an existing trip and refresh local state
  const update = async (id, patch) => {
    const updated = await updateTrip(id, patch);
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  //remove a trip from storage and local state
  const remove = async (id) => {
    await removeTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  //add photos to a trip and update state with returned photo list
  const addPhotos = async (id, uris) => {
    const photos = await addTripPhotos(id, uris);
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, photos } : t)));
    return photos;
  };

  //remove a photo and update the trip's photo list in state
  const removePhoto = async (id, uri) => {
    await removeTripPhoto(id, uri);
    setTrips((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, photos: (t.photos || []).filter((p) => p.uri !== uri) }
          : t
      )
    );
  };

  return {
    trips,
    loading,
    reload: load,
    create,
    update,
    remove,
    addPhotos,
    removePhoto,
  };
}
