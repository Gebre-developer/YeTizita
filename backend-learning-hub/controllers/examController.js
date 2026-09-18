const Exam = require("../models/Exam");
const Question = require("../models/Question");
const UserProgress = require("../models/UserProgress");

// Fetch all available national/school exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({ order: [["year", "DESC"]] });
    return res.status(200).json({ success: true, data: exams });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve specific multiple choice questions for an exam instance
exports.getExamQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { exam_id: req.params.id },
      attributes: { exclude: ["embedding"] }, // Prevent heavy AI vectors from consuming user network bandwidth
    });
    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Process answers, calculate score metrics, and record tracking history
exports.submitExamResult = async (req, res) => {
  try {
    const { examId, score, totalQuestions, weakTopics } = req.body;
    const userId = req.user.id; // Assigned via authMiddleware execution

    const progress = await UserProgress.create({
      user_id: userId,
      exam_id: examId,
      score,
      total_questions: totalQuestions,
      weak_topics: weakTopics || [],
    });

    return res.status(201).json({
      success: true,
      message: "Exam submitted successfully!",
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
