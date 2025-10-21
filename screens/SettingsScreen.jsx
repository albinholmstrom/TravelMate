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
      // Delningsarket öppnas – inget mer behövs
    } catch (e) {
      Alert.alert("Export misslyckades", String(e?.message ?? e));
    }
  };

  const onImport = async () => {
    try {
      const { imported } = await importTripsFromJsonFile();
      Alert.alert("Import klar", `Importerade ${imported} resor.`);
    } catch (e) {
      Alert.alert("Import misslyckades", String(e?.message ?? e));
    }
  };

  const onClear = () => {
    Alert.alert("Töm alla resor?", "Detta går inte att ångra.", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Töm",
        style: "destructive",
        onPress: async () => {
          await clearTrips();
          Alert.alert("Klart", "Alla resor är borttagna.");
        },
      },
    ]);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datahantering</Text>

          <View style={styles.row}>
            <AppButton title="Exportera resor (JSON)" onPress={onExport} />
            <Text style={styles.hint}>
              Dela/backup via filer, mail, AirDrop m.m.
            </Text>
          </View>

          <View style={styles.row}>
            <AppButton title="Importera resor (JSON)" onPress={onImport} />
            <Text style={styles.hint}>
              Välj en tidigare exporterad JSON-fil.
            </Text>
          </View>

          <View style={styles.row}>
            <AppButton title="Töm alla resor" onPress={onClear} />
            <Text style={styles.hint}>
              Raderar allt lokalt sparat (kräver bekräftelse).
            </Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
