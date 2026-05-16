const express = require("express");
const { processChat } = require("../services/ai");
const { processChatMock } = require("../services/mock-ai");

const useMock = !process.env.ANTHROPIC_API_KEY;

if (useMock) {
  console.log("⚠️  No ANTHROPIC_API_KEY found. Running in MOCK mode (canned responses)");
}

const router = express.Router();

/**
 * Processes a user chat message through the AI service (or mock fallback) and returns
 * a reply with optional cart actions and follow-up suggestions.
 * @route POST /api/chat
 * @body {string} message - The user's message text.
 * @body {Array} [cart] - Current cart items for context.
 * @body {Array} [conversationHistory] - Previous messages for continuity.
 */
router.post("/", async (req, res) => {
  try {
    const { message, cart, conversationHistory } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    const result = useMock
      ? processChatMock(message.trim(), cart || [], conversationHistory || [])
      : await processChat(message.trim(), cart || [], conversationHistory || []);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Chat processing error:", err);

    if (err.status === 401) {
      return res.status(500).json({
        success: false,
        error: "AI service authentication failed. Check your API key.",
      });
    }

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait a moment and try again.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to process your message. Please try again.",
    });
  }
});

module.exports = router;
