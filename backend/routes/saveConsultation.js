// const express = require("express");
// const router = express.Router();

// const HealthData = require("../models/HealthData");
// const authenticateToken = require("../middleware/authenticateToken");

// router.use(authenticateToken);

// // const saveConsultation = async (req, res) => {
// //   try {
// //     const userId = req.user._id; // Get user ID from JWT token
// //     const consultationData = req.body;
// //     console.log(userId)

// //     // Log the received data
// //     console.log(
// //       "Received consultation data:",
// //       JSON.stringify(consultationData, null, 2)
// //     );

// //     // Update health data document
// //     const updatedHealthData = await HealthData.findOneAndUpdate(
// //       { userId: userId },
// //       {
// //         $push: {
// //           consultationQA: consultationData,
// //         },
// //       },
// //       {
// //         new: true,
// //         runValidators: true,
// //       }
// //     );

// //     if (!updatedHealthData) {
// //       console.log("Health data not found for user:", userId);
// //       return res.status(404).json({
// //         success: false,
// //         message: "Health data not found for this user",
// //       });
// //     }

// //     // Log successful update
// //     console.log("Successfully saved consultation for user:", userId);
// //     console.log(
// //       "Updated health data:",
// //       JSON.stringify(updatedHealthData, null, 2)
// //     );

// //     res.status(200).json({
// //       success: true,
// //       message: "Consultation saved successfully",
// //       data: updatedHealthData,
// //     });
// //   } catch (error) {
// //     console.error("Error in saveConsultation:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error saving consultation",
// //       error: error.message,
// //     });
// //   }
// // };

// // router.post("/", saveConsultation);

// // module.exports = router;





// const express = require("express");
// const router = express.Router();

// const HealthData = require("../models/HealthData");
// const authenticateToken = require("../middleware/authenticateToken");

// // Apply authentication middleware to all routes
// router.use(authenticateToken);
// const saveConsultation = async (req, res) => {
//   // try {
//   //   const userId = req.user._id;
//   //   const consultationData = req.body; // Should be an object with `question` and `answer` fields

//   //   console.log("User ID from token:", userId);
//   //   // console.log("Received consultation data:", JSON.stringify(consultationData, null, 2));

//   //   const updatedHealthData = await HealthData.findByIdAndUpdate(
//   //     userId,
//   //     {
//   //       $push: {
//   //         consultationQA: consultationData,
//   //       },
//   //     },
//   //     {
//   //       new: true,
//   //       runValidators: true,
//   //     }
//   //   );
//   try {
//     // Check both `req.user.id` and `req.user._id` for user ID
//     const userId = req.user.id || req.user._id;
//     const consultationData = req.body;

//     // Log userId and consultation data
//     console.log("User ID from token:", userId);
//     console.log("Received consultation data:", JSON.stringify(consultationData, null, 2));

//     // Update health data document
//     const updatedHealthData = await HealthData.findByIdAndUpdate(
//       req.user?._id,

//       // { userId: userId },
//       {
//         $push:
//         {
//           consultationQA: consultationData}},
//       // {
//       //   $push: {
//       //     consultationQA: consultationData,
//       //   },
//       // },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedHealthData) {
//       console.log("Health data not found for user:", userId);
//       return res.status(404).json({
//         success: false,
//         message: "Health data not found for this user",
//       });
//     }

//     // Log successful update
//     console.log("Successfully saved consultation for user:", userId);
//     console.log("Updated health data:", JSON.stringify(updatedHealthData, null, 2));

//     res.status(200).json({
//       success: true,
//       message: "Consultation saved successfully",
//       data: updatedHealthData,
//     });
//   } catch (error) {
//     console.error("Error in saveConsultation:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error saving consultation",
//       error: error.message,
//     });
//   }
// };

// // Define POST route for saving consultation data
// router.post("/", saveConsultation);

// module.exports = router;



const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const authenticateToken = require('../middleware/authenticateToken');

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.post('/', async (req, res) => {
    try {
        const {
            patientQuery,
            responses,
            timestamp
        } = req.body;

        // Get user ID from authentication token
        const userId = req.user._id || req.user.id;

        // Validate required fields
        if (!patientQuery || !responses || !Array.isArray(responses)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input: patientQuery and responses array are required'
            });
        }

        // Validate responses array structure
        const isValidResponses = responses.every(response =>
            response.question &&
            response.answer &&
            typeof response.question === 'string' &&
            typeof response.answer === 'string'
        );

        if (!isValidResponses) {
            return res.status(400).json({
                success: false,
                error: 'Invalid responses format: each response must have question and answer fields'
            });
        }

        // Create new consultation document
        const consultation = new Consultation({
            userId,
            patientQuery,
            responses,
            timestamp: timestamp || new Date()
        });

        // Save consultation to database
        const savedConsultation = await consultation.save();

        // Log successful save
        console.log('Consultation saved successfully:', {
            consultationId: savedConsultation._id,
            userId: savedConsultation.userId
        });

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Consultation data added successfully!',
            data: {
                consultationId: savedConsultation._id,
                userId: savedConsultation.userId,
                timestamp: savedConsultation.timestamp
            }
        });

    } catch (error) {
        // Log the error
        console.error('Error in consultation route:', error);

        // Check for specific types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: error.message
            });
        }

        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: 'Duplicate consultation entry'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get consultations for the authenticated user
router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const consultations = await Consultation.find({ userId })
            .sort({ timestamp: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            data: consultations
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch consultations'
        });
    }
});

// Get a specific consultation by ID
router.get('/:id', async (req, res) => {
    try {
        const consultation = await Consultation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                error: 'Consultation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        console.error('Error fetching consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch consultation'
        });
    }
});

module.exports = router;