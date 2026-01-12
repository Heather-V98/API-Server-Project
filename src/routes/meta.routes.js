const express = require("express");
const path = require("path");
const { readJson } = require("../utils/fileStore");

const router = express.Router();
const CARDS_PATH = path.join(__dirname, "..", "..", "data", "cards.json");

function uniqueList(cards, field) {
  const set = new Set();
  for (const c of cards) {
    if (c[field] !== undefined && c[field] !== null) set.add(String(c[field]));
  }
  return Array.from(set).sort();
}

router.get("/sets", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    return res.json({
      successMessage: "Sets retrieved.",
      sets: uniqueList(cards, "set")
    });
  } catch (err) {
    next(err);
  }
});

router.get("/types", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    return res.json({
      successMessage: "Types retrieved.",
      types: uniqueList(cards, "type")
    });
  } catch (err) {
    next(err);
  }
});

router.get("/rarities", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    return res.json({
      successMessage: "Rarities retrieved.",
      rarities: uniqueList(cards, "rarity")
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
