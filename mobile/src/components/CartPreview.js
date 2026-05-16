import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import { useCartStore } from "../store";

/**
 * Floating cart preview bar that slides up from the bottom when items are in the cart.
 * Shows item count, total price, and bounces the badge when new items are added.
 */
export default function CartPreview({ onPress }) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(0);

  const count = getItemCount();
  const total = getTotal();

  useEffect(() => {
    if (items.length > 0) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [items.length]);

  // Bounce when count changes
  useEffect(() => {
    if (count > prevCount.current) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevCount.current = count;
  }, [count]);

  if (items.length === 0) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity
        style={styles.bar}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[styles.badge, { transform: [{ scale: bounceAnim }] }]}
        >
          <Text style={styles.badgeText}>{count}</Text>
        </Animated.View>

        <Text style={styles.label}>View Cart</Text>

        <Text style={styles.total}>${total.toFixed(2)}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textInverse}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  bar: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.lg,
  },
  badge: {
    backgroundColor: COLORS.textInverse,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
  total: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textInverse,
    marginRight: SPACING.xs,
  },
});
