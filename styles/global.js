import { StyleSheet } from "react-native";
import colors from "./colors";

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  text: {
    color: colors.textDark,
  },
});

export { colors };
