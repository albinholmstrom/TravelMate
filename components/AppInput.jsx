// /components/AppInput.jsx

//a reusable styled input component for the app that supports both single-line and multi-line text input.
import React from "react";
import { TextInput, View } from "react-native";
import { colors } from "../styles/global";
import { radius, spacing } from "../styles/theme";

export default function AppInput({ style, multiline, ...props }) {
  return (
    <View
      style={[
        {
          backgroundColor: "#fff",
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: multiline ? spacing.md : spacing.sm,
        },
      ]}
    >
      <TextInput
        style={[
          {
            color: colors.darkBlue,
            minHeight: multiline ? 100 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          },
          style,
        ]}
        placeholderTextColor="#8A93A6"
        multiline={multiline}
        {...props}
      />
    </View>
  );
}
