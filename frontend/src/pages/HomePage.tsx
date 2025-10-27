import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { sendVerificationCode, login, register } from '../utils/api';

const HomePage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phoneNumber: string, verificationCode: string) => {
    setIsLoading(true);
    try {
      const response = await login(phoneNumber, verificationCode);
      
      // 保存用户信息和令牌到localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        
        // 登录成功，可以跳转到主页面或显示成功消息
        alert('登录成功！');
        console.log('Login successful:', response);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (phoneNumber: string, verificationCode: string, agreeToTerms: boolean) => {
    if (!agreeToTerms) {
      alert('请先同意用户协议');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(phoneNumber, verificationCode);
      
      // 注册成功后自动登录
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        
        alert('注册成功！');
        console.log('Registration successful:', response);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert(`注册失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      await sendVerificationCode(phoneNumber);
      alert('验证码已发送！');
    } catch (error) {
      console.error('Send code failed:', error);
      alert(`发送验证码失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');

  return (
    <div className="App">
      {/* 顶部导航栏 */}
      <div className="top-nav">
        <div className="nav-content">
          <div className="logo">淘宝 Taobao</div>
          <div className="nav-right">
            网站导航
            <a href="#" className="nav-link">请登录</a>
            <a href="#" className="nav-link">免费注册</a>
          </div>
        </div>
      </div>

      <div className="home-page">
        {/* 左侧二维码区域 */}
        <div className="left-section">
          <div className="qr-section">
            <div className="qr-title">手机扫码登录</div>
            <div className="qr-code">
              <div className="qr-placeholder"></div>
            </div>
            <div className="qr-tip">
              打开手机淘宝APP<br />
              扫一扫上方二维码
            </div>
          </div>
          <div className="login-tip">
            怎么扫码登录？
            <a href="#" className="login-link">点此查看</a>
          </div>
        </div>

        {/* 右侧登录表单区域 */}
        <div className="right-section">
          <div className="auth-container">
            <div className="auth-tabs">
              <button
                className={`tab ${currentView === 'login' ? 'active' : ''}`}
                onClick={switchToLogin}
              >
                密码登录
              </button>
              <button
                className={`tab ${currentView === 'register' ? 'active' : ''}`}
                onClick={switchToRegister}
              >
                注册/登录
              </button>
            </div>

            <div className="auth-content">
              {currentView === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  onSendCode={handleSendCode}
                  isLoading={isLoading}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  onSendCode={handleSendCode}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* 第三方登录 */}
            <div className="third-party-login">
              <div className="login-divider">
                <span>或记住账号</span>
              </div>
              <div className="third-party-icons">
                <div className="third-party-icon qq-icon">Q</div>
                <div className="third-party-icon wechat-icon">W</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;