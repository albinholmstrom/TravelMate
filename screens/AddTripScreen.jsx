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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "../components/AppButton";
import { useTrips } from "../hooks/useTrips";
import styles from "../styles/addTrip";
import SafeScreen from "../components/SafeScreen";
import { fmt } from "../utils/date";
import { colors } from "../styles/global";
import * as Location from "expo-location";

export default function AddTripScreen({ navigation }) {
  const { create } = useTrips();
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [start, setStart] = React.useState(null); // ISO-string eller null
  const [end, setEnd] = React.useState(null);
  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);
  const [place, setPlace] = React.useState(null);

  function resetForm() {
    setTitle("");
    setNotes("");
    setStart(null);
    setEnd(null);
    setPlace(null);
  }

  const onPickStart = (_, date) => {
    setShowStart(false);
    if (date) {
      const iso = date.toISOString();
      setStart(iso);
      // Om end finns och end < start → nolla end
      if (end && new Date(end) < date) setEnd(null);
    }
  };
  const onPickEnd = (_, date) => {
    setShowEnd(false);
    if (date) setEnd(date.toISOString());
  };

  const onSave = async () => {
    if (!title.trim()) return Alert.alert("Titel saknas", "Skriv en titel.");
    if (start && end && new Date(end) < new Date(start)) {
      return Alert.alert(
        "Ogiltiga datum",
        "Slutdatum kan inte vara före startdatum."
      );
    }
    await create({ title, notes, dates: { start, end }, place });
    resetForm();
    navigation.navigate("Trips");
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
            placeholder="Titel (t.ex. London weekend)"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
            returnKeyType="next"
          />

          {/* Startdatum */}
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

          {/* Slutdatum */}
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

          <View style={{ gap: 8 }}>
            <AppButton title="Min position" onPress={useMyLocation} />
            {place && (
              <Text style={{ color: colors.darkBlue }}>
                Vald plats:{" "}
                {place.name ??
                  `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 8 }}>
            <AppButton title="Spara resa" onPress={onSave} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
