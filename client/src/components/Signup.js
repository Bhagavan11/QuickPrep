import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', { name, email, password });
      localStorage.setItem('token', response.data.token); // Store JWT token in localStorage
      console.log('Signup successful:', response.data);
      localStorage.setItem('userName', response.data.name); // Store user name in localStorage
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  };



  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Signup</button>
        <h5>Aleardy have account?
           <Link to="/login">
            <button className="signup-form button">login</button>
          </Link>
        </h5>
      </form>
      
      {/* Styles placed at the bottom of the component */}
      <style>
        {`
          .signup-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f7f7f7;
          }

          .signup-form {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            max-width: 100%;
          }

          .signup-form h2 {
            text-align: center;
            margin-bottom: 20px;
            font-family: 'Arial', sans-serif;
          }

          .signup-form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }

          .signup-form input:focus {
            border-color: #4e7e7e;
            outline: none;
          }

          .signup-form button {
            width: 100%;
            padding: 10px;
            background-color: #4e7e7e;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .signup-form button:hover {
            background-color: #3c6f6f;
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
