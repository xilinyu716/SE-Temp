const request = require('supertest');
const app = require('../../src/app');

describe('Authentication API Tests', () => {
  describe('POST /api/auth/send-verification-code', () => {
    it('应该成功发送验证码到有效手机号', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000',
          type: 'login'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('验证码发送成功');
      // 验证码不应该在响应中暴露
      expect(response.body).not.toHaveProperty('verificationCode');
    });

    it('应该拒绝无效的手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '123456',
          type: 'login'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('请输入正确的手机号码');
    });

    it('应该拒绝无效的类型参数', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000',
          type: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('应该拒绝缺少必需参数的请求', async () => {
      const response = await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000'
          // 缺少 type 参数
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('应该成功登录已注册用户', async () => {
      // 首先发送验证码
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000',
          type: 'login'
        });

      // 然后尝试登录（这里应该使用正确的验证码）
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '13800138000',
          verificationCode: '123456' // 在实际实现中，这应该是有效的验证码
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('登录成功');
    });

    it('应该拒绝未注册的手机号', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '13900139000',
          verificationCode: '123456'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('手机号未注册');
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '13800138000',
          verificationCode: '000000'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('验证码错误或已过期');
    });

    it('应该拒绝无效的手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '123456',
          verificationCode: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('请输入正确的手机号码');
    });

    it('应该拒绝无效的验证码格式', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '13800138000',
          verificationCode: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/register', () => {
    it('应该成功注册新用户', async () => {
      // 首先发送验证码
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13700137000',
          type: 'register'
        });

      // 然后尝试注册
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '13700137000',
          verificationCode: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('注册成功');
    });

    it('应该直接登录已注册用户', async () => {
      // 首先发送验证码
      await request(app)
        .post('/api/auth/send-verification-code')
        .send({
          phoneNumber: '13800138000',
          type: 'register'
        });

      // 尝试注册已存在的用户
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '13800138000',
          verificationCode: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('登录成功');
    });

    it('应该拒绝未同意用户协议的注册', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '13700137000',
          verificationCode: '123456',
          agreeToTerms: false
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('请同意用户协议');
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '13700137000',
          verificationCode: '000000',
          agreeToTerms: true
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('验证码错误或已过期');
    });

    it('应该拒绝无效的手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '123456',
          verificationCode: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('请输入正确的手机号码');
    });
  });
});