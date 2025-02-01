import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const startDebate = async (topic, currentAI, firstSpeaker) => {
  console.log('Making request to:', `${API_BASE_URL}/debate/start`);
  const response = await axios.post(`${API_BASE_URL}/debate/start`, {
    topic,
    currentAI,
    firstSpeaker
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

export const analyzeTopic = async (topic) => {
  const response = await axios.post(`${API_BASE_URL}/debate/analyze-topic`, { topic });
  return response.data;
}; 