// /components/SafeScreen.jsx
//a wrapper component that applies safe area padding and consistent screen styling.
//ensures content avoids nothces, status bars and edges.

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";

export default function SafeScreen({
  children,
  style,
  includeTopInset = false,
  edges,
}) {
  //determine which edges to apply safe area insets
  // if edges prop is provided, use it; otherwise, include top inset based on includeTopInset flag
  const computedEdges =
    edges ??
    (includeTopInset
      ? ["top", "left", "right", "bottom"]
      : ["left", "right", "bottom"]);

  return (
    <SafeAreaView edges={computedEdges} style={[globalStyles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}
