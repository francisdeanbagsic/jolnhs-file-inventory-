import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import { auth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Get all documents (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { category, search, startDate, endDate, uploadedBy, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query.uploadedBy = req.user._id;
    }
    
    if (category) query.category = category;
    if (uploadedBy && req.user.role === 'admin') query.uploadedBy = uploadedBy; // Only admins can filter by uploader
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search documents
router.get('/search', auth, async (req, res) => {
  try {
    const { q, category } = req.query;
    
    const query = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };
    
    if (category) query.category = category;

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name')
      .limit(50);

    res.json(documents);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, category, description, tags } = req.body;

    if (!title || !category) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const document = new Document({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      category,
      uploadedBy: req.user._id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      description,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await document.save();
    await document.populate('uploadedBy', 'name email');

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is admin or the uploader
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download document
router.get('/:id/download', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '../uploads', document.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, document.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
