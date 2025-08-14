const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;

// Конфиг подключения к вашей БД
const pool = new Pool({
  user: 'app_user',
  host: '158.160.138.204', // Замените на IP вашего сервера с PostgreSQL
  database: 'app_db',
  password: 'securepassword', // Пароль из вашего docker-compose.yml
  port: 5432,
});

// Проверка подключения к БД при старте
pool.query('SELECT 1')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('DB connection error:', err));

app.get('/api/data', async (req, res) => {
  const ip = req.ip.replace('::ffff:', '');
  const userAgent = req.get('User-Agent');

  try {
    // Записываем посещение
    await pool.query(
      `INSERT INTO visits(ip_address, user_agent) 
       VALUES($1, $2)`,
      [ip, userAgent]
    );

    // Получаем статистику
    const { rows } = await pool.query(`
      SELECT COUNT(*) as total_visits,
             COUNT(DISTINCT ip_address) as unique_visitors
      FROM visits
    `);

    res.json({
      status: 'OK',
      server: process.env.SERVER_NAME || 'Backend-1',
      yourIp: ip,
      visits: rows[0]
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running with DB support on port ${PORT}`);
});
