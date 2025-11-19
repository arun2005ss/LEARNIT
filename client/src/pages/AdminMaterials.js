import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaFolderPlus, FaUpload, FaTrash, FaFolder } from 'react-icons/fa';
import './AdminMaterials.css';

const AdminMaterials = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState({ title: '', description: '' });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/materials/folders');
      setFolders(res.data);
    } catch (e) {
      console.error('Failed to load folders', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.title.trim()) return;
    try {
      setCreating(true);
      const res = await api.post('/api/materials/folders', newFolder);
      setFolders(prev => [res.data, ...prev]);
      setNewFolder({ title: '', description: '' });
    } catch (e) {
      console.error('Create folder failed', e);
    } finally {
      setCreating(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFolder || files.length === 0) return;
    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await api.post(`/api/materials/folders/${selectedFolder}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFolders(prev => prev.map(f => f._id === res.data._id ? res.data : f));
      setFiles([]);
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (folderId, fileId) => {
    try {
      await api.delete(`/api/materials/folders/${folderId}/files/${fileId}`);
      setFolders(prev => prev.map(f => {
        if (f._id !== folderId) return f;
        return { ...f, files: f.files.filter(file => file._id !== fileId) };
      }));
    } catch (e) {
      console.error('Delete file failed', e);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await api.delete(`/api/materials/folders/${folderId}`);
      setFolders(prev => prev.filter(f => f._id !== folderId));
      if (selectedFolder === folderId) setSelectedFolder(null);
    } catch (e) {
      console.error('Delete folder failed', e);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading materials...</p>
      </div>
    );
  }

  return (
    <div className="admin-materials">
      <div className="container">
        <div className="page-header">
          <h1>Materials</h1>
          <p>Create topic folders and upload PPT, PDF, Word, and Excel files</p>
        </div>

        <div className="create-folder">
          <form onSubmit={handleCreateFolder} className="folder-form">
            <input
              type="text"
              placeholder="Folder Title (Topic)"
              value={newFolder.title}
              onChange={(e) => setNewFolder(prev => ({ ...prev, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newFolder.description}
              onChange={(e) => setNewFolder(prev => ({ ...prev, description: e.target.value }))}
            />
            <button type="submit" className="btn primary" disabled={creating}>
              <FaFolderPlus style={{ marginRight: 6 }} /> Create Folder
            </button>
          </form>
        </div>

        <div className="upload-section">
          <select value={selectedFolder || ''} onChange={(e) => setSelectedFolder(e.target.value)}>
            <option value="">Select a folder</option>
            {folders.map(f => (
              <option key={f._id} value={f._id}>{f.title}</option>
            ))}
          </select>
          <input type="file" multiple onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" />
          <button className="btn" onClick={handleUpload} disabled={!selectedFolder || files.length === 0 || uploading}>
            <FaUpload style={{ marginRight: 6 }} /> Upload
          </button>
        </div>

        <div className="folders-grid">
          {folders.map(folder => (
            <div key={folder._id} className="folder-card">
              <div className="folder-header">
                <div className="folder-title">
                  <FaFolder className="folder-icon" />
                  <div>
                    <h3>{folder.title}</h3>
                    {folder.description && <p>{folder.description}</p>}
                  </div>
                </div>
                <button className="btn danger" onClick={() => handleDeleteFolder(folder._id)}>
                  <FaTrash />
                </button>
              </div>
              <div className="files-list">
                {folder.files.length === 0 && <div className="empty">No files uploaded</div>}
                {folder.files.map(file => (
                  <div key={file._id} className="file-row">
                    <a href={file.url} target="_blank" rel="noreferrer">{file.originalName}</a>
                    <span className="file-meta">{Math.round(file.size / 1024)} KB</span>
                    <button className="btn danger small" onClick={() => handleDeleteFile(folder._id, file._id)}>
                      <FaTrash />
                    </button>
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

export default AdminMaterials;


