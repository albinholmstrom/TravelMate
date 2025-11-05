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
            "Use my location",
            "Select on map",
            place ? "Clear location" : null,
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
        "Select Location",
        "",
        [
          { text: "Use my location", onPress: onUseMyLocation },
          { text: "Select on map", onPress: onPickOnMap },
          place
            ? { text: "Clear location", style: "destructive", onPress: onClear }
            : undefined,
          { text: "Cancel", style: "cancel" },
        ].filter(Boolean)
      );
    }
  }

  return (
    <View style={{ gap: 8, marginTop: 8 }}>
      <AppButton title="Select Location" onPress={openMenu} />

      {place ? (
        <Text style={{ color: colors.darkBlue }}>
          Selected:{" "}
          {place.name ?? `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}
        </Text>
      ) : (
        <Text style={{ color: "#666" }}>No location selected</Text>
      )}
    </View>
  );
}
