import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Devices as DeviceIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

function ScriptDetails() {
  const navigate = useNavigate();
  const { scriptId } = useParams();
  const isNew = scriptId === undefined;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  
  const [script, setScript] = useState({
    name: '',
    description: '',
    actions: [],
    is_active: true
  });

  const [newAction, setNewAction] = useState({
    device_instance_id: '',
    action: '',
    params: {}
  });

  const [actionTypes] = useState([
    { value: 'turn_on', label: 'Включить' },
    { value: 'turn_off', label: 'Выключить' },
    { value: 'dim', label: 'Приглушить свет' },
    { value: 'set_temperature', label: 'Установить температуру' },
    { value: 'set_color', label: 'Установить цвет' },
    { value: 'enable', label: 'Активировать' },
    { value: 'disable', label: 'Деактивировать' },
    { value: 'start_recording', label: 'Начать запись' },
    { value: 'stop_recording', label: 'Остановить запись' },
    { value: 'play_music', label: 'Воспроизвести музыку' },
    { value: 'set_mode', label: 'Установить режим' }
  ]);

  useEffect(() => {
    loadAvailableDevices();
    if (!isNew) {
      loadScript();
    }
  }, [scriptId, isNew]);

  const loadScript = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/scripts/${scriptId}`);
      setScript(response.data);
    } catch (err) {
      setError('Ошибка загрузки сценария');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDevices = async () => {
    try {
      const response = await api.get('/scripts/available-devices');
      setAvailableDevices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        await api.post('/scripts', script);
      } else {
        await api.put(`/scripts/${scriptId}`, script);
      }
      navigate('/scripts');
    } catch (err) {
      setError('Ошибка сохранения сценария');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAction = () => {
    const selectedDevice = availableDevices.find(
      d => d.device_instance_id === parseInt(newAction.device_instance_id)
    );
    
    if (selectedDevice) {
      const actionToAdd = {
        ...newAction,
        device_info: selectedDevice
      };
      
      setScript({
        ...script,
        actions: [...script.actions, actionToAdd]
      });
      
      setNewAction({
        device_instance_id: '',
        action: '',
        params: {}
      });
      setOpenActionDialog(false);
    }
  };

  const handleRemoveAction = (index) => {
    setScript({
      ...script,
      actions: script.actions.filter((_, i) => i !== index)
    });
  };

  const renderActionParams = (action) => {
    const params = [];
    
    switch (action) {
      case 'dim':
        return (
          <TextField
            margin="dense"
            label="Уровень яркости (%)"
            type="number"
            fullWidth
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            value={newAction.params.level || ''}
            onChange={(e) => setNewAction({
              ...newAction,
              params: { ...newAction.params, level: parseInt(e.target.value) }
            })}
          />
        );
      case 'set_temperature':
        return (
          <TextField
            margin="dense"
            label="Температура (°C)"
            type="number"
            fullWidth
            InputProps={{ inputProps: { min: 10, max: 30, step: 0.5 } }}
            value={newAction.params.value || ''}
            onChange={(e) => setNewAction({
              ...newAction,
              params: { ...newAction.params, value: parseFloat(e.target.value) }
            })}
          />
        );
      case 'play_music':
        return (
          <>
            <TextField
              margin="dense"
              label="Громкость"
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              value={newAction.params.volume || ''}
              onChange={(e) => setNewAction({
                ...newAction,
                params: { ...newAction.params, volume: parseInt(e.target.value) }
              })}
            />
            <TextField
              margin="dense"
              label="Плейлист"
              fullWidth
              value={newAction.params.playlist || ''}
              onChange={(e) => setNewAction({
                ...newAction,
                params: { ...newAction.params, playlist: e.target.value }
              })}
            />
          </>
        );
      default:
        return null;
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
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/scripts')}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Typography variant="h4">
            {isNew ? 'Новый сценарий' : 'Редактирование сценария'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving || !script.name || script.actions.length === 0}
        >
          {saving ? <CircularProgress size={24} /> : 'Сохранить'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Основная информация</Typography>
        <TextField
          label="Название сценария"
          fullWidth
          value={script.name}
          onChange={(e) => setScript({ ...script, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Описание"
          fullWidth
          multiline
          rows={2}
          value={script.description}
          onChange={(e) => setScript({ ...script, description: e.target.value })}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Действия сценария</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenActionDialog(true)}
          >
            Добавить действие
          </Button>
        </Box>

        {script.actions.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
            Добавьте действия для вашего сценария
          </Typography>
        ) : (
          <List>
            {script.actions.map((action, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <DeviceIcon sx={{ mr: 2 }} />
                  <ListItemText
                    primary={action.device_info?.device_name || `Устройство ${action.device_instance_id}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Действие: {actionTypes.find(a => a.value === action.action)?.label || action.action}
                        </Typography>
                        {action.device_info && (
                          <Typography variant="caption" color="textSecondary">
                            {action.device_info.place_name} / {action.device_info.group_name}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveAction(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < script.actions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Диалог добавления действия */}
      <Dialog open={openActionDialog} onClose={() => setOpenActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить действие</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Устройство"
            fullWidth
            margin="dense"
            value={newAction.device_instance_id}
            onChange={(e) => setNewAction({ ...newAction, device_instance_id: e.target.value })}
          >
            {availableDevices.map((device) => (
              <MenuItem key={device.device_instance_id} value={device.device_instance_id}>
                {device.device_name} ({device.place_name} / {device.group_name})
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Действие"
            fullWidth
            margin="dense"
            value={newAction.action}
            onChange={(e) => setNewAction({ ...newAction, action: e.target.value, params: {} })}
          >
            {actionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          {renderActionParams(newAction.action)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActionDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleAddAction} 
            variant="contained"
            disabled={!newAction.device_instance_id || !newAction.action}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ScriptDetails;