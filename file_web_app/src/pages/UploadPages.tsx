import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { CloudUpload, InsertDriveFile, CheckCircle, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useDocumentStore } from '../store/appStore';
import { CATEGORIES } from '../types';

export default function UploadPage() {
  const navigate = useNavigate();
  const { uploadDocument, isLoading, error } = useDocumentStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    if (!title && acceptedFiles[0]) {
      setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ''));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!title || !category || files.length === 0) return;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title + (files.length > 1 ? ` (${files.indexOf(file) + 1})` : ''));
        formData.append('category', category);
        formData.append('description', description);

        await uploadDocument(formData);
      }

      setUploadSuccess(true);
      setTimeout(() => {
        navigate('/documents');
      }, 2000);
    } catch {
      // Error handled in store
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
          Upload Documents
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Drag and drop files or browse to upload your official reports.
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert
              severity="success"
              icon={<CheckCircle />}
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={() => navigate('/documents')}>
                  View Documents
                </Button>
              }
            >
              Files uploaded successfully! Redirecting to documents...
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Box
            {...getRootProps()}
            sx={{
              p: 6,
              border: `2px dashed`,
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 4,
              bgcolor: isDragActive ? 'primary.light' : 'action.hover',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            <input {...getInputProps()} />
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: isDragActive ? 'primary.main' : 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              transition: 'all 0.3s ease'
            }}>
              <CloudUpload sx={{ fontSize: 40, color: isDragActive ? 'white' : 'primary.main' }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'text.primary', mb: 1, fontWeight: 800 }}>
              {isDragActive ? 'Drop files here...' : 'Upload Files'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Drag & drop files here or click to browse
            </Typography>
          </Box>
        </motion.div>

        {/* Selected Files */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 2, fontWeight: 800 }}>
                  Selected Files ({files.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        gap: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 32, height: 32 }}>
                        <InsertDriveFile fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.primary', fontWeight: 700 }}
                          noWrap
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => removeFile(index)} sx={{ color: 'error.main' }}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Document Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{cat}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={3}
                />

                <Button
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  disabled={!title || !category || files.length === 0 || isLoading}
                  onClick={handleUpload}
                  sx={{
                    py: 2,
                    fontSize: '1rem',
                    fontWeight: 800,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {isLoading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}
