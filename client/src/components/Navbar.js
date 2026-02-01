import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          CareerLyzer
        </Link>
        
        <div className="navbar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/upload" 
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            Upload Resume
          </Link>
          <Link 
            to="/recommendations" 
            className={`nav-link ${isActive('/recommendations') ? 'active' : ''}`}
          >
            Career Suggestions
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'var(--gray-600)' }}>
              Welcome, {user.name}
            </span>
            <button 
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;