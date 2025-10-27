import React, { useState, useEffect } from 'react';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false
}) => {
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 验证中国大陆手机号格式
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    setPhoneNumber(value);
  }, [value]);

  useEffect(() => {
    if (phoneNumber === '') {
      setIsValid(false);
      setErrorMessage('');
      onValidationChange(false);
      return;
    }

    const valid = validatePhoneNumber(phoneNumber);
    setIsValid(valid);
    
    if (!valid && phoneNumber.length > 0) {
      setErrorMessage('请输入正确的手机号码');
    } else {
      setErrorMessage('');
    }
    
    onValidationChange(valid);
  }, [phoneNumber, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 只允许输入数字，最多11位
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 11);
    
    setPhoneNumber(numericValue);
    onChange(numericValue);
  };

  return (
    <div className="phone-input-container">
      <input
        type="tel"
        value={phoneNumber}
        onChange={handleChange}
        disabled={disabled}
        placeholder="请输入手机号"
        className={`phone-input ${!isValid && phoneNumber ? 'error' : ''}`}
        maxLength={11}
      />
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default PhoneNumberInput;