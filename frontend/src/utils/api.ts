// API 基础配置
const API_BASE_URL = 'http://localhost:3000/api';

// API 请求工具函数
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 发送验证码
export const sendVerificationCode = async (phoneNumber: string) => {
  return apiRequest('/auth/send-verification-code', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
};

// 用户登录
export const login = async (phoneNumber: string, verificationCode: string) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, verificationCode }),
  });
};

// 用户注册
export const register = async (phoneNumber: string, verificationCode: string) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, verificationCode }),
  });
};