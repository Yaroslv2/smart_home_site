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
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
// Using basic HTML5 date inputs instead of MUI date pickers
// Using simple CSV export without external libraries
import api from '../../api/api';

function EventList() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    place: '',
    deviceType: '',
    eventType: '',
    dateFrom: null,
    dateTo: null
  });
  
  // Filter options
  const [places, setPlaces] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [eventTypes] = useState(['error', 'warning', 'success', 'info', 'on', 'off']);

  useEffect(() => {
    loadEvents();
    loadStats();
    loadFilterOptions();
  }, [page, rowsPerPage, deviceId]);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

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
    if (deviceId) return;

    try {
      const response = await api.get('/events/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFilterOptions = async () => {
    try {
      // Load places
      const placesResponse = await api.get('/places');
      setPlaces(placesResponse.data);
      
      // Load device types
      const devicesResponse = await api.get('/devices');
      const uniqueTypes = [...new Set(devicesResponse.data.map(d => d.type))];
      setDeviceTypes(uniqueTypes);
    } catch (err) {
      console.error('Ошибка загрузки опций фильтра:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filters.place) {
      filtered = filtered.filter(event => 
        event.place_name === filters.place || event.group_name === filters.place
      );
    }

    if (filters.deviceType) {
      filtered = filtered.filter(event => 
        event.device_type === filters.deviceType
      );
    }

    if (filters.eventType) {
      filtered = filtered.filter(event => 
        event.type === filters.eventType
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(event => 
        new Date(event.date_time) >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(event => 
        new Date(event.date_time) <= endDate
      );
    }

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      place: '',
      deviceType: '',
      eventType: '',
      dateFrom: null,
      dateTo: null
    });
  };

  const exportToPDF = () => {
    // Simple print functionality as PDF alternative
    const printContent = `
      <html>
        <head>
          <title>События системы</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .event-error { background-color: #ffebee; }
            .event-warning { background-color: #fff3e0; }
            .event-success { background-color: #e8f5e8; }
          </style>
        </head>
        <body>
          <h1>События системы</h1>
          <p>Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}</p>
          <p>Всего событий: ${filteredEvents.length}</p>
          <table>
            <thead>
              <tr>
                <th>Время</th>
                <th>Тип</th>
                <th>Устройство</th>
                <th>Помещение</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEvents.map(event => `
                <tr class="event-${event.type}">
                  <td>${formatDate(event.date_time)}</td>
                  <td>${event.type}</td>
                  <td>${event.device_name}<br><small>${event.serial_number}</small></td>
                  <td>${event.place_name || event.group_name || '-'}</td>
                  <td>${event.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToCSV = () => {
    const headers = ['Время', 'Тип', 'Устройство', 'Серийный номер', 'Помещение', 'Описание'];
    const csvContent = [
      headers.join(','),
      ...filteredEvents.map(event => [
        `"${formatDate(event.date_time)}"`,
        `"${event.type}"`,
        `"${event.device_name}"`,
        `"${event.serial_number}"`,
        `"${event.place_name || event.group_name || '-'}"`,
        `"${event.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'events.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

        {/* Filter and Export Controls */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box>
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon />
              </IconButton>
              <Typography variant="body2" component="span">
                Фильтры {filteredEvents.length !== events.length && `(${filteredEvents.length} из ${events.length})`}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                onClick={exportToPDF}
                disabled={filteredEvents.length === 0}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<CsvIcon />}
                onClick={exportToCSV}
                disabled={filteredEvents.length === 0}
              >
                CSV
              </Button>
            </Stack>
          </Stack>

          <Collapse in={showFilters}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Помещение</InputLabel>
                  <Select
                    value={filters.place}
                    label="Помещение"
                    onChange={(e) => handleFilterChange('place', e.target.value)}
                  >
                    <MenuItem value="">Все</MenuItem>
                    {places.map((place) => (
                      <MenuItem key={place.id} value={place.name}>
                        {place.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Тип устройства</InputLabel>
                  <Select
                    value={filters.deviceType}
                    label="Тип устройства"
                    onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                  >
                    <MenuItem value="">Все</MenuItem>
                    {deviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Тип события</InputLabel>
                  <Select
                    value={filters.eventType}
                    label="Тип события"
                    onChange={(e) => handleFilterChange('eventType', e.target.value)}
                  >
                    <MenuItem value="">Все</MenuItem>
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Дата с"
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Дата по"
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  fullWidth
                  size="small"
                >
                  Очистить
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>

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
              {filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
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
            count={filteredEvents.length}
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