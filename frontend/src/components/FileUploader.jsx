import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Music, Video, Loader, Sparkles } from 'lucide-react';
import { fileService } from '../services/api';

const FileUploader = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      const result = await fileService.upload(acceptedFiles[0]);
      onUploadSuccess(result);
      onClose();
    } catch (err) {
      setError('Upload failed. The AI model might be busy or the file format is unsupported.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4']
    },
    multiple: false
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(2, 6, 23, 0.85)', 
              backdropFilter: 'blur(12px)' 
            }}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card"
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '540px', 
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <motion.button 
              whileHover={{ rotate: 90 }}
              onClick={onClose} 
              style={{ 
                position: 'absolute', 
                top: '24px', 
                right: '24px', 
                background: 'rgba(255,255,255,0.05)', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text-secondary)',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </motion.button>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                <Sparkles size={14} /> AI Media Processor
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Upload Content</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Analyze PDF, Audio (MP3/WAV), or Video (MP4)</p>
            </div>

            <div 
              {...getRootProps()} 
              style={{ 
                border: '2px dashed', 
                borderRadius: '24px', 
                padding: '60px 40px', 
                cursor: 'pointer',
                background: isDragActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0,0,0,0.2)',
                borderColor: isDragActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <input {...getInputProps()} />
              
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Loader className="spin" size={60} color="var(--accent-primary)" />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                       <Upload size={24} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
                    </div>
                  </div>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Processing Intelligence...</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Extracting semantic markers and generating summary.</p>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(56, 189, 248, 0.1)', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <Upload size={32} color="var(--accent-primary)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>
                    {isDragActive ? "Release to process" : "Drop your file here"}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Maximum file size: 4MB (Vercel Free Limit)
                  </p>
                </motion.div>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  color: '#f87171', 
                  fontSize: '0.85rem', 
                  marginTop: '20px', 
                  padding: '12px', 
                  background: 'rgba(239,68,68,0.1)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(239,68,68,0.2)',
                  textAlign: 'center'
                }}
              >
                {error}
              </motion.div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '32px', 
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(248, 113, 113, 0.1)' }}>
                  <FileText size={20} color="#f87171" />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PDF</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)' }}>
                  <Music size={20} color="#fbbf24" />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AUDIO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)' }}>
                  <Video size={20} color="#34d399" />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>VIDEO</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FileUploader;
