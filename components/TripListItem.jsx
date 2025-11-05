// /components/TripListItem.jsx
import React from "react";
import { Pressable, View, Text } from "react-native";
import AppCard from "./AppCard";
import WeatherBadge from "./WeatherBadge";
import { colors, globalStyles } from "../styles/global";
import { radius, spacing } from "../styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TripListItem({ item, onPress }) {
  const location = item.place?.name ?? "Unknown location";

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={{ borderRadius: radius.lg }}
      accessibilityRole="button"
      accessibilityLabel={`Open trip to ${location}`}
    >
      {({ pressed }) => (
        <AppCard
          style={{
            marginBottom: spacing.md,
            transform: [{ scale: pressed ? 0.995 : 1 }],
          }}
        >
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            {/* Left column */}
            <View style={{ flex: 1 }}>
              <Text
                style={[globalStyles.h2, { marginBottom: 2 }]}
                numberOfLines={1}
              >
                {item.title || "Untitled trip"}
              </Text>

              {/* Date row */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={16}
                  color={colors.muted}
                />
                <Text style={{ color: colors.muted }} numberOfLines={1}>
                  {item.dates?.start && item.dates?.end
                    ? `${new Date(
                        item.dates.start
                      ).toLocaleDateString()} – ${new Date(
                        item.dates.end
                      ).toLocaleDateString()}`
                    : "No dates set"}
                </Text>
              </View>

              {/* Location row */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={16}
                  color={colors.darkBlue}
                />
                <Text style={{ color: colors.darkBlue }} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </View>

            {/* Right column – weather */}
            <View style={{ justifyContent: "flex-start" }}>
              <WeatherBadge place={item.place} />
            </View>
          </View>
        </AppCard>
      )}
    </Pressable>
  );
}
