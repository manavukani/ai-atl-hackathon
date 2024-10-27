// routes/healthDataRoutes.js
const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const authenticateToken = require('../middleware/authenticateToken');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Route to add health data
router.post('/', async (req, res) => {
    const { diabetes, diabetesType, bloodPressure, age, labReports } = req.body;

    const healthData = new HealthData({
        userId: req.user.id,
        username: req.user.username,
        diabetes,
        diabetesType,
        bloodPressure,
        age,
        labReports,
    });

    try {
        await healthData.save();
        res.status(201).json({ message: 'Health data added successfully!' });
    } catch (error) {
        console.error("Error adding health data:", error);
        res.status(500).json({ error: `Failed to add health data: ${error.message}` });
    }
});

// Route to get health data for the logged-in user
router.get('/', async (req, res) => {
    try {
        const healthData = await HealthData.find({ userId: req.user.id });
        res.status(200).json(healthData);
    } catch (error) {
        console.error("Error fetching health data:", error);
        res.status(500).json({ error: `Failed to fetch health data: ${error.message}` });
    }
});

// Route to get all health data (accessible only by doctor)
router.get('/all', async (req, res) => {
    try {
        // Check if the user is doctor
        if (req.user.username !== 'drjohn') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const healthData = await HealthData.find();
        res.status(200).json(healthData);
    } catch (error) {
        console.error("Error fetching all health data:", error);
        res.status(500).json({ error: `Failed to fetch health data: ${error.message}` });
    }
});

module.exports = router;
