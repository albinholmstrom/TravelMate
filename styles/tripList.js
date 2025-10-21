import { StyleSheet } from "react-native";
import { colors } from "./global";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.beige },
  listContent: { padding: 16 },
  separator: { height: 8 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.lightBlue,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkBlue,
    marginBottom: 4,
  },
  dates: { color: colors.darkBlue },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.beige,
  },
  centeredText: { marginTop: 8, color: colors.darkBlue },
  emptyBox: { padding: 16 },
  emptyText: { color: colors.darkBlue },
});
