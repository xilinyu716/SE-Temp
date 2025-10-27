import React, { useState, useEffect } from 'react';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  disabled?: boolean;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false
}) => {
  const [code, setCode] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 验证验证码格式（6位数字）
  const validateCode = (inputCode: string): boolean => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(inputCode);
  };

  useEffect(() => {
    setCode(value);
  }, [value]);

  useEffect(() => {
    if (code === '') {
      setIsValid(false);
      setErrorMessage('');
      onValidationChange(false);
      return;
    }

    const valid = validateCode(code);
    setIsValid(valid);
    
    if (!valid && code.length > 0) {
      if (code.length < 6) {
        setErrorMessage('验证码必须是6位数字');
      } else {
        setErrorMessage('验证码格式不正确');
      }
    } else {
      setErrorMessage('');
    }
    
    onValidationChange(valid);
  }, [code, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 只允许输入数字，最多6位
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 6);
    
    setCode(numericValue);
    onChange(numericValue);
  };

  return (
    <div className="verification-code-container">
      <input
        type="text"
        value={code}
        onChange={handleChange}
        disabled={disabled}
        placeholder="请输入验证码"
        maxLength={6}
        className={`verification-code-input ${!isValid && code ? 'error' : ''}`}
      />
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default VerificationCodeInput;