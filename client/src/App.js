import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import ChatBot from './components/Chatbot';
import ProblemList from './components/ProblemList';
import CodeEditorPage from './components/CodeEditorPage';
// import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import FAQ from './components/FAQ.js';
import MyNotes from './components/MyNotes.jsx';
import CompanyFaq from './components/company-faq.jsx';
// Correct import

const App = () => {
  const handleLogout = () => {
    console.log('User logged out');
  };
  

  return (
    <Router>
        {/* Correct usage */}
        {/* <Navbar/> */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/ProblemList" element={<ProblemList />} />
          <Route path="/codeeditor/:problem_id" element={<CodeEditorPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/faq/:topic" element={<FAQ />} />
          <Route path="/MyNotes" element={<MyNotes />} />
          <Route path='/companyFaq/:company' element={<CompanyFaq/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
