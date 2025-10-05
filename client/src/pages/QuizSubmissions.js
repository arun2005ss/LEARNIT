import React, { useState, useEffect } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaBook, FaFilter } from 'react-icons/fa';
import './QuizSubmissions.css';

const QuizSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    status: 'all',
    attempt: 'all',
    search: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  const fetchSubmissions = async () => {
    try {
      // Mock data for quiz submissions - empty for now
      const mockSubmissions = [];

      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = submissions;

    if (filters.course !== 'all') {
      filtered = filtered.filter(sub => sub.courseId === filters.course);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    if (filters.attempt !== 'all') {
      filtered = filtered.filter(sub => sub.attemptNumber === parseInt(filters.attempt));
    }

    if (filters.search) {
      filtered = filtered.filter(sub => 
        sub.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.studentEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.courseName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <FaCheckCircle className="status-icon passed" />;
      case 'failed':
        return <FaTimesCircle className="status-icon failed" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const courses = [
    { id: '1', name: 'Programming in C' },
    { id: '2', name: 'Data Structures and Algorithms' },
    { id: '3', name: 'Database Management Systems' },
    { id: '4', name: 'Web Development with React' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading quiz submissions...</p>
      </div>
    );
  }

  return (
    <div className="quiz-submissions">
      <div className="container">
        <div className="page-header">
          <h1>Quiz Submissions</h1>
          <p>Monitor and analyze student quiz performance</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="course-filter">Course:</label>
            <select
              id="course-filter"
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="attempt-filter">Attempt:</label>
            <select
              id="attempt-filter"
              value={filters.attempt}
              onChange={(e) => handleFilterChange('attempt', e.target.value)}
            >
              <option value="all">All Attempts</option>
              <option value="1">1st Attempt</option>
              <option value="2">2nd Attempt</option>
              <option value="3">3rd Attempt</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search-filter">Search:</label>
            <input
              id="search-filter"
              type="text"
              placeholder="Search by name, email, or course..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="submissions-stats">
          <div className="stat-card">
            <h3>Total Submissions</h3>
            <p className="stat-number">{filteredSubmissions.length}</p>
          </div>
          <div className="stat-card">
            <h3>Passed</h3>
            <p className="stat-number passed">
              {filteredSubmissions.filter(s => s.status === 'passed').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Failed</h3>
            <p className="stat-number failed">
              {filteredSubmissions.filter(s => s.status === 'failed').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p className="stat-number">
              {filteredSubmissions.length > 0 
                ? Math.round(filteredSubmissions.reduce((sum, s) => sum + s.percentage, 0) / filteredSubmissions.length)
                : 0}%
            </p>
          </div>
          <div className="stat-card">
            <h3>First Attempts</h3>
            <p className="stat-number">
              {filteredSubmissions.filter(s => s.attemptNumber === 1).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Retakes</h3>
            <p className="stat-number">
              {filteredSubmissions.filter(s => s.attemptNumber > 1).length}
            </p>
          </div>
        </div>

        <div className="submissions-table-container">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Score</th>
                <th>Status</th>
                <th>Attempt</th>
                <th>Time Spent</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map(submission => (
                <tr key={submission.id}>
                  <td>
                    <div className="student-info">
                      <FaUser className="student-icon" />
                      <div>
                        <div className="student-name">{submission.studentName}</div>
                        <div className="student-email">{submission.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <FaBook className="course-icon" />
                      <span>{submission.courseName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="score-info">
                      <span className="score">{submission.score}/{submission.totalQuestions}</span>
                      <span className="percentage">({submission.percentage}%)</span>
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(submission.status)}
                      <span className="status-text">{getStatusText(submission.status)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="attempt-info">
                      <span className="attempt-number">{submission.attemptNumber}</span>
                      <span className="attempt-max">/ {submission.maxAttempts}</span>
                    </div>
                  </td>
                  <td>
                    <div className="time-info">
                      <FaClock className="time-icon" />
                      <span>{formatTime(submission.timeSpent)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                      <br />
                      <small>{new Date(submission.submittedAt).toLocaleTimeString()}</small>
                    </div>
                  </td>
                  <td>
                    <button className="view-btn" title="View Details">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubmissions.length === 0 && (
            <div className="no-submissions">
              <p>No submissions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissions;
