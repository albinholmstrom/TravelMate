// /components/WeatherBadge.jsx
import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { colors } from "../styles/global";
import { iconUrl } from "../services/weather";

export default function WeatherBadge({ place, compact = true }) {
  const { current, loading } = useWeather(place);

  if (!place?.lat || !place?.lng) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 12 }}>—</Text>
      </View>
    );
  }

  if (loading && !current) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

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
