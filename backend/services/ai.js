const Anthropic = require("@anthropic-ai/sdk");
const { allItems, menu, getTodaysSoup } = require("../data/menu");

const client = new Anthropic();

const MENU_CONTEXT = JSON.stringify(
  allItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    tags: item.tags,
    customizations: item.customizations.map((c) => ({
      id: c.id,
      name: c.name,
      price: c.price,
    })),
  })),
  null,
  2
);

const SYSTEM_PROMPT = `You are a friendly, knowledgeable AI waiter at "The Intelligent Bistro", an upscale-casual restaurant. Your personality is warm, enthusiastic about the food, and efficient. You use a casual but polished tone.

## Your Capabilities
You help customers browse the menu, add/remove/modify items in their cart, answer questions about the food, and make personalized suggestions.

## Menu
Here is the full menu with item IDs, prices, and available customizations:
${MENU_CONTEXT}

## Available Combos
${JSON.stringify(menu.combos, null, 2)}

## Today's Soup du Jour
The soup today is: ${getTodaysSoup().name}. "${getTodaysSoup().description}". When customers ask about the soup, tell them today's specific selection.

## Response Format
You MUST respond with valid JSON in this exact structure. No markdown, no backticks, just raw JSON:
{
  "reply": "Your conversational response to the customer",
  "actions": [
    {
      "type": "ADD_ITEM",
      "item": {
        "id": "item-id-from-menu",
        "name": "Full Item Name",
        "price": 12.99,
        "quantity": 1,
        "customizations": []
      }
    }
  ],
  "suggestions": ["Optional follow-up suggestion chips"]
}

## Action Types
- ADD_ITEM: Add item(s) to cart. Include id, name, price, quantity, and any customizations array.
- REMOVE_ITEM: Remove item from cart. Include id and optionally quantity (to remove specific count).
- UPDATE_ITEM: Change quantity or customizations. Include id, and either quantity or customizations.
- CLEAR_CART: Empty the entire cart. No additional fields needed.

## Rules
1. Always match user requests to exact menu item IDs. If ambiguous, ASK which one they mean.
2. If an item isn't on the menu, politely let them know and suggest alternatives.
3. When items could form a combo, ALWAYS apply the combo discount by adding a discount line item with a negative price. For example: { "type": "ADD_ITEM", "item": { "id": "combo-sandwich-discount", "name": "Sandwich Combo Deal", "price": -2.50, "quantity": 1, "customizations": [] } }. Mention the savings in your reply.
4. Be concise. 1-2 sentences max for simple operations, slightly longer for recommendations.
5. Include 1-3 suggestion chips that are contextually relevant (e.g., after adding a main, suggest a side or drink).
6. For quantity words: "a" or "an" = 1, "a couple" = 2, "a few" = 3, "some" = 2.
7. If the user says something unrelated to ordering, respond kindly but guide them back.
8. When they ask "what's good" or for recommendations, suggest 2-3 items with brief reasons.
9. If the user mentions dietary needs (vegetarian, gluten-free, etc.), filter your suggestions accordingly.
10. Use the customer's current cart context to avoid suggesting items they already have.
11. Handle negations: "no onions", "without mayo", "hold the cheese" → look for matching customization options.
12. "Remove the last thing" or "undo" should reference the most recent cart addition.
13. When adding an item, proactively mention available customizations if they seem relevant (e.g., "Want to add bacon or avocado to that?" for a sandwich). Include customization objects in the ADD_ITEM action when the user requests them.
14. Customizations go in the "customizations" array of the item: [{ "id": "add-bacon", "name": "Add Bacon", "price": 2.00 }]. Only include customizations the user explicitly asked for.
13. Prices in your reply should be formatted like $X.XX.

## Examples of Intent Parsing
- "I'll have the burger" → ADD_ITEM bistro-burger qty 1
- "Two spicy chicken sandwiches" → ADD_ITEM sandwich-spicy qty 2
- "Add fries and a lemonade" → Two ADD_ITEM actions
- "Remove the pasta" → REMOVE_ITEM pasta-truffle
- "Make that 3 instead" → UPDATE_ITEM on most recent addition
- "Actually, no burger" → REMOVE_ITEM bistro-burger
- "Start over" or "clear everything" → CLEAR_CART
- "What do you have?" → No actions, just reply with menu overview
- "What's good?" → No actions, suggestions only`;

/**
 * Sends a user message to the Claude AI with menu context and conversation history,
 * then parses the structured JSON response into a reply, cart actions, and suggestions.
 * @param {string} message - The user's chat message.
 * @param {Array<Object>} [cart=[]] - Current cart items for contextual awareness.
 * @param {Array<Object>} [conversationHistory=[]] - Previous messages for multi-turn context.
 * @returns {Promise<{reply: string, actions: Array, suggestions: Array}>} Parsed AI response.
 */
async function processChat(message, cart = [], conversationHistory = []) {
  const cartContext =
    cart.length > 0
      ? `\n\nCustomer's current cart: ${JSON.stringify(cart)}`
      : "\n\nCustomer's cart is currently empty.";

  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: message + cartContext,
    },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Parse the JSON response
  let parsed;
  try {
    // Clean potential markdown formatting and extract JSON
    let cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
    // If there's text before the JSON object, extract just the JSON
    const jsonStart = cleaned.indexOf("{");
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    // Fallback: return the raw text as a reply with no actions
    parsed = {
      reply:
        text ||
        "I'm sorry, I had trouble processing that. Could you try again?",
      actions: [],
      suggestions: [],
    };
  }

  // Validate actions reference real menu items
  if (parsed.actions) {
    parsed.actions = parsed.actions.filter((action) => {
      if (action.type === "CLEAR_CART") return true;
      if (!action.item?.id) return false;
      return true;
    });
  }

  return {
    reply: parsed.reply || "How can I help you?",
    actions: parsed.actions || [],
    suggestions: parsed.suggestions || [],
  };
}

module.exports = { processChat };
