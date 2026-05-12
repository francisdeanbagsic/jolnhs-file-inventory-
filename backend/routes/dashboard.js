import express from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';
import Reminder from '../models/Reminder.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Base query
    const baseQuery = isAdmin ? {} : { uploadedBy: userId };

    // Total documents
    const totalDocuments = await Document.countDocuments(baseQuery);

    // Documents by category
    const documentsByCategory = await Document.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQuery = { 
      ...baseQuery, 
      createdAt: { $gte: sevenDaysAgo } 
    };
    
    const recentUploads = await Document.find(recentQuery)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Total users (admin only)
    let totalUsers = 0;
    let activeUsers = 0;
    if (isAdmin) {
      totalUsers = await User.countDocuments();
      activeUsers = await User.countDocuments({ isActive: true });
    }

    // Upcoming reminders
    const upcomingReminders = await Reminder.find({
      userId: userId,
      isCompleted: false,
      dueDate: { $gte: new Date() }
    })
    .sort({ dueDate: 1 })
    .limit(5);

    // This month's uploads
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const thisMonthQuery = {
      ...baseQuery,
      createdAt: { $gte: startOfMonth }
    };
    
    const thisMonthUploads = await Document.countDocuments(thisMonthQuery);

    res.json({
      totalDocuments,
      documentsByCategory: documentsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentUploads,
      totalUsers,
      activeUsers,
      upcomingReminders,
      thisMonthUploads
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent uploads (admin sees all, teachers see their own)
router.get('/recent', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const query = isAdmin ? {} : { uploadedBy: userId };

    const recentDocs = await Document.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(recentDocs);
  } catch (error) {
    console.error('Recent uploads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary for admin review
router.get('/summary', auth, adminOnly, async (req, res) => {
  try {
    // Documents per user
    const documentsPerUser = await Document.aggregate([
      {
        $group: {
          _id: '$uploadedBy',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userName: '$user.name',
          userEmail: '$user.email',
          userRole: '$user.role',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Category distribution
    const categoryDistribution = await Document.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Document.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      documentsPerUser,
      categoryDistribution,
      monthlyTrend
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
