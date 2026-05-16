import React, { useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { COLORS, COLORS_DARK, RADIUS, SPACING } from "../constants/theme";
import { useThemeStore } from "../store/theme";

const ASSISTANT_AVATAR = require("../../assets/images/menu/Bistro Assistant.png");

/**
 * Chat message bubble component that renders user or assistant messages
 * with slide-in animation and appropriate styling for each role.
 */
export default function ChatBubble({ message }) {
  const isUser = message.role === "user";
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.userWrapper : styles.aiWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
          <Image source={ASSISTANT_AVATAR} style={styles.avatarImage} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.chatUserBg }]
            : [styles.aiBubble, { backgroundColor: colors.chatAiBg }],
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isUser ? colors.chatUserText : colors.chatAiText },
          ]}
        >
          {message.content}
        </Text>
      </View>
    </Animated.View>
  );
}

/**
 * Animated typing indicator showing three bouncing dots, displayed while the AI assistant is generating a response.
 */
export function TypingIndicator() {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={[styles.wrapper, styles.aiWrapper]}>
      <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
        <Image source={ASSISTANT_AVATAR} style={styles.avatarImage} />
      </View>
      <View style={[styles.bubble, styles.aiBubble, styles.typingBubble, { backgroundColor: colors.chatAiBg }]}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: colors.textSecondary },
              {
                opacity: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: "flex-end",
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  aiWrapper: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.xs,
    overflow: "hidden",
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    resizeMode: "cover",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    marginLeft: "auto",
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
