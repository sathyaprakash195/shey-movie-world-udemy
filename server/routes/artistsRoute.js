const Artist = require("../models/artistsModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

// add new artist
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    await Artist.create(req.body);
    res.json({ message: "Artist added successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// get all artists
router.get("/", authMiddleware, async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.json({ data: artists, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// get artist by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    res.json({ data: artist, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// update artist
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body , { new: true });
    res.json({ message: "Artist updated successfully", success: true , data: updatedArtist });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// delete artist
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Artist.findByIdAndDelete(req.params.id);
        res.json({ message: "Artist deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = router;
