const express = require("express");
const { createRoom, getRoomDetails } = require("../controllers/roomController");

const router = express.Router();

// Route to create a new room
router.post("/", createRoom);

// Route to fetch details of an existing room
router.get("/:roomId", getRoomDetails);

module.exports = router;
