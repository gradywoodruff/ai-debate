import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';

function ChatInterface({ messages, loading, onContinue, proAI, conAI }) {
  console.log('ChatInterface rendering with messages:', messages);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      height: '70vh'  // Set a fixed height
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        flexGrow: 1,  // Take up available space
        overflowY: 'auto', 
        p: 2,
        minHeight: 0  // Important for flex container
      }}>
        {messages.map((message, index) => {
          console.log('Rendering message:', message, 'at index:', index);
          return (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                alignSelf: message.role === 'pro' ? 'flex-start' : 'flex-end',
                backgroundColor: message.role === 'pro' ? '#e3f2fd' : '#fce4ec',
                wordBreak: 'break-word'  // Ensure long text wraps properly
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                {message.ai.toUpperCase()} ({message.role.toUpperCase()})
              </Typography>
              <Typography>{message.content}</Typography>
            </Paper>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onContinue}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Continue Debate'
        )}
      </Button>
    </Box>
  );
}

export default ChatInterface; 