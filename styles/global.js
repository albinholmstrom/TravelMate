// /styles/global.js
import { StyleSheet } from "react-native";
import { palette, radius } from "./theme";

export const colors = {
  lightBlue: palette.lightBlue,
  beige: palette.beige,
  darkBlue: palette.darkBlue,
  bg: palette.beige, // App-bakgrund
  card: palette.white, // Kortbakgrund
  text: palette.text,
  muted: palette.muted,
  border: palette.border,
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  h1: {
    color: colors.darkBlue,
    fontSize: 24,
    fontWeight: "800",
  },
  h2: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    color: colors.text,
    fontSize: 15,
  },
  caption: {
    color: colors.muted,
    fontSize: 12,
  },
  rounded: {
    borderRadius: radius.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
