import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../styles/global";

export default function AppButton({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: pressed ? colors.darkBluePressed : colors.darkBlue },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: colors.textOnDark,
    fontWeight: "600",
  },
});
