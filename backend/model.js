const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true },
  wing: { type: String, required: true },
  floor: { type: String, required: true },
  residentName: { type: String, required: true },
  phone: { type: String, required: true },
  problemType: { type: String, required: true, enum: ['Plumber', 'Carpenter', 'Electrician', 'Painter', 'Cleaner', 'Other'] },
  description: { type: String, required: true },
  image: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Resolved'] },
  priority: { type: String, default: 'Normal', enum: ['Urgent', 'Normal', 'Low'] },
  assignedWorker: { type: String, default: '' },
  assignedWorkerPhone: { type: String, default: '' },
  managerReply: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
module.exports.Notice = mongoose.model('Notice', noticeSchema);
