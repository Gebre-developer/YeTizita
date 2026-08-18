const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// POST Endpoint: Enroll a student into a specific course program
router.post(
  "/courses/:id/enroll",
  authenticateJWT,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const courseId = req.params.id;
      const studentId = req.user.id; // Pulled securely from your authenticated token payload!

      // Verify course row target exists in database schema
      const courseExists = await Course.findByPk(courseId);
      if (!courseExists)
        return res
          .status(404)
          .json({ success: false, message: "Course profile not found" });

      // Ensure the student isn't already assigned to an enrollment row record
      const alreadyEnrolled = await Enrollment.findOne({
        where: { studentId, courseId },
      });
      if (alreadyEnrolled)
        return res.status(400).json({
          success: false,
          message: "You are already registered in this course.",
        });

      // Create a new enrollment entry in MySQL database tables
      await Enrollment.create({ studentId, courseId });

      return res.status(201).json({
        success: true,
        message:
          "Enrollment registration processing pipeline completed successfully.",
      });
    } catch (error) {
      console.error("Enrollment pipeline registration failure:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server environment schema execution error.",
      });
    }
  },
);
// GET Endpoint: Fetch only courses the current student user has actively enrolled into
router.get(
  "/student/my-courses",
  authenticateJWT,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const studentId = req.user.id;

      // Fetch all enrollment row keys mapping to the logging student profile identifier parameters
      const studentEnrollments = await Enrollment.findAll({
        where: { studentId },
      });
      const enrolledIds = studentEnrollments.map((e) => e.courseId);

      // Retrieve full information data blocks for matching items collection rows
      const activeCourses = await Course.findAll({
        where: { id: enrolledIds },
      });

      // Append accessibility configurations flag parameters mapping cleanly to expected frontend layouts
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

      return res.status(200).json({
        success: true,
        data: catalogData,
      });
    } catch (error) {
      console.error("Fetch authorized catalog streams error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server architecture database error.",
      });
    }
  },
);

module.exports = router;
