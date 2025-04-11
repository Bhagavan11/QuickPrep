import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header Section with Login and Sign Up buttons */}
      <header className="landing-header">
        <h1>QuickPrep for Interview</h1>
        <p>Prepare smarter with curated resources and mock interviews!</p>
        <div className="cta-buttons">
          <Link to="/login">
            <button className="cta-button login">Login</button>
          </Link>
          <Link to="/signup">
            <button className="cta-button signup">Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Body Section with content about QuickPrep */}
      <section className="body-content">
        <h2>Why QuickPrep?</h2>
        <p>QuickPrep offers a comprehensive platform to help you ace your interviews. With curated resources, practice problems, and mock interviews, you'll be ready for anything that comes your way!</p>
        
        <div className="features">
          <div className="feature">
            <img src="https://tse4.mm.bing.net/th?id=OIP.cNbUIlE11Fw5hZMFoTdmTAHaFf&pid=Api&P=0&h=180" alt="Concepts" />
            <h3>Revise Key Concepts</h3>
            <p>Refresh your understanding of important topics with our curated list of concepts.</p>
          </div>
          <div className="feature">
            <img src="https://c8.alamy.com/comp/2HHXE7N/programming-and-coding-ux-ui-web-design-responsive-interface-development-concept-2HHXE7N.jpg" alt="Practice" />
            <h3>Practice Problems</h3>
            <p>Challenge yourself with practice problems designed to simulate interview scenarios.</p>
          </div>
          <div className="feature">
            <img src="https://tse3.mm.bing.net/th?id=OIP.RFOlMvzV5MBf2f1NsmQ4WAHaE8&pid=Api&P=0&h=180" alt="Mock Interviews" />
            <h3>Mock Interviews</h3>
            <p>Get real-time feedback with mock interviews based on your resume.</p>
          </div>
        </div>
      </section>

      {/* Inline Styling at the bottom */}
      <style>{`
        .landing-page {
          font-family: Arial, sans-serif;
          color: #333;
        }

        .landing-header {
          text-align: center;
          background-color: #4e7e7e;
          color: white;
          padding: 50px 0;
          
          background-size: cover;
          background-position: center;
        }

        .landing-header h1 {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .landing-header p {
          font-size: 1.25rem;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .cta-button {
          padding: 10px 20px;
          font-size: 1.1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .cta-button:hover {
          background-color: #3c6f6f;
        }

        .login {
          background-color: #4e7e7e;
          color: white;
        }

        .signup {
          background-color: #fff;
          border: 2px solid #4e7e7e;
          color: #4e7e7e;
        }

        .signup:hover {
          background-color: #4e7e7e;
          color: white;
        }

        .body-content {
          padding: 40px;
          text-align: center;
          background-color: #f5f5f5;
        }

        .body-content h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .body-content p {
          font-size: 1.25rem;
          margin-bottom: 40px;
        }

        .features {
          display: flex;
          justify-content: space-around;
          gap: 40px;
          flex-wrap: wrap;
        }

        .feature {
          text-align: center;
          max-width: 300px;
        }

        .feature img {
          width: 100px;
          height: 100px;
          margin-bottom: 15px;
          border-radius: 8px;
          object-fit: cover;
        }

        .feature h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .feature p {
          font-size: 1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
