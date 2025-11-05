// /components/SafeScreen.jsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";

/**
 * SafeScreen is a layout wrapper that applies safe area insets where needed.
 *
 * includeTopInset = false  -> no top inset (recommended for screens with a stack header)
 * includeTopInset = true   -> adds top inset (for screens without a header, e.g. tab screens)
 *
 * You can override the behavior entirely by providing a custom `edges` array.
 * Example:
 *   <SafeScreen edges={['top', 'bottom']} />
 */
export default function SafeScreen({
  children,
  style,
  includeTopInset = false,
  edges,
}) {
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
