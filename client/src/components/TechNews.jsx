import React, { useEffect, useState } from 'react';
import './LatestJobs.css'; // You can rename this to TechNews.css if needed
import axios from 'axios';
const TechNews = () => {
  const [news, setNews] = useState([]);
  const [visibleNews, setVisibleNews] = useState(4);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tech-news");
      console.log("Fetched News:", res.data);
      setNews(res.data);  // ✅ FIXED: use res.data directly
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch data from server");
      setLoading(false);
    }
  };

  fetchNews();
}, []);


  const loadMoreNews = () => {
    setVisibleNews(prev => prev + 4);
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">🚨 {error}</div>;
  }

  return (
    <div className="latest-news-container">
      <div className="latest-jobs-container">
          <h2 className="section-title">Latest Tech News</h2>
          <div className="jobs-grid">
              {news.slice(0, visibleNews).map((article, index) => (
            <div key={index} className="job-card">
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  className="apply-link"
                >
                        Read More →
                </a>
            </div>
    ))}
  </div>

  {visibleNews < news.length && (
    <div className="load-more-container">
      <button className="load-more-btn" onClick={loadMoreNews}>
        View More
      </button>
    </div>
  )}
</div>
</div>

  );
};

export default TechNews;
