import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const LoginSignup = ({ setIsLoggedIn }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [message, setMessage] = useState('');
  const [loginSnackbarOpen, setLoginSnackbarOpen] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const response = await axios.post('http://localhost:8080/auth/login', {
          username,
          password,
        });
        const token = response.data;
        console.log('Login successful, token:', token);
        localStorage.setItem('token', token);
        setIsLoggedIn(true);

        // Show Snackbar for successful login
        setSnackbarType('success');
        setMessage('Login successful!');
        setLoginSnackbarOpen(true); // Open the login snackbar
      } else {
        await axios.post('http://localhost:8080/auth/signup', {
          username,
          email,
          password,
        });
        // Show Snackbar for successful signup
        setSnackbarType('success');
        setMessage('Signup successful!');
        setSnackbarOpen(true);

        // Switch to login mode after successful signup
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'An error occurred');
      setSnackbarType('error');
      setMessage('An error occurred during the process');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setError(null);
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'lightgray' },
      '&.Mui-focused fieldset': { borderColor: '#90caf9' },
    },
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiInputBase-input': { color: 'white' },
    mt: 2
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      {mode === 'login' ? (
        <>
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
            Log In
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
            Sign up if you don't have an account
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
            Sign Up
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
            Log in if you already have an account
          </Typography>
        </>
      )}

      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        sx={textFieldStyle}
      />

      {mode === 'signup' && (
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          sx={textFieldStyle}
        />
      )}

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        sx={textFieldStyle}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || !username || !password || (mode === 'signup' && !email)}
        fullWidth
        sx={{ mt: 3 }}
      >
        {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
      </Button>

      <Button onClick={toggleMode} sx={{ mt: 1, color: '#90caf9' }}>
        {mode === 'login' ? 'Go to Sign Up' : 'Go to Log In'}
      </Button>

      {/* Snackbar for Signup */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Snackbar for Login */}
      <Snackbar
        open={loginSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setLoginSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setLoginSnackbarOpen(false)} severity={snackbarType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginSignup;

