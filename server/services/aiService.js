const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');
const DEBATE_PROMPTS = require('../constants/prompts');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_SECRET_KEY,
});

const startDebate = async (topic, currentAI, firstSpeaker) => {
  try {
    console.log('Making API request with:', { topic, currentAI, firstSpeaker });
    
    if (currentAI === 'gpt') {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [
          { role: "user", content: DEBATE_PROMPTS.startDebate(topic, firstSpeaker) }
        ],
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        message: response.data.choices[0].message.content,
        ai: currentAI
      };
    } else {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          { role: "user", content: DEBATE_PROMPTS.startDebate(topic, firstSpeaker) }
        ],
      });

      return {
        message: response.content[0].text,
        ai: currentAI
      };
    }
  } catch (error) {
    console.error('Error in startDebate:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

const continueDebate = async (topic, history, currentAI) => {
  try {
    const lastDebateMessage = [...history].reverse().find(m => m.role !== 'moderator');
    const nextRole = lastDebateMessage?.role === 'pro' ? 'con' : 'pro';

    if (currentAI === 'gpt') {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [
          { role: "user", content: DEBATE_PROMPTS.continueDebate(topic, nextRole, history) }
        ],
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        message: response.data.choices[0].message.content,
        ai: currentAI
      };
    } else {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          { role: "user", content: DEBATE_PROMPTS.continueDebate(topic, nextRole, history) }
        ],
      });

      return {
        message: response.content[0].text,
        ai: currentAI
      };
    }
  } catch (error) {
    console.error('Error in continueDebate:', error);
    throw error;
  }
};

module.exports = {
  startDebate,
  continueDebate
}; 