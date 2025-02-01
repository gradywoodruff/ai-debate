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
                   Your role is to provide thoughtful arguments while addressing points made by your opponent.
                   Keep responses under 150 words.`;
  
  if (history.length === 0) {
    return `${context}\n\nMake your opening argument.`;
  }
  
  // Clearly label each message in the conversation history with roles
  const formattedHistory = history.map((msg, index) => {
    const role = index % 2 === 0 ? 'Supporter' : 'Opponent';
    return `${role} (${msg.ai}): ${msg.content}`;
  }).join('\n\n');
  
  return `${context}\n\n
Current Debate History:
${formattedHistory}\n\n
You are the ${isProSide ? 'Supporter' : 'Opponent'}. Provide your next argument, addressing the points made in the previous messages.`;
};

// Rate limiter implementation
class RateLimiter {
  constructor(tokensPerMinute) {
    this.tokens = tokensPerMinute;
    this.maxTokens = tokensPerMinute;
    this.lastRefill = Date.now();
    this.tokensPerMs = tokensPerMinute / (60 * 1000); // tokens per millisecond
  }

  async getToken() {
    this.refillTokens();
    if (this.tokens < 1) {
      const msToWait = (1 - this.tokens) / this.tokensPerMs;
      console.log(`Rate limit reached, waiting ${Math.ceil(msToWait / 1000)} seconds`);
      await delay(msToWait);
      this.refillTokens();
    }
    this.tokens -= 1;
    return true;
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + timePassed * this.tokensPerMs
    );
    this.lastRefill = now;
  }
}

// Create rate limiters for each service
const gptLimiter = new RateLimiter(50); // 50 requests per minute
const claudeLimiter = new RateLimiter(50);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callClaude = async (prompt, retryCount = 0) => {
  const MAX_RETRIES = 3;
  try {
    await claudeLimiter.getToken(); // Wait for rate limit
    console.log('Calling Claude with prompt:', prompt);
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });
    
    console.log('Claude response received');
    const fullResponse = response.content.map(part => part.text).join('');
    return fullResponse;
  } catch (error) {
    console.error('Claude API call failed:', error);
    
    if (error.status === 429 && retryCount < MAX_RETRIES) {
      const retryAfter = 5000 * (retryCount + 1);
      console.log(`Rate limited. Waiting ${retryAfter}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);
      await delay(retryAfter);
      return callClaude(prompt, retryCount + 1);
    }
    
    throw error;
  }
};

const callGPT = async (prompt, retryCount = 0) => {
  const MAX_RETRIES = 3;
  try {
    await gptLimiter.getToken(); // Wait for rate limit
    console.log('Calling GPT with prompt:', prompt);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GPT response status:', response.status);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('GPT API call failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '5') * 1000;
      console.log(`Rate limited. Waiting ${retryAfter}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);
      await delay(retryAfter);
      return callGPT(prompt, retryCount + 1);
    }
    
    throw error;
  }
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