const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const debateRouter = require('./routes/debate');  // Make sure this path is correct
const titleGenerationRouter = require('./routes/titleGeneration');
require('dotenv').config();  // Add this if you're using environment variables

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Make openai available to routes
app.locals.openai = openai;

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is running' });
});

// Use the routes
app.use('/api', titleGenerationRouter);
app.use('/api/debate', debateRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- POST /api/generate-title');
  console.log('- GET /api/generate-title-test');
  console.log('- POST /api/debate/start');
  console.log('- POST /api/debate/continue');
}); 