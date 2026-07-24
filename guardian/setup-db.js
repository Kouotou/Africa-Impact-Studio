// guardian/setup-db.js
const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Guardian schema applied successfully.');
}

main()
  .catch((err) => {
    console.error('Guardian schema setup failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
