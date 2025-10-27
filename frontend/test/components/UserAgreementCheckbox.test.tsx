import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserAgreementCheckbox from '../../src/components/UserAgreementCheckbox';

describe('UserAgreementCheckbox Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('应该渲染用户协议复选框', () => {
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const agreementText = screen.getByText(/我已阅读并同意/);
    const agreementLink = screen.getByText('《用户协议》');

    expect(checkbox).toBeInTheDocument();
    expect(agreementText).toBeInTheDocument();
    expect(agreementLink).toBeInTheDocument();
  });

  it('应该显示传入的初始选中状态', () => {
    render(
      <UserAgreementCheckbox
        checked={true}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('应该显示传入的初始未选中状态', () => {
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('应该在点击复选框时切换状态', async () => {
    const user = userEvent.setup();
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('应该在点击标签文本时切换状态', async () => {
    const user = userEvent.setup();
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = screen.getByText(/我已阅读并同意/);
    
    await user.click(label);
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('应该在禁用状态下不可点击', async () => {
    const user = userEvent.setup();
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    
    await user.click(checkbox);
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('应该在点击用户协议链接时打开协议详情', async () => {
    const user = userEvent.setup();
    
    // 模拟window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    });
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const agreementLink = screen.getByText('《用户协议》');
    
    await user.click(agreementLink);
    
    // 验证是否尝试打开用户协议页面
    expect(mockOpen).toHaveBeenCalled();
  });

  it('应该阻止用户协议链接点击时触发复选框状态变化', async () => {
    const user = userEvent.setup();
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const agreementLink = screen.getByText('《用户协议》');
    
    await user.click(agreementLink);
    
    // 点击协议链接不应该改变复选框状态
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('应该支持键盘操作', async () => {
    const user = userEvent.setup();
    
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    // 聚焦到复选框
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    
    // 按空格键切换状态
    await user.keyboard(' ');
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('应该具有正确的可访问性属性', () => {
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    // 验证复选框具有正确的标签关联
    expect(checkbox).toHaveAccessibleName(/我已阅读并同意/);
  });

  it('应该在选中状态变化时更新内部状态', async () => {
    const user = userEvent.setup();
    
    const { rerender } = render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    // 通过props更新选中状态
    rerender(
      <UserAgreementCheckbox
        checked={true}
        onChange={mockOnChange}
      />
    );
    
    expect(checkbox).toBeChecked();
  });

  it('应该显示用户协议链接为按钮样式', () => {
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const agreementLink = screen.getByText('《用户协议》');
    
    expect(agreementLink).toHaveAttribute('type', 'button');
    expect(agreementLink.tagName).toBe('BUTTON');
  });

  it('应该在协议链接上显示正确的样式类', () => {
    render(
      <UserAgreementCheckbox
        checked={false}
        onChange={mockOnChange}
      />
    );

    const agreementLink = screen.getByText('《用户协议》');
    
    expect(agreementLink).toHaveClass('agreement-link');
  });
});