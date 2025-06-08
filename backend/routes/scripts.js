const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./auth');

// Получить все сценарии
router.get('/', authenticateToken, async (req, res) => {
  try {
    const scripts = await pool.query(
      `SELECT s.*, 
              (SELECT COUNT(*) FROM triggers_scripts WHERE script_id = s.script_id) as trigger_count
       FROM script s
       ORDER BY s.name`
    );

    res.json(scripts.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении сценариев' });
  }
});

// Получить сценарий по ID с действиями
router.get('/:scriptId', authenticateToken, async (req, res) => {
  try {
    const { scriptId } = req.params;

    const script = await pool.query(
      'SELECT * FROM script WHERE script_id = $1',
      [scriptId]
    );

    if (script.rows.length === 0) {
      return res.status(404).json({ error: 'Сценарий не найден' });
    }

    // Получаем информацию об устройствах в действиях
    const scriptData = script.rows[0];
    const actionsWithDevices = [];

    for (const action of scriptData.actions) {
      const deviceInfo = await pool.query(
        `SELECT di.*, d.name as device_name, d.type as device_type
         FROM device_instance di
         JOIN device d ON di.device_id = d.device_id
         WHERE di.device_instance_id = $1`,
        [action.device_instance_id]
      );

      actionsWithDevices.push({
        ...action,
        device_info: deviceInfo.rows[0] || null
      });
    }

    res.json({
      ...scriptData,
      actions: actionsWithDevices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении сценария' });
  }
});

// Создать новый сценарий
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, actions, isActive = true } = req.body;

    // Проверяем, что у пользователя есть доступ ко всем устройствам в actions
    for (const action of actions) {
      const accessCheck = await pool.query(
        `SELECT p.place_id
         FROM device_instance di
         JOIN device_group dg ON di.device_group_id = dg.device_group_id
         JOIN place p ON dg.place_id = p.place_id
         JOIN users_places up ON p.place_id = up.place_id
         WHERE di.device_instance_id = $1 AND up.user_id = $2`,
        [action.device_instance_id, req.user.userId]
      );

      if (accessCheck.rows.length === 0) {
        return res.status(403).json({
          error: `Нет доступа к устройству с ID ${action.device_instance_id}`
        });
      }
    }

    const newScript = await pool.query(
      'INSERT INTO script (name, description, actions, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, JSON.stringify(actions), isActive]
    );

    res.json(newScript.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании сценария' });
  }
});

// Обновить сценарий
router.put('/:scriptId', authenticateToken, async (req, res) => {
  try {
    const { scriptId } = req.params;
    const { name, description, actions, isActive } = req.body;

    // Проверяем доступ к устройствам
    if (actions) {
      for (const action of actions) {
        const accessCheck = await pool.query(
          `SELECT p.place_id
           FROM device_instance di
           JOIN device_group dg ON di.device_group_id = dg.device_group_id
           JOIN place p ON dg.place_id = p.place_id
           JOIN users_places up ON p.place_id = up.place_id
           WHERE di.device_instance_id = $1 AND up.user_id = $2`,
          [action.device_instance_id, req.user.userId]
        );

        if (accessCheck.rows.length === 0) {
          return res.status(403).json({
            error: `Нет доступа к устройству с ID ${action.device_instance_id}`
          });
        }
      }
    }

    const updatedScript = await pool.query(
      `UPDATE script 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           actions = COALESCE($3, actions),
           is_active = COALESCE($4, is_active)
       WHERE script_id = $5
       RETURNING *`,
      [name, description, actions ? JSON.stringify(actions) : null, isActive, scriptId]
    );

    if (updatedScript.rows.length === 0) {
      return res.status(404).json({ error: 'Сценарий не найден' });
    }

    res.json(updatedScript.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении сценария' });
  }
});

// Удалить сценарий
router.delete('/:scriptId', authenticateToken, async (req, res) => {
  try {
    const { scriptId } = req.params;

    const result = await pool.query(
      'DELETE FROM script WHERE script_id = $1 RETURNING script_id',
      [scriptId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сценарий не найден' });
    }

    res.json({ message: 'Сценарий удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении сценария' });
  }
});

// Получить доступные устройства для сценария
router.get('/available-devices', authenticateToken, async (req, res) => {
  try {
    console.log("/availible-device" + req.user.userId);

    const devices = await pool.query(
      `SELECT di.*, d.name as device_name, d.type as device_type,
              dg.name as group_name, p.name as place_name
       FROM device_instance di
       JOIN device d ON di.device_id = d.device_id
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       JOIN place p ON dg.place_id = p.place_id
       JOIN users_places up ON p.place_id = up.place_id
       WHERE up.user_id = $1 AND di.status = true
       ORDER BY p.name, dg.name, d.name`,
      [req.user.userId]
    );

    res.json(devices.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении устройств' });
  }
});

module.exports = router;