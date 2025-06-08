import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';

function EventList() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    loadEvents();
    loadStats();
  }, [page, rowsPerPage, deviceId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const endpoint = deviceId 
        ? `/events/device/${deviceId}`
        : '/events';
      const response = await api.get(endpoint, {
        params: {
          limit: rowsPerPage,
          offset: page * rowsPerPage
        }
      });
      setEvents(response.data);
    } catch (err) {
      setError('Ошибка загрузки событий');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (deviceId) return; // Статистика только для всех событий
    
    try {
      const response = await api.get('/events/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
      case 'on':
      case 'off':
        return <SuccessIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
      case 'on':
      case 'off':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {deviceId ? 'События устройства' : 'Все события'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {stats && !deviceId && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Всего событий
                </Typography>
                <Typography variant="h5">
                  {stats.total_events}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Активных устройств
                </Typography>
                <Typography variant="h5">
                  {stats.active_devices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Ошибок
                </Typography>
                <Typography variant="h5" color="error">
                  {stats.error_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  За последние 24ч
                </Typography>
                <Typography variant="h5">
                  {stats.last_24h}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Время</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Устройство</TableCell>
              <TableCell>Помещение</TableCell>
              <TableCell>Описание</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.event_id}>
                <TableCell>{formatDate(event.date_time)}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getEventIcon(event.type)}
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={getEventColor(event.type)}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {event.device_name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {event.serial_number}
                  </Typography>
                </TableCell>
                <TableCell>{event.place_name || event.group_name || '-'}</TableCell>
                <TableCell>{event.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={-1} // Мы не знаем общее количество
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Событий на странице:"
        />
      </TableContainer>
    </Box>
  );
}

export default EventList;