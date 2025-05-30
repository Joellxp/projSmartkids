const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:studentId/presence-history", authMiddleware, studentController.getStudentPresenceHistory);

module.exports = router;