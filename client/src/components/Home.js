import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Profile from './Profile';
import LatestJobs from './LatestJobs';
import TechNews from './TechNews';
const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const userName =localStorage.getItem('userName');  // Assuming userName is stored in local storage
  console.log('User Name:', userName);
  const [showProfile, setShowProfile] = useState(false);


  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token);

      if (!token) {
        console.error('No token found! Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('User data response:', res.data);
        setUserData(res.data.user);
      } catch (err) {
        console.error('Token validation failed:', err.response?.data || err.message);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);



  const handleChatbotNavigation = () => {
    if (userData) {
      navigate('/chatbot', { state: { userName: userName } });
    }
  };

  const handleEditorNavigation = () => {
    if (userData) {
      navigate('/ProblemList', { state: { userName:userName } });
    }
  };

  if (!userData) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      
      <Navbar toggleProfile={toggleProfile} />
       <div style={styles.profileContainer}>
        {showProfile && <Profile />}
      </div>
      <LatestJobs />
      <TechNews />
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
   profileContainer: {
  width: '0px', 
  textAlign: 'center',
  // marginBottom: '20px',
  // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  position: 'absolute',  // Positioning it freely
  top: '-10px',  // Adjust this based on Navbar height
  right: '10px',  // Keep it aligned to the right
  // backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  zIndex: 1000,  // Ensure it's above other content
},
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '20px',
  },
  navButton: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#333',
  },
};

export default Home;
