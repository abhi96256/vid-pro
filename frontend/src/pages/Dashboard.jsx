import React, { useState, useEffect } from 'react';
import FileSidebar from '../components/FileSidebar';
import ChatInterface from '../components/ChatInterface';
import MediaViewer from '../components/MediaViewer';
import FileUploader from '../components/FileUploader';
import { fileService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [seekTime, setSeekTime] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fileService.listFiles();
      setFiles(data);
    } catch (err) {
      console.error('Failed to load files');
    }
  };

  const handleUploadSuccess = (newFile) => {
    setFiles([newFile, ...files]);
    setSelectedFile(newFile);
  };

  const handleSeek = (time) => {
    setSeekTime(time);
    setTimeout(() => setSeekTime(null), 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 100%)' }}>
      {/* Header */}
      <header className="glass-card" style={{ 
        margin: '15px 20px', 
        padding: '12px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '8px', 
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            <Sparkles color="white" size={24} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '1.4rem' }}>VidInsight AI</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
            <User size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Vidya</span>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '0 20px 20px 20px', gap: '20px' }}>
        <FileSidebar 
          files={files} 
          onFileSelect={setSelectedFile} 
          selectedFileId={selectedFile?.id} 
          onUploadClick={() => setIsUploaderOpen(true)} 
          onFilesUpdate={loadFiles}
        />
        
        <main style={{ flex: 1, display: 'flex', gap: '20px', minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div 
                key={selectedFile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ flex: 1, display: 'flex', gap: '20px', minWidth: 0 }}
              >
                <ChatInterface selectedFile={selectedFile} onSeek={handleSeek} />
                <MediaViewer file={selectedFile} seekTime={seekTime} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(56, 189, 248, 0.1)', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                  }}>
                    <Sparkles size={40} color="var(--accent-primary)" />
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Ready to analyze?</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                    Select a file from the sidebar or upload a new one to start your AI-powered multimedia analysis journey.
                  </p>
                  <button 
                    onClick={() => setIsUploaderOpen(true)}
                    className="btn-premium" 
                    style={{ margin: '0 auto' }}
                  >
                    Upload File
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <FileUploader 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
        onUploadSuccess={handleUploadSuccess} 
      />
    </div>
  );
};

export default Dashboard;
