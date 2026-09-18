const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

// 🚀 FIXED: Destructure authenticateJWT to match your system's exact middleware export names
const { authenticateJWT } = require("../middleware/authMiddleware");

// Protect all following exam routes with your JWT gatekeeper
router.use(authenticateJWT);

router.get("/", examController.getAllExams);
router.get("/:id/questions", examController.getExamQuestions);
router.post("/submit", examController.submitExamResult);

module.exports = router;
