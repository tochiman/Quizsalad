import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function App() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // リダイレクト処理
    window.location.href = 'http://localhost:3000/home';
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          register
        </Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          fullWidth
          required
        />
        <Button 
          type="submit"
          variant="contained" 
          color="primary" 
          size="large" 
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default App;
