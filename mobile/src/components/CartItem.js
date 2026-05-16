import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import { getMenuImage } from "../constants/images";
import { useCartStore } from "../store";

/**
 * Cart line item component showing the item image, name, customizations, price,
 * and quantity increment/decrement controls.
 */
export default function CartItem({ item }) {
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const removeByCartId = useCartStore((s) => s.removeByCartId);
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const imageSource = getMenuImage(item.id);

  const customPrice = (item.customizations || []).reduce(
    (s, c) => s + (c.price || 0),
    0
  );
  const lineTotal = (item.price + customPrice) * item.quantity;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <View style={[styles.imageBox, { backgroundColor: colors.surfaceAlt }]}>
          {imageSource ? (
            <Image source={imageSource} style={styles.image} />
          ) : (
            <Text style={styles.emoji}>🍽️</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          {item.customizations?.length > 0 && (
            <Text style={[styles.customs, { color: colors.textSecondary }]}>
              {item.customizations.map((c) => c.name).join(", ")}
            </Text>
          )}
          <Text style={[styles.price, { color: colors.primary }]}>${lineTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={() =>
              item.quantity <= 1
                ? removeByCartId(item.cartId)
                : updateItemQuantity(item.cartId, item.quantity - 1)
            }
          >
            <Ionicons
              name={item.quantity <= 1 ? "trash-outline" : "remove"}
              size={16}
              color={item.quantity <= 1 ? colors.error : colors.text}
            />
          </TouchableOpacity>

          <Text style={[styles.qty, { color: colors.text }]}>{item.quantity}</Text>

          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={() =>
              updateItemQuantity(item.cartId, item.quantity + 1)
            }
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  imageBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    resizeMode: "cover",
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  customs: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    minWidth: 20,
    textAlign: "center",
  },
});
