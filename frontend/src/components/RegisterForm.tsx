import React, { useState, useEffect } from 'react';
import PhoneNumberInput from './PhoneNumberInput';
import VerificationCodeInput from './VerificationCodeInput';
import UserAgreementCheckbox from './UserAgreementCheckbox';

interface RegisterFormProps {
  onSubmit: (phoneNumber: string, verificationCode: string, agreeToTerms: boolean) => void;
  onSendCode: (phoneNumber: string) => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSendCode,
  isLoading = false
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  // 表单验证逻辑
  useEffect(() => {
    setCanSubmit(isPhoneValid && isCodeValid && agreeToTerms && !isLoading);
  }, [isPhoneValid, isCodeValid, agreeToTerms, isLoading]);

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSendCode = () => {
    if (!isPhoneValid || countdown > 0 || isLoading) {
      return;
    }
    
    // 调用父组件的发送验证码回调
    onSendCode(phoneNumber);
    
    // 启动60秒倒计时
    setCountdown(60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) {
      return;
    }
    
    // 调用父组件的提交回调
    onSubmit(phoneNumber, verificationCode, agreeToTerms);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>用户注册</h2>
      
      <div className="form-group">
        <PhoneNumberInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          onValidationChange={setIsPhoneValid}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <div className="code-input-group">
          <VerificationCodeInput
            value={verificationCode}
            onChange={setVerificationCode}
            onValidationChange={setIsCodeValid}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={!isPhoneValid || countdown > 0 || isLoading}
            className="send-code-btn"
          >
            {countdown > 0 ? `${countdown}s` : '发送验证码'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <UserAgreementCheckbox
          checked={agreeToTerms}
          onChange={setAgreeToTerms}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit || isLoading}
        className="submit-btn"
      >
        {isLoading ? '注册中...' : '注册'}
      </button>
    </form>
  );
};

export default RegisterForm;