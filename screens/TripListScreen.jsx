// /screens/TripListScreen.jsx
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrips } from "../hooks/useTrips";
import SafeScreen from "../components/SafeScreen";
import TripListItem from "../components/TripListItem";
import { colors, globalStyles } from "../styles/global";
import { radius, spacing } from "../styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Chip({ label, active, onPress }) {
  return (
    <Text
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? "transparent" : colors.border,
        backgroundColor: active ? colors.lightBlue : "#FFF",
        color: active ? colors.darkBlue : colors.text,
        marginRight: spacing.sm,
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {label}
    </Text>
  );
}

export default function TripListScreen({ navigation }) {
  const { trips } = useTrips();
  const insets = useSafeAreaInsets();

  // Minimal top padding — avoid the content appearing "too low"
  const topPad = Math.max(4, insets.top ? 6 : 0);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("upcoming"); // upcoming | past | all
  const now = new Date();

  const filtered = useMemo(() => {
    const base = (trips ?? []).filter((t) => {
      if (!query) return true;
      const hay = `${t.title ?? ""} ${t.place?.name ?? ""}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });
    if (filter === "all") return base;
    return base.filter((t) => {
      const end = t.dates?.end ? new Date(t.dates.end) : null;
      if (!end) return filter === "upcoming";
      return filter === "upcoming" ? end >= now : end < now;
    });
  }, [trips, query, filter]);

  const renderItem = ({ item }) => (
    <TripListItem
      item={item}
      onPress={() => navigation.navigate("TripDetails", { tripId: item.id })}
    />
  );

  // Header (title + search + filters) that can stick to the top
  const Header = (
    <View style={{ backgroundColor: colors.bg }}>
      <Text style={{ color: colors.muted, marginBottom: spacing.sm }}>
        {filtered.length} {filtered.length === 1 ? "trip" : "trips"}
      </Text>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: "#FFF",
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.xs, // smaller gap
        }}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.muted}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search trips or places"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, color: colors.text, paddingVertical: 6 }}
          returnKeyType="search"
          accessibilityLabel="Search"
        />
      </View>

      {/* Filter chips */}
      <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
        <Chip
          label="Upcoming"
          active={filter === "upcoming"}
          onPress={() => setFilter("upcoming")}
        />
        <Chip
          label="Past"
          active={filter === "past"}
          onPress={() => setFilter("past")}
        />
        <Chip
          label="All"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        // All padding in contentContainer — small topPadding so it sits close to the header
        contentContainerStyle={{
          paddingTop: topPad,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
        ListHeaderComponent={Header}
        ListHeaderComponentStyle={{ paddingTop: 0 }}
        // Keep search + filters sticky below the app header (optional, feels tighter)
        stickyHeaderIndices={[0]}
        // Remove extra separator height
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.xl * 2,
            }}
          >
            <MaterialCommunityIcons
              name="airplane-takeoff"
              size={48}
              color={colors.muted}
            />
            <Text style={[globalStyles.h2, { marginTop: spacing.sm }]}>
              No trips yet
            </Text>
            <Text
              style={{ color: colors.muted, marginTop: 4, textAlign: "center" }}
            >
              Tap “Add” in the menu to create your first trip.
            </Text>
          </View>
        }
      />
    </SafeScreen>
  );
}
