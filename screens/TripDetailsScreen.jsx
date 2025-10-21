import { View, Text, Alert } from "react-native";
import styles from "../styles/tripDetails";
import { useTrips } from "../hooks/useTrips";
import { fmtRange } from "../utils/date"; // ✅ behåll EN gång
import SafeScreen from "../components/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import AppButton from "../components/AppButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import PhotosGrid from "../components/PhotosGrid";
import { colors } from "../styles/global";
import FullScreenGallery from "../components/FullScreenGallery";

export default function TripDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { tripId } = route.params;
  const { trips, addPhotos } = useTrips();
  const trip = trips.find((t) => t.id === tripId);
  const [showGallery, setShowGallery] = React.useState(false);
  const [startIndex, setStartIndex] = React.useState(0);

  if (!trip) {
    return (
      <SafeScreen>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Resan kunde inte hittas.</Text>
        </View>
      </SafeScreen>
    );
  }

  async function ensureDir(dir) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  async function pickAndAttachPhotos() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Behörighet krävs", "Ge appen tillgång till bilder.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.9,
        selectionLimit: 0,
      });
      if (res.canceled) return;

      const baseDir = FileSystem.documentDirectory + "photos/";
      await ensureDir(baseDir);

      const copiedUris = [];
      for (const a of res.assets || []) {
        const name =
          a.fileName || a.uri.split("/").pop() || `img-${Date.now()}.jpg`;
        const dest =
          baseDir +
          `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`;
        await FileSystem.copyAsync({ from: a.uri, to: dest });
        copiedUris.push(dest);
      }
      if (copiedUris.length) await addPhotos(tripId, copiedUris);
    } catch (e) {
      console.warn(e);
      Alert.alert("Kunde inte lägga till bilder", String(e?.message ?? e));
    }
  }

  function onPressPhoto(photo) {
    const index = trip.photos.findIndex((p) => p.uri === photo.uri);
    setStartIndex(index >= 0 ? index : 0);
    setShowGallery(true);
  }

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.title}>{trip.title}</Text>

        <Text style={styles.subtitle}>
          {fmtRange(trip.dates?.start, trip.dates?.end)}
        </Text>

        {trip.place && (
          <Text style={{ marginTop: 6, color: colors.darkBlue }}>
            Plats:{" "}
            {trip.place.name ??
              `${trip.place.lat.toFixed(4)}, ${trip.place.lng.toFixed(4)}`}
          </Text>
        )}

        <Text style={{ marginTop: 12 }}>{trip.notes}</Text>

        {Array.isArray(trip.photos) && trip.photos.length > 0 && (
          <>
            <Text
              style={{
                color: colors.darkBlue,
                fontWeight: "600",
                marginTop: 20,
                marginBottom: 8,
              }}
            >
              Bilder
            </Text>
            <PhotosGrid photos={trip.photos} onPressPhoto={onPressPhoto} />
          </>
        )}

        <View style={{ marginTop: 12 }}>
          <AppButton title="Lägg till bilder" onPress={pickAndAttachPhotos} />
        </View>

        <View style={{ marginTop: 16 }}>
          <AppButton
            title="Redigera"
            onPress={() => navigation.navigate("EditTrip", { tripId })}
          />
        </View>

        {showGallery && (
          <FullScreenGallery
            photos={trip.photos}
            startIndex={startIndex}
            onClose={() => setShowGallery(false)}
          />
        )}
      </View>
    </SafeScreen>
  );
}
