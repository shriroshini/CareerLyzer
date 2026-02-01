import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../api";

const LearningRoadmap = ({ user }) => {
  const { careerName } = useParams();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    fetchRoadmap();
    loadCompletedSteps();
  }, [careerName]);

  const fetchRoadmap = async () => {
    try {
      const response = await api.get(`/api/career/roadmap/${careerName}`);
      setRoadmapData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch roadmap');
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedSteps = () => {
    const saved = localStorage.getItem(`roadmap_${careerName}_${user.id}`);
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  };

  const toggleStepCompletion = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
    localStorage.setItem(`roadmap_${careerName}_${user.id}`, JSON.stringify([...newCompleted]));
  };

  const getProgressPercentage = () => {
    if (!roadmapData) return 0;
    return Math.round((completedSteps.size / roadmapData.roadmap.length) * 100);
  };

  const getStepStatus = (stepNumber) => {
    if (completedSteps.has(stepNumber)) return 'completed';
    if (stepNumber === 1 || completedSteps.has(stepNumber - 1)) return 'available';
    return 'locked';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading learning roadmap for {careerName}...</p>
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

  const progressPercentage = getProgressPercentage();

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="page-header">
        <Link to="/recommendations" className="back-link">
          ← Back to Recommendations
        </Link>
        <h1>Learning Roadmap</h1>
        <h2>{roadmapData.careerName}</h2>
        <p>{roadmapData.description}</p>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="overview-card">
          <div className="progress-visual">
            <div className="circular-progress">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercentage * 2.51} 251`}
                  strokeDashoffset="62.75"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-number">{progressPercentage}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
          </div>
          <div className="progress-info">
            <h3>Your Progress</h3>
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-number">{completedSteps.size}</span>
                <span className="stat-label">Steps Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{roadmapData.roadmap.length - completedSteps.size}</span>
                <span className="stat-label">Steps Remaining</span>
              </div>
              <div className="stat">
                <span className="stat-number">{roadmapData.estimatedTimeToComplete}</span>
                <span className="stat-label">Est. Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Skills Alert */}
      {roadmapData.missingSkills && roadmapData.missingSkills.length > 0 && (
        <div className="missing-skills-alert">
          <div className="alert alert-warning">
            <h4>🎯 Focus Areas</h4>
            <p>Based on your current skills, pay special attention to these areas:</p>
            <div className="missing-skills-list">
              {roadmapData.missingSkills.map((skill, index) => (
                <span key={index} className="missing-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Steps */}
      <div className="roadmap-container">
        <div className="roadmap-timeline">
          {roadmapData.roadmap.map((step, index) => {
            const status = getStepStatus(step.step);
            return (
              <div key={step.step} className={`roadmap-step ${status}`}>
                <div className="step-connector">
                  {index < roadmapData.roadmap.length - 1 && (
                    <div className="connector-line"></div>
                  )}
                </div>
                
                <div className="step-marker">
                  <div className="step-number">
                    {status === 'completed' ? '✓' : step.step}
                  </div>
                </div>

                <div className="step-content">
                  <div className="step-header">
                    <h3>{step.title}</h3>
                    <div className="step-actions">
                      {status !== 'locked' && (
                        <button
                          onClick={() => toggleStepCompletion(step.step)}
                          className={`btn ${status === 'completed' ? 'btn-success' : 'btn-outline'}`}
                        >
                          {status === 'completed' ? 'Completed' : 'Mark Complete'}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="step-description">{step.description}</p>

                  {step.resources && step.resources.length > 0 && (
                    <div className="step-resources">
                      <h4>📚 Learning Resources:</h4>
                      <ul className="resources-list">
                        {step.resources.map((resource, resourceIndex) => (
                          <li key={resourceIndex} className="resource-item">
                            <span className="resource-icon">🔗</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {status === 'locked' && (
                    <div className="step-locked">
                      <span className="lock-icon">🔒</span>
                      <p>Complete the previous step to unlock this one</p>
                    </div>
                  )}

                  {status === 'completed' && (
                    <div className="step-completed">
                      <span className="check-icon">✅</span>
                      <p>Great job! You've completed this step.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Celebration */}
      {progressPercentage === 100 && (
        <div className="completion-celebration">
          <div className="celebration-card">
            <div className="celebration-icon">🎉</div>
            <h3>Congratulations!</h3>
            <p>You've completed the entire {roadmapData.careerName} learning roadmap!</p>
            <p>You're now ready to pursue opportunities in this field.</p>
            <div className="celebration-actions">
              <Link to="/recommendations" className="btn btn-primary">
                Explore More Careers
              </Link>
              <Link to="/upload" className="btn btn-secondary">
                Update Resume
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="additional-resources">
        <div className="card">
          <div className="card-header">
            <h3>💡 Additional Tips</h3>
          </div>
          <div className="tips-content">
            <div className="tip-section">
              <h4>Learning Strategy</h4>
              <ul>
                <li>Follow the roadmap steps in order for best results</li>
                <li>Practice each concept with hands-on projects</li>
                <li>Join communities and forums related to {roadmapData.careerName}</li>
                <li>Build a portfolio showcasing your progress</li>
              </ul>
            </div>
            <div className="tip-section">
              <h4>Time Management</h4>
              <ul>
                <li>Dedicate consistent time daily for learning</li>
                <li>Set realistic goals and deadlines</li>
                <li>Take breaks to avoid burnout</li>
                <li>Review and practice regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-section">
        <div className="action-buttons">
          <Link 
            to={`/skill-gaps/${roadmapData.careerName}`}
            className="btn btn-outline"
          >
            View Skill Gaps
          </Link>
          <Link 
            to="/recommendations"
            className="btn btn-secondary"
          >
            Other Career Paths
          </Link>
          <button 
            onClick={() => {
              setCompletedSteps(new Set());
              localStorage.removeItem(`roadmap_${careerName}_${user.id}`);
            }}
            className="btn btn-warning"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;