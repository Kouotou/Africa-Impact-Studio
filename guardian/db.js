// guardian/db.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Prisma Client auto-loads .env; raw `pg` doesn't, so these scripts load it
// manually. Checks .env then .env.local, without overriding already-set vars.
for (const filename of ['.env', '.env.local']) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) continue;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^"|"$/g, '');
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set (checked .env and .env.local)');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = { pool };
