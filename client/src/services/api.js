import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const startDebate = async (topic, proAI, conAI) => {
  console.log('Making request to:', `${API_BASE_URL}/debate/start`);
  const response = await axios.post(`${API_BASE_URL}/debate/start`, {
    topic,
    proAI,
    conAI
  });
  return response.data;
};

export const continueDebate = async (topic, history, currentAI) => {
  const response = await axios.post(`${API_BASE_URL}/debate/continue`, {
    topic,
    history,
    currentAI
  });
  return response.data;
};

export const generateTitle = async (message) => {
  try {
    console.log('Generating title for message:', message);
    const response = await axios.post(`${API_BASE_URL}/generate-title`, { message });
    console.log('Title generation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Title generation error:', error);
    throw error;
  }
}; 