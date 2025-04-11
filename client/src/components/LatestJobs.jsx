import React, { useEffect, useState } from 'react';
import './LatestJobs.css';

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(4); // initially show 4 jobs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadMoreJobs = () => {
    setVisibleJobs(prev => prev + 4); // load 4 more jobs
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="latest-jobs-container">
      <h2 className="section-title">Latest Job Postings</h2>
      <div className="jobs-grid">
        {jobs.slice(0, visibleJobs).map((job, index) => (
          <div key={index} className="job-card">
            <h3>{job.job_title}</h3>
            <p>{job.employer_name}</p>
            <p>{job.job_city}, {job.job_country}</p>
            <span className={`badge ${job.job_is_remote ? 'remote' : 'onsite'}`}>
              {job.job_is_remote ? 'Remote' : 'Onsite'}
            </span>
            <a href={job.job_apply_link} target="_blank" rel="noreferrer" className="apply-link">Apply →</a>
          </div>
        ))}
      </div>

      {visibleJobs < jobs.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMoreJobs}>View More</button>
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
