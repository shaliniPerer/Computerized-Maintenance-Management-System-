const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `WO-${Date.now()}` // safer unique ID
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: true,
    enum: ['HVAC', 'Electrical', 'Plumbing', 'Fire Safety']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Emergency', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Completed', 'Verified'],
    default: 'Open'
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedToName: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  activityLog: [{
    action: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
  }],
  completedAt: Date,
  verifiedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema);
