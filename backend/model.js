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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
