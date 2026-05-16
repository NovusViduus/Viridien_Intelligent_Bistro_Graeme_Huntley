import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import { useCartStore } from "../store";

/** Simplified US state sales tax rates used for order total estimation. */
const STATE_TAX_RATES = {
  AL: 0.04, AZ: 0.056, AR: 0.065, CA: 0.0725, CO: 0.029,
  CT: 0.0635, DE: 0, FL: 0.06, GA: 0.04, HI: 0.04,
  ID: 0.06, IL: 0.0625, IN: 0.07, IA: 0.06, KS: 0.065,
  KY: 0.06, LA: 0.0445, ME: 0.055, MD: 0.06, MA: 0.0625,
  MI: 0.06, MN: 0.0688, MS: 0.07, MO: 0.0423, MT: 0,
  NE: 0.055, NV: 0.0685, NH: 0, NJ: 0.0663, NM: 0.0513,
  NY: 0.04, NC: 0.0475, ND: 0.05, OH: 0.0575, OK: 0.045,
  OR: 0, PA: 0.06, RI: 0.07, SC: 0.06, SD: 0.042,
  TN: 0.07, TX: 0.0625, UT: 0.061, VT: 0.06, VA: 0.053,
  WA: 0.065, WV: 0.06, WI: 0.05, WY: 0.04, DC: 0.06,
};

/**
 * Checkout screen with payment form, state-based tax calculation, and simulated payment processing.
 * Displays an order summary and collects credit card details before confirming the order.
 */
export default function CheckoutScreen({ navigation }) {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("TX");
  const [processing, setProcessing] = useState(false);

  const subtotal = getTotal();
  const taxRate = STATE_TAX_RATES[state] || 0.0625;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  /**
   * Formats a raw numeric string into groups of 4 digits for card number display.
   * @param {string} text - Raw input text.
   * @returns {string} Formatted card number (e.g., "4242 4242 4242 4242").
   */
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  /**
   * Formats a raw numeric string into MM/YY expiry format.
   * @param {string} text - Raw input text.
   * @returns {string} Formatted expiry (e.g., "12/25").
   */
  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  /**
   * Validates that all payment form fields are filled with expected lengths.
   * @returns {boolean} True if the form is complete and valid.
   */
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      expiry.length === 5 &&
      cvv.length >= 3 &&
      name.trim().length > 0 &&
      state.length === 2
    );
  };

  /**
   * Simulates payment processing with a 2-second delay, then shows a confirmation alert
   * and clears the cart on success.
   */
  const handlePayment = () => {
    if (!isFormValid()) {
      Alert.alert("Missing Info", "Please fill in all payment fields.");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      Alert.alert(
        "Order Confirmed! 🎉",
        `Your order of ${getItemCount()} item${
          getItemCount() !== 1 ? "s" : ""
        } totaling $${total.toFixed(2)} has been placed.\n\nEstimated ready time: 15-20 minutes.\n\nThank you for dining with us!`,
        [
          {
            text: "Done",
            onPress: () => {
              clearCart();
              navigation.navigate("Menu");
            },
          },
        ]
      );
    }, 2000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
            {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
          </Text>
          {items.map((item) => (
            <View key={item.cartId} style={styles.lineItem}>
              <Text style={[styles.lineItemName, { color: colors.text }]}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={[styles.lineItemPrice, { color: colors.text }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* State Selection for Tax */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery State</Text>
        <View style={styles.stateRow}>
          <TextInput
            style={[styles.stateInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={state}
            onChangeText={(t) => setState(t.toUpperCase().slice(0, 2))}
            placeholder="TX"
            placeholderTextColor={colors.textLight}
            maxLength={2}
            autoCapitalize="characters"
          />
          <Text style={[styles.taxInfo, { color: colors.textSecondary }]}>
            Tax rate: {(taxRate * 100).toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
            <Ionicons name="card" size={20} color={colors.primary} />
            <Text style={[styles.cardHeaderText, { color: colors.text }]}>Credit / Debit Card</Text>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Cardholder Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor={colors.textLight}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Card Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
            value={cardNumber}
            onChangeText={(t) => setCardNumber(formatCardNumber(t))}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
            maxLength={19}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Expiry</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
                value={expiry}
                onChangeText={(t) => setExpiry(formatExpiry(t))}
                placeholder="MM/YY"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>CVV</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </View>

      {/* Total & Pay */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Tax ({state} {(taxRate * 100).toFixed(1)}%)</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal, { borderTopColor: colors.border }]}>
          <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.grandTotalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, !isFormValid() && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={processing}
          activeOpacity={0.8}
        >
          {processing ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color={colors.textInverse} />
              <Text style={styles.payBtnText}>
                Pay ${total.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark" size={14} color={colors.success} />
          <Text style={[styles.secureText, { color: colors.textSecondary }]}>
            Secure payment. Your data is encrypted
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  itemCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: "600",
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  lineItemName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  lineItemPrice: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  stateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  stateInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    width: 60,
    textAlign: "center",
    ...SHADOWS.sm,
  },
  taxInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: 16,
    color: COLORS.text,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  halfField: {
    flex: 1,
  },
  totalSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  totalLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: SPACING.md,
  },
  secureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
