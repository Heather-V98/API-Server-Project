const express = require("express");
const path = require("path");
const { readJson, updateJson } = require("../utils/fileStore");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const CARDS_PATH = path.join(__dirname, "..", "..", "data", "cards.json");


function filterCards(cards, query) {
  const keys = Object.keys(query || {});
  if (keys.length === 0) return cards;

  return cards.filter((card) => {
    return keys.every((k) => {
      
      if (!(k in card)) return false;

      
      return String(card[k]) === String(query[k]);
    });
  });
}


router.get("/cards/count", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    return res.json({
      successMessage: "Card count retrieved.",
      count: cards.length
    });
  } catch (err) {
    next(err);
  }
});


router.get("/cards/random", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    if (cards.length === 0) {
      const err = new Error("No cards available.");
      err.status = 404;
      throw err;
    }
    const card = cards[Math.floor(Math.random() * cards.length)];
    return res.json({
      successMessage: "Random card retrieved.",
      card
    });
  } catch (err) {
    next(err);
  }
});


router.get("/cards", async (req, res, next) => {
  try {
    const cards = await readJson(CARDS_PATH);
    const results = filterCards(cards, req.query);
    return res.json({
      successMessage: "Cards retrieved.",
      cards: results
    });
  } catch (err) {
    next(err);
  }
});


router.post("/cards/create", requireAuth, async (req, res, next) => {
  try {
    const newCard = req.body || {};

    if (!newCard.cardId) {
      const err = new Error("cardId is required.");
      err.status = 400;
      throw err;
    }
    if (!newCard.name) {
      const err = new Error("name is required.");
      err.status = 400;
      throw err;
    }

    let created;
    await updateJson(CARDS_PATH, async (cards) => {
      const exists = cards.some((c) => c.cardId === newCard.cardId);
      if (exists) {
        const err = new Error(`cardId "${newCard.cardId}" already exists.`);
        err.status = 409;
        throw err;
      }
      created = newCard;
      return [...cards, newCard];
    });

    return res.status(201).json({
      successMessage: "Card created.",
      card: created
    });
  } catch (err) {
    next(err);
  }
});


router.put("/cards/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const patch = req.body || {};

    let updatedCard;

    await updateJson(CARDS_PATH, async (cards) => {
      const idx = cards.findIndex((c) => c.cardId === id);
      if (idx === -1) {
        const err = new Error(`Card "${id}" not found.`);
        err.status = 404;
        throw err;
      }

      
      if (patch.cardId && patch.cardId !== id) {
        const conflict = cards.some((c) => c.cardId === patch.cardId);
        if (conflict) {
          const err = new Error(`cardId "${patch.cardId}" already exists.`);
          err.status = 409;
          throw err;
        }
      }

      const merged = { ...cards[idx], ...patch };
      
      cards[idx] = merged;
      updatedCard = merged;
      return cards;
    });

    return res.json({
      successMessage: "Card updated.",
      card: updatedCard
    });
  } catch (err) {
    next(err);
  }
});

// DELETE 
router.delete("/cards/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    let deleted;

    await updateJson(CARDS_PATH, async (cards) => {
      const idx = cards.findIndex((c) => c.cardId === id);
      if (idx === -1) {
        const err = new Error(`Card "${id}" not found.`);
        err.status = 404;
        throw err;
      }
      deleted = cards[idx];
      const copy = [...cards];
      copy.splice(idx, 1);
      return copy;
    });

    return res.json({
      successMessage: "Card deleted.",
      card: deleted
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
