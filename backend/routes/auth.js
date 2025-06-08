const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Проверка существующего пользователя
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser = await pool.query(
      'INSERT INTO "user" (fullname, email, password) VALUES ($1, $2, $3) RETURNING user_id, fullname, email',
      [fullname, email, password]
    );

    // Создание токена
    const token = jwt.sign(
      { userId: newUser.rows[0].user_id, email: newUser.rows[0].email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    // Поиск пользователя
    const user = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const validPassword = password === user.rows[0].password; // await bcrypt.compare(password, user.rows[0].password);
    console.log("Пароль в бд" + user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Создание токена
    const token = jwt.sign(
      { userId: user.rows[0].user_id, email: user.rows[0].email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        user_id: user.rows[0].user_id,
        fullname: user.rows[0].fullname,
        email: user.rows[0].email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка токена
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_id, fullname, email FROM "user" WHERE user_id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;