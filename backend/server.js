/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const { initialDocs } = require('./seedData.js');

const DB_FILE = path.join(__dirname, 'db.json');
const defaultUsers = [
  { id: 'u1', name: 'Aditya', email: 'aditya@lpu.in', password: 'password', role: 'B.Tech CSE Scholar', avatar: null },
  { id: 'u2', name: 'Dr. R. Sharma', email: 'faculty@lpu.in', password: 'password', role: 'Faculty Mentor', avatar: null },
  { id: 'u3', name: 'Kabir Singh', email: 'kabir@lpu.in', password: 'password', role: 'Senior Peer', avatar: null }
];

function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialState = { docs: initialDocs, users: defaultUsers };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
    return initialState;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Could not read database file, using seed data instead.', error);
    return { docs: initialDocs, users: defaultUsers };
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const db = loadDatabase();

app.get('/', (req, res) => {
  return res.json({ message: 'PeerScript Backend API is running', status: 'active' });
});

app.get('/api/docs', (req, res) => {
  return res.json(db.docs);
});

app.get('/api/docs/:id', (req, res) => {
  const doc = db.docs.find(item => item.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  return res.json(doc);
});

app.post('/api/docs', (req, res) => {
  const newDoc = req.body;
  if (!newDoc || !newDoc.id) return res.status(400).json({ error: 'Document payload must include an id' });
  if (db.docs.some(doc => doc.id === newDoc.id)) return res.status(409).json({ error: 'Document already exists' });

  db.docs.push(newDoc);
  saveDatabase(db);
  return res.status(201).json(newDoc);
});

app.put('/api/docs/:id', (req, res) => {
  const updatedDoc = req.body;
  const existingIndex = db.docs.findIndex(doc => doc.id === req.params.id);
  if (existingIndex === -1) return res.status(404).json({ error: 'Document not found' });

  db.docs[existingIndex] = updatedDoc;
  saveDatabase(db);
  return res.json(updatedDoc);
});

app.delete('/api/docs/:id', (req, res) => {
  console.log('DELETE /api/docs/:id called with id:', req.params.id);
  const existingIndex = db.docs.findIndex(doc => doc.id === req.params.id);
  if (existingIndex === -1) {
    console.log('Document not found for id:', req.params.id);
    return res.status(404).json({ error: 'Document not found' });
  }

  db.docs.splice(existingIndex, 1);
  saveDatabase(db);
  console.log('Document deleted successfully');
  return res.json({ success: true, message: 'Document deleted successfully' });
});

app.post('/api/docs/:id/comments', (req, res) => {
  const newComment = req.body;
  const doc = db.docs.find(item => item.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (!newComment || !newComment.id) return res.status(400).json({ error: 'Comment payload must include an id' });

  doc.comments = [...(doc.comments || []), newComment];
  if (doc.status === 'draft') doc.status = 'review';
  saveDatabase(db);
  return res.status(201).json(newComment);
});

app.put('/api/docs/:docId/comments/:commentId/resolve', (req, res) => {
  const doc = db.docs.find(item => item.id === req.params.docId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  let updated = false;
  doc.comments = (doc.comments || []).map(comment => {
    if (comment.id === req.params.commentId) {
      updated = true;
      return { ...comment, resolved: true };
    }
    return comment;
  });

  if (!updated) return res.status(404).json({ error: 'Comment not found' });
  saveDatabase(db);
  return res.json({ success: true });
});

app.delete('/api/docs/:docId/comments/:commentId', (req, res) => {
  const doc = db.docs.find(item => item.id === req.params.docId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const initialCount = doc.comments ? doc.comments.length : 0;
  doc.comments = (doc.comments || []).filter(c => c.id !== req.params.commentId);

  if (doc.comments.length === initialCount) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  saveDatabase(db);
  return res.json({ success: true, message: 'Comment deleted successfully' });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (db.users.some(user => user.email === email)) return res.status(400).json({ error: 'Email already exists' });

  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password,
    role: role || 'B.Tech CSE Scholar',
    avatar: null
  };
  db.users.push(newUser);
  saveDatabase(db);
  return res.status(201).json(newUser);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running flawlessly on port ${PORT}`);
});
