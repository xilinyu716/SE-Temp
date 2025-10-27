import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../../src/pages/HomePage';

// Mock子组件
jest.mock('../../src/components/LoginForm', () => {
  return function MockLoginForm({ onSubmit, onSendCode, isLoading }: any) {
    return (
      <div data-testid="login-form">
        <h2>用户登录</h2>
        <button 
          onClick={() => onSendCode('13800138000')}
          disabled={isLoading}
        >
          发送验证码
        </button>
        <button 
          onClick={() => onSubmit('13800138000', '123456')}
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </div>
    );
  };
});

jest.mock('../../src/components/RegisterForm', () => {
  return function MockRegisterForm({ onSubmit, onSendCode, isLoading }: any) {
    return (
      <div data-testid="register-form">
        <h2>用户注册</h2>
        <button 
          onClick={() => onSendCode('13800138000')}
          disabled={isLoading}
        >
          发送验证码
        </button>
        <button 
          onClick={() => onSubmit('13800138000', '123456', true)}
          disabled={isLoading}
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </div>
    );
  };
});

describe('HomePage Component', () => {
  beforeEach(() => {
    // 清除所有模拟
    jest.clearAllMocks();
  });

  it('应该渲染首页的基本结构', () => {
    render(<HomePage />);

    expect(screen.getByText('欢迎使用手机验证登录系统')).toBeInTheDocument();
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
  });

  it('应该默认显示登录表单', () => {
    render(<HomePage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    
    // 登录标签应该是激活状态
    const loginTab = screen.getByText('登录');
    expect(loginTab).toHaveClass('active');
  });

  it('应该能够切换到注册表单', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    
    // 注册标签应该是激活状态
    expect(registerTab).toHaveClass('active');
  });

  it('应该能够在登录和注册表单之间切换', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const loginTab = screen.getByText('登录');
    const registerTab = screen.getByText('注册');

    // 切换到注册
    await user.click(registerTab);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(registerTab).toHaveClass('active');

    // 切换回登录
    await user.click(loginTab);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(loginTab).toHaveClass('active');
  });

  it('应该处理登录表单的发送验证码操作', async () => {
    const user = userEvent.setup();
    
    // 模拟API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: '验证码发送成功' })
    });

    render(<HomePage />);

    const sendCodeButton = screen.getByText('发送验证码');
    await user.click(sendCodeButton);

    // 验证API调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '13800138000',
        type: 'login'
      }),
    });
  });

  it('应该处理注册表单的发送验证码操作', async () => {
    const user = userEvent.setup();
    
    // 模拟API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: '验证码发送成功' })
    });

    render(<HomePage />);

    // 切换到注册表单
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    const sendCodeButton = screen.getByText('发送验证码');
    await user.click(sendCodeButton);

    // 验证API调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '13800138000',
        type: 'register'
      }),
    });
  });

  it('应该处理登录表单提交', async () => {
    const user = userEvent.setup();
    
    // 模拟成功的登录API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        token: 'mock-jwt-token',
        user: { id: 1, phone: '13800138000' }
      })
    });

    render(<HomePage />);

    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    // 验证API调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '13800138000',
        code: '123456'
      }),
    });
  });

  it('应该处理注册表单提交', async () => {
    const user = userEvent.setup();
    
    // 模拟成功的注册API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        token: 'mock-jwt-token',
        user: { id: 1, phone: '13800138000' }
      })
    });

    render(<HomePage />);

    // 切换到注册表单
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    const registerButton = screen.getByText('注册');
    await user.click(registerButton);

    // 验证API调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '13800138000',
        code: '123456',
        agreement: true
      }),
    });
  });

  it('应该在加载状态下显示加载指示器', async () => {
    const user = userEvent.setup();
    
    // 模拟延迟的API调用
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }), 100))
    );

    render(<HomePage />);

    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    // 验证加载状态
    expect(screen.getByText('登录中...')).toBeInTheDocument();
  });

  it('应该处理API错误响应', async () => {
    const user = userEvent.setup();
    
    // 模拟失败的API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ 
        success: false, 
        message: '验证码错误' 
      })
    });

    // 模拟console.error以避免测试输出错误
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HomePage />);

    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('应该处理网络错误', async () => {
    const user = userEvent.setup();
    
    // 模拟网络错误
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // 模拟console.error以避免测试输出错误
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HomePage />);

    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('应该在成功登录后存储token', async () => {
    const user = userEvent.setup();
    
    // 模拟localStorage
    const localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // 模拟成功的登录API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        token: 'mock-jwt-token',
        user: { id: 1, phone: '13800138000' }
      })
    });

    render(<HomePage />);

    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });
  });

  it('应该在成功注册后存储token', async () => {
    const user = userEvent.setup();
    
    // 模拟localStorage
    const localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // 模拟成功的注册API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        success: true, 
        token: 'mock-jwt-token',
        user: { id: 1, phone: '13800138000' }
      })
    });

    render(<HomePage />);

    // 切换到注册表单
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    const registerButton = screen.getByText('注册');
    await user.click(registerButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });
  });

  it('应该正确处理发送验证码的错误', async () => {
    const user = userEvent.setup();
    
    // 模拟失败的发送验证码API调用
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ 
        success: false, 
        message: '手机号格式错误' 
      })
    });

    // 模拟console.error以避免测试输出错误
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HomePage />);

    const sendCodeButton = screen.getByText('发送验证码');
    await user.click(sendCodeButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('应该在切换标签时重置加载状态', async () => {
    const user = userEvent.setup();
    
    // 模拟延迟的API调用
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }), 100))
    );

    render(<HomePage />);

    // 开始登录操作
    const loginButton = screen.getByText('登录');
    await user.click(loginButton);

    // 验证加载状态
    expect(screen.getByText('登录中...')).toBeInTheDocument();

    // 切换到注册标签
    const registerTab = screen.getByText('注册');
    await user.click(registerTab);

    // 验证加载状态被重置
    expect(screen.queryByText('登录中...')).not.toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
  });

  afterEach(() => {
    // 清理全局模拟
    if (global.fetch) {
      (global.fetch as jest.Mock).mockRestore();
    }
  });
});