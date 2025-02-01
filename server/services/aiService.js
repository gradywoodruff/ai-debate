const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');

const ANTHROPIC_SECRET_KEY = process.env.ANTHROPIC_SECRET_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_SECRET_KEY
});

const generatePrompt = (topic, history, isProSide) => {
  const stance = isProSide ? 'supporting' : 'opposing';
  const context = `You are participating in a debate ${stance} the following topic: "${topic}". 
                   Respond in a clear, logical manner. Keep responses under 150 words.`;
  
  if (history.length === 0) {
    return `${context}\n\nMake your opening argument.`;
  }
  
  return `${context}\n\nPrevious exchanges:\n${history.map(msg => 
    `${msg.ai}: ${msg.content}`).join('\n')}\n\nProvide your next argument.`;
};

const callClaude = async (prompt) => {
  try {
    console.log('Calling Claude with prompt:', prompt);
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 150,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });
    console.log('Claude response:', response);
    return response.content[0].text;
  } catch (error) {
    console.error('Claude API error:', {
      status: error.status,
      data: error.error,
      message: error.message
    });
    throw new Error(`Claude API error: ${error.message}`);
  }
};

const callGPT = async (prompt) => {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150
  }, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  });
  return response.data.choices[0].message.content;
};

const startDebate = async (topic, proAI, conAI) => {
  const prompt = generatePrompt(topic, [], true);
  const response = await (proAI === 'claude' ? callClaude(prompt) : callGPT(prompt));
  
  return {
    message: response,
    ai: proAI,
    role: 'pro'
  };
};

const continueDebate = async (topic, history, currentAI) => {
  try {
    const isProSide = history.length % 2 === 0;
    console.log('Continue debate:', {
      currentAI,
      isProSide,
      historyLength: history.length,
      topic
    });

    const prompt = generatePrompt(topic, history, isProSide);
    console.log('Generated prompt:', prompt);

    const response = await (currentAI === 'claude' ? callClaude(prompt) : callGPT(prompt));
    console.log('AI Response:', response);
    
    const result = {
      message: response,
      ai: currentAI,
      role: isProSide ? 'pro' : 'con'
    };
    console.log('Returning result:', result);
    return result;
  } catch (error) {
    console.error('Error in continueDebate:', error);
    throw error;
  }
};

module.exports = {
  startDebate,
  continueDebate
}; 