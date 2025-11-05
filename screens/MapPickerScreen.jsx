import React from "react";
import { View, Text, TextInput, Alert, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SafeScreen from "../components/SafeScreen";
import AppButton from "../components/AppButton";
import { colors } from "../styles/global";
import * as Location from "expo-location";
import { useTrips } from "../hooks/useTrips";

export default function MapPickerScreen({ route, navigation }) {
  const { tripId, initial } = route.params || {};
  const { update } = useTrips();

  // --- Map / marker ---
  const [region, setRegion] = React.useState(
    initial?.lat && initial?.lng
      ? {
          latitude: initial.lat,
          longitude: initial.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : {
          latitude: 59.3293, // Stockholm default
          longitude: 18.0686,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }
  );

  const [marker, setMarker] = React.useState({
    latitude: initial?.lat ?? region.latitude,
    longitude: initial?.lng ?? region.longitude,
  });

  // --- Search field ---
  const [query, setQuery] = React.useState("");

  // Silently center on user if no initial location is provided
  React.useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted" && !initial) {
          const pos = await Location.getCurrentPositionAsync({});
          const r = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setRegion(r);
          setMarker({ latitude: r.latitude, longitude: r.longitude });
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSearch() {
    const q = query.trim();
    if (!q) return;
    try {
      Keyboard.dismiss();
      // Geocode text → coordinates (take the first result)
      const results = await Location.geocodeAsync(q);
      if (!results || results.length === 0) {
        Alert.alert("No results", "Couldn’t find a location for that search.");
        return;
      }
      const best = results[0];
      const r = {
        latitude: best.latitude,
        longitude: best.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(r);
      setMarker({ latitude: r.latitude, longitude: r.longitude });
    } catch (e) {
      Alert.alert("Search error", String(e?.message ?? e));
    }
  }

  //asynchronous function to save the selected place
  async function savePlace() {
    //a varaiable to hold the name of the place
    let name = null;
    //try to reverse geocode the selected coordinates to get a human-readable name (city, country)
    try {
      const rev = await Location.reverseGeocodeAsync({
        latitude: marker.latitude,
        longitude: marker.longitude,
      });
      //get the first result from the reverse geocoding
      const r = rev[0];
      //if a result is found, construct the name from city/subregion and country
      if (r)
        name = [r.city || r.subregion, r.country].filter(Boolean).join(", ");
    } catch {}

    //create a place object with the selected coordinates and the obtained name
    const picked = { lat: marker.latitude, lng: marker.longitude, name };

    //if a tripId is provided, update the trip's place and go back
    if (tripId) {
      await update(tripId, { place: picked });
      navigation.goBack();
    } else {
      const target = route.params?.forScreen || "AddTrip";
      navigation.navigate(target, { pickedPlace: picked });
    }
  }

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
        {/* Search field on top of the map */}
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            zIndex: 10,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search location (e.g., New York)"
            returnKeyType="search"
            onSubmitEditing={onSearch}
            style={{
              flex: 1,
              paddingVertical: 6,
              color: "#222",
            }}
            placeholderTextColor="#888"
          />
          <AppButton title="Search" onPress={onSearch} />
        </View>

        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarker({ latitude, longitude });
          }}
        >
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
          />
        </MapView>

        <View style={{ padding: 12, backgroundColor: colors.beige }}>
          <AppButton title="Save location" onPress={savePlace} />
          <Text style={{ marginTop: 6, color: "#333" }}>
            Search for a place or drag the pin / tap the map to select.
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}
