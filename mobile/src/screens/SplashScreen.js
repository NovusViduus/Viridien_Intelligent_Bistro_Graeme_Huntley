import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../constants/theme";

const BISTRO_HERO = require("../../assets/images/menu/bistro pic.jpg");
const { width } = Dimensions.get("window");

/**
 * Splash/landing screen shown on first app launch.
 * Features an animated hero image, tagline, and timeline of the bistro experience.
 */
export default function SplashScreen({ onComplete }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const timelineFade1 = useRef(new Animated.Value(0)).current;
  const timelineFade2 = useRef(new Animated.Value(0)).current;
  const timelineFade3 = useRef(new Animated.Value(0)).current;
  const timelineFade4 = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      Animated.stagger(200, [
        Animated.timing(timelineFade1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(timelineFade2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(timelineFade3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(timelineFade4, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(btnFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const TIMELINE = [
    { icon: "chatbubble-ellipses", title: "Tell us what you want", desc: "Chat naturally with our AI assistant" },
    { icon: "restaurant", title: "We build your order", desc: "Smart parsing, combos & suggestions" },
    { icon: "cart", title: "Review & customize", desc: "Adjust quantities, add extras" },
    { icon: "checkmark-circle", title: "Place your order", desc: "Secure checkout, ready in minutes" },
  ];

  const timelineAnims = [timelineFade1, timelineFade2, timelineFade3, timelineFade4];

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroSection}>
        <Image source={BISTRO_HERO} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <Animated.View style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.heroTitle}>The Intelligent{"\n"}Bistro</Text>
          <Text style={styles.heroTagline}>Where AI meets fine dining</Text>
        </Animated.View>
      </View>

      {/* Timeline */}
      <View style={styles.timelineSection}>
        <Text style={styles.sectionTitle}>How it works</Text>
        {TIMELINE.map((step, i) => (
          <Animated.View key={i} style={[styles.timelineItem, { opacity: timelineAnims[i] }]}>
            <View style={styles.timelineDot}>
              <Ionicons name={step.icon} size={18} color={COLORS.textInverse} />
            </View>
            {i < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
            <View style={styles.timelineText}>
              <Text style={styles.timelineTitle}>{step.title}</Text>
              <Text style={styles.timelineDesc}>{step.desc}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* CTA Button */}
      <Animated.View style={[styles.ctaContainer, { opacity: btnFade }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={onComplete} activeOpacity={0.8}>
          <Text style={styles.ctaText}>Start Ordering</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.textInverse} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Hero
  heroSection: {
    height: 280,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  heroContent: {
    position: "absolute",
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    lineHeight: 42,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroTagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
  // Timeline
  timelineSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
    position: "relative",
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  timelineLine: {
    position: "absolute",
    left: 17,
    top: 36,
    width: 2,
    height: 40,
    backgroundColor: COLORS.border,
  },
  timelineText: {
    marginLeft: SPACING.md,
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  timelineDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // CTA
  ctaContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 4,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
});
