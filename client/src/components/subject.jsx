import React from 'react';
import { useNavigate } from 'react-router-dom';
import './company.css';

const Subject = () => {
  const subject_array = [
    'java',
    'OS',
    'Data base Management system',
    'REACT',
    'NODEJS',
    'EXPRESS-JS',
    'SQL',
    'OPPS principles',
    'PYTHON',
    'DATA STRUCTURE AND ALGO',
  ];

  const navigate = useNavigate();

  const handleSubject = (topic) => {
     navigate(`/faq/${topic}`);
  };

  return (
    <div className="company-section">
      <h2 className="company-title">Subjects</h2>
      <div className="company-grid">
        {subject_array.map((subject, index) => (
          <div
            key={index}
            className="company-card"
            onClick={() => handleSubject(subject)}
            style={{ cursor: 'pointer' }}
          >
            <div className="company-name">{subject}</div>
            <div className="company-subtitle">Click to explore FAQs</div>
            <span className="company-link">View FAQs →</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subject;
