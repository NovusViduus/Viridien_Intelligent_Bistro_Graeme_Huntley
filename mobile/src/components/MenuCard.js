import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import { getMenuImage } from "../constants/images";
import { useCartStore } from "../store";

/**
 * Menu item card displaying the item's image, name, description, price, dietary tags,
 * and an add-to-cart button with a bounce animation.
 */
export default function MenuCard({ item, onPress }) {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const addItem = useCartStore((s) => s.addItem);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /**
   * Adds the item to the cart with a bounce animation on the card.
   */
  const handleAddToCart = () => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      customizations: [],
    });
  };

  const imageSource = getMenuImage(item.id, item.soupVariant);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(item)}
        style={styles.cardInner}
      >
        {/* Food image */}
        <View style={styles.imageWrapper}>
          <View style={[styles.imageContainer, { backgroundColor: colors.surfaceAlt }]}>
            {imageSource ? (
              <Image source={imageSource} style={styles.foodImage} />
            ) : (
              <Text style={styles.emoji}>🍽️</Text>
            )}
          </View>
          {item.tags.includes("popular") && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
          {item.tags.includes("signature") && (
            <View style={[styles.popularBadge, styles.signatureBadge]}>
              <Text style={styles.popularText}>Signature</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>

            {/* Tags */}
            <View style={styles.tags}>
              {item.tags.includes("spicy") && (
                <Text style={styles.tagEmoji}>🌶️</Text>
              )}
              {item.tags.includes("vegetarian") && (
                <Text style={styles.tagEmoji}>🌱</Text>
              )}
              {item.tags.includes("gluten-free") && (
                <Text style={styles.tagEmoji}>🌾</Text>
              )}
            </View>
          </View>
        </View>

        {/* Add button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={22} color={colors.textInverse} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  imageWrapper: {
    position: "relative",
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  foodImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    resizeMode: "cover",
  },
  emoji: {
    fontSize: 36,
  },
  popularBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    zIndex: 1,
  },
  signatureBadge: {
    backgroundColor: COLORS.accent,
  },
  popularText: {
    color: COLORS.textInverse,
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.xs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  tags: {
    flexDirection: "row",
    gap: 2,
  },
  tagEmoji: {
    fontSize: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
});
