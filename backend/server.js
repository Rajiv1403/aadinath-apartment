const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Complaint = require('./model');
const { Notice } = require('./model');
const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Manager Login
app.post('/api/manager/login', (req, res) => {
  const { phone, password } = req.body;
  if (phone === process.env.MANAGER_PHONE && password === process.env.MANAGER_PASSWORD) {
    res.json({ success: true, token: 'manager-authenticated' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid phone or password' });
  }
});

// Submit complaint
app.post('/api/complaints', upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const complaint = await Complaint.create(data);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Track complaints by phone
app.get('/api/complaints/track/:phone', async (req, res) => {
  const complaints = await Complaint.find({ phone: req.params.phone }).sort({ createdAt: -1 });
  res.json(complaints);
});

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  const complaints = await Complaint.find().sort({ priority: 1, createdAt: -1 });
  res.json(complaints);
});

// Update complaint (status, reply, worker, priority)
app.patch('/api/complaints/:id', async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(complaint);
});

// Delete complaint
app.delete('/api/complaints/:id', async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Get all notices
app.get('/api/notices', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
});

// Create notice
app.post('/api/notices', async (req, res) => {
  const notice = await Notice.create(req.body);
  res.status(201).json(notice);
});

// Delete notice
app.delete('/api/notices/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch(err => console.error(err));
