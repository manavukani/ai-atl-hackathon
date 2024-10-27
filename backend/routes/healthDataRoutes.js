// // routes/healthDataRoutes.js
// const express = require('express');
// const router = express.Router();
// const HealthData = require('../models/HealthData');
// const authenticateToken = require('../middleware/authenticateToken');

// // Apply authentication middleware to all routes
// router.use(authenticateToken);
// router.patch('/consultation/:userId', authenticateToken, async (req, res) => {
//     const { userId } = req.params;
//     const { consultationQA } = req.body;

//     try {
//         const healthData = await HealthData.findOne({ userId: userId });
//         if (!healthData) {
//             return res.status(404).json({ message: 'User health data not found.' });
//         }

//         // Append new Q&A data
//         healthData.consultationQA.push(...consultationQA);
//         await healthData.save();

//         res.status(200).json({ message: 'Consultation data appended successfully.' });
//     } catch (error) {
//         console.error("Error appending consultation data:", error);
//         res.status(500).json({ error: `Failed to append consultation data: ${error.message}` });
//     }
// });

// // Route to add health data
// router.post('/', async (req, res) => {
//     const {
//         fullName, dateOfBirth, gender, maritalStatus, address, contactNumber, email, emergencyContactName, emergencyContactNumber,
//         occupation, physicalActivityLevel, dietaryPreferences, alcoholConsumption, smokingHabits, sleepPatterns,
//         previousSurgeries, knownAllergies, medicationsCurrentlyTaking,
//         height, weight, bloodGroup, bloodPressureSystolic, bloodPressureDiastolic, heartRate,
//         chronicPain, recentSymptoms, recentWeightChange, appetiteLevel,
//         goals, preferredCommunicationChannel
//     } = req.body;

//     const healthData = new HealthData({
//         userId: req.user.id,
//         fullName,
//         dateOfBirth,
//         gender,
//         maritalStatus,
//         address,
//         contactNumber,
//         email,
//         emergencyContact: { name: emergencyContactName, number: emergencyContactNumber },
//         occupation,
//         physicalActivityLevel,
//         dietaryPreferences,
//         alcoholConsumption,
//         smokingHabits,
//         sleepPatterns,
//         medicalHistory: {
//             previousSurgeries,
//             knownAllergies,
//             medicationsCurrentlyTaking,
//             familyHistory: req.body.familyHistory, // Since this might be an array, handle directly from body
//             chronicConditions: req.body.chronicConditions // Handle directly from body if array
//         },
//         basicHealthData: {
//             height,
//             weight,
//             bloodGroup,
//             bloodPressure: { systolic: bloodPressureSystolic, diastolic: bloodPressureDiastolic },
//             heartRate
//         },
//         recentHealthSymptoms: {
//             chronicPain,
//             symptoms: recentSymptoms, // Assuming array
//             weightChange: recentWeightChange,
//             appetiteLevel
//         },
//         healthGoals: {
//             goals, // Assuming array
//             preferredCommunicationChannel
//         }
//     });

//     try {
//         await healthData.save();
//         res.status(201).json({ message: 'Health data added successfully!' });
//     } catch (error) {
//         console.error("Error adding health data:", error);
//         res.status(500).json({ error: `Failed to add health data: ${error.message}` });
//     }
// });
// router.get('/all', async (req, res) => {
//     console.log('Received GET request to /api/health-data/all');
//     try {
//       // Check if the user is a doctor
//       if (req.user.username !== 'drjohn') {
//         return res.status(403).json({ error: 'Access denied' });
//       }
  
//       // Fetch all health data from the database
//       const healthData = await HealthData.find();
  
//       res.status(200).json(healthData);
//     } catch (error) {
//       console.error('Error fetching patients data:', error);
//       res.status(500).json({ error: 'Failed to fetch patients data' });
//     }
//   });

// module.exports = router;

// // The GET routes remain unchanged but ensure they properly handle the expanded data structure if necessary.


// routes/healthDataRoutes.js
const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const authenticateToken = require('../middleware/authenticateToken');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// // New route for saving consultation data
// router.post('/consultation', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const consultationData = req.body;

//         console.log('Received consultation data:', JSON.stringify(consultationData, null, 2));

//         const healthData = await HealthData.findOne({ userId: userId });
//         if (!healthData) {
//             console.log('Health data not found for user:', userId);
//             return res.status(404).json({
//                 success: false,
//                 message: 'User health data not found.'
//             });
//         }

//         // Add consultation data to consultationQA array
//         healthData.consultationQA.push({
//             patientQuery: consultationData.patientQuery,
//             responses: consultationData.responses,
//             timestamp: consultationData.timestamp || new Date()
//         });

//         await healthData.save();

//         console.log('Successfully saved consultation for user:', userId);

//         res.status(200).json({
//             success: true,
//             message: 'Consultation data saved successfully',
//             data: healthData
//         });
//     } catch (error) {
//         console.error("Error saving consultation data:", error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to save consultation data',
//             error: error.message
//         });
//     }
// });

// // Existing route to patch consultation data
// router.patch('/consultation/:userId', authenticateToken, async (req, res) => {
//     const { userId } = req.params;
//     const { consultationQA } = req.body;

//     try {
//         const healthData = await HealthData.findOne({ userId: userId });
//         if (!healthData) {
//             return res.status(404).json({ message: 'User health data not found.' });
//         }

//         // Append new Q&A data
//         healthData.consultationQA.push(...consultationQA);
//         await healthData.save();

//         res.status(200).json({ message: 'Consultation data appended successfully.' });
//     } catch (error) {
//         console.error("Error appending consultation data:", error);
//         res.status(500).json({ error: `Failed to append consultation data: ${error.message}` });
//     }
// });



// Route to add health data
router.post('/', async (req, res) => {
    const {
        fullName, dateOfBirth, gender, maritalStatus, address, contactNumber, email, emergencyContactName, emergencyContactNumber,
        occupation, physicalActivityLevel, dietaryPreferences, alcoholConsumption, smokingHabits, sleepPatterns,
        previousSurgeries, knownAllergies, medicationsCurrentlyTaking,
        height, weight, bloodGroup, bloodPressureSystolic, bloodPressureDiastolic, heartRate,
        chronicPain, recentSymptoms, recentWeightChange, appetiteLevel,
        goals, preferredCommunicationChannel
    } = req.body;

    const healthData = new HealthData({
        userId: req.user.id,
        fullName,
        dateOfBirth,
        gender,
        maritalStatus,
        address,
        contactNumber,
        email,
        emergencyContact: { name: emergencyContactName, number: emergencyContactNumber },
        occupation,
        physicalActivityLevel,
        dietaryPreferences,
        alcoholConsumption,
        smokingHabits,
        sleepPatterns,
        medicalHistory: {
            previousSurgeries,
            knownAllergies,
            medicationsCurrentlyTaking,
            familyHistory: req.body.familyHistory,
            chronicConditions: req.body.chronicConditions
        },
        basicHealthData: {
            height,
            weight,
            bloodGroup,
            bloodPressure: { systolic: bloodPressureSystolic, diastolic: bloodPressureDiastolic },
            heartRate
        },
        recentHealthSymptoms: {
            chronicPain,
            symptoms: recentSymptoms,
            weightChange: recentWeightChange,
            appetiteLevel
        },
        healthGoals: {
            goals,
            preferredCommunicationChannel
        }
    });

    try {
        await healthData.save();
        res.status(201).json({ message: 'Health data added successfully!' });
    } catch (error) {
        console.error("Error adding health data:", error);
        res.status(500).json({ error: `Failed to add health data: ${error.message}` });
    }
});

// Route to get all health data (doctor access only)
router.get('/all', async (req, res) => {
    console.log('Received GET request to /api/health-data/all');
    try {
        // Check if the user is a doctor
        if (req.user.username !== 'drjohn') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Fetch all health data from the database
        const healthData = await HealthData.find();

        res.status(200).json(healthData);
    } catch (error) {
        console.error('Error fetching patients data:', error);
        res.status(500).json({ error: 'Failed to fetch patients data' });
    }
});

// // Route to get user's own health data
// router.get('/my-data', async (req, res) => {
//     try {
//         const healthData = await HealthData.findOne({ userId: req.user.id });
//         if (!healthData) {
//             return res.status(404).json({ message: 'Health data not found.' });
//         }
//         res.status(200).json(healthData);
//     } catch (error) {
//         console.error('Error fetching health data:', error);
//         res.status(500).json({ error: 'Failed to fetch health data' });
//     }
// });

module.exports = router;