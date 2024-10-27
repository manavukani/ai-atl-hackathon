const express = require("express");
const router = express.Router();

const HealthData = require("../models/HealthData");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

const saveConsultation = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from JWT token
    const consultationData = req.body;

    // Log the received data
    console.log(
      "Received consultation data:",
      JSON.stringify(consultationData, null, 2)
    );

    // Update health data document
    const updatedHealthData = await HealthData.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          consultationQA: consultationData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedHealthData) {
      console.log("Health data not found for user:", userId);
      return res.status(404).json({
        success: false,
        message: "Health data not found for this user",
      });
    }

    // Log successful update
    console.log("Successfully saved consultation for user:", userId);
    console.log(
      "Updated health data:",
      JSON.stringify(updatedHealthData, null, 2)
    );

    res.status(200).json({
      success: true,
      message: "Consultation saved successfully",
      data: updatedHealthData,
    });
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    res.status(500).json({
      success: false,
      message: "Error saving consultation",
      error: error.message,
    });
  }
};

router.post("/", saveConsultation);

module.exports = router;
