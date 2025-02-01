import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/debate';

export const startDebate = async (topic, proAI, conAI) => {
  console.log('Making request to:', `${API_BASE_URL}/start`);
  const response = await axios.post(`${API_BASE_URL}/start`, {
    topic,
    proAI,
    conAI
  });
  return response.data;
};

export const continueDebate = async (topic, history, currentAI) => {
  const response = await axios.post(`${API_BASE_URL}/continue`, {
    topic,
    history,
    currentAI
  });
  return response.data;
}; 