import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../src/components/RegisterForm';

describe('RegisterForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnSendCode = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSendCode.mockClear();
  });

  it('应该渲染注册表单的所有元素', () => {
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    expect(screen.getByText('用户注册')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入验证码')).toBeInTheDocument();
    expect(screen.getByText('发送验证码')).toBeInTheDocument();
    expect(screen.getByText(/我已阅读并同意/)).toBeInTheDocument();
    expect(screen.getByText('《用户协议》')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
  });

  it('应该在所有条件满足时启用提交按钮', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const agreementCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('注册');

    // 初始状态下提交按钮应该被禁用
    expect(submitButton).toBeDisabled();

    // 输入有效的手机号、验证码并同意协议
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');
    await user.click(agreementCheckbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('应该在未同意用户协议时保持提交按钮禁用', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const submitButton = screen.getByText('注册');

    // 输入有效的手机号和验证码，但不同意协议
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');

    // 提交按钮应该保持禁用
    expect(submitButton).toBeDisabled();
  });

  it('应该在手机号有效时启用发送验证码按钮', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
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
      <RegisterForm
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
      <RegisterForm
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
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const agreementCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('注册');

    // 输入有效的手机号、验证码并同意协议
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');
    await user.click(agreementCheckbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // 提交表单
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('13800138000', '123456', true);
  });

  it('应该在加载状态下禁用所有交互元素', () => {
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
        isLoading={true}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const sendCodeButton = screen.getByText('发送验证码');
    const agreementCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('注册中...');

    expect(phoneInput).toBeDisabled();
    expect(codeInput).toBeDisabled();
    expect(sendCodeButton).toBeDisabled();
    expect(agreementCheckbox).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('应该在加载状态下显示加载文本', () => {
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
        isLoading={true}
      />
    );

    expect(screen.getByText('注册中...')).toBeInTheDocument();
  });

  it('应该阻止表单的默认提交行为', async () => {
    const user = userEvent.setup();
    const mockPreventDefault = jest.fn();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const form = screen.getByRole('form') || screen.getByText('用户注册').closest('form');
    
    // 模拟表单提交事件
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    submitEvent.preventDefault = mockPreventDefault;
    
    fireEvent(form!, submitEvent);
    
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('应该在手机号无效时保持发送验证码按钮禁用', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
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
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const agreementCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('注册');

    // 输入有效的手机号、无效的验证码并同意协议
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123');
    await user.click(agreementCheckbox);

    // 提交按钮应该保持禁用
    expect(submitButton).toBeDisabled();
  });

  it('应该支持键盘提交表单', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const agreementCheckbox = screen.getByRole('checkbox');

    // 输入有效的手机号、验证码并同意协议
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');
    await user.click(agreementCheckbox);

    // 在验证码输入框中按回车提交
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('13800138000', '123456', true);
  });

  it('应该在倒计时结束后重新启用发送验证码按钮', async () => {
    const user = userEvent.setup();
    
    // 模拟定时器
    jest.useFakeTimers();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const sendCodeButton = screen.getByText('发送验证码');

    // 输入有效的手机号并发送验证码
    await user.type(phoneInput, '13800138000');
    await user.click(sendCodeButton);

    // 验证按钮被禁用且显示倒计时
    expect(sendCodeButton).toBeDisabled();
    
    // 快进60秒
    jest.advanceTimersByTime(60000);
    
    await waitFor(() => {
      expect(sendCodeButton).not.toBeDisabled();
      expect(screen.getByText('发送验证码')).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('应该正确处理用户协议状态变化', async () => {
    const user = userEvent.setup();
    
    render(
      <RegisterForm
        onSubmit={mockOnSubmit}
        onSendCode={mockOnSendCode}
      />
    );

    const phoneInput = screen.getByPlaceholderText('请输入手机号');
    const codeInput = screen.getByPlaceholderText('请输入验证码');
    const agreementCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('注册');

    // 输入有效的手机号和验证码
    await user.type(phoneInput, '13800138000');
    await user.type(codeInput, '123456');

    // 提交按钮应该被禁用（未同意协议）
    expect(submitButton).toBeDisabled();

    // 同意协议
    await user.click(agreementCheckbox);
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // 取消同意协议
    await user.click(agreementCheckbox);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});