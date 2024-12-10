const express = require("express");
const { 
    createCardPack, 
    getCardPacks, 
    deleteCardPack,
    getCardPackDetails, 
    updateCardPack,
    getAllUsersCardPacksDetails, // Import the new function
    getAllCards
} = require("../controllers/flashcardController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new card pack
router.post("/create", verifyToken, createCardPack);

// Get all card packs for the user
router.get("/packs", verifyToken, getCardPacks);

// Get details of a specific card pack
router.get("/packs/:id", verifyToken, getCardPackDetails);

 // Delete a specific card pack
 router.delete("/packs/:id", verifyToken, async (req, res) => {
    try {
        const cardPackId = req.params.id;
        const result = await CardPackModel.findByIdAndDelete(cardPackId);
        if (!result) {
            return res.status(404).json({ message: "Card pack not found" });
        }
        res.status(200).json({ message: "Card pack deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// Update a specific card pack
router.put("/packs/:id", verifyToken, updateCardPack);

// Get all cards created by all users
router.get("/all-cards", verifyToken, getAllCards);

// Get all users' card packs details
router.get("/all-users-packs/:id", verifyToken, getAllUsersCardPacksDetails);

module.exports = router;
