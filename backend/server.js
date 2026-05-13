import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import documentRoutes from './routes/document.js';
import reminderRoutes from './routes/reminder.js';
import dashboardRoutes from './routes/dashboard.js';
import User from './models/User.js';
import dns from "node:dns";
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb+srv://documentsjolnhs_db_user:W44IpN2nrKVt3lai@documentsjolnhs.vixzw7d.mongodb.net/?appName=documentsJolnhs';

const ADMIN_EMAIL = 'admin@jonhs.edu.ph';
const ADMIN_PASSWORD = '  ';
const ADMIN_NAME ='System Administrator';

const allowedOrigins = ['https://jolnhs-acr.onrender.com','http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked request from ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JONHS Document System API is running' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
      if (!existingAdmin) {
        await User.create({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: ADMIN_NAME,
          role: 'admin',
          isActive: true
        });
        console.log(`Default admin created: ${ADMIN_EMAIL}`);
      } else {
        console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
        // Update admin password to ensure it's correct
        existingAdmin.password = ADMIN_PASSWORD;
        await existingAdmin.save();
        console.log(`Admin password reset to default: ${ADMIN_EMAIL}`);
      }
    } catch (error) {
      console.error('Admin seed error:', error);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Start server anyway for demo purposes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without MongoDB)`);
    });
  });

export default app;
