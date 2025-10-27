const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Database = require('../models/database');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

class AuthService {
  constructor() {
    this.database = new Database();
    this.userModel = null;
    this.verificationCodeModel = null;
  }

  async init() {
    await this.database.connect();
    await this.database.initTables();
    const db = this.database.getDatabase();
    this.userModel = new User(db);
    this.verificationCodeModel = new VerificationCode(db);
  }

  // 生成6位随机验证码
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 生成JWT令牌
  generateToken(userId) {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    return jwt.sign({ userId }, secret, { expiresIn });
  }

  // 验证手机号格式
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  // 发送验证码
  async sendVerificationCode(phoneNumber, type) {
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('请输入正确的手机号码');
    }

    if (!['login', 'register'].includes(type)) {
      throw new Error('类型必须是login或register');
    }

    const code = this.generateVerificationCode();
    
    // 保存验证码到数据库
    await this.verificationCodeModel.save(phoneNumber, code, type);
    
    // 打印验证码到控制台（模拟发送短信）
    console.log(`验证码已发送到 ${phoneNumber}: ${code}`);
    
    return {
      message: '验证码发送成功',
      expiresIn: 60
    };
  }

  // 用户登录
  async login(phoneNumber, verificationCode) {
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('请输入正确的手机号码');
    }

    // 检查用户是否存在
    const user = await this.userModel.findByPhone(phoneNumber);
    if (!user) {
      throw new Error('手机号未注册');
    }

    // 验证验证码
    const isCodeValid = await this.verificationCodeModel.verify(phoneNumber, verificationCode);
    if (!isCodeValid) {
      throw new Error('验证码错误或已过期');
    }

    // 生成JWT令牌
    const token = this.generateToken(user.id);

    return {
      message: '登录成功',
      userId: user.id,
      token
    };
  }

  // 用户注册
  async register(phoneNumber, verificationCode, agreeToTerms) {
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('请输入正确的手机号码');
    }

    if (!agreeToTerms) {
      throw new Error('请同意用户协议');
    }

    // 验证验证码
    const isCodeValid = await this.verificationCodeModel.verify(phoneNumber, verificationCode);
    if (!isCodeValid) {
      throw new Error('验证码错误或已过期');
    }

    // 检查用户是否已存在
    const existingUser = await this.userModel.findByPhone(phoneNumber);
    if (existingUser) {
      // 如果用户已存在，直接登录
      const token = this.generateToken(existingUser.id);
      return {
        message: '登录成功',
        userId: existingUser.id,
        token
      };
    }

    // 创建新用户
    const newUser = await this.userModel.create({ phoneNumber });
    const token = this.generateToken(newUser.id);

    return {
      message: '注册成功',
      userId: newUser.id,
      token
    };
  }

  // 清理过期验证码
  async cleanExpiredCodes() {
    return await this.verificationCodeModel.cleanExpired();
  }

  // 关闭数据库连接
  async close() {
    if (this.database) {
      await this.database.disconnect();
    }
  }
}

module.exports = AuthService;