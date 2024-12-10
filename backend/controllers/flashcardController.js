const db = require("../config/db");

const executeQuery = (query, values = []) =>
  new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

// Create a new card pack
exports.createCardPack = async (req, res) => {
  const { name, cards } = req.body;
  const userId = req.user.id;

  if (!name || !cards || cards.length === 0) {
    return res.status(400).json({ message: "Name and cards are required" });
  }

  try {
    const currentDate = new Date().toISOString().split("T")[0];

    // Check daily limit for card pack creation
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM card_packs 
      WHERE user_id = ? AND DATE(created_at) = ?
    `;
    const countResult = await executeQuery(countQuery, [userId, currentDate]);
    const createdToday = countResult[0].count;

    if (createdToday >= 20) {
      return res.status(403).json({ message: "Daily limit of 20 flashcard sets reached" });
    }

    // Create card pack
    const cardPackQuery = "INSERT INTO card_packs (name, user_id) VALUES (?, ?)";
    const cardPackResult = await executeQuery(cardPackQuery, [name, userId]);
    const cardPackId = cardPackResult.insertId;

    // Add cards
    const cardPromises = cards.map((card) =>
      executeQuery("INSERT INTO cards (card_pack_id, question, answer) VALUES (?, ?, ?)", [
        cardPackId,
        card.question,
        card.answer,
      ])
    );
    await Promise.all(cardPromises);

    res.status(201).json({ message: "Card pack created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating card pack" });
  }
};

// Get all card packs for a user
// Get all card packs for a user with card counts
exports.getCardPacks = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT 
        cp.id, 
        cp.name, 
        cp.created_at, 
        COUNT(c.id) AS card_count 
      FROM card_packs cp
      LEFT JOIN cards c ON cp.id = c.card_pack_id
      WHERE cp.user_id = ?
      GROUP BY cp.id
      ORDER BY cp.created_at DESC;
    `;
    const results = await executeQuery(query, [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching card packs" });
  }
};

// Delete a card pack
exports.deleteCardPack = async (req, res) => {
  const cardPackId = req.params.id;

  try {
    // Verify ownership
    const packQuery = "SELECT * FROM card_packs WHERE id = ? AND user_id = ?";
    const packResults = await executeQuery(packQuery, [cardPackId]);

    if (packResults.length === 0) {
      return res.status(404).json({ message: "Card pack not found or not authorized to delete" });
    }

    // Delete cards
    const deleteCardsQuery = "DELETE FROM cards WHERE card_pack_id = ?";
    await executeQuery(deleteCardsQuery, [cardPackId]);

    // Delete card pack
    const deletePackQuery = "DELETE FROM card_packs WHERE id = ?";
    await executeQuery(deletePackQuery, [cardPackId]);

    res.status(200).json({ message: "Card pack deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting card pack" });
  }
};

// Get details of a specific card pack
exports.getCardPackDetails = async (req, res) => {
  const cardPackId = req.params.id;

  try {
    const packQuery = "SELECT * FROM card_packs WHERE id = ?";
    const packResults = await executeQuery(packQuery, [cardPackId]);

    if (packResults.length === 0) {
      return res.status(404).json({ message: "Card pack not found" });
    }

    const cardQuery = "SELECT * FROM cards WHERE card_pack_id = ?";
    const cardResults = await executeQuery(cardQuery, [cardPackId]);

    res.status(200).json({ pack: packResults[0], cards: cardResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching card pack details" });
  }
};

// Update a card pack and its cards
exports.updateCardPack = async (req, res) => {
  const cardPackId = req.params.id;
  const { name, cards } = req.body;
  const userId = req.user.id;

  if (!name || !cards || cards.length === 0) {
    return res.status(400).json({ message: "Name and cards are required" });
  }

  try {
    // Begin transaction
    await executeQuery("START TRANSACTION");

    // Verify ownership of the card pack
    const packQuery = "SELECT * FROM card_packs WHERE id = ? AND user_id = ?";
    const packResults = await executeQuery(packQuery, [cardPackId, userId]);

    if (packResults.length === 0) {
      await executeQuery("ROLLBACK");
      return res.status(404).json({ message: "Card pack not found or not authorized to update" });
    }

    // Update card pack name
    const updatePackQuery = "UPDATE card_packs SET name = ? WHERE id = ?";
    await executeQuery(updatePackQuery, [name, cardPackId]);

    // Remove existing cards
    const deleteCardsQuery = "DELETE FROM cards WHERE card_pack_id = ?";
    await executeQuery(deleteCardsQuery, [cardPackId]);

    // Insert new cards
    const cardPromises = cards.map((card) =>
      executeQuery("INSERT INTO cards (card_pack_id, question, answer) VALUES (?, ?, ?)", [
        cardPackId,
        card.question,
        card.answer,
      ])
    );
    await Promise.all(cardPromises);

    // Commit transaction
    await executeQuery("COMMIT");

    res.status(200).json({ message: "Card pack updated successfully" });
  } catch (err) {
    console.error(err);
    await executeQuery("ROLLBACK");
    res.status(500).json({ message: "Error updating card pack" });
  }
};

// Get all cards created by all users
exports.getAllCards = async (req, res) => {
    try {
        const query = `
            SELECT 
                cards.id AS card_pack_id,
                cards.question,
                cards.answer,
                card_packs.name AS card_pack_name,
                users.id AS user_id,
                users.fullName AS user_name
            FROM cards
            JOIN card_packs ON cards.card_pack_id = card_packs.id
            JOIN users ON card_packs.user_id = users.id
        `;
        const results = await executeQuery(query);

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching all cards:", err);
        res.status(500).json({ message: "Error fetching all cards" });
    }
};

// Get all users' card packs and their details
exports.getAllUsersCardPacksDetails = async (req, res) => {
    const cardPackId = req.params.id;

  try {
    const packQuery = "SELECT * FROM card_packs WHERE id = ?";
    const packResults = await executeQuery(packQuery, [cardPackId]);

    if (packResults.length === 0) {
      return res.status(404).json({ message: "Card pack not found" });
    }

    const cardQuery = "SELECT * FROM cards WHERE card_pack_id = ?";
    const cardResults = await executeQuery(cardQuery, [cardPackId]);

    res.status(200).json({ pack: packResults[0], cards: cardResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching card pack details" });
  }
  };
  