// /components/AppCard.jsx
import React from "react";
import { View } from "react-native";
import { colors, globalStyles } from "../styles/global";
import { radius, spacing, shadow } from "../styles/theme";

export default function AppCard({ style, children }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
