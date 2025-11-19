import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import Profile from './pages/Profile';
import AdminAssignments from './pages/AdminAssignments';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import CourseQuiz from './pages/CourseQuiz';
import Assignments from './pages/Assignments';
import Prerequisites from './pages/Prerequisites';
import EducatorDocuments from './pages/EducatorDocuments';
import StudentDocuments from './pages/StudentDocuments';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user && <Sidebar onToggle={setSidebarCollapsed} />}
      {!user && location.pathname === '/' && <Header />}
      <main className={`main-content ${user ? 'with-sidebar' : (location.pathname === '/' ? 'with-header' : '')} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/auth/callback" 
            element={<AuthCallback />} 
          />
          <Route 
            path="/notes" 
            element={user ? <Notes /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notes/:id" 
            element={user ? <NoteDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-note" 
            element={user?.role === 'admin' ? <CreateNote /> : <Navigate to="/" />} 
          />
          <Route 
            path="/notes/:id/edit" 
            element={user ? <EditNote /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/assignments" 
            element={user?.role === 'admin' ? <AdminAssignments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/dashboard" 
            element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/courses" 
            element={user?.role === 'student' ? <StudentCourses /> : <Navigate to="/" />} 
          />
          <Route 
            path="/courses/:courseId/quiz" 
            element={user?.role === 'student' ? <CourseQuiz /> : <Navigate to="/" />} 
          />
          <Route 
            path="/assignments" 
            element={user ? <Assignments /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/prerequisites" 
            element={<Prerequisites />} 
          />
          <Route 
            path="/admin/documents" 
            element={user?.role === 'admin' ? <EducatorDocuments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/educator/documents" 
            element={user?.role === 'educator' ? <EducatorDocuments /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/documents" 
            element={user?.role === 'student' ? <StudentDocuments /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
