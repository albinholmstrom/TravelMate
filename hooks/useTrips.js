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

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getTrips();
    setTrips(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const create = async (data) => {
    const newTrip = await addTrip(data);
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  };

  const update = async (id, patch) => {
    const updated = await updateTrip(id, patch);
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const remove = async (id) => {
    await removeTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const addPhotos = async (id, uris) => {
    const photos = await addTripPhotos(id, uris);
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, photos } : t)));
    return photos;
  };

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
