import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { 
  FileText, Upload, Check, Send, Sparkles, MessageSquare, Edit2, Play, BookOpen, PenTool, Award, Search, ShieldCheck, Clock, Download, Brain, Trash2
} from 'lucide-react';
import { mockUser } from './data';
import classNames from 'classnames';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : '/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [appState, setAppState] = useState('welcome'); // 'welcome' | 'landing' | 'editor'
  
  const [docs, setDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [activeBlockId, setActiveBlockId] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/docs`).then(res => {
      setDocs(res.data);
      if(res.data.length > 0 && !activeDocId) setActiveDocId(res.data[0].id);
      setLoading(false);
    }).catch(err => {
      console.error("Backend offline. Please start backend server", err);
      setLoading(false);
    });
  }, [activeDocId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const activeDoc = docs.find(d => d.id === activeDocId);
  const activeVersion = activeDoc?.versions.find(v => v.v === activeDoc.currentVersion);

  const handleResolve = async (commentId) => {
    try {
      await axios.put(`${API_BASE}/docs/${activeDocId}/comments/${commentId}/resolve`);
      setDocs(docs.map(doc => {
        if (doc.id === activeDocId) {
          return {
            ...doc,
            comments: doc.comments.map(c => c.id === commentId ? { ...c, resolved: true } : c)
          };
        }
        return doc;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (text, blockId, author) => {
    if (!text) return;

    if (!blockId && author.role === 'Faculty Mentor') {
      try {
        const updatedDoc = { ...activeDoc, facultyFeedback: text };
        const res = await axios.put(`${API_BASE}/docs/${activeDocId}`, updatedDoc);
        setDocs(docs.map(doc => doc.id === activeDocId ? res.data : doc));
        setNotification({ type: 'success', message: 'Faculty Review posted successfully!' });
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const newComment = {
      // eslint-disable-next-line react-hooks/purity
      id: 'c' + Date.now(),
      blockId: blockId || null,
      author: author,
      text,
      resolved: false,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    try {
      await axios.post(`${API_BASE}/docs/${activeDocId}/comments`, newComment);
      setDocs(docs.map(doc => {
        if (doc.id === activeDocId) {
          return {
            ...doc,
            status: doc.status === 'draft' ? 'review' : doc.status,
            comments: [...doc.comments, newComment]
          };
        }
        return doc;
      }));
      setNotification({ type: 'success', message: 'Comment transmitted successfully!' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setNotification({ type: 'info', message: 'Removing review thread...' });
      await axios.delete(`${API_BASE}/docs/${activeDocId}/comments/${commentId}`);
      setDocs(docs.map(doc => {
        if (doc.id === activeDocId) {
          return {
            ...doc,
            comments: doc.comments.filter(c => c.id !== commentId)
          };
        }
        return doc;
      }));
      setNotification({ type: 'success', message: 'Review thread removed.' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to purge review.' });
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!docId) return;

    try {
      setNotification({ type: 'info', message: 'Purging document from archive...' });
      await axios.delete(`${API_BASE}/docs/${docId}`);
      
      const updatedDocs = docs.filter(d => d.id !== docId);
      setDocs(updatedDocs);
      
      if (updatedDocs.length > 0) {
        setActiveDocId(updatedDocs[0].id);
      } else {
        setActiveDocId(null);
        setAppState('landing');
      }
      setNotification({ type: 'success', message: 'Document removed successfully.' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'System error: Could not delete document.' });
    }
  };

  const handleRequestApproval = async () => {
    try {
      const updatedDoc = { ...activeDoc, status: 'pending_approval' };
      const res = await axios.put(`${API_BASE}/docs/${activeDocId}`, updatedDoc);
      setDocs(docs.map(d => d.id === activeDocId ? res.data : d));
      setNotification({ type: 'success', message: 'Approval requested from Faculty.' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (docPayload) => {
    const newDoc = {
      ...docPayload,
      author: currentUser.name
    };
    try {
      const res = await axios.post(`${API_BASE}/docs`, newDoc);
      setDocs([...docs, res.data]);
      setActiveDocId(res.data.id);
      setShowUploadModal(false);
      setAppState('editor');
      setNotification({ type: 'success', message: 'Document concept deployed to archive.' });
    } catch (err) { console.error(err); }
  };

  const handleRevise = async (updatedDoc) => {
    try {
      const res = await axios.put(`${API_BASE}/docs/${updatedDoc.id}`, updatedDoc);
      setDocs(docs.map(d => d.id === res.data.id ? res.data : d));
      setShowReviseModal(false);
      setNotification({ type: 'success', message: 'New version pushed successfully.' });
    } catch (err) { console.error(err); }
  };

  const handleDeleteBlock = async (blockId, sectionName) => {
    try {
      const updatedDoc = { ...activeDoc };
      const activeVersionObj = updatedDoc.versions.find(v => v.v === updatedDoc.currentVersion);
      
      const blockIndex = activeVersionObj.blocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        activeVersionObj.blocks.splice(blockIndex, 1);
      }

      const res = await axios.put(`${API_BASE}/docs/${activeDocId}`, updatedDoc);
      setDocs(docs.map(d => d.id === activeDocId ? res.data : d));
      setActiveBlockId(null);
      setNotification({ type: 'success', message: `Topic "${sectionName || 'Untitled'}" removed.` });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to remove topic.' });
    }
  };

  const handleExport = () => {
    setNotification({ type: 'success', message: 'Generating academic PDF transcript...' });
    setTimeout(() => {
      setNotification({ type: 'success', message: 'PDF Exported Successfully!' });
    }, 2000);
  };

  const commentsForPanel = activeDoc?.comments?.filter(c => !c.resolved && (!activeBlockId || c.blockId === activeBlockId)) || [];

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: '#0f172a' }}><h2>Connecting to backend...</h2></div>
  }

  return (
    <div className="app-viewport">
      <header className="glass-header">
        <div className="brand-title" onClick={() => setAppState('landing')} style={{ cursor: 'pointer' }}>
          <Sparkles size={24} color="var(--accent-cyan)" /> 
          LPU <span>PeerScript</span>
        </div>
        
        {appState === 'editor' && (
          <div className="nav-tabs">
            {docs.map(doc => (
              <button 
                key={doc.id}
                className={classNames('nav-tab', activeDocId === doc.id ? 'active' : '')}
                onClick={() => { setActiveDocId(doc.id); setActiveBlockId(null); }}
              >
                {doc.title.split(':')[0]} 
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {appState === 'editor' && (
            <button className="btn btn-outline" onClick={handleExport} style={{ border: 'none', background: 'transparent' }}>
              <Download size={18} />
            </button>
          )}
          <button className="btn btn-outline" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} /> Upload
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-pure)', fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.name}</div>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>{currentUser.role}</div>
            </div>
            <div className="avatar-circle">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000,
              padding: '12px 24px', borderRadius: '12px', 
              background: notification.type === 'error' ? '#ff3b30' : 'var(--text-pure)', 
              color: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Sparkles size={18} color={notification.type === 'error' ? '#fff' : 'var(--accent-cyan)'} />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="ai-mentor-orb" 
        onClick={() => setNotification({ type: 'info', message: 'AI Mentor: Use more scholarly active verbs in Section 2.' })}
        title="AI Writing Mentor"
      >
        <Brain size={24} color="#fff" />
      </div>

      {appState === 'welcome' ? (
        <WelcomeScreen onEnter={() => setAppState('landing')} />
      ) : appState === 'landing' ? (
        <main className="landing-stage">
          <div className="bg-glow-1"></div>
          <div className="bg-glow-2"></div>
          
          <motion.h1 
            className="welcome-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to <br/><span>LPU PeerScript</span>
          </motion.h1>
          
          <motion.p 
            className="welcome-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The official academic review platform for Lovely Professional University. Collaborate, review, and iterate to perfection.
          </motion.p>
          
          <motion.div 
            className="action-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="action-card" onClick={() => setShowUploadModal(true)}>
              <PenTool size={48} color="var(--accent-cyan)" />
              <h3>Draft New Review</h3>
              <p>Quickly upload a new academic essay or peer-review report for faculty assessment.</p>
            </div>
            
            <div className="action-card" onClick={() => setAppState('editor')}>
              <BookOpen size={48} color="var(--accent-purple)" />
              <h3>Access Archive</h3>
              <p>Visit previously written reviews, monitor peer threads, and respond to faculty feedback.</p>
            </div>
          </motion.div>
        </main>
      ) : (
        <main className="main-stage">
          <div className="doc-area">
            {activeDoc && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={activeDoc.id}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="doc-canvas"
              >
                <div className="doc-hero">
                  <div className="doc-meta" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
                    <span className="stat-pill">{activeDoc.status}</span>
                    <span className="stat-pill">v{activeDoc.currentVersion}</span>
                    
                    {activeDoc.integrity && (
                      <div className="integrity-badge">
                        <ShieldCheck size={14} /> 
                        Plagiarism: <span>{activeDoc.integrity.plagiarism}%</span> | AI Risk: <span>{activeDoc.integrity.aiRisk}</span>
                      </div>
                    )}
                    
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                      {activeDoc.status === 'revised' && (
                        <button 
                          className="btn btn-outline" 
                          style={{ color: 'var(--accent-purple)', borderColor: 'rgba(112,0,255,0.4)' }}
                          onClick={handleRequestApproval}
                        >
                          Request Approval
                        </button>
                      )}
                      <button className="btn btn-glow" onClick={() => setShowReviseModal(true)}>
                        <Edit2 size={16} /> Revise Model
                      </button>
                      <button className="btn btn-outline" style={{ borderColor: '#ff3b30', color: '#ff3b30' }} onClick={() => handleDeleteDoc(activeDoc.id)}>
                        <Trash2 size={16} /> Delete Essay
                      </button>
                    </div>
                  </div>
                  <h1 className="doc-title">{activeDoc.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-sub)', fontSize: '1rem', flexWrap: 'wrap' }}>
                    <p>Authored by <span style={{ color: 'var(--text-pure)', fontWeight: 600 }}>{activeDoc.author}</span></p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> {Math.ceil(activeVersion.blocks.reduce((acc, b) => acc + b.text.split(' ').length, 0) / 200)} min read</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14}/> {activeVersion.blocks.reduce((acc, b) => acc + b.text.split(' ').length, 0)} words</div>
                  </div>
                </div>

                <div className="doc-content-flow">
                  {activeVersion.blocks.map((block, index) => {
                    const blockComments = activeDoc.comments.filter(c => c.blockId === block.id && !c.resolved);
                    const hasThreads = blockComments.length > 0;
                    const showSection = block.section && (index === 0 || activeVersion.blocks[index - 1].section !== block.section);
                    const isActive = activeBlockId === block.id;

                    return (
                      <motion.div 
                        key={block.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {showSection && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
                            <h2 className="section-marker">{block.section}</h2>
                            <button
                              onClick={() => handleDeleteBlock(block.id, block.section)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-sub)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.9rem',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
                                e.currentTarget.style.color = '#ff3b30';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-sub)';
                              }}
                              title="Delete this topic"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                        
                        <div 
                          className={classNames('interactive-block', hasThreads ? 'has-threads' : '', isActive ? 'active' : '')}
                          onClick={() => setActiveBlockId(isActive ? null : block.id)}
                        >
                          {block.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {activeDoc && (
              <motion.div 
                initial={{ x: 420 }} 
                animate={{ x: 0 }} 
                className="comments-panel"
              >
                <div className="panel-header">
                  <h2><MessageSquare color="var(--accent-cyan)" /> Live Threads</h2>
                  <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '8px' }}>
                    {activeBlockId ? 'Targeted block interactions.' : 'Document overview.'}
                  </p>
                </div>

                <div className="panel-body">
                  <AnimatePresence>
                    {!activeBlockId && activeDoc.facultyFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="faculty-box"
                      >
                        <div className="faculty-title">
                          <Award color="var(--accent-purple)" size={18} /> Official Faculty Review
                        </div>
                        <p className="faculty-text">{activeDoc.facultyFeedback}</p>
                        
                        {activeDoc.rubric && (
                          <div className="rubric-container">
                             <div className="rubric-item">
                               <div className="rubric-header"><span>Rigor</span> <span>{activeDoc.rubric.rigor}/10</span></div>
                               <div className="rubric-bar-bg"><motion.div initial={{ width: 0 }} animate={{ width: `${activeDoc.rubric.rigor * 10}%` }} transition={{ duration: 1, delay: 0.2 }} className="rubric-bar-fill"></motion.div></div>
                             </div>
                             <div className="rubric-item">
                               <div className="rubric-header"><span>Originality</span> <span>{activeDoc.rubric.originality}/10</span></div>
                               <div className="rubric-bar-bg"><motion.div initial={{ width: 0 }} animate={{ width: `${activeDoc.rubric.originality * 10}%` }} transition={{ duration: 1, delay: 0.3 }} className="rubric-bar-fill"></motion.div></div>
                             </div>
                             <div className="rubric-item">
                               <div className="rubric-header"><span>Formatting</span> <span>{activeDoc.rubric.formatting}/10</span></div>
                               <div className="rubric-bar-bg"><motion.div initial={{ width: 0 }} animate={{ width: `${activeDoc.rubric.formatting * 10}%` }} transition={{ duration: 1, delay: 0.4 }} className="rubric-bar-fill"></motion.div></div>
                             </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {commentsForPanel.length === 0 && (
                      <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} style={{ textAlign: 'center', color: 'var(--text-sub)', marginTop: '40px' }}>
                        No ongoing threads.
                      </motion.div>
                    )}

                    {commentsForPanel.map(comment => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="thread-card"
                      >
                        <div className="thread-author">
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="author-name">{comment.author.name}</span>
                            <span className="author-role">{comment.author.role}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'transparent', border: 'none', color: '#ff3b30', cursor: 'pointer', opacity: 0.6 }}>
                              <Trash2 size={16} />
                            </button>
                            <button onClick={() => handleResolve(comment.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                              <Check size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="thread-text">{comment.text}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="compose-box">
                   <ComposeArea 
                      isGeneral={!activeBlockId} 
                      currentUser={currentUser}
                      onSend={(text, author) => handleAddComment(text, activeBlockId, author)} 
                      setCurrentUser={setCurrentUser}
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      <AnimatePresence>
        {showUploadModal && <UploadModal currentUser={currentUser} onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />}
        {showReviseModal && <ReviseModal currentUser={currentUser} doc={activeDoc} onClose={() => setShowReviseModal(false)} onRevise={handleRevise} />}
      </AnimatePresence>
    </div>
  );
}

function ComposeArea({ onSend, isGeneral, currentUser, setCurrentUser }) {
  const [text, setText] = useState('');
  const [selectedRole, setSelectedRole] = useState(currentUser.role);

  const roles = [
    'B.Tech CSE Scholar',
    'Faculty Mentor',
    'Senior Peer',
    'Postgrad Researcher'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
         <label style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
           {isGeneral ? 'General Review' : 'Targeting Active Block'}
         </label>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
           <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Act as:</span>
           {roles.map(role => (
             <button
               key={role}
               onClick={() => {
                 setSelectedRole(role);
                 setCurrentUser({ ...currentUser, role: role });
               }}
               style={{
                 fontSize: '0.65rem',
                 padding: '4px 10px',
                 borderRadius: '99px',
                 border: '1px solid',
                 borderColor: selectedRole === role ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                 background: selectedRole === role ? 'var(--accent-cyan-dim)' : 'transparent',
                 color: selectedRole === role ? 'var(--accent-cyan)' : 'var(--text-sub)',
                 cursor: 'pointer',
                 fontWeight: 600,
                 transition: 'all 0.2s'
               }}
             >
               {role.split(' ')[0]}
             </button>
           ))}
         </div>
       </div>
       <textarea 
         className="compose-textarea" 
         rows={3} 
         placeholder={isGeneral ? "Input general review or feedback..." : "Input critique..."}
         value={text}
         onChange={e => setText(e.target.value)}
       />
       <button className="btn btn-glow" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onSend(text, { ...currentUser, role: selectedRole }); setText(''); }}>
         Transmit <Send size={14}/>
       </button>
    </div>
  )
}

function WelcomeScreen({ onEnter }) {
  const techStack = [
    { name: 'React 19', icon: <Sparkles size={20} /> },
    { name: 'Vite 8', icon: <Play size={20} /> },
    { name: 'Framer Motion', icon: <Brain size={20} /> },
    { name: 'Lucide Icons', icon: <ShieldCheck size={20} /> },
    { name: 'Axios', icon: <Send size={20} /> },
    { name: 'Node.js', icon: <FileText size={20} /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="welcome-screen"
    >
      <div className="welcome-content">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="welcome-hero"
        >
          <div className="welcome-logo">
             <Sparkles size={48} color="var(--accent-cyan)" />
          </div>
          <h1>LPU PeerScript</h1>
          <p>The Premium Academic Peer Review & Collaborative Writing Engine</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="welcome-info"
        >
          <div className="info-card">
            <h3>What is PeerScript?</h3>
            <p>
              A high-integrity platform designed for Lovely Professional University scholars to collaborate 
              with faculty and peers. Streamline your essay reviews, track revisions, and receive 
              instant feedback with an AI-enhanced interface.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="tech-stack-grid"
        >
          {techStack.map((tech, i) => (
            <div key={i} className="tech-item">
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </motion.div>

        <motion.button 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-glow welcome-btn"
          onClick={onEnter}
        >
          Initialize Workspace <Play size={18} />
        </motion.button>
      </div>
      
      <div className="welcome-bg-glow"></div>
    </motion.div>
  );
}

function UploadModal({ onClose, onUpload, currentUser }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submit = () => {
    if(!title || !content) return;
    const blocks = content.split('\n\n').filter(p => p.trim()).map((text, i) => ({ id: 'b_' + Date.now() + '_' + i, text }));
    const newDoc = {
      id: 'd' + Date.now(),
      title,
      author: currentUser.name,
      status: 'draft',
      currentVersion: 1,
      versions: [{ v: 1, note: 'Initial Upload', timestamp: new Date().toISOString(), author: currentUser.name, blocks }],
      facultyFeedback: null,
      comments: []
    };
    onUpload(newDoc);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="modal-glass" onClick={e => e.stopPropagation()}>
        <h2 className="m-title">Draft New Concept</h2>
        <label className="f-label">Title</label>
        <input className="f-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g., Quantum Mechanics Review" />
        
        <label className="f-label">Content blocks (double spacer)</label>
        <textarea className="f-textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your draft here..." rows={6} />
        
        <div className="modal-actions">
           <button className="btn btn-outline" onClick={onClose}>Cancel</button>
           <button className="btn btn-glow" onClick={submit}>Deploy Document <Play size={14}/></button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReviseModal({ doc, onClose, onRevise, currentUser }) {
  const activeVersion = doc.versions.find(v => v.v === doc.currentVersion);
  const initialText = activeVersion.blocks.map(b => b.text).join('\n\n');
  const [content, setContent] = useState(initialText);

  const submit = () => {
    if(!content) return;
    const blocks = content.split('\n\n').filter(p => p.trim()).map((text, i) => {
      return { id: 'b_' + Date.now() + '_' + i, section: i === 0 ? 'Update' : undefined, text }; 
    });
    const updatedDoc = { ...doc };
    const newV = doc.currentVersion + 1;
    updatedDoc.currentVersion = newV;
    updatedDoc.status = 'revised';
    updatedDoc.versions.push({ v: newV, note: `Iterative Update ${newV}`, timestamp: new Date().toISOString(), author: currentUser.name, blocks });
    onRevise(updatedDoc);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="modal-glass" onClick={e => e.stopPropagation()}>
        <h2 className="m-title">Iterate Version {doc.currentVersion + 1}</h2>
        <textarea className="f-textarea" value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: '300px' }} />
        <div className="modal-actions">
           <button className="btn btn-outline" onClick={onClose}>Abort</button>
           <button className="btn btn-glow" onClick={submit}>Push Revision <Check size={14}/></button>
        </div>
      </motion.div>
    </motion.div>
  );
}


