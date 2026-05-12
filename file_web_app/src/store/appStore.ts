import { create } from 'zustand';
import type { Document, Reminder, DashboardStats } from '../types';
import { documentsApi, remindersApi, dashboardApi } from '../api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'upload' | 'reminder' | 'user';
  createdAt: string;
  isRead: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      // Since there's no dedicated notification API, we derive from recent activity
      const response = await dashboardApi.getStats();
      const { recentUploads, upcomingReminders } = response.data;

      const news: Notification[] = [
        ...(recentUploads || []).map((doc: any) => ({
          _id: doc._id,
          title: 'New Document',
          message: `${doc.title} was uploaded by ${doc.uploadedBy?.name || 'User'}`,
          type: 'upload' as const,
          createdAt: doc.createdAt,
          isRead: false
        })),
        ...(upcomingReminders || []).map((rem: any) => ({
          _id: rem._id,
          title: 'Upcoming Reminder',
          message: rem.title,
          type: 'reminder' as const,
          createdAt: new Date().toISOString(),
          isRead: false
        }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      set({
        notifications: news,
        unreadCount: news.filter(n => !n.isRead).length,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.isRead).length
    });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    set({
      notifications: updated,
      unreadCount: 0
    });
  }
}));

interface DocumentStore {
  documents: Document[];
  recentUploads: Document[];
  searchResults: Document[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  fetchDocuments: (params?: { category?: string; search?: string; page?: number }) => Promise<void>;
  searchDocuments: (q: string, category?: string) => Promise<void>;
  uploadDocument: (formData: FormData) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  fetchRecentUploads: (limit?: number) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  recentUploads: [],
  searchResults: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },

  fetchDocuments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsApi.getAll(params);
      set({
        documents: (response.data.documents || []).filter(doc => doc && doc._id),
        pagination: response.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch documents'
      });
    }
  },

  searchDocuments: async (q, category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsApi.search(q, category);
      set({ searchResults: response.data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Search failed'
      });
    }
  },

  uploadDocument: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await documentsApi.upload(formData);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Upload failed'
      });
      throw error;
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await documentsApi.delete(id);
      const { documents } = get();
      set({
        documents: documents.filter(d => d._id !== id),
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Delete failed'
      });
      throw error;
    }
  },

  fetchRecentUploads: async (limit = 10) => {
    try {
      const response = await dashboardApi.getRecent(limit);
      set({ recentUploads: response.data });
    } catch (error) {
      console.error('Failed to fetch recent uploads:', error);
    }
  }
}));

interface ReminderStore {
  reminders: Reminder[];
  upcomingReminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  fetchReminders: (completed?: boolean) => Promise<void>;
  createReminder: (data: { title: string; category: string; dueDate: string; notes?: string }) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
  snoozeReminder: (id: string, days?: number) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],
  upcomingReminders: [],
  isLoading: false,
  error: null,

  fetchReminders: async (completed) => {
    set({ isLoading: true, error: null });
    try {
      const response = await remindersApi.getAll(completed);
      if (completed === false) {
        set({ upcomingReminders: response.data, isLoading: false });
      } else {
        set({ reminders: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch reminders'
      });
    }
  },

  createReminder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await remindersApi.create(data);
      await get().fetchReminders(false);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create reminder'
      });
      throw error;
    }
  },

  completeReminder: async (id) => {
    try {
      await remindersApi.complete(id);
      const { upcomingReminders } = get();
      set({
        upcomingReminders: upcomingReminders.filter(r => r._id !== id)
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to complete reminder' });
      throw error;
    }
  },

  snoozeReminder: async (id, days = 1) => {
    try {
      await remindersApi.snooze(id, days);
      await get().fetchReminders(false);
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to snooze reminder' });
      throw error;
    }
  },

  deleteReminder: async (id) => {
    try {
      await remindersApi.delete(id);
      const { reminders, upcomingReminders } = get();
      set({
        reminders: reminders.filter(r => r._id !== id),
        upcomingReminders: upcomingReminders.filter(r => r._id !== id)
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete reminder' });
      throw error;
    }
  }
}));

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardApi.getStats();
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch stats'
      });
    }
  }
}));
