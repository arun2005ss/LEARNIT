import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaStar } from 'react-icons/fa';
import './StudentCourses.css';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Real courses similar to SWAYAM NPTEL
      const realCourses = [
        {
          _id: '1',
          title: 'Programming in C',
          description: 'Learn the fundamentals of C programming language including data types, control structures, functions, arrays, pointers, and file handling.',
          instructor: 'Prof. Rajesh Kumar, IIT Delhi',
          progress: 68,
          status: 'enrolled',
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          totalLessons: 8,
          completedLessons: 5,
          duration: '12 weeks',
          level: 'Beginner',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-10',
          lastAccessed: '2024-02-20',
          nextDeadline: '2024-03-01',
          videoHours: 24,
          assignments: 6,
          completedAssignments: 4,
          totalMCQs: 25,
          completedMCQs: 17,
          mcqScore: 68,
          passPercentage: 50,
          hasQuiz: true
        },
        {
          _id: '2',
          title: 'Data Structures and Algorithms',
          description: 'Master fundamental data structures like arrays, linked lists, stacks, queues, trees, graphs and their algorithms with complexity analysis.',
          instructor: 'Dr. Priya Sharma, IIT Bombay',
          progress: 45,
          status: 'enrolled',
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          totalLessons: 12,
          completedLessons: 5,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-25',
          lastAccessed: '2024-02-18',
          nextDeadline: '2024-02-28',
          videoHours: 30,
          assignments: 8,
          completedAssignments: 3,
          totalMCQs: 25,
          completedMCQs: 11,
          mcqScore: 44,
          passPercentage: 50,
          hasQuiz: true
        },
        {
          _id: '3',
          title: 'Database Management Systems',
          description: 'Comprehensive study of database concepts, SQL queries, normalization, indexing, transactions, and database design principles.',
          instructor: 'Dr. Sunita Patel, IIT Madras',
          progress: 80,
          status: 'enrolled',
          startDate: '2024-01-20',
          endDate: '2024-04-20',
          totalLessons: 10,
          completedLessons: 8,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Computer Science',
          credits: 4,
          enrollmentDate: '2024-01-15',
          lastAccessed: '2024-02-19',
          nextDeadline: '2024-02-25',
          videoHours: 27,
          assignments: 7,
          completedAssignments: 6,
          totalMCQs: 25,
          completedMCQs: 20,
          mcqScore: 80,
          passPercentage: 50,
          hasQuiz: true,
          quizPassed: true
        },
        {
          _id: '4',
          title: 'Web Development with React',
          description: 'Modern web development using React.js, including hooks, state management, routing, component lifecycle, and deployment strategies.',
          instructor: 'Prof. Vikram Singh, IIT Roorkee',
          progress: 30,
          status: 'enrolled',
          startDate: '2024-02-15',
          endDate: '2024-05-15',
          totalLessons: 14,
          completedLessons: 4,
          duration: '12 weeks',
          level: 'Intermediate',
          category: 'Web Development',
          credits: 3,
          enrollmentDate: '2024-02-10',
          lastAccessed: '2024-02-17',
          nextDeadline: '2024-02-29',
          videoHours: 33,
          assignments: 9,
          completedAssignments: 2,
          totalMCQs: 25,
          completedMCQs: 8,
          mcqScore: 32,
          passPercentage: 50,
          hasQuiz: true
        }
      ];
      
      setCourses(realCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return course.status === 'enrolled';
    if (filter === 'completed') return course.status === 'completed';
    return true;
  });


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="student-courses">
      <div className="courses-header">
        <h1 className="courses-title">
          <FaGraduationCap className="title-icon" />
          Quiz
        </h1>
        <p className="courses-subtitle">
          Take quizzes for your enrolled courses
        </p>
      </div>

      <div className="courses-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Courses ({courses.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'enrolled' ? 'active' : ''}`}
          onClick={() => setFilter('enrolled')}
        >
          In Progress ({courses.filter(c => c.status === 'enrolled').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({courses.filter(c => c.status === 'completed').length})
        </button>
      </div>

      <div className="courses-summary">
        <div className="summary-card">
          <FaBook className="summary-icon" />
          <div className="summary-content">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <div className="course-icon">
                  <FaBook />
                </div>
              </div>

              <div className="course-content">
                <div className="course-title-section">
                  <h3 className="course-title">{course.title}</h3>
                </div>
                <p className="course-description">{course.description}</p>
                




                {course.status === 'completed' && course.grade && (
                  <div className="grade-section">
                    <div className="grade-display">
                      <FaStar className="grade-icon" />
                      <span className="grade-text">Grade: {course.grade}</span>
                    </div>
                  </div>
                )}

                <div className="course-actions">
                  {course.hasQuiz && (
                    <Link to={`/courses/${course._id}/quiz`} className="action-btn quiz">
                      <FaBook className="btn-icon" />
                      {course.completedMCQs === course.totalMCQs ? 'Retake Quiz' : 'Take Quiz'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FaGraduationCap className="empty-icon" />
            <h3>No courses found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't enrolled in any courses yet."
                : `No ${filter} courses found.`
              }
            </p>
            <Link to="/" className="cta-button">
              Browse Available Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
