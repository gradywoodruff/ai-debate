import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import DebateApp from './components/DebateApp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DebateApp />
    </ThemeProvider>
  );
}

export default App; 