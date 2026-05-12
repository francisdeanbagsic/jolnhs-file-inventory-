import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
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
  Avatar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  PersonAdd,
  AdminPanelSettings,
  School,
  People
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usersApi } from '../api';
import type { User } from '../types';

const roleColors: Record<string, string> = {
  admin: '#8B5CF6',
  teacher: '#3B82F6',
  faculty: '#10B981'
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <AdminPanelSettings fontSize="small" />,
  teacher: <School fontSize="small" />,
  faculty: <People fontSize="small" />
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'teacher'
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      await usersApi.create(newUser);
      setCreateDialog(false);
      setNewUser({ email: '', password: '', name: '', role: 'teacher' });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async () => {
    if (!editDialog) return;
    try {
      await usersApi.update(editDialog._id, {
        name: editDialog.name,
        role: editDialog.role,
        isActive: editDialog.isActive
      });
      setEditDialog(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await usersApi.delete(deleteDialog._id);
      setDeleteDialog(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await usersApi.update(user._id, { isActive: !user.isActive });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              User Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage faculty and staff accounts.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setCreateDialog(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 3
            }}
          >
            Add User
          </Button>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Joined</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: roleColors[user.role] }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <Chip 
                          icon={roleIcons[user.role] as React.ReactElement}
                          label={user.role}
                          size="small"
                          sx={{ 
                            bgcolor: `${roleColors[user.role]}20`,
                            color: roleColors[user.role],
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <Switch
                          checked={user.isActive}
                          onChange={() => handleToggleActive(user)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#10B981'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#10B981'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditDialog(user)}
                          sx={{ color: '#3B82F6' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setDeleteDialog(user)}
                          sx={{ color: '#EF4444' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </motion.div>

      {/* Create User Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 800 }}>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'action.hover',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'primary.light' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: 'text.secondary' },
                '& .MuiInputBase-input': { color: 'text.primary' }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'action.hover',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'primary.light' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: 'text.secondary' },
                '& .MuiInputBase-input': { color: 'text.primary' }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'action.hover',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'primary.light' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: 'text.secondary' },
                '& .MuiInputBase-input': { color: 'text.primary' }
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#94A3B8' }}>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
                sx={{
                  bgcolor: 'action.hover',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '& .MuiSelect-select': { color: 'text.primary' }
                }}
              >
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="faculty">Faculty Staff</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialog(false)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!newUser.name || !newUser.email || !newUser.password}
            sx={{
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={Boolean(editDialog)}
        onClose={() => setEditDialog(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 800 }}>Edit User</DialogTitle>
        <DialogContent>
          {editDialog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={editDialog.name}
                onChange={(e) => setEditDialog({ ...editDialog, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiInputBase-input': { color: '#F8FAFC' }
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94A3B8' }}>Role</InputLabel>
                <Select
                  value={editDialog.role}
                  onChange={(e) => setEditDialog({ ...editDialog, role: e.target.value as any })}
                  label="Role"
                  sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B5CF6' },
                    '& .MuiSelect-select': { color: '#F8FAFC' }
                  }}
                >
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="faculty">Faculty Staff</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: '#94A3B8' }}>Active</Typography>
                <Switch
                  checked={editDialog.isActive}
                  onChange={(e) => setEditDialog({ ...editDialog, isActive: e.target.checked })}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialog(null)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteDialog)}
        onClose={() => setDeleteDialog(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 800 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94A3B8' }}>
            Are you sure you want to delete {deleteDialog?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
