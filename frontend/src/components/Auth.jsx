// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLoginMode ? 'login' : 'signup';
    const apiUrl = `http://localhost:5001/api/auth/${endpoint}`;

    try {
      const response = await axios.post(apiUrl, { username, password });
      setMessage(`${isLoginMode ? 'Login' : 'Signup'} successful!`);

      if (isLoginMode) {
        // Store JWT token
        localStorage.setItem('token', response.data.token);

        // Determine role based on username
        const userRole = username === 'drjohn' ? 'doctor' : 'user';
        localStorage.setItem('userRole', userRole);

        // Redirect based on role
        if (userRole === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/home-page');
        }
      } else {
        // Switch to login mode after successful signup
        alert('Signup successful!');
        navigate('/new-user');

      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred';
      setMessage(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLoginMode ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isLoginMode ? 'Login' : 'Signup'}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
        <span
          onClick={() => setIsLoginMode(!isLoginMode)}
          style={styles.toggleButton}
        >
          {isLoginMode ? ' Signup' : ' Login'}
        </span>
      </p>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '300px',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px',
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleText: {
    marginTop: '10px',
  },
  toggleButton: {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  message: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Auth;
