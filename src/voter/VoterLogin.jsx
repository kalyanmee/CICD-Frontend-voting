import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';

export default function VoterLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setIsVoterLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.url}/voter/checkvoterlogin`, formData);
      if (response.status === 200) {
        setIsVoterLoggedIn(true);
        sessionStorage.setItem('voter', JSON.stringify(response.data));
        navigate('/voterhome');
      } else {
        setMessage(response.data);
        setError('');
      }
    } catch (err) {
      setMessage('');
      if (err.response) {
        setError(err.response.data);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    },
    formWrapper: {
      backgroundColor: '#fff',
      padding: '30px 40px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    },
    smallImage: {
      width: '90px',
      height: '90px',
      marginBottom: '10px'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    formGroup: {
      marginBottom: '20px',
      textAlign: 'left'
    },
    label: {
      marginBottom: '6px',
      fontWeight: '600',
      color: '#555'
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    },
    button: {
      marginTop: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      width: '100%'
    },
    message: {
      marginBottom: '10px',
      fontWeight: '600'
    },
    success: { color: 'green' },
    errorText: { color: 'red' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>

        {/* 🔹 Small voting icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
          alt="vote"
          style={styles.smallImage}
        />

        <h3 style={styles.title}>Voter Login</h3>

        {message && <p style={{ ...styles.message, ...styles.success }}>{message}</p>}
        {error && <p style={{ ...styles.message, ...styles.errorText }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}
