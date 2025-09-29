import React from 'react';
import { Link } from 'react-router-dom'; // This import is essential

// Basic styling for the form
const formStyles = {
  // ... (styles from before)
};

// We need to import the images it uses. If these files don't exist in
// src/assets, it will cause a crash.
import logo from '../assets/logo.png';
import maillogo from '../assets/maillogo.png';
import padlock from '../assets/padlock.png';

const LoginForm = () => {
  return (
    <div style={formStyles.container}>
      <img src={logo} alt="Company Logo" />
      <h2>Welcome Back!</h2>
      <form>
        <img src={maillogo} alt="email icon" />
        <input style={formStyles.input} type="email" placeholder="Email Address" required />
        <img src={padlock} alt="padlock icon" />
        <input style={formStyles.input} type="password" placeholder="Password" required />
        <button style={formStyles.button} type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default LoginForm;