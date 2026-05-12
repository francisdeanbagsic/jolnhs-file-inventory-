export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'faculty';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface Document {
  _id: string;
  title: string;
  filename: string;
  originalName: string;
  category: string;
  uploadedBy: {
    _id: string;
    name: string;
    email?: string;
  };
  fileSize: number;
  mimeType: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  _id: string;
  title: string;
  category: string;
  dueDate: string;
  userId: string;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalDocuments: number;
  documentsByCategory: Record<string, number>;
  recentUploads: Document[];
  totalUsers: number;
  activeUsers: number;
  upcomingReminders: Reminder[];
  thisMonthUploads: number;
}

export const CATEGORIES = [
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
] as const;

export type Category = typeof CATEGORIES[number];
