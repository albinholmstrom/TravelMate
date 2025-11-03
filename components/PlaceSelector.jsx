import React from "react";
import { View, Text, Platform, ActionSheetIOS, Alert } from "react-native";
import AppButton from "./AppButton";
import { colors } from "../styles/global";

export default function PlaceSelector({
  place,
  onUseMyLocation,
  onPickOnMap,
  onClear,
}) {
  function openMenu() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "My position",
            "Place on map",
            place ? "Clear space" : null,
          ].filter(Boolean),
          cancelButtonIndex: 0,
          userInterfaceStyle: "light",
        },
        (index) => {
          if (index === 1) onUseMyLocation?.();
          else if (index === 2) onPickOnMap?.();
          else if (index === 3 && place) onClear?.();
        }
      );
    } else {
      Alert.alert(
        "Välj plats",
        "",
        [
          { text: "My position", onPress: onUseMyLocation },
          { text: "Place on map", onPress: onPickOnMap },
          place
            ? { text: "Clear space", style: "destructive", onPress: onClear }
            : undefined,
          { text: "Cancel", style: "cancel" },
        ].filter(Boolean)
      );
    }
  }

  return (
    <View style={{ gap: 8, marginTop: 8 }}>
      <AppButton title="Välj plats" onPress={openMenu} />
      {place ? (
        <Text style={{ color: colors.darkBlue }}>
          Vald plats:{" "}
          {place.name ?? `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}
        </Text>
      ) : (
        <Text style={{ color: "#666" }}>Ingen plats vald</Text>
      )}
    </View>
  );
}
