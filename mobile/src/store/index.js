import { create } from "zustand";

/**
 * Zustand store for managing the shopping cart state.
 * Handles adding, removing, updating items and processing AI-driven cart actions.
 */
export const useCartStore = create((set, get) => ({
  items: [],

  /**
   * Adds an item to the cart, incrementing quantity if a matching item (same id and customizations) already exists.
   * @param {Object} item - The menu item to add.
   * @param {string} item.id - Menu item identifier.
   * @param {string} item.name - Display name.
   * @param {number} item.price - Unit price.
   * @param {number} [item.quantity=1] - Quantity to add.
   * @param {Array} [item.customizations=[]] - Selected customizations.
   */
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.customizations || []) ===
            JSON.stringify(item.customizations || [])
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity: item.quantity || 1,
            cartId: `${item.id}-${Date.now()}`,
            customizations: item.customizations || [],
          },
        ],
      };
    }),

  /**
   * Removes an item from the cart by its menu id, optionally reducing by a specific quantity.
   * @param {string} itemId - The menu item id to remove.
   * @param {number} [quantity] - Number of units to remove; if omitted, removes the first matching entry entirely.
   */
  removeItem: (itemId, quantity) =>
    set((state) => {
      if (quantity) {
        return {
          items: state.items
            .map((i) => {
              if (i.id === itemId) {
                const newQty = i.quantity - quantity;
                return newQty > 0 ? { ...i, quantity: newQty } : null;
              }
              return i;
            })
            .filter(Boolean),
        };
      }
      // Remove first matching item
      let removed = false;
      return {
        items: state.items.filter((i) => {
          if (!removed && i.id === itemId) {
            removed = true;
            return false;
          }
          return true;
        }),
      };
    }),

  /**
   * Removes a specific cart entry by its unique cart id.
   * @param {string} cartId - The unique cart-level identifier for the line item.
   */
  removeByCartId: (cartId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartId !== cartId),
    })),

  /**
   * Updates the quantity of a cart item; removes it if quantity drops to zero or below.
   * @param {string} cartId - The unique cart-level identifier.
   * @param {number} quantity - The new quantity to set.
   */
  updateItemQuantity: (cartId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.cartId !== cartId)
          : state.items.map((i) =>
              i.cartId === cartId ? { ...i, quantity } : i
            ),
    })),

  /**
   * Removes all items from the cart.
   */
  clearCart: () => set({ items: [] }),

  /**
   * Calculates the total price of all items in the cart, including customization surcharges.
   * @returns {number} The cart total in dollars.
   */
  getTotal: () => {
    const items = get().items;
    return items.reduce((sum, item) => {
      const customPrice = (item.customizations || []).reduce(
        (s, c) => s + (c.price || 0),
        0
      );
      return sum + (item.price + customPrice) * item.quantity;
    }, 0);
  },

  /**
   * Returns the total number of individual items (sum of quantities) in the cart.
   * @returns {number} Total item count.
   */
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Processes an array of AI-generated cart actions (ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, CLEAR_CART).
   * @param {Array<Object>} actions - Array of action objects from the AI response.
   * @param {string} actions[].type - The action type.
   * @param {Object} [actions[].item] - The item payload for the action.
   */
  processActions: (actions) => {
    const store = get();
    actions.forEach((action) => {
      switch (action.type) {
        case "ADD_ITEM":
          if (action.item) store.addItem(action.item);
          break;
        case "REMOVE_ITEM":
          if (action.item?.id) store.removeItem(action.item.id, action.item?.quantity);
          break;
        case "UPDATE_ITEM":
          if (action.item?.id) {
            const existing = store.items.find((i) => i.id === action.item.id);
            if (existing && action.item.quantity) {
              set((state) => ({
                items: state.items.map((i) =>
                  i.id === action.item.id
                    ? { ...i, quantity: action.item.quantity }
                    : i
                ),
              }));
            }
          }
          break;
        case "CLEAR_CART":
          store.clearCart();
          break;
      }
    });
  },
}));

/**
 * Zustand store for managing chat messages and conversation history with the AI assistant.
 */
export const useChatStore = create((set, get) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to The Intelligent Bistro! 🍽️\n\nI'm here to help you with your order. You can ask me to add items, make recommendations, or browse our menu.\n\nWhat sounds good today?",
      timestamp: Date.now(),
    },
  ],
  isTyping: false,
  conversationHistory: [],

  /**
   * Appends a new message to the chat display list.
   * @param {Object} message - The message to add.
   * @param {string} message.role - Either "user" or "assistant".
   * @param {string} message.content - The message text.
   */
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: `msg-${Date.now()}`, timestamp: Date.now() },
      ],
    })),

  /**
   * Sets the typing indicator state for the assistant.
   * @param {boolean} isTyping - Whether the assistant is currently typing.
   */
  setTyping: (isTyping) => set({ isTyping }),

  /**
   * Adds a message to the conversation history sent to the AI backend for context.
   * @param {string} role - The message role ("user" or "assistant").
   * @param {string} content - The message content.
   */
  addToHistory: (role, content) =>
    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        { role, content },
      ],
    })),

  /**
   * Resets the chat to a fresh welcome state, clearing all messages and history.
   */
  clearChat: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Welcome back! 🍽️ What can I get for you?",
          timestamp: Date.now(),
        },
      ],
      conversationHistory: [],
    }),
}));
