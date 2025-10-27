import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationCodeInput from '../../src/components/VerificationCodeInput';

describe('VerificationCodeInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnValidationChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnValidationChange.mockClear();
  });

  it('应该渲染验证码输入框', () => {
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('maxLength', '6');
  });

  it('应该显示传入的初始值', () => {
    render(
      <VerificationCodeInput
        value="123456"
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByDisplayValue('123456');
    expect(input).toBeInTheDocument();
  });

  it('应该验证6位数字验证码格式', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 输入有效的6位验证码
    await user.type(input, '123456');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
    
    // 不应该显示错误信息
    expect(screen.queryByText(/验证码格式不正确/)).not.toBeInTheDocument();
  });

  it('应该拒绝少于6位的验证码', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 输入少于6位的验证码
    await user.type(input, '12345');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    // 应该显示错误信息
    expect(screen.getByText(/验证码必须是6位数字/)).toBeInTheDocument();
    expect(input).toHaveClass('error');
  });

  it('应该只允许输入数字', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 尝试输入字母和特殊字符
    await user.type(input, 'abc123!@#');
    
    // 只有数字应该被保留
    expect(mockOnChange).toHaveBeenCalledWith('123');
  });

  it('应该限制验证码长度为6位', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 输入超过6位的数字
    await user.type(input, '1234567890');
    
    // 应该被限制为6位
    expect(mockOnChange).toHaveBeenCalledWith('123456');
  });

  it('应该在禁用状态下不可编辑', () => {
    render(
      <VerificationCodeInput
        value="123456"
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    expect(input).toBeDisabled();
  });

  it('应该实时验证验证码格式', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 逐步输入验证码
    await user.type(input, '1');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    await user.type(input, '23');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    await user.type(input, '456');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
  });

  it('应该拒绝包含非数字字符的验证码', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 输入包含字母的验证码
    await user.type(input, '12a456');
    
    // 应该只保留数字部分
    expect(mockOnChange).toHaveBeenCalledWith('12456');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
  });

  it('应该清除输入时移除错误状态', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 先输入无效格式
    await user.type(input, '123');
    await waitFor(() => {
      expect(screen.getByText(/验证码必须是6位数字/)).toBeInTheDocument();
    });
    
    // 清除输入
    await user.clear(input);
    
    // 错误信息应该消失
    await waitFor(() => {
      expect(screen.queryByText(/验证码必须是6位数字/)).not.toBeInTheDocument();
    });
  });

  it('应该支持粘贴操作', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 模拟粘贴6位验证码
    await user.click(input);
    await user.paste('654321');
    
    expect(mockOnChange).toHaveBeenCalledWith('654321');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
  });

  it('应该处理粘贴超长内容的情况', async () => {
    const user = userEvent.setup();
    
    render(
      <VerificationCodeInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入验证码');
    
    // 模拟粘贴超长内容
    await user.click(input);
    await user.paste('1234567890abc');
    
    // 应该只保留前6位数字
    expect(mockOnChange).toHaveBeenCalledWith('123456');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
  });
});