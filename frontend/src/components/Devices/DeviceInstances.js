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
  Switch,
  FormControlLabel,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  PowerSettingsNew as PowerIcon,
  Router as RouterIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

function DeviceInstances() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    serialNumber: '',
    ipAddress: '',
    macAddress: '',
    status: true
  });

  useEffect(() => {
    loadDevices();
    loadDeviceTypes();
  }, [groupId]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/devices/instances/${groupId}`);
      setDevices(response.data);
    } catch (err) {
      setError('Ошибка загрузки устройств');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDeviceTypes = async () => {
    try {
      const response = await api.get('/devices/types');
      setDeviceTypes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDevice = async () => {
    try {
      await api.post('/devices/instances', {
        ...formData,
        deviceGroupId: parseInt(groupId)
      });
      setOpenDialog(false);
      setFormData({
        deviceId: '',
        serialNumber: '',
        ipAddress: '',
        macAddress: '',
        status: true
      });
      loadDevices();
    } catch (err) {
      setError('Ошибка добавления устройства');
    }
  };

  const handleToggleStatus = async (deviceId, currentStatus) => {
    try {
      await api.patch(`/devices/instances/${deviceId}/status`, { 
        status: !currentStatus 
      });
      loadDevices();
    } catch (err) {
      setError('Ошибка изменения статуса');
    }
  };

  const getStatusColor = (status) => status ? 'success' : 'default';
  const getStatusText = (status) => status ? 'Включено' : 'Выключено';

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
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Typography variant="h4">Устройства группы</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить устройство
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {devices.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              В этой группе пока нет устройств
            </Typography>
          </Grid>
        ) : (
          devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.device_instance_id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" component="div">
                      {device.device_name}
                    </Typography>
                    <Chip 
                      label={getStatusText(device.status)}
                      color={getStatusColor(device.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Тип: {device.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Производитель: {device.manufacturer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Модель: {device.model}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <RouterIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="caption">
                      {device.ip_address}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    S/N: {device.serial_number}
                  </Typography>
                </CardContent>
                <CardActions>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={device.status}
                        onChange={() => handleToggleStatus(device.device_instance_id, device.status)}
                        icon={<PowerIcon />}
                        checkedIcon={<PowerIcon />}
                      />
                    }
                    label={device.status ? "Вкл" : "Выкл"}
                  />
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/events?deviceId=${device.device_instance_id}`)}
                  >
                    События
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Диалог добавления устройства */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить устройство</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Тип устройства"
            fullWidth
            variant="outlined"
            value={formData.deviceId}
            onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
            sx={{ mb: 2 }}
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type.device_id} value={type.device_id}>
                {type.name} ({type.manufacturer} {type.model})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Серийный номер"
            fullWidth
            variant="outlined"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="IP адрес"
            fullWidth
            variant="outlined"
            value={formData.ipAddress}
            onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="MAC адрес"
            fullWidth
            variant="outlined"
            value={formData.macAddress}
            onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
            }
            label="Устройство включено"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleCreateDevice} 
            variant="contained"
            disabled={!formData.deviceId || !formData.serialNumber || !formData.ipAddress || !formData.macAddress}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeviceInstances;