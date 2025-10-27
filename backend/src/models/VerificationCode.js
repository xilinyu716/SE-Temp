class VerificationCode {
  constructor(database) {
    this.db = database;
  }

  // DB-SaveVerificationCode: 保存验证码到数据库，设置60秒有效期
  async save(phoneNumber, code, type = 'login') {
    try {
      const expiresAt = new Date(Date.now() + 60 * 1000); // 60秒后过期
      
      // 先删除该手机号的旧验证码
      const deleteStmt = this.db.prepare('DELETE FROM verification_codes WHERE phone = ? AND type = ?');
      deleteStmt.run(phoneNumber, type);
      
      // 插入新验证码
      const insertStmt = this.db.prepare('INSERT INTO verification_codes (phone, code, type, expires_at) VALUES (?, ?, ?, ?)');
      const result = insertStmt.run(phoneNumber, code, type, expiresAt.toISOString());
      
      return {
        id: result.lastInsertRowid,
        phone: phoneNumber,
        code,
        type,
        expires_at: expiresAt.toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  // DB-VerifyCode: 验证手机号对应的验证码是否正确且未过期
  async verify(phoneNumber, code) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM verification_codes 
        WHERE phone = ? AND code = ? AND used = FALSE AND expires_at > datetime('now')
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      const row = stmt.get(phoneNumber, code);
      
      if (!row) {
        return false;
      }
      
      // 标记验证码为已使用
      const updateStmt = this.db.prepare('UPDATE verification_codes SET used = TRUE WHERE id = ?');
      updateStmt.run(row.id);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // DB-CleanExpiredCodes: 清理数据库中已过期的验证码记录
  async cleanExpired() {
    try {
      const stmt = this.db.prepare("DELETE FROM verification_codes WHERE expires_at <= datetime('now')");
      const result = stmt.run();
      return result.changes;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VerificationCode;