// /components/AppButton.jsx
import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { colors } from "../styles/global";
import { radius, spacing, shadow } from "../styles/theme";

export default function AppButton({
  title,
  onPress,
  loading = false,
  variant = "primary",
  style,
  textStyle,
  disabled,
}) {
  //Base styles for the button
  const base = {
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  };

  const variants = {
    primary: {
      backgroundColor: colors.darkBlue,
    },
    secondary: {
      backgroundColor: colors.lightBlue,
    },
    ghost: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: colors.border,
    },
  };

  //determine text color based on variant
  const colorByVariant =
    variant === "primary"
      ? "#fff"
      : variant === "secondary"
      ? colors.darkBlue
      : colors.darkBlue;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading} //button is disabled if loading or if explicitly disabled
      style={({ pressed }) => [
        base,
        variants[variant],
        pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colorByVariant} />
      ) : (
        <Text style={[{ color: colorByVariant, fontWeight: "700" }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
