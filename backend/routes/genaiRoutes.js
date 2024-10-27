const express = require('express');
const router = express.Router();
const { getShortPoemResponse } = require('../genai.ts');

// Route to generate a poem based on a given prompt
router.post('/poem', async (req, res) => {
    const { prompt } = req.body;

    try {
        const poem = await getShortPoemResponse(prompt);
        res.status(200).json({ poem });
    } catch (error) {
        console.error("Error generating poem:", error);
        res.status(500).json({ error: `Failed to generate poem: ${error.message}` });
    }
});

module.exports = router;