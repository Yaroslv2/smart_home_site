import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  Devices as DevicesIcon,
  Event as EventIcon,
  PlayArrow as ScriptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    places: 0,
    devices: 0,
    events: 0,
    scripts: 0,
    recentEvents: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Загружаем данные параллельно
      const [placesRes, eventsRes, scriptsRes, eventStatsRes] = await Promise.all([
        api.get('/places'),
        api.get('/events?limit=5'),
        api.get('/scripts'),
        api.get('/events/stats')
      ]);

      setStats({
        places: placesRes.data.length,
        devices: eventStatsRes.data.active_devices || 0,
        events: eventStatsRes.data.total_events || 0,
        scripts: scriptsRes.data.length,
        recentEvents: eventsRes.data
      });
    } catch (err) {
      setError('Ошибка загрузки данных');
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

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statsCards = [
    {
      title: 'Помещения',
      value: stats.places,
      icon: <HomeIcon fontSize="large" />,
      color: '#1976d2',
      path: '/places'
    },
    {
      title: 'Активные устройства',
      value: stats.devices,
      icon: <DevicesIcon fontSize="large" />,
      color: '#388e3c',
      path: '/places'
    },
    {
      title: 'Всего событий',
      value: stats.events,
      icon: <EventIcon fontSize="large" />,
      color: '#f57c00',
      path: '/events'
    },
    {
      title: 'Сценарии',
      value: stats.scripts,
      icon: <ScriptIcon fontSize="large" />,
      color: '#7b1fa2',
      path: '/scripts'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в систему умного дома!
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(card.path)}>
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Последние события
            </Typography>
            {stats.recentEvents.length === 0 ? (
              <Typography color="textSecondary">Нет событий</Typography>
            ) : (
              <Box>
                {stats.recentEvents.map((event) => (
                  <Box key={event.event_id} sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1">
                      {event.device_name} ({event.place_name})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.date_time).toLocaleString('ru-RU')}
                    </Typography>
                  </Box>
                ))}
                <Button onClick={() => navigate('/events')} sx={{ mt: 1 }}>
                  Все события
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;