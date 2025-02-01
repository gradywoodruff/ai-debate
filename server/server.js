require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/debate', require('./routes/debateRoutes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 