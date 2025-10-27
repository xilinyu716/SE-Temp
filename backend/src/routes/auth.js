const express = require('express');
const AuthService = require('../services/authService');

const router = express.Router();
const authService = new AuthService();

// 初始化认证服务
authService.init().catch(console.error);

// API-SendVerificationCode: 发送验证码接口
router.post('/send-verification-code', async (req, res) => {
  try {
    const { phoneNumber, type } = req.body;
    
    // 验证必需参数
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: '类型不能为空'
      });
    }

    const result = await authService.sendVerificationCode(phoneNumber, type);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// API-Login: 用户登录接口
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    
    // 验证必需参数
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: '验证码不能为空'
      });
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: '验证码必须是6位数字'
      });
    }

    const result = await authService.login(phoneNumber, verificationCode);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// API-Register: 用户注册接口
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, verificationCode, agreeToTerms } = req.body;
    
    // 验证必需参数
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: '验证码不能为空'
      });
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: '验证码必须是6位数字'
      });
    }

    const result = await authService.register(phoneNumber, verificationCode, agreeToTerms);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;