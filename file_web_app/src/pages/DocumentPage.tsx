import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  InputAdornment,
  Skeleton
} from '@mui/material';
import { 
  Search, 
  Download, 
  Delete, 
  Description,
  Clear
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDocumentStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { CATEGORIES, type Document } from '../types';
import { documentsApi } from '../api';

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

function DocumentCard({ doc, onDelete }: { doc: Document; onDelete: (id: string) => void }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const uploaderId = doc.uploadedBy && typeof doc.uploadedBy === 'object' ? doc.uploadedBy._id : doc.uploadedBy;
  const isOwner = uploaderId === user?._id;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes < 1024) return (bytes || 0) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    try {
      const response = await documentsApi.download(doc._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${categoryColors[doc.category] || '#3B82F6'}20 0%, ${categoryColors[doc.category] || '#3B82F6'}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Description sx={{ color: categoryColors[doc.category] || '#3B82F6', fontSize: 24 }} />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {doc.title || 'Untitled Document'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Chip 
                  label={(doc.category || 'Unknown').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  size="small"
                  sx={{ 
                    height: 22,
                    fontSize: '0.7rem',
                    bgcolor: `${categoryColors[doc.category] || '#3B82F6'}20`,
                    color: categoryColors[doc.category] || '#3B82F6'
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  {formatSize(doc.fileSize)}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                {typeof doc.uploadedBy === 'object' ? doc.uploadedBy.name : 'Unknown'} • {formatDate(doc.createdAt)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={handleDownload}
                sx={{ color: '#3B82F6' }}
              >
                <Download fontSize="small" />
              </IconButton>
              {(isAdmin || isOwner) && (
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(doc._id)}
                  sx={{ color: '#EF4444' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { documents, pagination, isLoading, fetchDocuments, deleteDocument } = useDocumentStore();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDocuments({
      search: search || undefined,
      category: categoryFilter || undefined,
      page: pagination.page
    });
  }, [search, categoryFilter, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments({ search: search || undefined, category: categoryFilter || undefined });
  };

  const handleDelete = async () => {
    if (deleteDialog) {
      await deleteDocument(deleteDialog);
      setDeleteDialog(null);
    }
  };

  const handlePageChange = (_: any, page: number) => {
    fetchDocuments({ 
      search: search || undefined, 
      category: categoryFilter || undefined,
      page 
    });
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSearchParams({});
    fetchDocuments();
  };

  const hasFilters = search || categoryFilter;

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
          Documents
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Browse and manage all uploaded documents.
        </Typography>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#64748B' }} />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'action.hover',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'primary.light' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputBase-input': { color: 'text.primary' }
                  }}
                />
              </Box>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#94A3B8' }}>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                  sx={{
                    bgcolor: 'action.hover',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '& .MuiSelect-select': { color: 'text.primary' }
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {hasFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#94A3B8',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents Grid */}
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Skeleton
                  variant="rounded"
                  animation="pulse"
                  height={160}
                  sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
              </motion.div>
            </Grid>
          ))
        ) : documents.length > 0 ? (
          documents.map((doc, index) => (
            <Grid key={doc._id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <DocumentCard doc={doc} onDelete={(id) => setDeleteDialog(id)} />
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                No documents found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {hasFilters ? 'Try adjusting your filters' : 'Upload your first document to get started'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#94A3B8'
              },
              '& .Mui-selected': {
                bgcolor: '#3B82F6 !important',
                color: '#fff'
              }
            }}
          />
        </Box>
      )}

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
        <DialogTitle sx={{ color: '#F8FAFC' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94A3B8' }}>
            Are you sure you want to delete this document? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
