import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from "../api";

const Dashboard = ({ user }) => {
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [careerSuggestions, setCareerSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [analysisRes, careerRes] = await Promise.all([
        api.get('/api/resume/analyze', config).catch(() => ({ data: null })),
        api.get('/api/career/suggest', config).catch(() => ({ data: { recommendations: [] } }))
      ]);

      setResumeAnalysis(analysisRes.data);
      setCareerSuggestions(careerRes.data?.recommendations || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const scoreData = [
    { name: 'Score', value: user?.resumeScore || 0, fill: getScoreColor(user?.resumeScore || 0) },
    { name: 'Remaining', value: 100 - (user?.resumeScore || 0), fill: '#E5E7EB' }
  ];

  const skillsData = (user?.skills || []).slice(0, 8).map(skill => ({
    name: skill,
    value: Math.floor(Math.random() * 40) + 60
  }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Your career analysis overview</p>
      </div>

      <div className="dashboard-grid">

        {/* Resume Score */}
        <div className="card">
          <div className="card-header">
            <h3>Resume Score</h3>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={scoreData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {scoreData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user?.resumeScore || 0}</span>
            <span style={{ fontSize: '1rem', color: '#6B7280', marginLeft: '4px' }}> / 100</span>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="card-header">
            <h3>Your Skills</h3>
          </div>

          {user?.skills && user.skills.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>No skills detected yet</p>
              <Link to="/upload" className="btn btn-primary">Upload Resume</Link>
            </div>
          )}
        </div>

        {/* Career Recommendations */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3>Career Recommendations</h3>
            <Link to="/recommendations" className="btn btn-secondary">View All</Link>
          </div>

          {careerSuggestions.length > 0 ? (
            careerSuggestions.slice(0, 3).map((career, index) => (
              <div key={index} className="career-card">
                <h4>{career.careerName}</h4>
                <p>{career.description}</p>
                <p><strong>Match:</strong> {career.matchPercentage}%</p>
              </div>
            ))
          ) : (
            <p>Upload your resume to get recommendations</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
