import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Music, Video, Loader } from 'lucide-react';
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
      setError('Upload failed. Ensure backend is running and OpenAI key is valid.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'video/mp4': ['.mp4']
    },
    multiple: false
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass"
            style={{ position: 'relative', width: '90%', maxWidth: '500px', padding: '40px', textAlign: 'center' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '10px' }}>Upload Content</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>PDF, Audio (MP3/WAV), or Video (MP4)</p>

            <div 
              {...getRootProps()} 
              style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: '16px', 
                padding: '40px', 
                cursor: 'pointer',
                background: isDragActive ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                borderColor: isDragActive ? 'var(--accent-primary)' : 'var(--border-color)',
                transition: 'all 0.2s'
              }}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Loader className="spin" size={48} color="var(--accent-primary)" style={{ marginBottom: '15px' }} />
                  <p>Processing & Indexing... This may take a minute.</p>
                </div>
              ) : (
                <>
                  <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '15px' }} />
                  <p>{isDragActive ? "Drop it here!" : "Drag & drop file here, or click to select"}</p>
                </>
              )}
            </div>

            {error && <p style={{ color: '#ef4444', marginTop: '20px' }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
              <FileText size={24} color="var(--text-muted)" />
              <Music size={24} color="var(--text-muted)" />
              <Video size={24} color="var(--text-muted)" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FileUploader;
