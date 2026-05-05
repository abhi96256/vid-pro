import React, { useRef, useEffect } from 'react';
import { FileText, Music, Video as VideoIcon, Info, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const MediaViewer = ({ file, seekTime }) => {
  const mediaRef = useRef(null);

  useEffect(() => {
    if (seekTime !== null && mediaRef.current) {
      mediaRef.current.currentTime = seekTime;
      mediaRef.current.play();
    }
  }, [seekTime]);

  if (!file) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const fileUrl = file?.file_path ? `${API_URL}/${file.file_path.replace(/\\/g, '/')}` : '';

  return (
    <div style={{ width: '420px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Media Player Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {file.file_type === 'pdf' ? <FileText color="#f87171" size={18} /> : 
             file.file_type === 'audio' ? <Music color="#fbbf24" size={18} /> : 
             <VideoIcon color="#34d399" size={18} />}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.filename}
            </h3>
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {file.file_type}
          </div>
        </div>

        <div style={{ 
          aspectRatio: '16/9', 
          background: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-glass)'
        }}>
          {file.file_type === 'pdf' ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <FileText size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full PDF Preview available in Pro version</p>
            </div>
          ) : file.file_type === 'audio' ? (
            <div style={{ width: '100%', padding: '20px', textAlign: 'center' }}>
              <Music size={40} color="var(--accent-primary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
              <audio ref={mediaRef} controls style={{ width: '100%', height: '36px' }}>
                <source src={fileUrl} type="audio/mpeg" />
              </audio>
            </div>
          ) : (
            <video ref={mediaRef} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
              <source src={fileUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </div>

      {/* Intelligence/Summary Card */}
      <div className="glass-card" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={18} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Intelligence Report</h4>
        </div>
        
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          borderRadius: '12px', 
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-glass)',
          fontSize: '0.9rem',
          lineHeight: '1.7',
          color: '#cbd5e1',
          whiteSpace: 'pre-wrap'
        }}>
          <div style={{ 
            padding: '4px 10px', 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: 'var(--accent-primary)', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            EXECUTIVE SUMMARY
          </div>
          {file.summary || "Analyzing content to generate executive intelligence report..."}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>Processed</div>
          </div>
          <div style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>AI Model</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Llama 3.3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;
