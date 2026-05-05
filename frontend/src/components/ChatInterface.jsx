import React, { useState, useEffect, useRef } from 'react';
import { Send, Play, Bot, User, Sparkles } from 'lucide-react';
import { chatService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = ({ selectedFile, onSeek }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedFile) {
      loadHistory();
    }
  }, [selectedFile]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const data = await chatService.getHistory(selectedFile.id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedFile) return;

    const userMsg = { content: input, role: 'user', id: Date.now() };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const assistantMsg = await chatService.sendMessage(selectedFile.id, input);
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractTimestamp = (text) => {
    const match = text.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const mins = parseInt(match[1]);
      const secs = parseInt(match[2]);
      return mins * 60 + secs;
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      flex: 1, 
      minWidth: 0,
      overflow: 'hidden'
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: 'rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Bot size={22} color="var(--accent-primary)" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Analysis Chat</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Powered by Llama 3.3</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px dashed var(--border-glass)' }}>
                <Sparkles size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem' }}>Ask anything about {selectedFile.filename}</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const timestamp = msg.role === 'assistant' ? extractTimestamp(msg.content) : null;
              return (
                <motion.div 
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '12px'
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', flexShrink: 0 }}>
                      <Bot size={18} color="white" />
                    </div>
                  )}
                  
                  <div style={{ 
                    maxWidth: '85%', 
                    padding: '14px 18px', 
                    borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    background: msg.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-glass)',
                    color: 'white',
                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(56, 189, 248, 0.2)' : 'none'
                  }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', wordBreak: 'break-word' }}>{msg.content}</p>
                    
                    {timestamp !== null && (
                      <button 
                        onClick={() => onSeek(timestamp)}
                        style={{ 
                          marginTop: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          background: 'rgba(255,255,255,0.1)', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: 'white',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      >
                        <Play size={14} style={{ marginRight: '6px' }} /> Jump to scene at {Math.floor(timestamp/60)}:{(timestamp%60).toString().padStart(2, '0')}
                      </button>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', flexShrink: 0 }}>
                      <User size={18} color="white" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
          >
            <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
            <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%', animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%', animationDelay: '0.4s' }}></div>
            <span style={{ marginLeft: '4px' }}>AI is thinking...</span>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} style={{ padding: '24px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          className="input-field"
          placeholder="Ask a question about this file..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-premium" style={{ width: '48px', height: '48px', padding: 0, justifyContent: 'center' }}>
          <Send size={20} />
        </button>
      </form>

      <style>{`
        @keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .typing-dot { animation: blink 1.4s infinite; }
      `}</style>
    </div>
  );
};

export default ChatInterface;
