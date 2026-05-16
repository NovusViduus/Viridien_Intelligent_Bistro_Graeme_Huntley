import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./src/screens/SplashScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ChatScreen from "./src/screens/ChatScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import AboutScreen from "./src/screens/AboutScreen";
import { useCartStore } from "./src/store";
import { useThemeStore } from "./src/store/theme";
import { COLORS, COLORS_DARK, RADIUS, SHADOWS } from "./src/constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Badge overlay component that displays the current cart item count on the Cart tab icon.
 * Renders nothing when the cart is empty.
 */
function CartBadge() {
  const getItemCount = useCartStore((s) => s.getItemCount);
  const count = getItemCount();

  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

/**
 * Bottom tab navigator containing the Menu, Chat (Order AI), and Cart screens.
 */
function TabNavigator() {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Menu") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Chat") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          }
          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === "Cart" && <CartBadge />}
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: "Order AI" }}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

/**
 * Root application component. Shows a splash/onboarding screen on first launch,
 * then the main app with tab navigation + modal stack for checkout and about.
 */
export default function App() {
  const isDark = useThemeStore((s) => s.isDark);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 10,
    fontWeight: "800",
  },
});
