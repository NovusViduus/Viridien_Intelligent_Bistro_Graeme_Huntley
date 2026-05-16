import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import MenuCard from "../components/MenuCard";
import CartPreview from "../components/CartPreview";
import { fetchMenu } from "../services/api";

const BISTRO_HERO = require("../../assets/images/menu/bistro pic.jpg");

/**
 * Returns a time-of-day greeting string with an emoji.
 * @returns {string} A greeting like "Good morning ☀️".
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning ☀️";
  if (hour < 17) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

/**
 * Main menu screen displaying the restaurant's categorized menu items with search,
 * category tabs, and a floating cart preview bar.
 */
export default function MenuScreen({ navigation }) {
  const [menu, setMenu] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const colors = isDark ? COLORS_DARK : COLORS;

  useEffect(() => {
    loadMenu();
  }, []);

  /**
   * Fetches the menu from the API and triggers the fade-in animation on success.
   */
  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setMenu(data);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error("Failed to load menu:", err);
      setLoading(false);
    }
  };

  /**
   * Filters menu items locally based on the search query against names, descriptions, and tags.
   * @param {string} query - The user's search input.
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2 && menu) {
      const q = query.toLowerCase();
      const allItems = menu.categories.flatMap((cat) => cat.items);
      const results = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading menu...</Text>
      </View>
    );
  }

  if (!menu) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>Failed to load menu</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadMenu}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categories = menu.categories;
  const currentItems = searchResults || categories[activeCategory]?.items || [];

  const ListHeader = () => (
    <>
      {/* Hero Header */}
      <View style={styles.heroContainer}>
        <Image source={BISTRO_HERO} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>The Intelligent Bistro</Text>
          <Text style={styles.heroSubtitle}>AI-Powered Fine Dining</Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate("About")}
          style={[styles.aboutBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
        >
          <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()}</Text>
        <Text style={[styles.greetingSubtext, { color: colors.textLight }]}>
          What would you like to order today?
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons
          name="search"
          size={18}
          color={colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search the menu..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSearchResults(null);
            }}
          >
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      {!searchResults && (
        <View style={styles.tabsWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            contentContainerStyle={styles.tabsContainer}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.tab,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  activeCategory === index && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setActiveCategory(index)}
              >
                <Text style={styles.tabEmoji}>{item.icon}</Text>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textSecondary },
                    activeCategory === index && { color: colors.textInverse },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          {/* Dietary Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>🌶️</Text>
              <Text style={[styles.legendText, { color: colors.textLight }]}>Spicy</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>🌱</Text>
              <Text style={[styles.legendText, { color: colors.textLight }]}>Vegetarian</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendEmoji}>🌾</Text>
              <Text style={[styles.legendText, { color: colors.textLight }]}>Gluten-Free</Text>
            </View>
          </View>
        </View>
      )}

      {/* Search Results Header */}
      {searchResults !== null && (
        <View style={styles.searchHeader}>
          <Text style={[styles.searchHeaderText, { color: colors.textSecondary }]}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            for "{searchQuery}"
          </Text>
        </View>
      )}
    </>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.background }]}>
      {/* Menu Items */}
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items found</Text>
          </View>
        }
      />

      {/* Floating Cart Preview */}
      <CartPreview onPress={() => navigation.navigate("Cart")} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
  },
  errorText: {
    marginTop: SPACING.md,
    fontSize: 16,
  },
  retryBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryText: {
    color: COLORS.textInverse,
    fontWeight: "600",
  },
  // Hero
  heroContainer: {
    height: 180,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  heroContent: {
    position: "absolute",
    bottom: SPACING.lg,
    left: SPACING.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginTop: 2,
  },
  themeBtn: {
    position: "absolute",
    top: SPACING.xl,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutBtn: {
    position: "absolute",
    top: SPACING.xl,
    right: SPACING.lg + 48,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
  },
  // Greeting
  greetingSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
  },
  greetingSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    height: 44,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  // Tabs
  tabsWrapper: {
    marginBottom: SPACING.sm,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  tabEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Legend
  legend: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendEmoji: {
    fontSize: 12,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "500",
  },
  // Search results
  searchHeader: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  searchHeaderText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  // List
  listContent: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: "center",
    paddingTop: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 16,
  },
});
