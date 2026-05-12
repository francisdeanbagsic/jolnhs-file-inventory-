import express from 'express';
import Reminder from '../models/Reminder.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all reminders for current user
router.get('/', auth, async (req, res) => {
  try {
    const { completed } = req.query;
    
    const query = { userId: req.user._id };
    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    const reminders = await Reminder.find(query)
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reminder
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, dueDate, notes } = req.body;

    if (!title || !category || !dueDate) {
      return res.status(400).json({ message: 'Title, category, and due date are required' });
    }

    const reminder = new Reminder({
      title,
      category,
      dueDate: new Date(dueDate),
      userId: req.user._id,
      notes
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reminder
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, dueDate, isCompleted, notes } = req.body;
    
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (title) reminder.title = title;
    if (category) reminder.category = category;
    if (dueDate) reminder.dueDate = new Date(dueDate);
    if (typeof isCompleted === 'boolean') reminder.isCompleted = isCompleted;
    if (notes !== undefined) reminder.notes = notes;

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await reminder.deleteOne();
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.isCompleted = true;
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error('Complete reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Snooze reminder (push due date)
router.post('/:id/snooze', auth, async (req, res) => {
  try {
    const { days = 1 } = req.body;
    
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const newDueDate = new Date(reminder.dueDate);
    newDueDate.setDate(newDueDate.getDate() + parseInt(days));
    reminder.dueDate = newDueDate;
    
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error('Snooze reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
