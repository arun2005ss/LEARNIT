import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      // Fetch student-specific data
      const notesResponse = await axios.get('/api/notes');
      const notes = notesResponse.data || [];

      setStats({
        recentNotes: notes.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <FaChartLine className="title-icon" />
          Student Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Welcome to your learning dashboard
        </p>
      </div>


      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBook className="section-icon" />
              Recent Notes
            </h2>
            <Link to="/notes" className="view-all-link">
              View All Notes
            </Link>
          </div>
          
          <div className="notes-grid">
            {stats.recentNotes.length > 0 ? (
              stats.recentNotes.map(note => (
                <div key={note._id} className="note-card">
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-excerpt">
                    {note.content.substring(0, 100)}...
                  </p>
                  <div className="note-meta">
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <Link to={`/notes/${note._id}`} className="read-more">
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaBook className="empty-icon" />
                <p>No notes available yet</p>
                <Link to="/notes" className="cta-button">
                  Browse Notes
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaTasks className="section-icon" />
              Quick Actions
            </h2>
          </div>
          
          <div className="quick-actions">
            <Link to="/notes" className="action-card">
              <FaBook className="action-icon" />
              <h3>Browse Notes</h3>
              <p>Access all available study materials</p>
            </Link>
            
            <Link to="/assignments" className="action-card">
              <FaTasks className="action-icon" />
              <h3>View Assignments</h3>
              <p>Check your assignments and progress</p>
            </Link>
            
            <Link to="/profile" className="action-card">
              <FaUser className="action-icon" />
              <h3>Update Profile</h3>
              <p>Manage your account settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
