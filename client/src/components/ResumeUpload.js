import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";


const ResumeUpload = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'application/pdf' || fileType === 'text/plain') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF or text file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/api/resume/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


      setAnalysis(response.data);
      
      // Update user data
      setUser(prev => ({
        ...prev,
        resumeScore: response.data.resumeScore,
        skills: response.data.skills
      }));

      // Navigate immediately to dashboard
      navigate('/dashboard');

    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized.';
    if (score >= 60) return 'Good! There\'s room for improvement.';
    return 'Your resume needs significant improvements.';
  };

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: '800px' }}>
      <div className="upload-header">
        <h1>Resume Analysis</h1>
        <p>Upload your resume to get AI-powered insights and career recommendations</p>
      </div>

      {!analysis ? (
        <div className="card">
          <div className="card-header">
            <h3>Upload Your Resume</h3>
            <p>Supported formats: PDF, TXT</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="upload-area">
            <div className="file-input-container">
              <input
                type="file"
                id="resume-file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="resume-file" className="file-input-label">
                <div className="upload-icon">📄</div>
                <div>
                  <h4>Choose Resume File</h4>
                  <p>Click to browse or drag and drop</p>
                </div>
              </label>
            </div>

            {file && (
              <div className="file-info">
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="upload-actions">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn btn-primary"
              style={{ width: '200px' }}
            >
              {uploading ? (
                <>
                  <div className="loading-spinner small"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          <div className="upload-tips">
            <h4>Tips for better analysis:</h4>
            <ul>
              <li>Use a well-formatted resume with clear sections</li>
              <li>Include relevant skills, experience, and projects</li>
              <li>Use industry-standard keywords</li>
              <li>Keep the file size under 5MB</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="analysis-results">
          <div className="alert alert-success">
            <h3>✅ Resume Analysis Complete!</h3>
            <p>Your resume has been successfully analyzed. Redirecting to dashboard...</p>
          </div>

          <div className="results-grid">
            {/* Score Card */}
            <div className="card">
              <div className="card-header">
                <h3>Resume Score</h3>
              </div>
              <div className="score-display">
                <div 
                  className="score-circle"
                  style={{ 
                    background: `conic-gradient(${getScoreColor(analysis.resumeScore)} ${analysis.resumeScore * 3.6}deg, #E5E7EB 0deg)`
                  }}
                >
                  <div className="score-inner">
                    <span className="score-number">{analysis.resumeScore}</span>
                    <span className="score-label">/ 100</span>
                  </div>
                </div>
                <p className="score-message">
                  {getScoreMessage(analysis.resumeScore)}
                </p>
              </div>
            </div>

            {/* Skills Found */}
            <div className="card">
              <div className="card-header">
                <h3>Skills Detected ({analysis.skills.length})</h3>
              </div>
              <div className="skills-grid">
                {analysis.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
              {analysis.skills.length === 0 && (
                <p className="empty-message">
                  No technical skills detected. Consider adding more specific skills to your resume.
                </p>
              )}
            </div>

            {/* Analysis Summary */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <h3>Analysis Summary</h3>
              </div>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <div className="analysis-icon">📊</div>
                  <div>
                    <h4>Word Count</h4>
                    <p>{analysis.analysis.wordCount} words</p>
                  </div>
                </div>
                <div className="analysis-item">
                  <div className="analysis-icon">💼</div>
                  <div>
                    <h4>Experience Section</h4>
                    <p className={analysis.analysis.hasExperience ? 'text-success' : 'text-warning'}>
                      {analysis.analysis.hasExperience ? 'Found' : 'Missing'}
                    </p>
                  </div>
                </div>
                <div className="analysis-item">
                  <div className="analysis-icon">🎓</div>
                  <div>
                    <h4>Education Section</h4>
                    <p className={analysis.analysis.hasEducation ? 'text-success' : 'text-warning'}>
                      {analysis.analysis.hasEducation ? 'Found' : 'Missing'}
                    </p>
                  </div>
                </div>
                <div className="analysis-item">
                  <div className="analysis-icon">🚀</div>
                  <div>
                    <h4>Projects Section</h4>
                    <p className={analysis.analysis.hasProjects ? 'text-success' : 'text-warning'}>
                      {analysis.analysis.hasProjects ? 'Found' : 'Missing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="next-steps-grid">
              <button 
                onClick={() => navigate('/recommendations')}
                className="btn btn-primary"
              >
                View Career Recommendations
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;