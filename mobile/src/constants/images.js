/**
 * Static image map: maps menu item IDs to local image assets.
 * Soup images are handled dynamically via the "soupVariant" field from the API.
 */
const MENU_IMAGES = {
  bruschetta: require("../../assets/images/menu/Bruschetta Classica.jpg"),
  "soup-du-jour": require("../../assets/images/menu/Tomato Soup.jpg"), // fallback
  calamari: require("../../assets/images/menu/Crispy Calamari.jpg"),
  "caesar-salad": require("../../assets/images/menu/Classic Caesar Salad.jpg"),
  "sandwich-classic": require("../../assets/images/menu/Classic Chicken Sandwich.jpg"),
  "sandwich-spicy": require("../../assets/images/menu/Spicy Chicken Sandwich.jpg"),
  "bistro-burger": require("../../assets/images/menu/Bistro Burger.jpg"),
  salmon: require("../../assets/images/menu/Pan-Seared Atlantic Salmon.jpg"),
  "pasta-truffle": require("../../assets/images/menu/Truffle Mushroom Pasta.jpg"),
  "steak-frites": require("../../assets/images/menu/Steak Frites.jpg"),
  fries: require("../../assets/images/menu/Hand-Cut Fries.jpg"),
  "mac-cheese": require("../../assets/images/menu/Mac and Cheese.jpg"),
  "onion-rings": require("../../assets/images/menu/Beer-Battered Onion Rings.jpg"),
  "side-salad": require("../../assets/images/menu/House Side Salad.jpg"),
  tiramisu: require("../../assets/images/menu/Classic Tiramisu.jpg"),
  "chocolate-lava": require("../../assets/images/menu/Chocolate Lava Cake.jpg"),
  "creme-brulee": require("../../assets/images/menu/Vanilla Creme Brulee.jpg"),
  "water-sm": require("../../assets/images/menu/Water (Small).jpg"),
  "water-lg": require("../../assets/images/menu/Water (Large).jpg"),
  lemonade: require("../../assets/images/menu/Fresh-Squeezed Lemonade.jpg"),
  "iced-tea": require("../../assets/images/menu/Iced Tea.jpg"),
  espresso: require("../../assets/images/menu/Espresso.jpg"),
  "craft-soda": require("../../assets/images/menu/Craft Soda.jpg"),
};

/** Dynamic soup images: selected by backend based on the day's rotation. */
const SOUP_IMAGES = {
  "tomato-bisque": require("../../assets/images/menu/Tomato Soup.jpg"),
  "broccoli-cheddar": require("../../assets/images/menu/Broccoli Cheddar.jpg"),
  "clam-chowder": require("../../assets/images/menu/Clam Chowder.jpg"),
};

/**
 * Resolves the correct image asset for a menu item, handling dynamic soup variants.
 * @param {string} itemId - The menu item identifier.
 * @param {string} [soupVariant] - The soup variant id for dynamic soup-du-jour images.
 * @returns {number|null} The require'd image asset or null if no image is mapped.
 */
export function getMenuImage(itemId, soupVariant) {
  if (itemId === "soup-du-jour" && soupVariant && SOUP_IMAGES[soupVariant]) {
    return SOUP_IMAGES[soupVariant];
  }
  return MENU_IMAGES[itemId] || null;
}

export { MENU_IMAGES, SOUP_IMAGES };
