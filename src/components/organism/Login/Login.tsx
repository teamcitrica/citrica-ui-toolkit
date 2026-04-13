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
  bgColor?: string;
  bgImage?: string;
  logo?: string;
  logoAlt?: string;
  logoClassName?: string;
  className?: string;

  // Content - Login mode
  title?: string;
  subtitle?: string;
  brandTitle?: string;
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
  newPasswordPlaceholder?: string;
  savePasswordButtonText?: string;
  savingPasswordButtonText?: string;
  cancelText?: string;

  // Actions - Login mode
  onLogin?: (email: string, password: string) => Promise<{error?: boolean; message?: string}>;
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;

  // Actions - Forgot Password mode
  onSendResetLink?: (email: string) => Promise<{error?: boolean; message?: string}>;
  onBackToLogin?: () => void;

  // Actions - New Password mode
  onSaveNewPassword?: (password: string) => Promise<{error?: boolean; message?: string}>;
  onCancel?: () => void;

  // Visibility toggles
  showRegisterLink?: boolean;
  showForgotPassword?: boolean;

  // Text customization
  registerLinkText?: string;
  registerButtonText?: string;
  forgotPasswordText?: string;
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
  bgColor = '#3E688E',
  bgImage = '/img/logo-principal.svg',
  logo,
  logoAlt = 'Logo',
  logoClassName = 'w-20 pb-3',
  className = '',

  // Content - Login
  title = 'Bienvenido',
  subtitle,
  brandTitle = 'Administración',
  emailPlaceholder = 'Correo electrónico',
  passwordPlaceholder = 'Contraseña',
  loginButtonText = 'Acceder',
  loadingButtonText = 'Iniciando...',

  // Content - Forgot Password
  forgotPasswordTitle = '¿No puedes iniciar sesión?',
  forgotPasswordSubtitle,
  forgotPasswordDescription = 'Escribe tu correo para recuperar el acceso.',
  sendLinkButtonText = 'Enviar enlace',
  sendingLinkButtonText = 'Enviando...',
  backToLoginText = 'Volver al inicio de sesión',

  // Content - New Password
  newPasswordTitle = 'Crea una nueva contraseña',
  newPasswordSubtitle,
  newPasswordPlaceholder = 'Nueva contraseña',
  savePasswordButtonText = 'Guardar contraseña',
  savingPasswordButtonText = 'Guardando...',
  cancelText = 'Cancelar',

  // Actions
  onLogin,
  onForgotPasswordClick,
  onRegisterClick,
  onSendResetLink,
  onBackToLogin,
  onSaveNewPassword,
  onCancel,

  // Toggles
  showRegisterLink = true,
  showForgotPassword = true,

  // Texts
  registerLinkText = '¿Aún no te has registrado?',
  registerButtonText = 'Regístrate',
  forgotPasswordText = '¿Olvidaste tu contraseña?',
  emptyFieldsError = 'Se requiere un usuario y contraseña',
  loginError = 'Por favor verifique su usuario o contraseña',
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
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasCheckedSession(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    setErrorMessage('');
  };

  const handlePasswordChange = (value: string) => {
    setPasswordValue(value);
    setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  if (!hasCheckedSession) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className="animate-pulse">
          <img
            src={bgImage}
            alt="Logo"
            className="w-48 h-48"
          />
        </div>
      </div>
    );
  }

  // Render Login Mode
  const renderLoginMode = () => (
    <>
      {logo && (
        <div className="mb-4 flex justify-center">
          <img src={logo} alt={logoAlt} className={logoClassName} />
        </div>
      )}

      {brandTitle && (
        <Text
          variant="headline"
          className="text-center mb-2"
          style={{ color: bgColor }}
        >
          {brandTitle}
        </Text>
      )}

      <Text
        variant="headline"
        className="text-center mb-4"
        style={{ color: bgColor }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text variant="body" className="text-center mb-4" style={{ color: bgColor }}>
          {subtitle}
        </Text>
      )}

      <Input
        placeholder={emailPlaceholder}
        type="email"
        value={emailValue}
        onValueChange={handleEmailChange}
        variant="primary"
      />

      <div className="relative">
        <Input
          placeholder={passwordPlaceholder}
          type={showPassword ? 'text' : 'password'}
          value={passwordValue}
          onValueChange={handlePasswordChange}
          variant="primary"
        />
        <button
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          type="button"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Icon
              className="text-2xl text-default-400 pointer-events-none"
              name="EyeOff"
            />
          ) : (
            <Icon
              className="text-2xl text-default-400 pointer-events-none"
              name="Eye"
            />
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="error-message" style={{ color: '#ef4444' }}>
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-2">
        <Button
          className="w-full"
          isDisabled={isLoading}
          variant="primary"
          type="submit"
          onPress={handleLogin}
          label={isLoading ? loadingButtonText : loginButtonText}
          fullWidth
        />

        {showForgotPassword && (
          <div className="flex justify-center items-center">
            <button
              className="text-sm underline hover:opacity-80 transition-opacity"
              style={{ color: bgColor }}
              onClick={onForgotPasswordClick}
            >
              {forgotPasswordText}
            </button>
          </div>
        )}
      </div>

      {showRegisterLink && (
        <>
          <div className="my-4 h-px bg-gray-300" />
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <span className="text-sm" style={{ color: bgColor }}>
              {registerLinkText}
            </span>
            <button
              className="text-sm underline hover:opacity-80 transition-opacity font-medium"
              style={{ color: bgColor }}
              onClick={onRegisterClick}
            >
              {registerButtonText}
            </button>
          </div>
        </>
      )}
    </>
  );

  // Render Forgot Password Mode
  const renderForgotPasswordMode = () => (
    <>
      {logo && (
        <div className="mb-4 flex justify-center">
          <img src={logo} alt={logoAlt} className={logoClassName} />
        </div>
      )}

      <Text
        variant="body"
        weight="bold"
        className="mb-4"
      >
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
          onValueChange={handleEmailChange}
          description="Te enviaremos un enlace para restablecerla."
          className="!p-0"
        />

        <Button
          variant="primary"
          label={isLoading ? sendingLinkButtonText : sendLinkButtonText}
          isDisabled={isLoading || !emailValue}
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
        <div className="mb-4 flex justify-center">
          <img src={logo} alt={logoAlt} className={logoClassName} />
        </div>
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
        <div className="relative">
          <Input
            placeholder={newPasswordPlaceholder}
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            onValueChange={handlePasswordChange}
            className="!p-0"
            disabled={isLoading}
          />
          <button
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            type="button"
            onClick={togglePasswordVisibility}
          >
            <Icon
              name={showPassword ? 'EyeOff' : 'Eye'}
              size={20}
              color="#666666"
            />
          </button>
        </div>

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          label={isLoading ? savingPasswordButtonText : savePasswordButtonText}
          type="submit"
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
    <div className={`w-full min-h-screen flex items-center justify-center ${className}`} style={{ backgroundColor: bgColor }}>
      <div className="w-full max-w-[968px] flex flex-col lg:flex-row justify-center items-stretch shadow-2xl bg-white rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white">
          <div className="w-full max-w-[350px] flex flex-col">
            {mode === 'login' && renderLoginMode()}
            {mode === 'forgot-password' && renderForgotPasswordMode()}
            {mode === 'new-password' && renderNewPasswordMode()}
          </div>
        </div>

        {/* Background Image Section */}
        <div
          className="hidden lg:block flex-1 min-h-[600px]"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
    </div>
  );
};

export default Login;
