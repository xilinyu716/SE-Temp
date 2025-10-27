const express = require('express');
const router = express.Router();

// API-GET-UserProfile: 获取当前登录用户的基本信息
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    const token = authHeader.substring(7);
    
    // TODO: 实现获取用户信息逻辑
    // 验证用户认证令牌有效性
    // 返回用户基本信息，不包含敏感数据
    
    throw new Error('Get user profile not implemented');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;