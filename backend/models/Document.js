import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
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
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Document = mongoose.model('Document', documentSchema);

export default Document;
