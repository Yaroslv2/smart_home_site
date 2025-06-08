import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  Devices as DevicesIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function PlaceList() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState({ open: false, placeId: null, placeName: '' });
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/places');
      setPlaces(response.data);
    } catch (err) {
      setError('Ошибка загрузки помещений');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlace = async () => {
    try {
      await api.post('/places', formData);
      setOpenDialog(false);
      setFormData({ name: '', address: '' });
      loadPlaces();
    } catch (err) {
      setError('Ошибка создания помещения');
    }
  };

  const handleSharePlace = async () => {
    try {
      await api.post(`/places/${shareDialog.placeId}/share`, { email: shareEmail });
      setShareDialog({ open: false, placeId: null, placeName: '' });
      setShareEmail('');
      alert('Доступ успешно предоставлен');
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка предоставления доступа');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Мои помещения</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить помещение
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {places.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              У вас пока нет помещений. Создайте первое!
            </Typography>
          </Grid>
        ) : (
          places.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.place_id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {place.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {place.address}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <DevicesIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2">
                      Групп устройств: {place.device_groups_count || 0}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/places/${place.place_id}`)}
                  >
                    Подробнее
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/places/${place.place_id}/groups`)}
                  >
                    Устройства
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => setShareDialog({ 
                      open: true, 
                      placeId: place.place_id, 
                      placeName: place.name 
                    })}
                  >
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Диалог создания помещения */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Новое помещение</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Адрес"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreatePlace} 
            variant="contained"
            disabled={!formData.name || !formData.address}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог предоставления доступа */}
      <Dialog 
        open={shareDialog.open} 
        onClose={() => setShareDialog({ open: false, placeId: null, placeName: '' })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Предоставить доступ к "{shareDialog.placeName}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email пользователя"
            type="email"
            fullWidth
            variant="outlined"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            helperText="Введите email пользователя, которому хотите предоставить доступ"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog({ open: false, placeId: null, placeName: '' })}>
            Отмена
          </Button>
          <Button 
            onClick={handleSharePlace} 
            variant="contained"
            disabled={!shareEmail}
          >
            Предоставить доступ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PlaceList;