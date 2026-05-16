const express = require("express");
const {
  getMenu,
  searchMenu,
  getPopularItems,
  getItemById,
} = require("../data/menu");

const router = express.Router();

/**
 * Returns the full restaurant menu with categories and today's soup enrichment.
 * @route GET /api/menu
 */
router.get("/", (req, res) => {
  res.json({ success: true, data: getMenu() });
});

/**
 * Searches menu items by a query string against names, descriptions, and tags.
 * @route GET /api/menu/search?q={query}
 */
router.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Query parameter 'q' is required" });
  }
  const results = searchMenu(q.trim());
  res.json({ success: true, data: results });
});

/**
 * Returns all menu items tagged as popular.
 * @route GET /api/menu/popular
 */
router.get("/popular", (req, res) => {
  res.json({ success: true, data: getPopularItems() });
});

/**
 * Returns a single menu item by its id, or 404 if not found.
 * @route GET /api/menu/:id
 */
router.get("/:id", (req, res) => {
  const item = getItemById(req.params.id);
  if (!item) {
    return res
      .status(404)
      .json({ success: false, error: "Item not found" });
  }
  res.json({ success: true, data: item });
});

module.exports = router;
