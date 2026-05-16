import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING } from "../constants/theme";
import { useThemeStore } from "../store/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const SECTION_HEIGHT = SCREEN_HEIGHT * 0.85;

// Story images
const IMAGES = {
  chef: require("../../assets/story-1986.jpg"),
  dining: require("../../assets/story-1987.jpg"),
  modern: require("../../assets/story-2010.jpg"),
  tech: require("../../assets/story-2024.jpg"),
  today: require("../../assets/images/menu/bistro pic.jpg"),
};

// Story timeline data
const STORY = [
  {
    year: "1986",
    title: "A Chef's Dream",
    subtitle: "Where it all began",
    body: "Chef Laurent Moreau, trained in Lyon and Paris, opens a 30-seat bistro with nothing but a cast-iron pan, a family recipe book, and an unshakeable belief that great food brings people together.",
    image: IMAGES.chef,
    tint: "rgba(0,0,0,0.55)",
  },
  {
    year: "1987",
    title: "The Dining Room",
    subtitle: "Doors open to the neighborhood",
    body: "Word travels fast. Within a year, the intimate dining room becomes the neighborhood's gathering place, a spot where regulars are greeted by name and the daily soup is never the same twice.",
    image: IMAGES.dining,
    tint: "rgba(0,0,0,0.5)",
  },
  {
    year: "2010",
    title: "Next Generation",
    subtitle: "Tradition meets ambition",
    body: "Laurent's daughter Sophie returns from culinary school with fresh ideas. She modernizes the kitchen, expands the menu to 25 signature dishes, and earns the bistro its first regional award.",
    image: IMAGES.modern,
    tint: "rgba(0,0,0,0.5)",
  },
  {
    year: "2024",
    title: "The Intelligent Bistro",
    subtitle: "AI meets hospitality",
    body: "Sophie partners with a team of engineers to reimagine the ordering experience. An AI assistant that knows the menu as well as Laurent knew his regulars. Personal, intuitive, effortless.",
    image: IMAGES.tech,
    tint: "rgba(0,0,0,0.55)",
  },
  {
    year: "Today",
    title: "Same Soul, Smarter Service",
    subtitle: "The future is conversational",
    body: "Three generations of recipes. One conversation to order. The Intelligent Bistro honors every dish Laurent perfected while making the experience as seamless as talking to a friend.",
    image: IMAGES.today,
    tint: "rgba(0,0,0,0.45)",
  },
];

/**
 * Full-screen parallax timeline telling the story of The Intelligent Bistro.
 * Each section is a full-bleed image with overlaid text that fades/slides on scroll.
 */
export default function AboutScreen({ navigation }) {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Scroll indicator */}
      <View style={styles.scrollHint}>
        <Text style={styles.scrollHintText}>Scroll to explore</Text>
        <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.7)" />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={SECTION_HEIGHT}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {STORY.map((section, index) => {
          const inputRange = [
            (index - 1) * SECTION_HEIGHT,
            index * SECTION_HEIGHT,
            (index + 1) * SECTION_HEIGHT,
          ];

          // Parallax: image moves at 0.3x scroll speed
          const imageTranslate = scrollY.interpolate({
            inputRange,
            outputRange: [-SECTION_HEIGHT * 0.3, 0, SECTION_HEIGHT * 0.3],
            extrapolate: "clamp",
          });

          // Text fades in/out
          const textOpacity = scrollY.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          // Text slides up
          const textTranslate = scrollY.interpolate({
            inputRange,
            outputRange: [40, 0, -40],
            extrapolate: "clamp",
          });

          return (
            <View key={index} style={styles.section}>
              {/* Background image with parallax */}
              <Animated.View
                style={[
                  styles.imageContainer,
                  { transform: [{ translateY: imageTranslate }] },
                ]}
              >
                <Image source={section.image} style={styles.sectionImage} />
              </Animated.View>

              {/* Overlay tint */}
              <View style={[styles.overlay, { backgroundColor: section.tint }]} />

              {/* Content */}
              <Animated.View
                style={[
                  styles.sectionContent,
                  {
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslate }],
                  },
                ]}
              >
                <Text style={styles.year}>{section.year}</Text>
                <Text style={styles.title}>{section.title}</Text>
                <Text style={styles.subtitle}>{section.subtitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.body}>{section.body}</Text>
              </Animated.View>

              {/* Section indicator dots */}
              <View style={styles.dots}>
                {STORY.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === index && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          );
        })}

        {/* Final CTA */}
        <View style={[styles.ctaSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.ctaTitle, { color: colors.text }]}>Ready to experience it?</Text>
          <Text style={[styles.ctaBody, { color: colors.textSecondary }]}>
            Order through our AI assistant. It knows the menu as well as Chef Laurent knew his regulars.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="restaurant" size={20} color={COLORS.textInverse} />
            <Text style={styles.ctaBtnText}>View Menu</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backBtn: {
    position: "absolute",
    top: SPACING.xl + 8,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollHint: {
    position: "absolute",
    bottom: SPACING.xl,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollHintText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginBottom: 4,
  },
  // Sections
  section: {
    height: SECTION_HEIGHT,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionImage: {
    width: SCREEN_WIDTH,
    height: SECTION_HEIGHT + SECTION_HEIGHT * 0.6,
    resizeMode: "cover",
    position: "absolute",
    top: -SECTION_HEIGHT * 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl + 20,
  },
  year: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.md,
    borderRadius: 2,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255,255,255,0.85)",
    maxWidth: "90%",
  },
  // Dots
  dots: {
    position: "absolute",
    right: SPACING.md,
    top: "50%",
    transform: [{ translateY: -40 }],
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
    height: 24,
  },
  // CTA
  ctaSection: {
    height: SECTION_HEIGHT * 0.6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  ctaBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  ctaBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
});
