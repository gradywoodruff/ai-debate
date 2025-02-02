const express = require('express');
const router = express.Router();
const { startDebate, continueDebate } = require('../services/aiService');
const axios = require('axios');
const DEBATE_PROMPTS = require('../constants/prompts');

router.post('/start', async (req, res) => {
  try {
    const { topic, currentAI, firstSpeaker } = req.body;
    console.log('Starting debate with:', { topic, currentAI, firstSpeaker });
    
    const response = await startDebate(topic, currentAI, firstSpeaker);
    res.json(response);
  } catch (error) {
    console.error('Server error in /start:', error.response?.data || error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
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

router.post('/analyze-topic', async (req, res) => {
  try {
    const { topic } = req.body;
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [
        { role: "user", content: DEBATE_PROMPTS.analyze(topic) }
      ],
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing topic:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 