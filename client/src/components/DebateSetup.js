import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

function DebateSetup({ onStart }) {
  const [topic, setTopic] = useState('');
  const [proAI, setProAI] = useState('claude');
  const [conAI, setConAI] = useState('gpt');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ topic, proAI, conAI });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        Set Up AI Debate
      </Typography>
      
      <TextField
        required
        label="Debate Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Pro Side AI</InputLabel>
        <Select
          value={proAI}
          label="Pro Side AI"
          onChange={(e) => setProAI(e.target.value)}
        >
          <MenuItem value="claude">Claude</MenuItem>
          <MenuItem value="gpt">GPT-4</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Con Side AI</InputLabel>
        <Select
          value={conAI}
          label="Con Side AI"
          onChange={(e) => setConAI(e.target.value)}
        >
          <MenuItem value="claude">Claude</MenuItem>
          <MenuItem value="gpt">GPT-4</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={!topic}
      >
        Start Debate
      </Button>
    </Box>
  );
}

export default DebateSetup; 