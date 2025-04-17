import React from 'react';
import { useNavigate } from 'react-router-dom';
import './company.css';

const Company = () => {
  const company_array = [
    'Amazon',
    'Microsoft',
    'DarwinBox',
    'Nvidia',
    'TCS',
    'HCL',
    'Infosys',
    'Capgemini',
    'Accenture',
    'Tech Mahindra',
  ];

  const navigate = useNavigate();

  const handleCompany = (company) => {
    navigate(`/companyFaq/${company}`);
  };

  return (
    <div className="company-section">
      <h2 className="company-title">Prepare fot the Company</h2>
      <div className="company-grid">
        {company_array.map((company, index) => (
          <div
            key={index}
            className="company-card"
            onClick={() => handleCompany(company)}
            style={{ cursor: 'pointer' }}
          >
            <div className="company-name">{company}</div>
            <div className="company-subtitle">Click to explore FAQs</div>
            <span className="company-link">View FAQs →</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Company;
