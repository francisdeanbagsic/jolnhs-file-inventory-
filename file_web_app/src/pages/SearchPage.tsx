import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  IconButton,
  Skeleton
} from '@mui/material';
import { 
  Search, 
  Download, 
  Description,
  Clear
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { documentsApi } from '../api';
import { type Document } from '../types';

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

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await documentsApi.search(searchQuery, category || undefined);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleDownload = async (doc: Document) => {
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSize = (bytes: number) => {
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1 }}>
          Search Documents
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
          Find documents across all departments.
        </Typography>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card sx={{ bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)', mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, minWidth: 250 }}>
                <TextField
                  fullWidth
                  placeholder="Search by title, description, or tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#64748B' }} />
                        </InputAdornment>
                      ),
                      endAdornment: query && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => { setQuery(''); setResults([]); }}>
                            <Clear sx={{ color: '#64748B' }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(15, 23, 42, 0.5)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#3B82F6' }
                    },
                    '& .MuiInputBase-input': { color: '#F8FAFC' }
                  }}
                />
              </Box>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#94A3B8' }}>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3B82F6' },
                    '& .MuiSelect-select': { color: '#F8FAFC' }
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {Object.keys(categoryColors).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={140} sx={{ bgcolor: '#1E293B' }} />
            </Grid>
          ))}
        </Grid>
      ) : results.length > 0 ? (
        <>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            Found {results.length} document{results.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={2}>
            {results.map((doc, index) => (
              <Grid key={doc._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    sx={{
                      bgcolor: '#1E293B',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: '#253248',
                        transform: 'scale(1.02)'
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
                            justifyContent: 'center'
                          }}
                        >
                          <Description sx={{ color: categoryColors[doc.category] || '#3B82F6' }} />
                        </Box>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#F8FAFC',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {doc.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                              label={doc.category.split(' ')[0]}
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

                        <IconButton 
                          size="small" 
                          onClick={() => handleDownload(doc)}
                          sx={{ color: '#3B82F6' }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      ) : query ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: '#1E293B',
            borderRadius: 2,
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}
        >
          <Search sx={{ fontSize: 64, color: '#64748B', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 1 }}>
            No documents found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Try different keywords or check the category filter
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
