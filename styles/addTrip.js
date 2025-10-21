import { StyleSheet } from "react-native";
import { colors } from "./global";

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.beige, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    color: colors.darkBlue,
  },
});
