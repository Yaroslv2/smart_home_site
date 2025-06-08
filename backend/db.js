const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'smart_home',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('Подключено к базе данных PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
  process.exit(-1);
});

module.exports = pool;