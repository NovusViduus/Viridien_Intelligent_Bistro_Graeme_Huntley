/** Restaurant menu data structure containing all categories, items, and combo deals. */
const menu = {
  categories: [
    {
      id: "starters",
      name: "Starters",
      icon: "🥗",
      items: [
        {
          id: "bruschetta",
          name: "Bruschetta Classica",
          description: "Grilled sourdough topped with heirloom tomatoes, fresh basil, garlic & aged balsamic",
          price: 9.99,
          image: "bruschetta",
          tags: ["vegetarian", "popular"],
          customizations: [
            { id: "add-burrata", name: "Add Burrata", price: 3.00 },
            { id: "gluten-free-bread", name: "Gluten-Free Bread", price: 1.50 }
          ]
        },
        {
          id: "soup-du-jour",
          name: "Soup du Jour",
          description: "Chef's daily selection. Ask your server for today's creation",
          price: 7.99,
          image: "soup",
          tags: ["daily-special"],
          customizations: [
            { id: "bread-bowl", name: "Bread Bowl", price: 2.50 }
          ],
          dynamic: true
        },
        {
          id: "calamari",
          name: "Crispy Calamari",
          description: "Lightly fried calamari rings with marinara and lemon aioli",
          price: 11.99,
          image: "calamari",
          tags: ["popular"],
          customizations: [
            { id: "extra-sauce", name: "Extra Sauce", price: 1.00 },
            { id: "spicy", name: "Spicy Marinara", price: 0.00 }
          ]
        },
        {
          id: "caesar-salad",
          name: "Classic Caesar Salad",
          description: "Crisp romaine, house-made croutons, parmesan, and our signature Caesar dressing",
          price: 10.99,
          image: "caesar",
          tags: ["vegetarian"],
          customizations: [
            { id: "add-chicken", name: "Add Grilled Chicken", price: 4.00 },
            { id: "add-shrimp", name: "Add Shrimp", price: 5.00 },
            { id: "no-croutons", name: "No Croutons (GF)", price: 0.00 }
          ]
        }
      ]
    },
    {
      id: "mains",
      name: "Mains",
      icon: "🍖",
      items: [
        {
          id: "sandwich-classic",
          name: "Classic Chicken Sandwich",
          description: "Herb-marinated grilled chicken, lettuce, tomato & garlic mayo on brioche",
          price: 13.99,
          image: "chicken-sandwich",
          tags: ["popular"],
          customizations: [
            { id: "no-mayo", name: "No Mayo", price: 0.00 },
            { id: "add-bacon", name: "Add Bacon", price: 2.00 },
            { id: "add-avocado", name: "Add Avocado", price: 1.50 },
            { id: "gluten-free-bun", name: "Gluten-Free Bun", price: 1.50 }
          ]
        },
        {
          id: "sandwich-spicy",
          name: "Spicy Chicken Sandwich",
          description: "Crispy Nashville hot chicken, pickled jalapeños, slaw & chipotle ranch on brioche",
          price: 14.99,
          image: "spicy-sandwich",
          tags: ["popular", "spicy"],
          customizations: [
            { id: "mild", name: "Make It Mild", price: 0.00 },
            { id: "extra-hot", name: "Extra Hot", price: 0.00 },
            { id: "add-avocado", name: "Add Avocado", price: 1.50 }
          ]
        },
        {
          id: "bistro-burger",
          name: "The Bistro Burger",
          description: "8oz Wagyu blend patty, aged cheddar, caramelized onions, truffle aioli, brioche bun",
          price: 16.99,
          image: "burger",
          tags: ["signature", "popular"],
          customizations: [
            { id: "add-bacon", name: "Add Bacon", price: 2.00 },
            { id: "add-egg", name: "Add Fried Egg", price: 1.50 },
            { id: "extra-patty", name: "Extra Patty", price: 6.00 },
            { id: "no-bun", name: "Lettuce Wrap (GF)", price: 0.00 }
          ]
        },
        {
          id: "salmon",
          name: "Pan-Seared Atlantic Salmon",
          description: "Wild-caught salmon, lemon dill butter, roasted vegetables & quinoa",
          price: 22.99,
          image: "salmon",
          tags: ["healthy", "gluten-free"],
          customizations: [
            { id: "sub-rice", name: "Sub White Rice", price: 0.00 },
            { id: "sub-mash", name: "Sub Mashed Potatoes", price: 0.00 },
            { id: "extra-veggies", name: "Extra Vegetables", price: 2.00 }
          ]
        },
        {
          id: "pasta-truffle",
          name: "Truffle Mushroom Pasta",
          description: "Fresh pappardelle, wild mushroom ragù, truffle cream, pecorino",
          price: 18.99,
          image: "pasta",
          tags: ["vegetarian", "signature"],
          customizations: [
            { id: "add-chicken", name: "Add Grilled Chicken", price: 4.00 },
            { id: "add-shrimp", name: "Add Shrimp", price: 5.00 },
            { id: "gluten-free-pasta", name: "Gluten-Free Pasta", price: 2.00 }
          ]
        },
        {
          id: "steak-frites",
          name: "Steak Frites",
          description: "10oz NY strip, herb butter, hand-cut fries & béarnaise sauce",
          price: 28.99,
          image: "steak",
          tags: ["signature", "gluten-free"],
          customizations: [
            { id: "rare", name: "Rare", price: 0.00 },
            { id: "medium-rare", name: "Medium Rare", price: 0.00 },
            { id: "medium", name: "Medium", price: 0.00 },
            { id: "well-done", name: "Well Done", price: 0.00 },
            { id: "upgrade-filet", name: "Upgrade to Filet", price: 8.00 }
          ]
        }
      ]
    },
    {
      id: "sides",
      name: "Sides",
      icon: "🍟",
      items: [
        {
          id: "fries",
          name: "Hand-Cut Fries",
          description: "Crispy golden fries with sea salt and rosemary",
          price: 5.99,
          image: "fries",
          tags: ["vegetarian", "popular"],
          customizations: [
            { id: "truffle", name: "Truffle Parmesan", price: 2.00 },
            { id: "loaded", name: "Loaded (Bacon, Cheese, Scallions)", price: 3.00 },
            { id: "sweet-potato", name: "Sweet Potato Fries", price: 1.00 }
          ]
        },
        {
          id: "mac-cheese",
          name: "Mac & Cheese",
          description: "Four-cheese blend with crispy breadcrumb topping",
          price: 7.99,
          image: "mac",
          tags: ["vegetarian", "comfort"],
          customizations: [
            { id: "add-bacon", name: "Add Bacon", price: 2.00 },
            { id: "add-truffle", name: "Truffle Oil", price: 2.00 }
          ]
        },
        {
          id: "onion-rings",
          name: "Beer-Battered Onion Rings",
          description: "Thick-cut sweet onions in crispy beer batter with chipotle ketchup",
          price: 6.99,
          image: "onion-rings",
          tags: ["vegetarian"],
          customizations: []
        },
        {
          id: "side-salad",
          name: "House Side Salad",
          description: "Mixed greens, cherry tomatoes, cucumber, red onion, balsamic vinaigrette",
          price: 5.49,
          image: "side-salad",
          tags: ["vegetarian", "healthy", "gluten-free"],
          customizations: [
            { id: "ranch", name: "Ranch Dressing", price: 0.00 },
            { id: "blue-cheese", name: "Blue Cheese Dressing", price: 0.00 }
          ]
        }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      icon: "🍰",
      items: [
        {
          id: "tiramisu",
          name: "Classic Tiramisu",
          description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa dust",
          price: 9.99,
          image: "tiramisu",
          tags: ["popular", "signature"],
          customizations: []
        },
        {
          id: "chocolate-lava",
          name: "Chocolate Lava Cake",
          description: "Warm dark chocolate cake with molten center, vanilla bean gelato",
          price: 11.99,
          image: "lava-cake",
          tags: ["popular"],
          customizations: [
            { id: "extra-gelato", name: "Extra Scoop Gelato", price: 2.00 }
          ]
        },
        {
          id: "creme-brulee",
          name: "Vanilla Crème Brûlée",
          description: "Classic custard with a caramelized sugar crust",
          price: 8.99,
          image: "brulee",
          tags: ["gluten-free"],
          customizations: []
        }
      ]
    },
    {
      id: "drinks",
      name: "Drinks",
      icon: "🥤",
      items: [
        {
          id: "water-sm",
          name: "Water (Small)",
          description: "Purified still water, 12oz",
          price: 1.99,
          image: "water",
          tags: [],
          customizations: [
            { id: "sparkling", name: "Sparkling", price: 0.50 }
          ]
        },
        {
          id: "water-lg",
          name: "Water (Large)",
          description: "Purified still water, 20oz",
          price: 2.99,
          image: "water",
          tags: [],
          customizations: [
            { id: "sparkling", name: "Sparkling", price: 0.50 }
          ]
        },
        {
          id: "lemonade",
          name: "Fresh-Squeezed Lemonade",
          description: "House-made with real lemons and a hint of mint",
          price: 4.99,
          image: "lemonade",
          tags: ["popular"],
          customizations: [
            { id: "strawberry", name: "Strawberry Lemonade", price: 1.00 },
            { id: "lavender", name: "Lavender Lemonade", price: 1.00 }
          ]
        },
        {
          id: "iced-tea",
          name: "Iced Tea",
          description: "Cold-brewed black tea, lightly sweetened",
          price: 3.49,
          image: "tea",
          tags: [],
          customizations: [
            { id: "unsweetened", name: "Unsweetened", price: 0.00 },
            { id: "peach", name: "Peach Flavor", price: 0.50 }
          ]
        },
        {
          id: "espresso",
          name: "Espresso",
          description: "Double shot, Italian roast",
          price: 3.99,
          image: "espresso",
          tags: [],
          customizations: [
            { id: "decaf", name: "Decaf", price: 0.00 }
          ]
        },
        {
          id: "craft-soda",
          name: "Craft Soda",
          description: "Small-batch artisan sodas: Cola, Ginger Beer, or Root Beer",
          price: 3.99,
          image: "soda",
          tags: [],
          customizations: [
            { id: "cola", name: "Cola", price: 0.00 },
            { id: "ginger-beer", name: "Ginger Beer", price: 0.00 },
            { id: "root-beer", name: "Root Beer", price: 0.00 }
          ]
        }
      ]
    }
  ],
  combos: [
    {
      id: "combo-burger",
      name: "Burger Combo",
      description: "Any burger + fries + drink",
      discount: 3.00,
      qualifyingItems: {
        main: ["bistro-burger"],
        side: ["fries"],
        drink: ["water-sm", "water-lg", "lemonade", "iced-tea", "craft-soda"]
      }
    },
    {
      id: "combo-sandwich",
      name: "Sandwich Combo",
      description: "Any sandwich + side + drink",
      discount: 2.50,
      qualifyingItems: {
        main: ["sandwich-classic", "sandwich-spicy"],
        side: ["fries", "onion-rings", "side-salad"],
        drink: ["water-sm", "water-lg", "lemonade", "iced-tea", "craft-soda"]
      }
    }
  ]
};

/** Flattened array of all menu items across categories for easy lookup. */
const allItems = menu.categories.flatMap(cat => cat.items);

/** Map of item id to item object for O(1) lookups. */
const itemMap = Object.fromEntries(allItems.map(item => [item.id, item]));

/** Daily soup rotation variants with names and descriptions. */
const SOUP_VARIANTS = [
  {
    id: "tomato-bisque",
    name: "Roasted Tomato Bisque",
    description: "Creamy roasted tomato soup with fresh basil and a drizzle of olive oil",
  },
  {
    id: "broccoli-cheddar",
    name: "Broccoli Cheddar Soup",
    description: "Velvety cheddar soup loaded with tender broccoli florets",
  },
  {
    id: "clam-chowder",
    name: "New England Clam Chowder",
    description: "Rich and creamy chowder with tender clams, potatoes & bacon",
  },
];

/**
 * Determines today's soup variant based on the day of the year rotation.
 * @returns {{id: string, name: string, description: string}} Today's soup variant.
 */
function getTodaysSoup() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const variant = SOUP_VARIANTS[dayOfYear % SOUP_VARIANTS.length];
  return variant;
}

/**
 * Returns the full menu with today's soup du jour info injected into the starters category.
 * @returns {Object} The enriched menu object with categories and combos.
 */
function getMenu() {
  const todaysSoup = getTodaysSoup();
  // Return menu with today's soup info injected
  const enrichedMenu = JSON.parse(JSON.stringify(menu));
  const starters = enrichedMenu.categories.find(c => c.id === "starters");
  const soup = starters.items.find(i => i.id === "soup-du-jour");
  if (soup) {
    soup.name = `Soup du Jour: ${todaysSoup.name}`;
    soup.description = todaysSoup.description;
    soup.soupVariant = todaysSoup.id;
  }
  return enrichedMenu;
}

/**
 * Searches all menu items by matching a query against names, descriptions, and tags.
 * @param {string} query - The search term (case-insensitive).
 * @returns {Array<Object>} Array of matching menu items.
 */
function searchMenu(query) {
  const q = query.toLowerCase();
  return allItems.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.tags.some(tag => tag.includes(q))
  );
}

/**
 * Returns all menu items tagged as "popular".
 * @returns {Array<Object>} Array of popular menu items.
 */
function getPopularItems() {
  return allItems.filter(item => item.tags.includes("popular"));
}

/**
 * Looks up a single menu item by its unique id.
 * @param {string} id - The menu item identifier.
 * @returns {Object|null} The menu item or null if not found.
 */
function getItemById(id) {
  return itemMap[id] || null;
}

/**
 * Returns all items belonging to a specific menu category.
 * @param {string} categoryId - The category identifier (e.g., "starters", "mains").
 * @returns {Array<Object>} Array of items in the category, or empty array if category not found.
 */
function getItemsByCategory(categoryId) {
  const category = menu.categories.find(c => c.id === categoryId);
  return category ? category.items : [];
}

module.exports = { menu, getMenu, searchMenu, getPopularItems, getItemById, getItemsByCategory, allItems, getTodaysSoup, SOUP_VARIANTS };
