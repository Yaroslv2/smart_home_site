const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./auth');

// Получить события для всех устройств пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const events = await pool.query(
      `SELECT e.*, di.serial_number, d.name as device_name, d.type as device_type,
              dg.name as group_name, p.name as place_name
       FROM event e
       JOIN device_instance di ON e.device_instance_id = di.device_instance_id
       JOIN device d ON di.device_id = d.device_id
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       JOIN place p ON dg.place_id = p.place_id
       JOIN users_places up ON p.place_id = up.place_id
       WHERE up.user_id = $1
       ORDER BY e.date_time DESC
       LIMIT $2 OFFSET $3`,
      [req.user.userId, limit, offset]
    );

    res.json(events.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении событий' });
  }
});

// Получить события для конкретного устройства
router.get('/device/:instanceId', authenticateToken, async (req, res) => {
  try {
    const { instanceId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Проверяем доступ
    const accessCheck = await pool.query(
      `SELECT p.place_id
       FROM device_instance di
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       JOIN place p ON dg.place_id = p.place_id
       JOIN users_places up ON p.place_id = up.place_id
       WHERE di.device_instance_id = $1 AND up.user_id = $2`,
      [instanceId, req.user.userId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Нет доступа к устройству' });
    }

    const events = await pool.query(
      `SELECT e.*, di.serial_number, d.name as device_name, d.type as device_type
       FROM event e
       JOIN device_instance di ON e.device_instance_id = di.device_instance_id
       JOIN device d ON di.device_id = d.device_id
       WHERE e.device_instance_id = $1
       ORDER BY e.date_time DESC
       LIMIT $2 OFFSET $3`,
      [instanceId, limit, offset]
    );

    res.json(events.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении событий' });
  }
});

// Получить события для помещения
router.get('/place/:placeId', authenticateToken, async (req, res) => {
  try {
    const { placeId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Проверяем доступ
    const accessCheck = await pool.query(
      'SELECT * FROM users_places WHERE user_id = $1 AND place_id = $2',
      [req.user.userId, placeId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Нет доступа к помещению' });
    }

    const events = await pool.query(
      `SELECT e.*, di.serial_number, d.name as device_name, d.type as device_type,
              dg.name as group_name
       FROM event e
       JOIN device_instance di ON e.device_instance_id = di.device_instance_id
       JOIN device d ON di.device_id = d.device_id
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       WHERE dg.place_id = $1
       ORDER BY e.date_time DESC
       LIMIT $2 OFFSET $3`,
      [placeId, limit, offset]
    );

    res.json(events.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении событий' });
  }
});

// Получить статистику событий
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT e.device_instance_id) as active_devices,
        COUNT(CASE WHEN e.type = 'error' THEN 1 END) as error_count,
        COUNT(CASE WHEN e.date_time > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h
       FROM event e
       JOIN device_instance di ON e.device_instance_id = di.device_instance_id
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       JOIN place p ON dg.place_id = p.place_id
       JOIN users_places up ON p.place_id = up.place_id
       WHERE up.user_id = $1`,
      [req.user.userId]
    );

    res.json(stats.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

module.exports = router;