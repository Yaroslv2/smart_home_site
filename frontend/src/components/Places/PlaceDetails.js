import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  ArrowBack as BackIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

function PlaceDetails() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [users, setUsers] = useState([]);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlaceInfo();
    loadUsers();
  }, [placeId]);

  const loadPlaceInfo = async () => {
    try {
      const response = await api.get('/places');
      const place = response.data.find(p => p.place_id === parseInt(placeId));
      if (place) {
        setPlaceInfo(place);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/places/${placeId}/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      console.error(err);
    } finally {
      setLoading(false);
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
        <Typography color="text.primary">{placeInfo?.name}</Typography>
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
          <Typography variant="h4">{placeInfo?.name}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={() => navigate('/places')}
        >
          Управление доступом
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {placeInfo && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Информация о помещении
          </Typography>
          <Typography variant="body1" gutterBottom>
            Адрес: {placeInfo.address}
          </Typography>
          <Typography variant="body1">
            Групп устройств: {placeInfo.device_groups_count || 0}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Пользователи с доступом
        </Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.user_id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.fullname}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box mt={3}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/places/${placeId}/groups`)}
          sx={{ mr: 2 }}
        >
          Управление устройствами
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/events/place/${placeId}`)}
        >
          События помещения
        </Button>
      </Box>
    </Box>
  );
}

export default PlaceDetails;