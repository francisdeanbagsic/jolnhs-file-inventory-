import { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Add, 
  CalendarToday, 
  CheckCircle, 
  Snooze, 
  Delete,
  Schedule
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useReminderStore } from '../store/appStore';
import { CATEGORIES, type Reminder } from '../types';

const categoryColors: Record<string, string> = {
  'feeding/health': '#10B981',
  'drrm': '#F59E0B',
  'test result': '#3B82F6',
  'lac/inset': '#8B5CF6',
  'gulayan sa paaralan': '#22C55E',
  'aral': '#06B6D4',
  'literacy report': '#EC4899',
  'guidance report': '#F97316',
  'LR report': '#6366F1',
  'YES-o': '#14B8A6',
  'SSLG': '#A855F7',
  'BKD': '#EAB308',
  'research report': '#0EA5E9',
  'brigada': '#F43F5E',
  'OITSP': '#84CC16',
  'SBM': '#64748B',
  'SGC': '#D946EF',
  'Boys/girls scout': '#F59E0B',
  'LIS/BEIS report': '#0D9488',
  'PRAES': '#7C3AED',
  'STE': '#2563EB',
  'sp-ict': '#06B6D4',
  'sports': '#EF4444'
};

function ReminderItem({ reminder, onComplete, onSnooze, onDelete }: { 
  reminder: Reminder; 
  onComplete: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
  onDelete: (id: string) => void;
}) {
  const isOverdue = new Date(reminder.dueDate) < new Date();

  const getDaysUntilDue = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntilDue(reminder.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: isOverdue ? 'error.light' : 'divider',
          borderRadius: 3,
          mb: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: isOverdue ? 'error.main' : 'primary.main',
            boxShadow: theme => `0 10px 20px -10px ${isOverdue ? theme.palette.error.main : theme.palette.primary.main}40`
          }
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: isOverdue ? 'error.light' : 'primary.light',
                color: isOverdue ? 'error.main' : 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CalendarToday sx={{ fontSize: 20 }} />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: '1rem'
                }}
              >
                {reminder.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  {reminder.category}
                </Typography>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 14, color: isOverdue ? 'error.main' : 'text.secondary' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isOverdue ? 'error.main' : 'text.secondary',
                      fontWeight: 600
                    }}
                  >
                    {isOverdue 
                      ? `${Math.abs(daysUntil)} days overdue`
                      : daysUntil === 0 
                        ? 'Due today'
                        : daysUntil === 1 
                          ? 'Due tomorrow'
                          : `Due in ${daysUntil} days`
                    }
                  </Typography>
                </Box>
              </Box>

              {reminder.notes && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {reminder.notes}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <IconButton 
                size="small" 
                onClick={() => onSnooze(reminder._id, 1)}
                sx={{ color: '#F59E0B' }}
                title="Snooze 1 day"
              >
                <Snooze fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onComplete(reminder._id)}
                sx={{ color: '#10B981' }}
                title="Mark complete"
              >
                <CheckCircle fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDelete(reminder._id)}
                sx={{ color: '#EF4444' }}
                title="Delete"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RemindersPage() {
  const { 
    reminders, 
    upcomingReminders, 
    isLoading, 
    fetchReminders, 
    createReminder,
    completeReminder,
    snoozeReminder,
    deleteReminder 
  } = useReminderStore();

  const [tab, setTab] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    category: '',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchReminders(tab === 0 ? false : true);
  }, [tab]);

  const handleCreate = async () => {
    if (!newReminder.title || !newReminder.category || !newReminder.dueDate) return;
    
    await createReminder(newReminder);
    setCreateDialog(false);
    setNewReminder({ title: '', category: '', dueDate: '', notes: '' });
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
              Reminders
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Stay on top of your periodic report submissions.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            New Reminder
          </Button>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab label={`Upcoming (${upcomingReminders.length})`} sx={{ fontWeight: 700 }} />
          <Tab label="Completed" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Reminders List */}
      <Box>
        {isLoading ? (
          <Typography sx={{ color: '#64748B' }}>Loading...</Typography>
        ) : tab === 0 ? (
          upcomingReminders.length > 0 ? (
            upcomingReminders.map((reminder) => (
              <ReminderItem
                key={reminder._id}
                reminder={reminder}
                onComplete={completeReminder}
                onSnooze={snoozeReminder}
                onDelete={deleteReminder}
              />
            ))
          ) : (
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'action.hover',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Schedule sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 800 }}>
                No upcoming reminders
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Create a reminder to stay on top of your reports
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialog(true)}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Create Reminder
              </Button>
            </Box>
          )
        ) : (
          reminders.length > 0 ? (
            reminders.map((reminder) => (
              <ReminderItem
                key={reminder._id}
                reminder={reminder}
                onComplete={completeReminder}
                onSnooze={snoozeReminder}
                onDelete={deleteReminder}
              />
            ))
          ) : (
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'action.hover',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 800 }}>
                No completed reminders
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Completed reminders will appear here
              </Typography>
            </Box>
          )
        )}
      </Box>

      {/* Create Reminder Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              borderRadius: 3
            }
          }
        }}
      >
        <DialogTitle sx={{ color: '#F8FAFC' }}>Create New Reminder</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
                '& .MuiInputBase-input': { color: '#F8FAFC' }
              }}
            />

            <FormControl fullWidth required>
              <InputLabel sx={{ color: '#94A3B8' }}>Category</InputLabel>
              <Select
                value={newReminder.category}
                onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                label="Category"
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
                  '& .MuiSelect-select': { color: '#F8FAFC' }
                }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              required
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
                '& .MuiInputBase-input': { color: '#F8FAFC' }
              }}
            />

            <TextField
              fullWidth
              label="Notes (Optional)"
              value={newReminder.notes}
              onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#F59E0B' }
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
                '& .MuiInputBase-input': { color: '#F8FAFC' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialog(false)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!newReminder.title || !newReminder.category || !newReminder.dueDate}
            sx={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
              }
            }}
          >
            Create Reminder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
