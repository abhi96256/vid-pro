import React, { useRef, useEffect, useState } from 'react';
import { FileText, Music, Video as VideoIcon, Info, Layout, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MediaViewer = ({ file, seekTime }) => {
  const mediaRef = useRef(null);
  const [pdfError, setPdfError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (seekTime !== null && mediaRef.current) {
      mediaRef.current.currentTime = seekTime;
      mediaRef.current.play();
    }
  }, [seekTime]);

  useEffect(() => {
    setPdfError(false);
  }, [file]);

  if (!file) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const fileUrl = file?.file_path?.startsWith('http') 
    ? file.file_path 
    : (file?.file_path ? `${API_URL}/uploads/${file.file_path.split(/[\\/]/).pop()}` : '');

  const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}&key=${refreshKey}`;

  return (
    <div style={{ width: '440px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            {file.file_type === 'pdf' && (
              <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                title="Reload Preview"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {file.file_type}
            </div>
          </div>
        </div>

        <div style={{ 
          aspectRatio: '4/5', 
          background: '#000', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-glass)',
          position: 'relative'
        }}>
          {file.file_type === 'pdf' ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <img 
                src={fileUrl.replace(/\.pdf$/, '.jpg')} 
                alt="PDF Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setPdfError(true);
                }}
              />
              {pdfError && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <FileText size={48} style={{ marginBottom: '10px', opacity: 0.3, margin: '0 auto' }} />
                  <p>Preview not available</p>
                </div>
              )}
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
        
        {file.file_type === 'pdf' && (
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              marginTop: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              fontSize: '0.85rem', 
              color: 'var(--accent-primary)', 
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.05)'
            }}
          >
            <ExternalLink size={14} /> Open Full Document
          </a>
        )}
      </div>

      <div className="glass-card" style={{ 
        flex: '1 1 300px',
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0, 
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}>
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
          whiteSpace: 'pre-wrap',
          scrollbarWidth: 'thin'
        }}>
          <div style={{ 
            padding: '4px 10px', 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: 'var(--accent-primary)', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            display: 'inline-block',
            marginBottom: '12px',
            flexShrink: 0
          }}>
            EXECUTIVE SUMMARY
          </div>
          {file.summary || "Analyzing content to generate executive intelligence report..."}
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;
