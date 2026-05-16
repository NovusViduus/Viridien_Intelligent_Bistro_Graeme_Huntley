import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, COLORS_DARK, SPACING } from "../constants/theme";
import { useThemeStore } from "../store/theme";

/**
 * Horizontally scrollable row of quick-reply suggestion chips for the chat interface.
 * Renders nothing if no suggestions are provided.
 */
export default function SuggestionChips({ suggestions, onPress }) {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {suggestions.map((text, index) => (
        <TouchableOpacity
          key={`${text}-${index}`}
          style={[styles.chip, { borderColor: colors.primary, backgroundColor: colors.surface }]}
          onPress={() => onPress(text)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, { color: colors.primary }]}>{text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    gap: SPACING.sm,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
