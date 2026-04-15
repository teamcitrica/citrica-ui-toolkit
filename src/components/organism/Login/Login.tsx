"use client";
import React, { useState } from 'react';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';

export type LoginMode = 'login' | 'forgot-password' | 'new-password';

export interface LoginProps {
  // Mode configuration
  mode?: LoginMode;

  // Styling
  bgImage?: string;
  bgImageSrc?: string;
  bgImageAlt?: string;
  logo?: string;
  logoAlt?: string;
  logoClassName?: string;
  className?: string;

  // Content - Login mode
  title?: string;
  subtitle?: string;
  emailLabel?: string;
  passwordLabel?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  loginButtonText?: string;
  loadingButtonText?: string;

  // Content - Forgot Password mode
  forgotPasswordTitle?: string;
  forgotPasswordSubtitle?: string;
  forgotPasswordDescription?: string;
  sendLinkButtonText?: string;
  sendingLinkButtonText?: string;
  backToLoginText?: string;

  // Content - New Password mode
  newPasswordTitle?: string;
  newPasswordSubtitle?: string;
  newPasswordLabel?: string;
  newPasswordPlaceholder?: string;
  savePasswordButtonText?: string;
  savingPasswordButtonText?: string;
  cancelText?: string;

  // Actions - Login mode
  onLogin?: (email: string, password: string) => Promise<{error?: boolean; message?: string}>;
  onForgotPasswordClick?: () => void;

  // Actions - Forgot Password mode
  onSendResetLink?: (email: string) => Promise<{error?: boolean; message?: string}>;
  onBackToLogin?: () => void;

  // Actions - New Password mode
  onSaveNewPassword?: (password: string) => Promise<{error?: boolean; message?: string}>;
  onCancel?: () => void;

  // Visibility toggles
  showForgotPassword?: boolean;

  // Error messages
  emptyFieldsError?: string;
  loginError?: string;
  emptyEmailError?: string;
  resetLinkError?: string;
  emptyPasswordError?: string;
  savePasswordError?: string;
}

export const Login: React.FC<LoginProps> = ({
  // Mode
  mode = 'login',

  // Styling
  bgImage = '/img/login-form-image-lg.jpg',
  bgImageSrc,
  bgImageAlt = 'Login background',
  logo = '/img/citrica-logo.png',
  logoAlt = 'Logo',
  logoClassName = 'w-[80px] pb-3 items-center',
  className = '',

  // Content - Login
  title = '¡Bienvenido!',
  subtitle = 'Ingresa tu correo electrónico y contraseña',
  emailLabel = 'Email',
  passwordLabel = 'Clave',
  emailPlaceholder = 'Correo electrónico',
  passwordPlaceholder = 'Contraseña',
  loginButtonText = 'Iniciar sesión',
  loadingButtonText = 'Accediendo...',

  // Content - Forgot Password
  forgotPasswordTitle = '¿No puedes iniciar sesión?',
  forgotPasswordSubtitle,
  forgotPasswordDescription = 'Escribe tu correo para recuperar el acceso.',
  sendLinkButtonText = 'Enviar enlace',
  sendingLinkButtonText = 'Enviando...',
  backToLoginText = '¿Olvidaste tu contraseña?',

  // Content - New Password
  newPasswordTitle = 'Crea una nueva contraseña',
  newPasswordSubtitle,
  newPasswordLabel = 'Nueva contraseña',
  newPasswordPlaceholder = 'Nueva contraseña',
  savePasswordButtonText = 'Guardar contraseña',
  savingPasswordButtonText = 'Guardando...',
  cancelText = 'Cancelar',

  // Actions
  onLogin,
  onForgotPasswordClick,
  onSendResetLink,
  onBackToLogin,
  onSaveNewPassword,
  onCancel,

  // Toggles
  showForgotPassword = true,

  // Error messages
  emptyFieldsError = 'Por favor ingresa tu correo y contraseña',
  loginError = 'Correo o contraseña incorrectos',
  emptyEmailError = 'Se requiere un correo electrónico',
  resetLinkError = 'Ocurrió un error al enviar el correo',
  emptyPasswordError = 'Se requiere una contraseña',
  savePasswordError = 'Ocurrió un error al guardar la contraseña',
}) => {
  // Common states
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    setErrorMessage('');
  };

  const handlePasswordChange = (value: string) => {
    setPasswordValue(value);
    setErrorMessage('');
  };


  // Login mode handler
  const handleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (!emailValue.trim() || !passwordValue.trim()) {
      setErrorMessage(emptyFieldsError);
      setIsLoading(false);
      return;
    }

    if (onLogin) {
      try {
        const result = await onLogin(emailValue, passwordValue);
        if (result?.error) {
          setErrorMessage(result.message || loginError);
        }
      } catch (error) {
        setErrorMessage(loginError);
      }
    }

    setIsLoading(false);
  };

  // Forgot password mode handler
  const handleSendResetLink = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (!emailValue.trim()) {
      setErrorMessage(emptyEmailError);
      setIsLoading(false);
      return;
    }

    if (onSendResetLink) {
      try {
        const result = await onSendResetLink(emailValue);
        if (result?.error) {
          setErrorMessage(result.message || resetLinkError);
        }
      } catch (error) {
        setErrorMessage(resetLinkError);
      }
    }

    setIsLoading(false);
  };

  // New password mode handler
  const handleSavePassword = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (!passwordValue.trim()) {
      setErrorMessage(emptyPasswordError);
      setIsLoading(false);
      return;
    }

    if (onSaveNewPassword) {
      try {
        const result = await onSaveNewPassword(passwordValue);
        if (result?.error) {
          setErrorMessage(result.message || savePasswordError);
        }
      } catch (error) {
        setErrorMessage(savePasswordError);
      }
    }

    setIsLoading(false);
  };

  // Estilos inline basados en la referencia
  const containerInputsStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '484px',
    height: '473px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #E9E8DD',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    boxShadow: '8px 8px 24px rgba(102, 102, 102, 0.3)',
    background: '#FFFFFF',
    zIndex: 10,
  };

  const bgLoginStyle: React.CSSProperties = {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100%',
    maxWidth: '484px',
    height: '473px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    zIndex: 10,
  };

  // Render Login Mode
  const renderLoginMode = () => (
    <>
      {logo && (
        <img className={logoClassName} src={logo} alt={logoAlt} />
      )}

      <h2 className="text-center mb-1">
        <Text color="#FF5B00" variant="title">
          {title}
        </Text>
      </h2>

      {subtitle && (
        <span>
          <Text variant="label" textColor="#265197">
            {subtitle}
          </Text>
        </span>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col justify-center mt-4 gap-4">
        <Input
          label={emailLabel}
          type="email"
          placeholder={emailPlaceholder}
          value={emailValue}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isLoading}
          variant="faded"
          classNames={{
            inputWrapper: "!border-[#D4DEED] !rounded-[12px] data-[hover=true]:!border-[#265197]",
            label: "!text-[#FF5B00]",
            input: "placeholder:text-[#A7BDE2] !text-[#265197]",
          }}
        />

        <Input
          label={passwordLabel}
          type={showPassword ? "text" : "password"}
          placeholder={passwordPlaceholder}
          value={passwordValue}
          onChange={(e) => handlePasswordChange(e.target.value)}
          disabled={isLoading}
          variant="faded"
          classNames={{
            inputWrapper: "!border-[#D4DEED] !rounded-[12px] data-[hover=true]:!border-[#265197]",
            label: "!text-[#FF5B00]",
            input: "placeholder:text-[#A7BDE2] !text-[#265197]",
          }}
          endContent={
            <Icon
              name="Eye"
              className="text-[#66666666] cursor-pointer w-5 h-5"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <Button
          onClick={handleLogin}
          variant="primary"
          label={isLoading ? loadingButtonText : loginButtonText}
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth={true}
        />
      </form>

      {errorMessage && (
        <Text variant="label" color="#ef4444" className="text-center mt-2">
          {errorMessage}
        </Text>
      )}

      {showForgotPassword && (
        <div className="w-[312px] mt-4 flex flex-col justify-center items-center">
          <div className="w-[210px] h-[1px] bg-[#E5E7EB] mt-[14px] mb-2" />
          <button onClick={onForgotPasswordClick}>
            <Text variant="label" textColor="color-primary">
              {backToLoginText}
            </Text>
          </button>
        </div>
      )}
    </>
  );

  // Render Forgot Password Mode
  const renderForgotPasswordMode = () => (
    <>
      {logo && (
        <img className={logoClassName} src={logo} alt={logoAlt} />
      )}

      <Text variant="body" weight="bold" className="mb-4">
        {forgotPasswordTitle}
      </Text>

      {forgotPasswordSubtitle && (
        <Text variant="body" className="mb-4">
          {forgotPasswordSubtitle}
        </Text>
      )}

      <Text variant="label" className="mb-4 text-gray-600">
        {forgotPasswordDescription}
      </Text>

      <div className="flex flex-col justify-center gap-4">
        <Input
          type="email"
          placeholder={emailPlaceholder}
          required
          value={emailValue}
          onChange={(e) => handleEmailChange(e.target.value)}
          description="Te enviaremos un enlace para restablecerla."
          className="!p-0"
          variant="faded"
          classNames={{
            inputWrapper: "!border-[#D4DEED] !rounded-[12px] data-[hover=true]:!border-[#265197]",
            label: "!text-[#FF5B00]",
            input: "placeholder:text-[#A7BDE2] !text-[#265197]",
          }}
        />

        <Button
          variant="primary"
          label={isLoading ? sendingLinkButtonText : sendLinkButtonText}
          disabled={isLoading || !emailValue}
          onPress={handleSendResetLink}
        />

        {errorMessage && (
          <Text variant="label" color="#ef4444" className="text-center">
            {errorMessage}
          </Text>
        )}
      </div>

      <div className="w-[312px] mt-4 flex flex-col justify-center items-center">
        <div className="w-[210px] h-[1px] bg-[#E5E7EB] mt-[14px] mb-2" />
        <button onClick={onBackToLogin}>
          <Text variant="label" textColor="color-secondary">
            {backToLoginText}
          </Text>
        </button>
      </div>
    </>
  );

  // Render New Password Mode
  const renderNewPasswordMode = () => (
    <>
      {logo && (
        <img className={logoClassName} src={logo} alt={logoAlt} />
      )}

      <Text variant="body" className="text-center mb-4">
        {newPasswordTitle}
      </Text>

      {newPasswordSubtitle && (
        <Text variant="label" className="text-center mb-4">
          {newPasswordSubtitle}
        </Text>
      )}

      <div className="flex flex-col justify-center gap-4">
        <Input
          label={newPasswordLabel}
          placeholder={newPasswordPlaceholder}
          type={showPassword ? 'text' : 'password'}
          value={passwordValue}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="!p-0"
          disabled={isLoading}
          variant="faded"
          classNames={{
            inputWrapper: "!border-[#D4DEED] !rounded-[12px] data-[hover=true]:!border-[#265197]",
            label: "!text-[#FF5B00]",
            input: "placeholder:text-[#A7BDE2] !text-[#265197]",
          }}
          endContent={
            <Icon
              name={showPassword ? 'EyeOff' : 'Eye'}
              className="text-[#66666666] cursor-pointer w-5 h-5"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          label={isLoading ? savingPasswordButtonText : savePasswordButtonText}
          variant="primary"
          onPress={handleSavePassword}
        />

        {errorMessage && (
          <Text variant="label" color="#ef4444" className="text-center">
            {errorMessage}
          </Text>
        )}
      </div>

      <div className="w-[312px] mt-4 flex flex-col justify-center items-center">
        <div className="w-[210px] h-[1px] bg-[#E5E7EB] mt-[14px] mb-2" />
        <button onClick={onCancel}>
          <Text textColor="color-secondary" variant="body">
            {cancelText}
          </Text>
        </button>
      </div>
    </>
  );

  return (
    <div className={`w-[968px] flex justify-center flex-nowrap ${className}`}>
      {/* Form Section - Left */}
      <div style={containerInputsStyle}>
        {mode === 'login' && renderLoginMode()}
        {mode === 'forgot-password' && renderForgotPasswordMode()}
        {mode === 'new-password' && renderNewPasswordMode()}
      </div>

      {/* Background Image Section - Right - Hidden on mobile */}
      <div className="hidden md:block" style={bgImageSrc ? {} : bgLoginStyle}>
        {bgImageSrc && (
          <img
            src={bgImageSrc}
            alt={bgImageAlt}
            className="w-full h-full object-cover rounded-r-lg"
            style={{
              maxWidth: '484px',
              height: '473px',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
