#!/usr/bin/env node
// Создаёт первого пользователя owner в таблице users.
// Запуск: node scripts/seed-user.js
//
// Требует DATABASE_URL в окружении или .env.local:
//   DATABASE_URL=postgres://... node scripts/seed-user.js
//
// Или задать EMAIL / PASSWORD / FULL_NAME через переменные:
//   EMAIL=me@company.ru PASSWORD=secret123 node scripts/seed-user.js

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Подгружаем .env.local вручную если нет DATABASE_URL
if (!process.env.DATABASE_URL) {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL не задан. Добавь в .env.local или передай переменной окружения.");
  process.exit(1);
}

const EMAIL     = process.env.EMAIL     || "admin@company.ru";
const PASSWORD  = process.env.PASSWORD  || "changeme123";
const FULL_NAME = process.env.FULL_NAME || "Администратор";
const ROLE      = "owner";

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  try {
    // Проверяем, есть ли уже такой email
    const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", [EMAIL]);
    if (rows.length > 0) {
      console.log(`⚠️  Пользователь ${EMAIL} уже существует (id: ${rows[0].id}). Ничего не создаём.`);
      return;
    }

    const hash = await bcrypt.hash(PASSWORD, 12);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role`,
      [EMAIL, hash, FULL_NAME, ROLE]
    );

    const user = result.rows[0];
    console.log("✅  Пользователь создан:");
    console.log(`    id:    ${user.id}`);
    console.log(`    email: ${user.email}`);
    console.log(`    role:  ${user.role}`);
    console.log(`    pass:  ${PASSWORD}`);
    console.log("\n⚠️  Смени пароль после первого входа!");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌  Ошибка:", err.message);
  process.exit(1);
});
