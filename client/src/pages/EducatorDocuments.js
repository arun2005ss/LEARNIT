import React, { useEffect, useState } from 'react';
import { FaFolderPlus, FaUpload, FaTrash, FaFolder, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import './EducatorDocuments.css';

const EducatorDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/documents');
      console.log('Loaded documents:', response.data);
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

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newDocument.trim()) return;
    
    try {
      const response = await axios.post('/api/documents', {
        title: newDocument.trim(),
        description: ''
      });
      
      setDocuments([response.data, ...documents]);
      setNewDocument('');
      console.log('Document created:', response.data);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedDocument || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`/api/documents/${selectedDocument}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setDocuments(documents.map(doc => 
        doc._id === selectedDocument ? response.data : doc
      ));
      setFiles([]);
      setSelectedDocument('');
      console.log('Files uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document and all its files?')) {
      return;
    }

    try {
      await axios.delete(`/api/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      console.log('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteFile = async (documentId, fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/documents/${documentId}/files/${fileId}`);
      setDocuments(documents.map(doc => 
        doc._id === documentId ? response.data : doc
      ));
      console.log('File deleted');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file: ' + (error.response?.data?.message || 'Unknown error'));
    }
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
      <div className="edu-docs">
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
    <div className="edu-docs">
      <div className="container">
        <div className="page-header">
          <h1>Documents</h1>
          <p>Create document folders and upload files for students to access.</p>
        </div>

        <div className="actions-section">
          <form className="create-document-form" onSubmit={handleCreateDocument}>
            <div className="form-group">
              <input
                type="text"
                placeholder="New document title"
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
                className="form-input"
                required
              />
              <button className="btn btn-primary" type="submit">
                <FaFolderPlus /> Create Document
              </button>
            </div>
          </form>

          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group">
              <select 
                value={selectedDocument} 
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select document to upload files</option>
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
              
              <div className="file-input-wrapper">
                <input
                  type="file"
                  multiple
                  onChange={onFileChange}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-input-label">
                  <FaUpload /> Choose Files
                </label>
                {files.length > 0 && (
                  <span className="file-count">{files.length} file(s) selected</span>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={!selectedDocument || files.length === 0 || uploading}
              >
                <FaUpload /> 
                {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
              </button>
            </div>
          </form>
        </div>

        <div className="documents">
          {documents.length === 0 && (
            <div className="empty-state">
              <FaFolder className="empty-icon" />
              <h3>No documents yet</h3>
              <p>Create your first document to start organizing files.</p>
            </div>
          )}
          
          {documents.map(doc => (
            <div key={doc._id} className="document-card">
              <div className="document-head">
                <div className="title">
                  <FaFolder className="folder-icon" />
                  <h3>{doc.title}</h3>
                  <span className="file-count">({doc.files.length} files)</span>
                </div>
                <button 
                  className="btn danger" 
                  onClick={() => handleDeleteDocument(doc._id)}
                  title="Delete document"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="files">
                {doc.files.length === 0 && (
                  <div className="empty">No files in this document</div>
                )}
                {doc.files.map(file => (
                  <div key={file._id} className="file-row">
                    <div className="file-info">
                      <span className="file-name">{file.originalName}</span>
                      <span className="file-size">{Math.round(file.size/1024)} KB</span>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="btn success small"
                        onClick={() => handleDownload(doc._id, file._id, file.originalName)}
                        title="Download file"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        className="btn danger small" 
                        onClick={() => handleDeleteFile(doc._id, file._id)}
                        title="Delete file"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducatorDocuments;