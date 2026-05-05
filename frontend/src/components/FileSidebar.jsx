import React from 'react';
import { Plus, FileText, Music, Video, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FileSidebar = ({ files, onFileSelect, selectedFileId, onUploadClick }) => {
  return (
    <aside className="glass-card" style={{ 
      width: '320px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Files</h2>
        <button 
          onClick={onUploadClick}
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'rgba(56, 189, 248, 0.1)', 
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          className="hover-scale"
        >
          <Plus size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No files yet. Start by uploading one!
          </div>
        ) : (
          files.map((file, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={file.id}
              onClick={() => onFileSelect(file)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: selectedFileId === file.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                border: selectedFileId === file.id ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
              className="sidebar-item"
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px',
                background: file.file_type === 'pdf' ? 'rgba(248, 113, 113, 0.1)' : 
                           file.file_type === 'audio' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {file.file_type === 'pdf' ? <FileText size={20} color="#f87171" /> : 
                 file.file_type === 'audio' ? <Music size={20} color="#fbbf24" /> : 
                 <Video size={20} color="#34d399" />}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: selectedFileId === file.id ? 'white' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {file.filename}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Clock size={12} />
                  {new Date(file.created_at).toLocaleDateString()}
                </div>
              </div>

              {selectedFileId === file.id && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight size={16} color="var(--accent-primary)" />
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
      
      <style>{`
        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: translateX(4px);
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
      `}</style>
    </aside>
  );
};

export default FileSidebar;
