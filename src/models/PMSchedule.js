const mongoose = require('mongoose');

const pmScheduleSchema = new mongoose.Schema({
  pmId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String
  },
  asset: {
    type: String,
    required: [true, 'Please provide asset information']
  },
  frequency: {
    type: String,
    required: true,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']
  },
  nextDueDate: {
    type: Date,
    required: true
  },
  lastCompletedDate: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedToName: String,
  status: {
    type: String,
    enum: ['Scheduled', 'Upcoming', 'Overdue', 'Completed'],
    default: 'Scheduled'
  },
  checklist: [{
    item: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date
  }],
  completionNotes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate pmId
pmScheduleSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('PMSchedule').countDocuments();
    this.pmId = `PM-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Update status based on dates
pmScheduleSchema.pre('save', function(next) {
  const now = new Date();
  const dueDate = new Date(this.nextDueDate);
  const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  if (this.status !== 'Completed') {
    if (daysUntilDue < 0) {
      this.status = 'Overdue';
    } else if (daysUntilDue <= 7) {
      this.status = 'Upcoming';
    } else {
      this.status = 'Scheduled';
    }
  }
  
  next();
});

module.exports = mongoose.model('PMSchedule', pmScheduleSchema);