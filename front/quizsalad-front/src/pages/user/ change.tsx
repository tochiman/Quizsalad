import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
} from '@mui/material';

const UserProfile = () => {
  // ユーザー情報の初期値とステート設定
  const [username, setUsername] = useState(''); // ユーザー名
  const [email, setEmail] = useState(''); // メールアドレス

  // フォーム送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    // フォームの内容をサーバーに送信するか、更新処理を実装する
    console.log('Submitted:', { username, email });
    // ここで実際の更新処理を実装する
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Edit User Profile
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfile;
