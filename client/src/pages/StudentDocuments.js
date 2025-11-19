import React, { useEffect, useState } from 'react';
import { FaFolder, FaDownload, FaSyncAlt } from 'react-icons/fa';
import api from '../api/axios';
import './StudentDocuments.css';

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/documents/public');
      console.log('Student: Loaded documents:', response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const toggleDocument = (documentId) => {
    setExpanded(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }));
  };

  const handleRefresh = () => {
    console.log('Student: Manual refresh');
    loadDocuments();
  };

  const handleDownload = async (documentId, fileId, filename) => {
    try {
      const response = await axios.get(`/api/documents/${documentId}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="stu-docs">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stu-docs">
      <div className="container">
        <div className="page-header">
          <h1>Documents</h1>
          <p>View and download course documents shared by your teachers.</p>
          <button className="refresh-btn" onClick={handleRefresh} title="Refresh">
            <FaSyncAlt /> Refresh
          </button>
        </div>

        <div className="documents">
          {documents.length === 0 && (
            <div className="empty-state">
              <FaFolder className="empty-icon" />
              <h3>No documents available</h3>
              <p>Your teachers haven't shared any documents yet.</p>
            </div>
          )}
          
          {documents.map(doc => (
            <div key={doc._id} className="document-card">
              <button 
                className="document-head" 
                onClick={() => toggleDocument(doc._id)}
              >
                <FaFolder className="folder-icon" />
                <span className="title">{doc.title}</span>
                <span className="file-count">({doc.files.length} files)</span>
                {doc.createdBy && (
                  <span className="author">by {doc.createdBy.fullName || doc.createdBy.username}</span>
                )}
              </button>
              
              {expanded[doc._id] && (
                <div className="files">
                  {doc.files.length === 0 && (
                    <div className="empty">No files in this document</div>
                  )}
                  {doc.files.map(file => (
                    <div key={file._id} className="file-item">
                      <div className="file-info">
                        <span className="file-name">{file.originalName}</span>
                        <span className="file-size">{Math.round(file.size/1024)} KB</span>
                      </div>
                      <button 
                        className="download-btn"
                        onClick={() => handleDownload(doc._id, file._id, file.originalName)}
                        title="Download file"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDocuments;