const express = require('express');
const router = express.Router();
const { startDebate, continueDebate } = require('../services/aiService');

router.post('/start', async (req, res) => {
  try {
    const { topic, proAI, conAI } = req.body;
    const response = await startDebate(topic, proAI, conAI);
    res.json(response);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/continue', async (req, res) => {
  try {
    const { topic, history, currentAI } = req.body;
    console.log('Received request:', { topic, currentAI, historyLength: history.length });
    const response = await continueDebate(topic, history, currentAI);
    res.json(response);
  } catch (error) {
    console.error('Server error in /continue:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

module.exports = router; 