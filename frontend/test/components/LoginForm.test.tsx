import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../src/components/LoginForm';

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnSendCode = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSendCode.mockClear();
  });

  it('应该渲染登录表单的所有元素', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    expect(screen.getByText('用户登录')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入验证码')).toBeInTheDocument();
    expect(screen.getByText('发送验证码')).toBeInTheDocument();
    expect(screen.getByText('登录')).toBeInTheDocument();
  });

  it('应该在手机号和验证码都有效时启用提交按钮', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const submitButton = screen.getByText('登录');

    // 初始状态下提交按钮应该被禁用
    expect(submitButton).toBeDisabled();

    // 输入有效的手机号和验证码
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('应该在手机号有效时启用发送验证码按钮', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const sendCodeButton = screen.getByText('发送验证码');

    // 初始状态下发送验证码按钮应该被禁用
    expect(sendCodeButton).toBeDisabled();

    // 输入有效的手机号
    await user.type(phoneInput, '13800138000');

    await waitFor(() => {
      expect(sendCodeButton).not.toBeDisabled();
    });
  });

  it('应该在点击发送验证码时调用onSendCode回调', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const sendCodeButton = screen.getByText('发送验证码');

    // 输入有效的手机号
    await user.type(phoneInput, '13800138000');
    
    await waitFor(() => {
      expect(sendCodeButton).not.toBeDisabled();
    });

    // 点击发送验证码
    await user.click(sendCodeButton);

    expect(mockOnSendCode).toHaveBeenCalledWith('13800138000');
  });

  it('应该在发送验证码后启动60秒倒计时', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const sendCodeButton = screen.getByText('发送验证码');

    // 输入有效的手机号并发送验证码
    await user.type(phoneInput, '13800138000');
    await user.click(sendCodeButton);

    // 验证倒计时开始
    await waitFor(() => {
      expect(screen.getByText(/\d+s/)).toBeInTheDocument();
    });

    // 验证按钮被禁用
    expect(sendCodeButton).toBeDisabled();
  });

  it('应该在提交表单时调用onSubmit回调', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const submitButton = screen.getByText('登录');

    // 输入有效的手机号和验证码
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // 提交表单
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('13800138000', '123456');
  });

  it('应该在加载状态下禁用所有交互元素', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
        isLoading={true}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const sendCodeButton = screen.getByText('发送验证码');
    const submitButton = screen.getByText('登录中...');

    expect(phoneInput).toBeDisabled();
    expect(codeInput).toBeDisabled();
    expect(sendCodeButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('应该在加载状态下显示加载文本', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
        isLoading={true}
      />
    );

    expect(screen.getByText('登录中...')).toBeInTheDocument();
  });

  it('应该阻止表单的默认提交行为', async () => {
    const user = userEvent.setup();
    const mockPreventDefault = jest.fn();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const form = screen.getByRole('form') || screen.getByText('用户登录').closest('form');
    
    // 模拟表单提交事件
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    submitEvent.preventDefault = mockPreventDefault;
    
    fireEvent(form!, submitEvent);
    
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('应该在手机号无效时保持发送验证码按钮禁用', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const sendCodeButton = screen.getByText('发送验证码');

    // 输入无效的手机号
    await user.type(phoneInput, '123456');

    // 发送验证码按钮应该保持禁用
    expect(sendCodeButton).toBeDisabled();
  });

  it('应该在验证码无效时保持提交按钮禁用', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const submitButton = screen.getByText('登录');

    // 输入有效的手机号但无效的验证码
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123');

    // 提交按钮应该保持禁用
    expect(submitButton).toBeDisabled();
  });

  it('应该支持键盘提交表单', async () => {
    const user = userEvent.setup();
    
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');

    // 输入有效的手机号和验证码
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');

    // 在验证码输入框中按回车提交
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('13800138000', '123456');
  });
});