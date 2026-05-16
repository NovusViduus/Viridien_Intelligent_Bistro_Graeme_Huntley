// Mock AI service: returns canned responses for testing without an API key
const { allItems } = require("../data/menu");

/**
 * Processes a chat message using keyword-based intent matching to return canned responses.
 * Used as a fallback when no Anthropic API key is configured.
 * @param {string} message - The user's chat message.
 * @param {Array<Object>} [cart=[]] - Current cart items for context.
 * @param {Array<Object>} [conversationHistory=[]] - Previous conversation messages (unused in mock).
 * @returns {{reply: string, actions: Array, suggestions: Array}} A mock AI response with reply text, cart actions, and suggestion chips.
 */
function processChatMock(message, cart = [], conversationHistory = []) {
  const msg = message.toLowerCase();

  // Simple intent matching for testing
  if (msg.includes("spicy chicken") || msg.includes("spicy sandwich")) {
    const qty = msg.includes("two") ? 2 : msg.includes("three") ? 3 : 1;
    const item = allItems.find((i) => i.id === "sandwich-spicy");
    const actions = [
      {
        type: "ADD_ITEM",
        item: { id: item.id, name: item.name, price: item.price, quantity: qty, customizations: [] },
      },
    ];

    // Check if they also want water
    if (msg.includes("water")) {
      const size = msg.includes("large") ? "water-lg" : "water-sm";
      const water = allItems.find((i) => i.id === size);
      actions.push({
        type: "ADD_ITEM",
        item: { id: water.id, name: water.name, price: water.price, quantity: 1, customizations: [] },
      });
    }

    return {
      reply: `Added ${qty} Spicy Chicken Sandwich${qty > 1 ? "es" : ""}${msg.includes("water") ? " and a water" : ""} to your cart! 🔥`,
      actions,
      suggestions: ["Add fries?", "Any drinks?", "View my cart"],
    };
  }

  if (msg.includes("burger")) {
    const item = allItems.find((i) => i.id === "bistro-burger");
    return {
      reply: "Great choice! The Bistro Burger is one of our best sellers. Added to your cart! 🍔",
      actions: [
        { type: "ADD_ITEM", item: { id: item.id, name: item.name, price: item.price, quantity: 1, customizations: [] } },
      ],
      suggestions: ["Add fries for a combo?", "Any drinks?"],
    };
  }

  if (msg.includes("salad")) {
    const item = allItems.find((i) => i.id === "caesar-salad");
    return {
      reply: "Our Classic Caesar is a great pick! Added to your cart. 🥗",
      actions: [
        { type: "ADD_ITEM", item: { id: item.id, name: item.name, price: item.price, quantity: 1, customizations: [] } },
      ],
      suggestions: ["Add chicken to it?", "Anything else?"],
    };
  }

  if (msg.includes("fries")) {
    const item = allItems.find((i) => i.id === "fries");
    return {
      reply: "Hand-Cut Fries coming right up! 🍟",
      actions: [
        { type: "ADD_ITEM", item: { id: item.id, name: item.name, price: item.price, quantity: 1, customizations: [] } },
      ],
      suggestions: ["Make them truffle parmesan?", "Anything to drink?"],
    };
  }

  if (msg.includes("remove") || msg.includes("never mind") || msg.includes("cancel")) {
    if (cart.length > 0) {
      return {
        reply: "No problem! I've cleared your cart. What would you like instead?",
        actions: [{ type: "CLEAR_CART" }],
        suggestions: ["Show me the menu", "What's popular?"],
      };
    }
    return {
      reply: "Your cart is already empty! What can I get for you?",
      actions: [],
      suggestions: ["What's popular?", "Show me mains"],
    };
  }

  if (msg.includes("popular") || msg.includes("recommend") || msg.includes("what's good")) {
    return {
      reply: "Our most popular items are the Bistro Burger, Spicy Chicken Sandwich, and the Truffle Mushroom Pasta. The burger is my personal favorite, Wagyu blend with truffle aioli! 🤤",
      actions: [],
      suggestions: ["I'll try the burger", "Tell me about the pasta", "Spicy sandwich please"],
    };
  }

  if (msg.includes("soup")) {
    const item = allItems.find((i) => i.id === "soup-du-jour");
    return {
      reply: "Today's soup is our New England Clam Chowder, rich and creamy with tender clams and potatoes. Want me to add one?",
      actions: [],
      suggestions: ["Yes, add the soup", "What else do you have?"],
    };
  }

  if (msg.includes("menu") || msg.includes("what do you have")) {
    return {
      reply: "We've got Starters, Mains, Sides, Desserts, and Drinks! Our highlights include the Bistro Burger, Pan-Seared Salmon, and Classic Tiramisu. What catches your eye?",
      actions: [],
      suggestions: ["Show me mains", "Any vegetarian options?", "What's popular?"],
    };
  }

  // Default response
  return {
    reply: "I'd be happy to help! You can ask me to add items to your cart, get recommendations, or browse the menu. What sounds good? 😊",
    actions: [],
    suggestions: ["What's popular?", "Show me the menu", "I'd like a burger"],
  };
}

module.exports = { processChatMock };
