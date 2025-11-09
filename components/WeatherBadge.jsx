// /components/WeatherBadge.jsx
//a small UI component that displays the current weather for a given place.
//uses the weather hook to fetch current conditions and shows an icon and temperature.

import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { colors } from "../styles/global";
import { iconUrl } from "../services/weather";

export default function WeatherBadge({ place, compact = true }) {
  const { current, loading } = useWeather(place);

  //if no valid place provided, show placeholder
  if (!place?.lat || !place?.lng) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 12 }}>—</Text>
      </View>
    );
  }

  //show a loading indicator while fetching weather
  if (loading && !current) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  //if no current weather data, don't render anything
  if (!current) return null;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Image
        source={{ uri: iconUrl(current.icon) }}
        style={{ width: compact ? 28 : 40, height: compact ? 28 : 40 }}
      />
      <Text style={{ color: colors.darkBlue, fontWeight: "600" }}>
        {current.temp}°C
      </Text>
    </View>
  );
}
