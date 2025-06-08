const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/events', require('./routes/events'));
app.use('/api/scripts', require('./routes/scripts'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});