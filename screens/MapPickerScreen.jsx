import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SafeScreen from "../components/SafeScreen";
import AppButton from "../components/AppButton";
import { colors } from "../styles/global";
import * as Location from "expo-location";
import { useTrips } from "../hooks/useTrips";

export default function MapPickerScreen({ route, navigation }) {
  const { tripId, initial } = route.params || {};
  const { update } = useTrips();

  const [region, setRegion] = React.useState(
    initial?.lat && initial?.lng
      ? {
          latitude: initial.lat,
          longitude: initial.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : {
          latitude: 59.3293,
          longitude: 18.0686,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } // Stockholm
  );
  const [marker, setMarker] = React.useState({
    latitude: region.latitude,
    longitude: region.longitude,
  });

  React.useEffect(() => {
    // Om ingen initial plats – försök centrera på användaren (tyst)
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
  }, []);

  async function savePlace() {
    // Reverse geocode (valfritt namn)
    let name = null;
    try {
      const rev = await Location.reverseGeocodeAsync({
        latitude: marker.latitude,
        longitude: marker.longitude,
      });
      const r = rev[0];
      if (r)
        name = [r.city || r.subregion, r.country].filter(Boolean).join(", ");
    } catch {}

    // Spara direkt på resan
    await update(tripId, {
      place: { lat: marker.latitude, lng: marker.longitude, name },
    });
    navigation.goBack();
  }

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
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
          <AppButton title="Spara plats" onPress={savePlace} />
          <Text style={{ marginTop: 6, color: "#333" }}>
            Dra markören eller tryck på kartan för att välja plats.
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}
