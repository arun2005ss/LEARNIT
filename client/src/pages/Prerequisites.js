import React from 'react';
import { FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import './Prerequisites.css';

const links = [
  { name: 'MongoDB Community Server', url: 'https://www.mongodb.com/try/download/community', desc: 'Self-managed MongoDB for local development.' },
  { name: 'Visual Studio Code', url: 'https://code.visualstudio.com/download', desc: 'Free, extensible code editor.' },
  { name: 'GitHub Desktop', url: 'http://desktop.github.com/download/', desc: 'Simplified Git GUI client.' },
  { name: 'Oracle Downloads', url: 'http://oracle.com/in/downloads/', desc: 'Oracle software and tools.' },
  { name: 'Oracle Java JDK', url: 'https://www.oracle.com/java/technologies/downloads/', desc: 'Download Java Development Kit.' },
  { name: 'MATLAB Install Guide', url: 'https://www.mathworks.com/help/install/ug/install-products-with-internet-connection.html', desc: 'Instructions to install MATLAB.' },
  // Additional useful software
  { name: 'Node.js', url: 'https://nodejs.org/en/download', desc: 'JavaScript runtime for building backend and tools.' },
  { name: 'Git', url: 'https://git-scm.com/downloads', desc: 'Distributed version control system.' },
  { name: 'Postman', url: 'https://www.postman.com/downloads/', desc: 'API client for testing and documentation.' },
  { name: 'Docker Desktop', url: 'https://www.docker.com/products/docker-desktop/', desc: 'Build and run containers locally.' },
  { name: 'Python', url: 'https://www.python.org/downloads/', desc: 'Popular programming language installer.' },
  { name: 'Anaconda', url: 'https://www.anaconda.com/download', desc: 'Python/R distribution for data science.' },
  { name: 'MySQL Community Server', url: 'https://dev.mysql.com/downloads/mysql/', desc: 'Open-source relational database.' },
  { name: 'PostgreSQL', url: 'https://www.postgresql.org/download/', desc: 'Advanced open-source relational database.' },
  { name: 'DBeaver', url: 'https://dbeaver.io/download/', desc: 'Universal database client (GUI).' },
  { name: '7-Zip', url: 'https://www.7-zip.org/download.html', desc: 'Free file archiver and extractor.' }
];

const Prerequisites = () => {
  return (
    <div className="prereq">
      <div className="container">
        <div className="page-header">
          <h1>Prerequisites</h1>
          <p>Recommended software and tools for your learning environment.</p>
        </div>

        <div className="cards">
          {links.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="card">
              <div className="card-body">
                <div className="card-title">{link.name}</div>
                <div className="card-desc">{link.desc}</div>
              </div>
              <div className="card-action">
                <FaDownload className="dl-icon" />
                <FaExternalLinkAlt />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prerequisites;


