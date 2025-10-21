import { StyleSheet } from "react-native";
import { colors } from "./global";

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.beige },
  title: { fontSize: 20, fontWeight: "700", color: colors.darkBlue },
  subtitle: {
    fontSize: 14,
    color: colors.darkBlue,
    opacity: 0.7,
    marginTop: 4,
  },
});
