const request = require('supertest');
const app = require('../../src/app');

describe('User API Tests', () => {
  describe('GET /api/user/profile', () => {
    it('应该成功获取已认证用户的基本信息', async () => {
      // 模拟有效的认证令牌
      const validToken = 'valid-jwt-token';
      
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body).toHaveProperty('createdAt');
      
      // 确保不返回敏感信息
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('verificationCode');
      
      // 验证返回的数据格式
      expect(typeof response.body.userId).toBe('string');
      expect(typeof response.body.phoneNumber).toBe('string');
      expect(typeof response.body.createdAt).toBe('string');
    });

    it('应该拒绝没有认证令牌的请求', async () => {
      const response = await request(app)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('未授权访问');
    });

    it('应该拒绝无效的认证令牌', async () => {
      const invalidToken = 'invalid-token';
      
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('认证令牌无效');
    });

    it('应该拒绝过期的认证令牌', async () => {
      const expiredToken = 'expired-jwt-token';
      
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('认证令牌已过期');
    });

    it('应该拒绝格式错误的Authorization头', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('未授权访问');
    });

    it('应该拒绝空的Authorization头', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('未授权访问');
    });

    it('应该拒绝只有Bearer前缀但没有令牌的请求', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('未授权访问');
    });
  });
});