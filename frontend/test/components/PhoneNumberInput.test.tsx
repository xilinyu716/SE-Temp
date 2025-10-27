import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneNumberInput from '../../src/components/PhoneNumberInput';

describe('PhoneNumberInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnValidationChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnValidationChange.mockClear();
  });

  it('应该渲染手机号输入框', () => {
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('应该显示传入的初始值', () => {
    render(
      <PhoneNumberInput
        value="13800138000"
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByDisplayValue('13800138000');
    expect(input).toBeInTheDocument();
  });

  it('应该验证有效的中国大陆手机号格式', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 输入有效的手机号
    await user.type(input, '13800138000');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
    
    // 不应该显示错误信息
    expect(screen.queryByText(/手机号格式不正确/)).not.toBeInTheDocument();
  });

  it('应该拒绝无效的手机号格式并显示错误信息', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 输入无效的手机号
    await user.type(input, '123456');
    
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    // 应该显示错误信息
    expect(screen.getByText(/手机号格式不正确/)).toBeInTheDocument();
    expect(input).toHaveClass('error');
  });

  it('应该只允许输入数字', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 尝试输入字母和特殊字符
    await user.type(input, 'abc123!@#');
    
    // 只有数字应该被保留
    expect(mockOnChange).toHaveBeenCalledWith('123');
  });

  it('应该限制手机号长度为11位', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 输入超过11位的数字
    await user.type(input, '138001380001234');
    
    // 应该被限制为11位
    expect(mockOnChange).toHaveBeenCalledWith('13800138000');
  });

  it('应该在禁用状态下不可编辑', () => {
    render(
      <PhoneNumberInput
        value="13800138000"
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    expect(input).toBeDisabled();
  });

  it('应该实时验证手机号格式', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 逐步输入手机号
    await user.type(input, '1');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    await user.type(input, '38');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });
    
    await user.type(input, '00138000');
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });
  });

  it('应该支持常见的中国大陆手机号段', async () => {
    const user = userEvent.setup();
    const validPrefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                          '147', '150', '151', '152', '153', '155', '156', '157', '158', '159',
                          '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
    
    for (const prefix of validPrefixes.slice(0, 3)) { // 测试前3个号段
      render(
        <PhoneNumberInput
          value=""
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      );

      const input = screen.getByPlaceholderText('请输入手机号');
      await user.clear(input);
      await user.type(input, `${prefix}12345678`);
      
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(true);
      });
    }
  });

  it('应该清除输入时移除错误状态', async () => {
    const user = userEvent.setup();
    
    render(
      <PhoneNumberInput
        value=""
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const input = screen.getByPlaceholderText('请输入手机号');
    
    // 先输入无效格式
    await user.type(input, '123');
    await waitFor(() => {
      expect(screen.getByText(/手机号格式不正确/)).toBeInTheDocument();
    });
    
    // 清除输入
    await user.clear(input);
    
    // 错误信息应该消失
    await waitFor(() => {
      expect(screen.queryByText(/手机号格式不正确/)).not.toBeInTheDocument();
    });
  });
});