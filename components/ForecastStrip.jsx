// /components/ForecastStrip.jsx
import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { useWeather } from "../hooks/useWeather";
import { iconUrl } from "../services/weather";
import { colors } from "../styles/global";

function hh(dtMs) {
  const d = new Date(dtMs);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ForecastStrip({ place }) {
  const { forecast, loadForecast } = useWeather(place);

  React.useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  if (!place?.lat || !place?.lng) return null;
  if (!forecast || forecast.length === 0) return null;

  const data = forecast.slice(0, 10);

  return (
    <View style={{ marginTop: 8 }}>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.dt)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignItems: "center",
              padding: 8,
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
              minWidth: 72,
            }}
          >
            <Text style={{ color: "#444", fontSize: 12 }}>{hh(item.dt)}</Text>
            <Image
              source={{ uri: iconUrl(item.icon) }}
              style={{ width: 36, height: 36, marginVertical: 4 }}
            />
            <Text style={{ color: colors.darkBlue, fontWeight: "600" }}>
              {item.temp}°C
            </Text>
          </View>
        )}
      />
    </View>
  );
}
