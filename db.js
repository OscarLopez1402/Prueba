const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Mi Base',
  password: 'Udeo2023',
  port: 5432, 
});

module.exports = pool;