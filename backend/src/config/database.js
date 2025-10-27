const Database = require('better-sqlite3');
const path = require('path');

class DatabaseConfig {
  constructor() {
    this.db = null;
    this.dbPath = process.env.NODE_ENV === 'test' 
      ? ':memory:' 
      : path.join(__dirname, '../../data/database.sqlite');
  }

  connect() {
    try {
      this.db = new Database(this.dbPath);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database disconnected');
    }
  }

  initTables() {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    // 创建用户表
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone VARCHAR(11) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 创建验证码表
    const createVerificationCodesTable = `
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone VARCHAR(11) NOT NULL,
        code VARCHAR(6) NOT NULL,
        type VARCHAR(10) DEFAULT 'login',
        used BOOLEAN DEFAULT FALSE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(createUsersTable);
    this.db.exec(createVerificationCodesTable);
    
    console.log('Database tables initialized');
  }

  getDatabase() {
    return this.db;
  }

  clearTestData() {
    if (process.env.NODE_ENV === 'test' && this.db) {
      this.db.exec('DELETE FROM verification_codes');
      this.db.exec('DELETE FROM users');
      console.log('Test data cleared');
    }
  }
}

module.exports = DatabaseConfig;