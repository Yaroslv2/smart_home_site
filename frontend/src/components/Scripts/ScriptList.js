import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function ScriptList() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/scripts');
      setScripts(response.data);
    } catch (err) {
      setError('Ошибка загрузки сценариев');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (scriptId, currentStatus) => {
    try {
      await api.put(`/scripts/${scriptId}`, { isActive: !currentStatus });
      loadScripts();
    } catch (err) {
      setError('Ошибка изменения статуса сценария');
    }
  };

  const handleDelete = async (scriptId, scriptName) => {
    if (window.confirm(`Удалить сценарий "${scriptName}"?`)) {
      try {
        await api.delete(`/scripts/${scriptId}`);
        loadScripts();
      } catch (err) {
        setError('Ошибка удаления сценария');
      }
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
        <Typography variant="h4">Сценарии</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/scripts/new')}
        >
          Создать сценарий
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {scripts.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              Сценарии еще не созданы. Создайте первый сценарий для автоматизации вашего дома!
            </Typography>
          </Grid>
        ) : (
          scripts.map((script) => (
            <Grid item xs={12} sm={6} md={4} key={script.script_id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <PlayIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="div">
                        {script.name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={script.is_active ? 'Активен' : 'Неактивен'}
                      color={script.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {script.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <ScheduleIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="caption">
                      Действий: {script.actions?.length || 0}
                    </Typography>
                  </Box>
                  {script.trigger_count > 0 && (
                    <Typography variant="caption" color="primary">
                      Триггеров: {script.trigger_count}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={script.is_active}
                        onChange={() => handleToggleActive(script.script_id, script.is_active)}
                        size="small"
                      />
                    }
                    label="Активен"
                  />
                  <Box>
                    <IconButton 
                      size="small"
                      onClick={() => navigate(`/scripts/${script.script_id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleDelete(script.script_id, script.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default ScriptList;