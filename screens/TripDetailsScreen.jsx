// /screens/TripDetailsScreen.jsx
import { View, Text, Alert } from "react-native";
import styles from "../styles/tripDetails";
import { useTrips } from "../hooks/useTrips";
import { fmtRange } from "../utils/date";
import SafeScreen from "../components/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import AppButton from "../components/AppButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import PhotosGrid from "../components/PhotosGrid";
import { colors } from "../styles/global";
import FullScreenGallery from "../components/FullScreenGallery";

// NEW
import WeatherBadge from "../components/WeatherBadge";
import ForecastStrip from "../components/ForecastStrip";

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
          <Text style={styles.subtitle}>Trip not found.</Text>
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

  // Function to pick photos and attach them to the trip
  async function pickAndAttachPhotos() {
    try {
      // Request permission to access media library
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos."
        );
        return;
      }
      // Launch device's image picker
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.9,
        selectionLimit: 0,
      });
      if (res.canceled) return; //user backs out

      // create a local storage directory for photos if it doesn't exist
      const baseDir = FileSystem.documentDirectory + "photos/";
      await ensureDir(baseDir);

      const copiedUris = [];

      // Copy selected photos to app's local storage
      for (const a of res.assets || []) {
        //generate a unique file name and copy the file
        const name =
          a.fileName || a.uri.split("/").pop() || `img-${Date.now()}.jpg`;
        const dest =
          baseDir +
          `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`;

        //copy the file to the app's local storage
        await FileSystem.copyAsync({ from: a.uri, to: dest });
        copiedUris.push(dest);
      }

      //attach the copied photos to the trip
      if (copiedUris.length) await addPhotos(tripId, copiedUris);
    } catch (e) {
      console.warn(e);
      Alert.alert("Couldn’t add photos", String(e?.message ?? e));
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
            Location:{" "}
            {trip.place.name ??
              `${trip.place.lat.toFixed(4)}, ${trip.place.lng.toFixed(4)}`}
          </Text>
        )}

        {/* Current weather */}
        <View style={{ marginTop: 12 }}>
          <WeatherBadge place={trip.place} compact={false} />
        </View>

        {/* Forecast strip */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: colors.darkBlue, fontWeight: "700" }}>
            Forecast (next hours)
          </Text>
          <ForecastStrip place={trip.place} />
        </View>

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
              Photos
            </Text>
            <PhotosGrid photos={trip.photos} onPressPhoto={onPressPhoto} />
          </>
        )}

        <View style={{ marginTop: 12 }}>
          <AppButton title="Add photos" onPress={pickAndAttachPhotos} />
        </View>

        <View style={{ marginTop: 16 }}>
          <AppButton
            title="Edit"
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
