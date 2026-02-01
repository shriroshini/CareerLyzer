import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../api";

const CareerRecommendations = ({ user }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/api/career/suggest');
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch recommendations';
      // Check if user needs to upload resume first
      if (errorMessage.includes('upload') || errorMessage.includes('analyze')) {
        setError('Please upload your resume first to get career recommendations.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#22C55E';
    if (percentage >= 60) return '#F59E0B';
    if (percentage >= 40) return '#EF4444';
    return '#6B7280';
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Low Match';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Analyzing your profile for career matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ marginTop: '100px' }}>
        <div className="alert alert-error">
          {error}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/upload" className="btn btn-primary">
            Upload Resume First
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="page-header">
        <h1>Career Recommendations</h1>
        <p>AI-powered career suggestions based on your skills and experience</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">🎯</div>
          <h3>No Recommendations Yet</h3>
          <p>Upload your resume to get personalized career recommendations</p>
          <Link to="/upload" className="btn btn-primary">
            Upload Resume
          </Link>
        </div>
      ) : (
        <>
          <div className="recommendations-summary">
            <div className="summary-card">
              <h3>Your Profile Summary</h3>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{user?.skills?.length || 0}</span>
                  <span className="stat-label">Skills Detected</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user?.resumeScore || 0}</span>
                  <span className="stat-label">Resume Score</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{recommendations.length}</span>
                  <span className="stat-label">Career Matches</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-grid">
            {recommendations.map((career, index) => (
              <div key={index} className="career-recommendation-card">
                <div className="career-header">
                  <h3>{career.careerName}</h3>
                  <span
                    className="match-badge"
                    style={{ backgroundColor: getMatchColor(career.matchPercentage) }}
                  >
                    {career.matchPercentage}% Match
                  </span>
                </div>

                <p>{career.description}</p>

                <div className="career-skills">
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {career.requiredSkills.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="career-actions">
                  <Link to={`/skill-gaps/${career.careerName}`} className="btn btn-outline">
                    View Skill Gaps
                  </Link>
                  <Link to={`/roadmap/${career.careerName}`} className="btn btn-primary">
                    Learning Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CareerRecommendations;
