// Change this to your backend URL
// For Expo Go on physical device, use your machine's local IP
// For emulator: Android = 10.0.2.2, iOS = localhost
const API_BASE = __DEV__
  ? "http://localhost:3000/api"
  : "https://your-production-url.com/api";

/**
 * Makes an HTTP request to the backend API with JSON content type and error handling.
 * @param {string} endpoint - The API path (e.g., "/menu").
 * @param {Object} [options={}] - Fetch options (method, headers, body, etc.).
 * @returns {Promise<Object>} The parsed JSON response body.
 * @throws {Error} If the network request fails or the server returns a non-OK status.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (err) {
    if (err.message === "Network request failed") {
      throw new Error(
        "Cannot connect to server. Make sure the backend is running."
      );
    }
    throw err;
  }
}

/**
 * Fetches the full restaurant menu including categories and items.
 * @returns {Promise<Object>} The menu data with categories and enriched soup info.
 */
export async function fetchMenu() {
  const res = await request("/menu");
  return res.data;
}

/**
 * Searches menu items by a text query against names, descriptions, and tags.
 * @param {string} query - The search term.
 * @returns {Promise<Array<Object>>} Array of matching menu items.
 */
export async function searchMenu(query) {
  const res = await request(`/menu/search?q=${encodeURIComponent(query)}`);
  return res.data;
}

/**
 * Fetches the list of popular menu items.
 * @returns {Promise<Array<Object>>} Array of popular menu items.
 */
export async function fetchPopularItems() {
  const res = await request("/menu/popular");
  return res.data;
}

/**
 * Sends a chat message to the AI assistant along with cart context and conversation history.
 * @param {string} message - The user's message text.
 * @param {Array<Object>} [cart=[]] - Current cart items for context.
 * @param {Array<Object>} [conversationHistory=[]] - Previous messages for conversation continuity.
 * @returns {Promise<Object>} The AI response containing reply, actions, and suggestions.
 */
export async function sendMessage(message, cart = [], conversationHistory = []) {
  const res = await request("/chat", {
    method: "POST",
    body: JSON.stringify({ message, cart, conversationHistory }),
  });
  return res.data;
}

export default {
  fetchMenu,
  searchMenu,
  fetchPopularItems,
  sendMessage,
};
