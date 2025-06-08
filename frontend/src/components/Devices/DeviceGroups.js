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
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Devices as DevicesIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

function DeviceGroups() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [groups, setGroups] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    loadGroups();
    loadPlaceInfo();
  }, [placeId]);

  const loadPlaceInfo = async () => {
    try {
      const response = await api.get('/places');
      const place = response.data.find(p => p.place_id === parseInt(placeId));
      if (place) {
        setPlaceName(place.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/devices/groups/${placeId}`);
      setGroups(response.data);
    } catch (err) {
      setError('Ошибка загрузки групп устройств');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await api.post('/devices/groups', { name: groupName, placeId: parseInt(placeId) });
      setOpenDialog(false);
      setGroupName('');
      loadGroups();
    } catch (err) {
      setError('Ошибка создания группы');
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
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/places');
          }}
        >
          Помещения
        </Link>
        <Typography color="text.primary">{placeName}</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/places')}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Typography variant="h4">Группы устройств</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Создать группу
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {groups.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              В этом помещении пока нет групп устройств
            </Typography>
          </Grid>
        ) : (
          groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.device_group_id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <DevicesIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {group.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Устройств в группе: {group.devices_count || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/groups/${group.device_group_id}/devices`)}
                  >
                    Устройства
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Диалог создания группы */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Новая группа устройств</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название группы"
            fullWidth
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            helperText="Например: Освещение, Безопасность, Климат"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={!groupName}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeviceGroups;