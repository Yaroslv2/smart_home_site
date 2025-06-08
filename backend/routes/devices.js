const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./auth');

// Проверка доступа к помещению
async function checkPlaceAccess(userId, placeId) {
  const result = await pool.query(
    'SELECT * FROM users_places WHERE user_id = $1 AND place_id = $2',
    [userId, placeId]
  );
  return result.rows.length > 0;
}

// Получить все типы устройств
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const devices = await pool.query('SELECT * FROM device ORDER BY type, name');
    res.json(devices.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении типов устройств' });
  }
});

// Получить группы устройств для помещения
router.get('/groups/:placeId', authenticateToken, async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!await checkPlaceAccess(req.user.userId, placeId)) {
      return res.status(403).json({ error: 'Нет доступа к помещению' });
    }

    const groups = await pool.query(
      `SELECT dg.*, 
              (SELECT COUNT(*) FROM device_instance WHERE device_group_id = dg.device_group_id) as devices_count
       FROM device_group dg
       WHERE dg.place_id = $1
       ORDER BY dg.name`,
      [placeId]
    );

    res.json(groups.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении групп устройств' });
  }
});

// Создать группу устройств
router.post('/groups', authenticateToken, async (req, res) => {
  try {
    const { name, placeId } = req.body;

    if (!await checkPlaceAccess(req.user.userId, placeId)) {
      return res.status(403).json({ error: 'Нет доступа к помещению' });
    }

    const newGroup = await pool.query(
      'INSERT INTO device_group (name, place_id) VALUES ($1, $2) RETURNING *',
      [name, placeId]
    );

    res.json(newGroup.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании группы' });
  }
});

// Получить экземпляры устройств для группы
router.get('/instances/:groupId', authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;

    // Проверяем доступ через помещение
    const groupCheck = await pool.query(
      `SELECT dg.place_id 
       FROM device_group dg 
       WHERE dg.device_group_id = $1`,
      [groupId]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    if (!await checkPlaceAccess(req.user.userId, groupCheck.rows[0].place_id)) {
      return res.status(403).json({ error: 'Нет доступа к помещению' });
    }

    const instances = await pool.query(
      `SELECT di.*, d.name as device_name, d.type, d.manufacturer, d.model, d.protocol
       FROM device_instance di
       JOIN device d ON di.device_id = d.device_id
       WHERE di.device_group_id = $1
       ORDER BY d.name`,
      [groupId]
    );

    res.json(instances.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении устройств' });
  }
});

// Добавить экземпляр устройства
router.post('/instances', authenticateToken, async (req, res) => {
  try {
    const { deviceId, deviceGroupId, serialNumber, ipAddress, macAddress, status = true } = req.body;

    // Проверяем доступ через помещение
    const groupCheck = await pool.query(
      `SELECT dg.place_id 
       FROM device_group dg 
       WHERE dg.device_group_id = $1`,
      [deviceGroupId]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    if (!await checkPlaceAccess(req.user.userId, groupCheck.rows[0].place_id)) {
      return res.status(403).json({ error: 'Нет доступа к помещению' });
    }

    const newInstance = await pool.query(
      `INSERT INTO device_instance (device_id, device_group_id, serial_number, ip_address, mac_address, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [deviceId, deviceGroupId, serialNumber, ipAddress, macAddress, status]
    );

    // Получаем полную информацию об устройстве
    const fullInfo = await pool.query(
      `SELECT di.*, d.name as device_name, d.type, d.manufacturer, d.model, d.protocol
       FROM device_instance di
       JOIN device d ON di.device_id = d.device_id
       WHERE di.device_instance_id = $1`,
      [newInstance.rows[0].device_instance_id]
    );

    res.json(fullInfo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении устройства' });
  }
});

// Изменить статус устройства
router.patch('/instances/:instanceId/status', authenticateToken, async (req, res) => {
  try {
    const { instanceId } = req.params;
    const { status } = req.body;

    // Проверяем доступ
    const instanceCheck = await pool.query(
      `SELECT dg.place_id 
       FROM device_instance di
       JOIN device_group dg ON di.device_group_id = dg.device_group_id
       WHERE di.device_instance_id = $1`,
      [instanceId]
    );

    if (instanceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Устройство не найдено' });
    }

    if (!await checkPlaceAccess(req.user.userId, instanceCheck.rows[0].place_id)) {
      return res.status(403).json({ error: 'Нет доступа к устройству' });
    }

    await pool.query(
      'UPDATE device_instance SET status = $1 WHERE device_instance_id = $2',
      [status, instanceId]
    );

    res.json({ message: 'Статус обновлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
});

module.exports = router;