const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// POST: Enroll a student into a specific course
router.post(
  "/courses/:id/enroll",
  authenticateJWT,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;

      const courseExists = await Course.findByPk(courseId);
      if (!courseExists) {
        return res
          .status(404)
          .json({ success: false, message: "Course profile not found" });
      }

      const alreadyEnrolled = await Enrollment.findOne({
        where: { userId, courseId },
      });
      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "You are already registered in this course.",
        });
      }

      await Enrollment.create({ userId, courseId });
      return res
        .status(201)
        .json({ success: true, message: "Enrollment successful." });
    } catch (error) {
      console.error("Enrollment pipeline failure:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
);

// GET: Fetch courses the current student user has actively enrolled into
router.get(
  "/student/my-courses",
  authenticateJWT,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const studentEnrollments = await Enrollment.findAll({
        where: { userId },
      });
      const enrolledIds = studentEnrollments.map((e) => e.courseId);

      const activeCourses = await Course.findAll({
        where: { id: enrolledIds },
        include: [{ model: User, as: "instructor", attributes: ["username"] }],
      });

      const catalogData = activeCourses.map((course) => {
        const matchRecord = studentEnrollments.find(
          (e) => e.courseId === course.id,
        );
        return {
          ...course.toJSON(),
          isStudentEnrolled: true,
          completedLessons: matchRecord ? matchRecord.completedLessons : [],
        };
      });

      return res.status(200).json({ success: true, data: catalogData });
    } catch (error) {
      console.error("Fetch authorized catalog streams error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
);

// POST: Mark a lesson as complete to track learner progress
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  authenticateJWT,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user.id;

      const enrollment = await Enrollment.findOne({
        where: { userId, courseId },
      });
      if (!enrollment) {
        return res
          .status(404)
          .json({ success: false, message: "Enrollment record not found." });
      }

      let completedList = Array.isArray(enrollment.completedLessons)
        ? enrollment.completedLessons
        : JSON.parse(enrollment.completedLessons || "[]");

      const numericLessonId = Number(lessonId);

      if (!completedList.includes(numericLessonId)) {
        completedList.push(numericLessonId);
        enrollment.completedLessons = completedList;
        await enrollment.save();
      }

      return res.status(200).json({
        success: true,
        message: "Lesson progress saved successfully.",
        data: enrollment.completedLessons,
      });
    } catch (error) {
      console.error("Progress tracking failure:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
);

module.exports = router;
