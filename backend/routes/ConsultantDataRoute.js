// const express = require('express');
// const router = express.Router();
// const ConsData=require('../models/Consultation');
// const authenticateToken = require('../middleware/authenticateToken');

// // Apply authentication middleware to all routes
// router.use(authenticateToken);


// router.post('/', async (req, res) => {
//     const {
//         patientQuery,
//         responses
//     } = req.body;

//     // Validate required fields
//     if (!patientQuery || !responses || !Array.isArray(responses)) {
//         return res.status(400).json({ 
//             error: 'Invalid input: patientQuery and responses array are required' 
//         });
//     }

//     // Validate responses array structure
//     const isValidResponses = responses.every(response => 
//         response.question && 
//         response.answer && 
//         typeof response.question === 'string' && 
//         typeof response.answer === 'string'
//     );

//     if (!isValidResponses) {
//         return res.status(400).json({ 
//             error: 'Invalid responses format: each response must have question and answer fields' 
//         });
//     }

//     const consultation = new ConsData({
//         userId: req.user._id, // From authentication middleware
//         patientQuery,
//         responses,
//         timestamp: new Date()
//     });

//     try {
//         await consultation.save();
//         res.status(201).json({ 
//             message: 'Consultation data added successfully!',
//             consultationId: consultation._id,
//             user: consultation.userId
//         });
//     } catch (error) {
//         console.error("Error adding consultation data:", error);
//         res.status(500).json({ 
//             error: `Failed to add consultation data: ${error.message}` 
//         });
//     }
// });


// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const ConsData = require('../models/Consultation');
// const authenticateToken = require('../middleware/authenticateToken');

// // Apply authentication middleware to all routes
// router.use(authenticateToken);

// router.post('/', async (req, res) => {
//     const { patientQuery, responses } = req.body;

//     // Log the req.user to ensure userId is available from the middleware
//     console.log("User info from token:", req.user);

//     // Check if userId is available
//     if (!req.user || !req.user._id) {
//         return res.status(400).json({ error: 'User ID is missing from the request.' });
//     }

//     // Validate required fields
//     if (!patientQuery || !responses || !Array.isArray(responses)) {
//         return res.status(400).json({ 
//             error: 'Invalid input: patientQuery and responses array are required' 
//         });
//     }

//     // Validate responses array structure
//     const isValidResponses = responses.every(response => 
//         response.question && 
//         response.answer && 
//         typeof response.question === 'string' && 
//         typeof response.answer === 'string'
//     );

//     if (!isValidResponses) {
//         return res.status(400).json({ 
//             error: 'Invalid responses format: each response must have question and answer fields' 
//         });
//     }

//     // Create consultation data with the user ID from the token
//     const consultation = new ConsData({
//         userId: req.user._id, // userId from authenticateToken middleware
//         patientQuery,
//         responses,
//         timestamp: new Date()
//     });

//     try {
//         const savedConsultation = await consultation.save();
//         console.log("Consultation saved successfully:", savedConsultation);

//         res.status(201).json({ 
//             message: 'Consultation data added successfully!',
//             consultationId: savedConsultation._id,
//             user: savedConsultation.userId
//         });
//     } catch (error) {
//         console.error("Error adding consultation data:", error);

//         res.status(500).json({ 
//             error: `Failed to add consultation data: ${error.message}` 
//         });
//     }
// });

// module.exports = router;


// routeconsultant.js
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const authenticateToken = require('../middleware/authenticateToken');

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.post('/', async (req, res) => {
    const { patientQuery, responses } = req.body;

    // Log the req.user to ensure userId is available from the middleware
    console.log("Authenticated user ID:", req.user._id);

    if (!req.user || !req.user._id) {
        return res.status(400).json({ error: 'User ID is missing from the request.' });
    }

    // Validate required fields
    if (!patientQuery || !responses || !Array.isArray(responses)) {
        return res.status(400).json({
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
            error: 'Invalid responses format: each response must have question and answer fields'
        });
    }

    // Create consultation data with the user ID from the token
    const consultation = new Consultation({
        userId: req.user._id, // Ensure this maps to the authenticated user ID
        patientQuery,
        responses,
        timestamp: new Date()
    });

    try {
        const savedConsultation = await consultation.save();
        console.log("Consultation saved successfully:", savedConsultation);

        res.status(201).json({
            message: 'Consultation data added successfully!',
            consultationId: savedConsultation._id,
            user: savedConsultation.userId
        });
    } catch (error) {
        console.error("Error adding consultation data:", error);

        res.status(500).json({
            error: `Failed to add consultation data: ${error.message}`
        });
    }
});

// Get consultations for the authenticated user
// router.get('/', async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const consultations = await Consultation.find({ userId })
//             .sort({ timestamp: -1 }); // Sort by newest first

//         res.status(200).json({
//             success: true,
//             data: consultations
//         });
//     } catch (error) {
//         console.error('Error fetching consultations:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Failed to fetch consultations'
//         });
//     }
// });

// routes/consultations.js

// Route to get consultations by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(req.params)
  try {
    const consultations = await Consultation.find({ userId });
    if (!consultations) {
      return res.status(404).json({ message: 'No consultations found for this user' });
    }
    res.status(200).json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
