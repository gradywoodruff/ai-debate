const express = require('express');
const router = express.Router();
const axios = require('axios');

// Add a test endpoint
router.get('/generate-title-test', (req, res) => {
  res.json({ message: 'Title generation route is working' });
});

router.post('/generate-title', async (req, res) => {
  try {
    const { message } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return res.status(500).json({ error: 'OpenAI configuration error' });
    }

    console.log('Received message:', message);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a title generator. Generate a short, engaging title (4-8 words) that captures the essence of this debate opening message. The title should be neutral and not favor either side."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const title = response.data.choices[0].message.content.trim();
    console.log('Generated title:', title);
    res.json({ title });
  } catch (error) {
    console.error('Error in generate-title:', error);
    res.status(500).json({ 
      error: 'Failed to generate title', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

module.exports = router; 