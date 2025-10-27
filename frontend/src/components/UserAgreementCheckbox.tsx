import React, { useState, useEffect } from 'react';

interface UserAgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const UserAgreementCheckbox: React.FC<UserAgreementCheckboxProps> = ({
  checked,
  onChange,
  disabled = false
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  const handleAgreementClick = () => {
    // 简单的用户协议弹窗实现
    alert('用户协议内容：\n\n1. 用户需遵守相关法律法规\n2. 保护个人信息安全\n3. 合理使用平台服务\n\n详细条款请联系客服获取。');
  };

  return (
    <div className="user-agreement-container">
      <label className="agreement-label">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="agreement-checkbox"
        />
        <span className="agreement-text">
          我已阅读并同意
          <button
            type="button"
            className="agreement-link"
            onClick={handleAgreementClick}
          >
            《用户协议》
          </button>
        </span>
      </label>
    </div>
  );
};

export default UserAgreementCheckbox;