import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TextInput,
  Alert,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SafeScreen from "../components/SafeScreen";
import * as Location from "expo-location";
import AppButton from "../components/AppButton";
import styles from "../styles/addTrip";
import { colors } from "../styles/global";
import { useTrips } from "../hooks/useTrips";
import { fmt } from "../utils/date";
import { useNavigation } from "@react-navigation/native";
import PlaceSelector from "../components/PlaceSelector";

export default function EditTripScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();
  const { trips, update } = useTrips();
  const trip = trips.find((t) => t.id === tripId) || null;

  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);
  const [place, setPlace] = React.useState(null);
  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);

  React.useEffect(() => {
    if (trip) {
      setTitle(trip.title || "");
      setNotes(trip.notes || "");
      setStart(trip.dates?.start ?? null);
      setEnd(trip.dates?.end ?? null);
      setPlace(trip.place ?? null);
    }
  }, [trip?.id]);

  const onPickStart = (_, date) => {
    setShowStart(false);
    if (date) {
      const iso = date.toISOString();
      setStart(iso);
      if (end && new Date(end) < date) setEnd(null);
    }
  };

  const onPickEnd = (_, date) => {
    setShowEnd(false);
    if (date) setEnd(date.toISOString());
  };

  async function useMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Behörighet saknas", "Ge appen tillgång till plats.");
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    let name = null;
    try {
      const rev = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const r = rev[0];
      if (r)
        name = [r.city || r.subregion, r.country].filter(Boolean).join(", ");
    } catch {}
    setPlace({ lat: pos.coords.latitude, lng: pos.coords.longitude, name });
  }

  function openMapPicker() {
    navigation.navigate("MapPicker", {
      tripId,
      initial: place ?? trip.place ?? null,
    });
  }

  const onSave = async () => {
    if (!title.trim()) return Alert.alert("Titel saknas", "Skriv en titel.");
    if (start && end && new Date(end) < new Date(start)) {
      return Alert.alert(
        "Ogiltiga datum",
        "Slutdatum kan inte vara före startdatum."
      );
    }
    await update(tripId, {
      title: title.trim(),
      notes: notes.trim(),
      dates: { start, end },
      place,
    });
    navigation.goBack();
  };

  if (!trip) {
    return (
      <SafeScreen>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: colors.darkBlue }}>
            Laddar resa…
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            placeholder="Titel"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
            returnKeyType="next"
          />

          <Pressable
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowStart(true)}
          >
            <Text style={{ color: start ? colors.darkBlue : "#888" }}>
              {start ? `Start: ${fmt(start)}` : "Välj startdatum"}
            </Text>
          </Pressable>
          {showStart && (
            <DateTimePicker
              value={start ? new Date(start) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onPickStart}
            />
          )}

          <Pressable
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowEnd(true)}
          >
            <Text style={{ color: end ? colors.darkBlue : "#888" }}>
              {end ? `Slut: ${fmt(end)}` : "Välj slutdatum (valfritt)"}
            </Text>
          </Pressable>
          {showEnd && (
            <DateTimePicker
              value={end ? new Date(end) : start ? new Date(start) : new Date()}
              minimumDate={start ? new Date(start) : undefined}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onPickEnd}
            />
          )}

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Anteckningar"
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholderTextColor="#888"
          />

          <PlaceSelector
            place={place ?? trip.place ?? null}
            onUseMyLocation={useMyLocation}
            onPickOnMap={openMapPicker}
            onClear={() => setPlace(null)}
          />

          <View style={{ marginTop: 8 }}>
            <AppButton title="Spara ändringar" onPress={onSave} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
