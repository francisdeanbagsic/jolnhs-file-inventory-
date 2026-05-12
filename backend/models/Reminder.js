import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'feeding/health',
      'drrm',
      'test result',
      'lac/inset',
      'gulayan sa paaralan',
      'aral',
      'literacy report',
      'guidance report',
      'LR report',
      'YES-o',
      'SSLG',
      'BKD',
      'research report',
      'brigada',
      'OITSP',
      'SBM',
      'SGC',
      'Boys/girls scout',
      'LIS/BEIS report',
      'PRAES',
      'STE',
      'sp-ict',
      'sports'
    ]
  },
  dueDate: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
