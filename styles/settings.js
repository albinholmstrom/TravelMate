import { StyleSheet } from "react-native";
import { colors } from "./global";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.darkBlue,
    marginBottom: 12,
  },
  row: { marginBottom: 12 },
  hint: { opacity: 0.8, color: colors.darkBlue, marginTop: 6, fontSize: 12 },
});
