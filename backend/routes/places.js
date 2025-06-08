const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./auth');

// Получить все помещения пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const places = await pool.query(
      `SELECT p.*, 
              (SELECT COUNT(*) FROM device_group WHERE place_id = p.place_id) as device_groups_count
       FROM place p
       JOIN users_places up ON p.place_id = up.place_id
       WHERE up.user_id = $1`,
      [req.user.userId]
    );

    res.json(places.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении помещений' });
  }
});

// Создать новое помещение
router.post('/', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, address } = req.body;

    await client.query('BEGIN');

    // Создаем помещение
    const newPlace = await client.query(
      'INSERT INTO place (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    );

    // Связываем с пользователем
    await client.query(
      'INSERT INTO users_places (user_id, place_id) VALUES ($1, $2)',
      [req.user.userId, newPlace.rows[0].place_id]
    );

    await client.query('COMMIT');

    res.json(newPlace.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании помещения' });
  } finally {
    client.release();
  }
});

// Предоставить доступ к помещению другому пользователю
router.post('/:placeId/share', authenticateToken, async (req, res) => {
  try {
    const { placeId } = req.params;
    const { email } = req.body;

    // Проверяем, что текущий пользователь имеет доступ к помещению
    const hasAccess = await pool.query(
      'SELECT * FROM users_places WHERE user_id = $1 AND place_id = $2',
      [req.user.userId, placeId]
    );

    if (hasAccess.rows.length === 0) {
      return res.status(403).json({ error: 'У вас нет доступа к этому помещению' });
    }

    // Находим пользователя по email
    const targetUser = await pool.query(
      'SELECT user_id FROM "user" WHERE email = $1',
      [email]
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверяем, что у пользователя еще нет доступа
    const existingAccess = await pool.query(
      'SELECT * FROM users_places WHERE user_id = $1 AND place_id = $2',
      [targetUser.rows[0].user_id, placeId]
    );

    if (existingAccess.rows.length > 0) {
      return res.status(400).json({ error: 'У пользователя уже есть доступ' });
    }

    // Предоставляем доступ
    await pool.query(
      'INSERT INTO users_places (user_id, place_id) VALUES ($1, $2)',
      [targetUser.rows[0].user_id, placeId]
    );

    res.json({ message: 'Доступ успешно предоставлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при предоставлении доступа' });
  }
});

// Получить пользователей с доступом к помещению
router.get('/:placeId/users', authenticateToken, async (req, res) => {
  try {
    const { placeId } = req.params;

    // Проверяем доступ
    const hasAccess = await pool.query(
      'SELECT * FROM users_places WHERE user_id = $1 AND place_id = $2',
      [req.user.userId, placeId]
    );

    if (hasAccess.rows.length === 0) {
      return res.status(403).json({ error: 'У вас нет доступа к этому помещению' });
    }

    const users = await pool.query(
      `SELECT u.user_id, u.fullname, u.email
       FROM "user" u
       JOIN users_places up ON u.user_id = up.user_id
       WHERE up.place_id = $1`,
      [placeId]
    );

    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

module.exports = router;