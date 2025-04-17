import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Profile from './Profile';
import LatestJobs from './LatestJobs';
import TechNews from './TechNews';
import Company from './company';
import Separator from './Separator';
import Subject from './subject';
const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const userName =localStorage.getItem('userName');  
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
      <Company/>
      <Separator/>
      <Subject/>
      {/* <LatestJobs /> */}
      {/* <TechNews /> */}
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
    backgroundColor: ' #0d0d0d',
    padding: '10px', // Added padding for smaller screens
  },
  profileContainer: {
    width: '0px', 
    textAlign: 'center',
    position: 'absolute',
    top: '-10px',  // Adjust this based on Navbar height
    right: '10px',  // Keep it aligned to the right
    padding: '15px',
    borderRadius: '8px',
    zIndex: 1000,  // Ensure it's above other content
    transition: 'width 0.3s ease', // Smooth transition for the profile container
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '20px',
    flexDirection: 'row', // Default for larger screens
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

  // Media Queries for Responsiveness

  // For Tablet screens and below (max-width: 768px)
  '@media (max-width: 768px)': {
    container: {
      padding: '5px', // Less padding for smaller screens
    },
    profileContainer: {
      top: '10px', // Slightly adjust for smaller screens
      right: '5px', // Adjust for mobile view
      width: 'auto', // Make the profile container visible with auto width
    },
    main: {
      flexDirection: 'column', // Stack items vertically on smaller screens
      gap: '15px',
    },
    navButton: {
      padding: '12px 25px',
      fontSize: '16px',
    },
  },

  // For Mobile screens (max-width: 480px)
  '@media (max-width: 480px)': {
    container: {
      padding: '0', // No padding for mobile view
    },
    profileContainer: {
      top: '15px', // Adjust top margin further for mobile
      right: '5px', 
      width: 'auto', // Still keep it auto on mobile
    },
    main: {
      flexDirection: 'column', // Stack items in column on mobile
      gap: '10px', // Reduce gap for better mobile fit
    },
    navButton: {
      padding: '10px 20px',
      fontSize: '14px',
    },
  },
};

export default Home;
