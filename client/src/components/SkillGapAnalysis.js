import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../api";

const SkillGapAnalysis = ({ user }) => {
  const { careerName } = useParams();
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkillGaps();
  }, [careerName]);

  const fetchSkillGaps = async () => {
    try {
      const response = await api.get(`/api/career/skill-gaps/${careerName}`);
      setSkillGapData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch skill gaps');
    } finally {
      setLoading(false);
    }
  };

  const getSkillStatus = (skill) => {
    return skillGapData.userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    );
  };

  const getGapSeverity = (percentage) => {
    if (percentage <= 20) return { level: 'low', color: '#22C55E', label: 'Minor Gap' };
    if (percentage <= 50) return { level: 'medium', color: '#F59E0B', label: 'Moderate Gap' };
    return { level: 'high', color: '#EF4444', label: 'Significant Gap' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Analyzing skill gaps for {careerName}...</p>
      </div>
    );
  }

  if (error) {
    const needsResumeUpload = error.includes('upload') || error.includes('analyze');
    return (
      <div className="container" style={{ marginTop: '100px' }}>
        <div className="alert alert-error">
          {error}
        </div>
        {needsResumeUpload ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/upload" className="btn btn-primary">
              Upload Resume First
            </Link>
          </div>
        ) : (
          <Link to="/recommendations" className="btn btn-secondary">
            Back to Recommendations
          </Link>
        )}
      </div>
    );
  }

  const gapSeverity = getGapSeverity(skillGapData.skillGapPercentage);
  const matchedSkills = skillGapData.requiredSkills.filter(skill => getSkillStatus(skill));
  const missingSkills = skillGapData.missingSkills;

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="page-header">
        <Link to="/recommendations" className="back-link">
          ← Back to Recommendations
        </Link>
        <h1>Skill Gap Analysis</h1>
        <h2>{skillGapData.careerName}</h2>
      </div>

      {/* Gap Overview */}
      <div className="gap-overview">
        <div className="overview-card">
          <div className="gap-visual">
            <div className="gap-circle">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={gapSeverity.color}
                  strokeWidth="10"
                  strokeDasharray={`${(100 - skillGapData.skillGapPercentage) * 3.14} 314`}
                  strokeDashoffset="78.5"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="gap-text">
                <span className="gap-percentage">{100 - skillGapData.skillGapPercentage}%</span>
                <span className="gap-label">Match</span>
              </div>
            </div>
          </div>
          <div className="gap-info">
            <h3>Skill Match Analysis</h3>
            <div className="gap-stats">
              <div className="stat">
                <span className="stat-number">{matchedSkills.length}</span>
                <span className="stat-label">Skills You Have</span>
              </div>
              <div className="stat">
                <span className="stat-number">{missingSkills.length}</span>
                <span className="stat-label">Skills to Learn</span>
              </div>
              <div className="stat">
                <span className="stat-number">{skillGapData.requiredSkills.length}</span>
                <span className="stat-label">Total Required</span>
              </div>
            </div>
            <div className={`gap-severity ${gapSeverity.level}`}>
              <span className="severity-indicator" style={{ backgroundColor: gapSeverity.color }}></span>
              {gapSeverity.label}
            </div>
          </div>
        </div>
      </div>

      <div className="skills-analysis">
        {/* Skills You Have */}
        <div className="card">
          <div className="card-header">
            <h3>✅ Skills You Have ({matchedSkills.length})</h3>
          </div>
          <div className="skills-grid">
            {matchedSkills.map((skill, index) => (
              <div key={index} className="skill-item matched">
                <span className="skill-name">{skill}</span>
                <span className="skill-status">✓</span>
              </div>
            ))}
          </div>
          {matchedSkills.length === 0 && (
            <div className="empty-message">
              <p>No matching skills found. Consider updating your resume with more relevant skills.</p>
            </div>
          )}
        </div>

        {/* Skills to Learn */}
        <div className="card">
          <div className="card-header">
            <h3>📚 Skills to Learn ({missingSkills.length})</h3>
          </div>
          <div className="skills-grid">
            {missingSkills.map((skill, index) => (
              <div key={index} className="skill-item missing">
                <span className="skill-name">{skill}</span>
                <span className="skill-priority">
                  {index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low'}
                </span>
              </div>
            ))}
          </div>
          {missingSkills.length === 0 && (
            <div className="success-message">
              <h4>🎉 Congratulations!</h4>
              <p>You have all the required skills for this career path!</p>
            </div>
          )}
        </div>
      </div>

      {/* Learning Recommendations */}
      {missingSkills.length > 0 && (
        <div className="learning-recommendations">
          <div className="card">
            <div className="card-header">
              <h3>🎯 Learning Recommendations</h3>
            </div>
            <div className="recommendations-content">
              <div className="priority-skills">
                <h4>Priority Skills (Learn First)</h4>
                <div className="priority-list">
                  {missingSkills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="priority-item">
                      <div className="priority-number">{index + 1}</div>
                      <div className="priority-info">
                        <h5>{skill}</h5>
                        <p>High demand skill in {skillGapData.careerName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="learning-tips">
                <h4>Learning Tips</h4>
                <ul>
                  <li>Focus on the top 3 priority skills first</li>
                  <li>Practice with real projects to gain hands-on experience</li>
                  <li>Join online communities and forums</li>
                  <li>Consider taking structured courses or bootcamps</li>
                  <li>Build a portfolio showcasing your new skills</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-section">
        <div className="action-buttons">
          <Link 
            to={`/roadmap/${skillGapData.careerName}`}
            className="btn btn-primary"
          >
            View Learning Roadmap
          </Link>
          <Link 
            to="/recommendations"
            className="btn btn-secondary"
          >
            Explore Other Careers
          </Link>
          <Link 
            to="/upload"
            className="btn btn-outline"
          >
            Update Resume
          </Link>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="progress-tracker">
        <div className="card">
          <div className="card-header">
            <h3>📈 Your Progress</h3>
          </div>
          <div className="progress-content">
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(matchedSkills.length / skillGapData.requiredSkills.length) * 100}%`,
                    backgroundColor: gapSeverity.color
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {matchedSkills.length} of {skillGapData.requiredSkills.length} skills completed
              </span>
            </div>
            <p className="progress-message">
              {missingSkills.length === 0 
                ? "You're ready for this career path!" 
                : `${missingSkills.length} more skills to go!`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;