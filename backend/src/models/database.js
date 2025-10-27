const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DatabaseConfig = require('../config/database');

class Database {
  constructor() {
    this.config = new DatabaseConfig();
  }

  async connect() {
    this.config.connect();
  }

  async disconnect() {
    this.config.disconnect();
  }

  async initTables() {
    this.config.initTables();
  }

  getDatabase() {
    return this.config.getDatabase();
  }

  async clearTestData() {
    this.config.clearTestData();
  }
}

module.exports = Database;