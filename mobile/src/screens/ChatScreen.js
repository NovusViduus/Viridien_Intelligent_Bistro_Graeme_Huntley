import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, COLORS_DARK, RADIUS, SPACING, SHADOWS } from "../constants/theme";
import { useThemeStore } from "../store/theme";
import ChatBubble, { TypingIndicator } from "../components/ChatBubble";
import SuggestionChips from "../components/SuggestionChips";
import { useCartStore, useChatStore } from "../store";
import { sendMessage } from "../services/api";

const ASSISTANT_AVATAR = require("../../assets/images/menu/Bistro Assistant.png");

const QUICK_SUGGESTIONS = [
  "What's popular?",
  "Any vegetarian options?",
  "I'd like a burger",
  "What do you recommend?",
];

/**
 * Chat screen providing a conversational interface with the AI ordering assistant.
 * Users can send messages, receive AI responses, and have items added to their cart via natural language.
 */
export default function ChatScreen() {
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? COLORS_DARK : COLORS;

  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const addToHistory = useChatStore((s) => s.addToHistory);
  const conversationHistory = useChatStore((s) => s.conversationHistory);

  const cartItems = useCartStore((s) => s.items);
  const processActions = useCartStore((s) => s.processActions);

  const [suggestions, setSuggestions] = useState(QUICK_SUGGESTIONS);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Scrolls the message list to the bottom after a short delay to ensure layout is complete.
   */
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  /**
   * Sends a message to the AI backend, updates chat state, and processes any cart actions in the response.
   * @param {string} [text] - Optional text override; defaults to the current input field value.
   */
  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    addMessage({ role: "user", content: msg });
    addToHistory("user", msg);
    setInput("");
    setSuggestions([]);
    setTyping(true);

    try {
      const response = await sendMessage(msg, cartItems, conversationHistory);
      setTyping(false);
      addMessage({ role: "assistant", content: response.reply });
      addToHistory("assistant", response.reply);

      if (response.actions && response.actions.length > 0) {
        processActions(response.actions);
      }

      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setTyping(false);
      addMessage({
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please make sure the server is running and try again! 🔄",
      });
      setSuggestions(["Try again"]);
    }
  };

  const renderItem = ({ item }) => <ChatBubble message={item} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.headerAvatar, { backgroundColor: colors.surfaceAlt }]}>
          <Image source={ASSISTANT_AVATAR} style={styles.headerAvatarImage} />
        </View>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bistro Assistant</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {isTyping ? "Typing..." : "Online, ready to take your order"}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
      />

      {/* Suggestion Chips */}
      <SuggestionChips suggestions={suggestions} onPress={handleSend} />

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text }]}
          placeholder="Ask me anything about the menu..."
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !input.trim() && [styles.sendButtonDisabled, { backgroundColor: colors.border }],
          ]}
          onPress={() => handleSend()}
          disabled={!input.trim()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={20}
            color={input.trim() ? colors.textInverse : colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    overflow: "hidden",
  },
  headerAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    resizeMode: "cover",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  messageList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    flexGrow: 1,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: 15,
    marginRight: SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
});
