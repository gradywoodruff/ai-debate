const express = require('express');
const router = express.Router();
const { startDebate, continueDebate } = require('../services/aiService');
const axios = require('axios');

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

router.post('/analyze-topic', async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `Analyze this debate topic: "${topic}"
    
    Please provide the following in JSON format:
    1. A concise, engaging title for the debate (4-8 words)
    2. A brief summary of the pro (supporting) stance (2-3 sentences)
    3. A brief summary of the con (opposing) stance (2-3 sentences)
    
    Format:
    {
      "title": "your title here",
      "proSummary": "pro stance summary",
      "conSummary": "con stance summary"
    }`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [
        { role: "user", content: prompt }
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