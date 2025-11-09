//AddTripScreen.jsx
//a screen  that lets the user create a new trip by entering title, notes, picking start & end dates, and selecting a place via current location or map.
//performs basic validation and persists the trip using the useTrips hook.

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
import { useRoute } from "@react-navigation/native";
import PlaceSelector from "../components/PlaceSelector";
import AppInput from "../components/AppInput";

export default function AddTripScreen({ navigation }) {
  const route = useRoute();
  const { create } = useTrips();
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);
  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);
  const [place, setPlace] = React.useState(null);

  // Capture place selected on MapPicker and clear the param afterwards.
  React.useEffect(() => {
    if (route.params?.pickedPlace) {
      setPlace(route.params.pickedPlace);
      navigation.setParams?.({ pickedPlace: undefined });
    }
  }, [route.params?.pickedPlace]);

  //reset form fields to initial state
  function resetForm() {
    setTitle("");
    setNotes("");
    setStart(null);
    setEnd(null);
    setPlace(null);
  }

  //handle start date selection
  const onPickStart = (_, date) => {
    setShowStart(false);
    if (date) {
      const iso = date.toISOString();
      setStart(iso);
      //if end is before the chosen start, clear it to avoid invalid range
      if (end && new Date(end) < date) setEnd(null);
    }
  };

  //handle end date selection
  const onPickEnd = (_, date) => {
    setShowEnd(false);
    if (date) setEnd(date.toISOString());
  };

  //ask for permission, get current GPS position, reverse-geocode a human readable name, and set as place
  async function useMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow location access.");
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

  //navigate to MapPicker screen to select a place
  function openMapPicker() {
    navigation.navigate("MapPicker", {
      initial: place ?? null,
      forScreen: "AddTrip",
    });
  }

  //validate and persist the new trip
  const onSave = async () => {
    if (!title.trim()) {
      return Alert.alert("Missing title", "Please enter a trip title.");
    }
    if (start && end && new Date(end) < new Date(start)) {
      return Alert.alert(
        "Invalid dates",
        "End date can’t be before the start date."
      );
    }
    await create({ title, notes, dates: { start, end }, place });
    resetForm();
    navigation.navigate("Trips");
  };

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
          <AppInput
            placeholder="Title (e.g., London weekend)"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          <Pressable
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowStart(true)}
          >
            <Text style={{ color: start ? colors.darkBlue : "#888" }}>
              {start ? `Start: ${fmt(start)}` : "Select start date"}
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
              {end ? `End: ${fmt(end)}` : "Select end date (optional)"}
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

          <AppInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <PlaceSelector
            place={place}
            onUseMyLocation={useMyLocation}
            onPickOnMap={openMapPicker}
            onClear={() => setPlace(null)}
          />

          <View style={{ marginTop: 8 }}>
            <AppButton title="Save trip" onPress={onSave} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
