import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import CartItem from "../components/CartItem";
import { useCartStore } from "../store";

/**
 * Cart screen displaying the user's current order with quantity controls,
 * order summary with tax estimate, and a checkout button.
 */
export default function CartScreen({ navigation }) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;

  const subtotal = getTotal();
  const taxRate = 0.0625; // Default TX rate, actual rate shown at checkout
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  /**
   * Prompts the user with a confirmation alert before clearing all cart items.
   */
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearCart(),
        },
      ]
    );
  };

  /**
   * Navigates to the checkout screen via the parent navigator or current stack.
   */
  const handleCheckout = () => {
    navigation.getParent()?.navigate("Checkout") || navigation.navigate("Checkout");
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: colors.background }]} edges={["top"]}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Browse the menu or chat with our AI assistant to add items
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate("Menu")}
        >
          <Text style={styles.browseBtnText}>Browse Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header with Clear */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Your Order</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.cartId}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary */}
      <View style={[styles.summary, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Est. Tax (TX 6.25%)</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Ionicons name="restaurant" size={20} color={colors.textInverse} />
          <Text style={styles.checkoutText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    ...SHADOWS.md,
  },
  browseBtnText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: "#FEE2E2",
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.error,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  summary: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
});
