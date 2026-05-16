import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import { getMenuImage } from "../constants/images";
import { useCartStore } from "../store";

/**
 * Full-screen modal for viewing item details and selecting customizations before adding to cart.
 * @param {Object} props
 * @param {Object|null} props.item - The menu item to display, or null to hide the modal.
 * @param {Function} props.onClose - Callback to close the modal.
 */
export default function ItemDetailModal({ item, onClose }) {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const addItem = useCartStore((s) => s.addItem);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const imageSource = getMenuImage(item.id, item.soupVariant);

  const toggleCustomization = (customization) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.find((c) => c.id === customization.id);
      if (exists) {
        return prev.filter((c) => c.id !== customization.id);
      }
      return [...prev, customization];
    });
  };

  const getCustomizationTotal = () => {
    return selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  };

  const getItemTotal = () => {
    return (item.price + getCustomizationTotal()) * quantity;
  };

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      customizations: selectedCustomizations,
    });
    // Reset and close
    setSelectedCustomizations([]);
    setQuantity(1);
    onClose();
  };

  return (
    <Modal
      visible={!!item}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header image */}
        <View style={styles.imageSection}>
          {imageSource ? (
            <Image source={imageSource} style={styles.image} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={styles.placeholderEmoji}>🍽️</Text>
            </View>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item info */}
          <View style={styles.infoSection}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tags}>
                {item.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                      {tag === "spicy" && "🌶️ "}
                      {tag === "vegetarian" && "🌱 "}
                      {tag === "gluten-free" && "🌾 "}
                      {tag === "popular" && "⭐ "}
                      {tag === "signature" && "✨ "}
                      {tag.charAt(0).toUpperCase() + tag.slice(1).replace("-", " ")}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Customizations */}
          {item.customizations && item.customizations.length > 0 && (
            <View style={styles.customSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Customize Your Order
              </Text>
              {item.customizations.map((custom) => {
                const isSelected = selectedCustomizations.find((c) => c.id === custom.id);
                return (
                  <Pressable
                    key={custom.id}
                    style={[
                      styles.customOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { borderColor: colors.primary, backgroundColor: isDark ? "rgba(232,113,79,0.1)" : "rgba(212,69,26,0.05)" },
                    ]}
                    onPress={() => toggleCustomization(custom)}
                  >
                    <View style={styles.customLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          { borderColor: colors.border },
                          isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                        ]}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        )}
                      </View>
                      <Text style={[styles.customName, { color: colors.text }]}>
                        {custom.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.customPrice,
                        { color: custom.price > 0 ? colors.primary : colors.textLight },
                      ]}
                    >
                      {custom.price > 0 ? `+$${custom.price.toFixed(2)}` : "Free"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Add to cart button */}
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={20} color={COLORS.textInverse} />
            <Text style={styles.addBtnText}>
              Add to Cart - ${getItemTotal().toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Image
  imageSection: {
    height: 220,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  closeBtn: {
    position: "absolute",
    top: SPACING.lg,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Content
  content: {
    flex: 1,
  },
  infoSection: {
    padding: SPACING.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: SPACING.sm,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Customizations
  customSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  customOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
  },
  customLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  customName: {
    fontSize: 15,
    fontWeight: "500",
  },
  customPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  // Quantity
  quantitySection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "800",
    minWidth: 30,
    textAlign: "center",
  },
  // Footer
  footer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  addBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
});
