import React from "react";
import { View, Text, Alert } from "react-native";
import styles from "../styles/settings";
import AppButton from "../components/AppButton";
import SafeScreen from "../components/SafeScreen";
import {
  clearTrips,
  exportTripsToJsonFile,
  importTripsFromJsonFile,
} from "../storage/trips";

export default function SettingsScreen() {
  const onExport = async () => {
    try {
      await exportTripsToJsonFile();
      // Share sheet opens automatically – nothing more needed
    } catch (e) {
      Alert.alert("Export failed", String(e?.message ?? e));
    }
  };

  const onImport = async () => {
    try {
      const { imported } = await importTripsFromJsonFile();
      Alert.alert("Import complete", `Imported ${imported} trips.`);
    } catch (e) {
      Alert.alert("Import failed", String(e?.message ?? e));
    }
  };

  const onClear = () => {
    Alert.alert("Delete all trips?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await clearTrips();
          Alert.alert("Done", "All trips have been deleted.");
        },
      },
    ]);
  };

  return (
    <SafeScreen includeTopInset>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <View style={styles.row}>
            <AppButton title="Export trips (JSON)" onPress={onExport} />
            <Text style={styles.hint}>
              Export a backup as a JSON file via Files, email, AirDrop, etc.
            </Text>
          </View>

          <View style={styles.row}>
            <AppButton title="Import trips (JSON)" onPress={onImport} />
            <Text style={styles.hint}>
              Import from a previously exported JSON file.
            </Text>
          </View>

          <View style={styles.row}>
            <AppButton title="Delete all trips" onPress={onClear} />
            <Text style={styles.hint}>
              Removes all locally stored trips (requires confirmation).
            </Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
