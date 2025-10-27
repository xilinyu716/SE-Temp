// 后端测试环境设置文件
const path = require('path');

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DB_PATH = path.join(__dirname, '../test.db');

// 全局测试设置
beforeAll(async () => {
  // 测试开始前的全局设置
  console.log('开始运行后端测试...');
});

afterAll(async () => {
  // 测试结束后的清理工作
  console.log('后端测试运行完成');
});

// 每个测试前的设置
beforeEach(() => {
  // 清除所有模拟
  jest.clearAllMocks();
});

// 模拟console.log以减少测试输出噪音
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};