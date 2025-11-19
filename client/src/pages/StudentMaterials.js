import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFilePdf, FaFilePowerpoint, FaFileWord, FaFileExcel, FaDownload } from 'react-icons/fa';
import './StudentMaterials.css';

const iconForMime = (mime) => {
  if (mime === 'application/pdf') return <FaFilePdf className="file-icon pdf" />;
  if (mime.includes('presentation')) return <FaFilePowerpoint className="file-icon ppt" />;
  if (mime.includes('word')) return <FaFileWord className="file-icon doc" />;
  if (mime.includes('excel') || mime.includes('sheet')) return <FaFileExcel className="file-icon xls" />;
  return <FaDownload className="file-icon" />;
};

const StudentMaterials = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/materials/folders');
        setFolders(res.data);
      } catch (e) {
        console.error('Failed to load materials', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const toggleFolder = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
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
    <div className="student-materials">
      <div className="container">
        <div className="page-header">
          <h1>Materials</h1>
          <p>Browse topic folders and view PPT, PDF, Word, and Excel files</p>
        </div>

        <div className="folders-list">
          {folders.map(folder => (
            <div key={folder._id} className="folder-item">
              <button className="folder-toggle" onClick={() => toggleFolder(folder._id)}>
                <FaFolder className="folder-icon" />
                <span className="folder-title">{folder.title}</span>
                {folder.description && <span className="folder-desc">{folder.description}</span>}
              </button>
              {expanded[folder._id] && (
                <div className="files">
                  {folder.files.length === 0 && <div className="empty">No files available</div>}
                  {folder.files.map(file => (
                    <a key={file._id} href={file.url} target="_blank" rel="noreferrer" className="file-link">
                      {iconForMime(file.mimeType)}
                      <span className="file-name">{file.originalName}</span>
                      <span className="file-size">{Math.round(file.size / 1024)} KB</span>
                    </a>
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

export default StudentMaterials;


