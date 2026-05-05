import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '15px', borderRadius: '50%', boxShadow: '0 0 20px var(--accent-primary)' }}>
            <LogIn size={32} color="white" />
          </div>
        </div>
        <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              className="glass"
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              className="glass"
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
