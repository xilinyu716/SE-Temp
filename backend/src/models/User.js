class User {
  constructor(database) {
    this.db = database;
  }

  // DB-FindUserByPhone: 根据手机号查找用户
  async findByPhone(phoneNumber) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE phone = ?');
      const user = stmt.get(phoneNumber);
      return user || null;
    } catch (error) {
      throw error;
    }
  }

  // DB-CreateUser: 创建新用户
  async create(userData) {
    try {
      const { phoneNumber } = userData;
      const stmt = this.db.prepare('INSERT INTO users (phone) VALUES (?)');
      const result = stmt.run(phoneNumber);
      
      return {
        id: result.lastInsertRowid,
        phone: phoneNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('手机号已存在');
      }
      throw error;
    }
  }

  // DB-FindUserById: 根据用户ID查找用户
  async findById(userId) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
      const user = stmt.get(userId);
      return user || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;