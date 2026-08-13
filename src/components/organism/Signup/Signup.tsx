"use client";
import React, { useState } from 'react';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { Container, Col } from '../../atoms/Grid';

export interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface SignupResult {
  error?: boolean;
  message?: string;
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'Al menos una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'Al menos una minúscula', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Al menos un número', test: (p) => /[0-9]/.test(p) },
];

export interface SignupProps {
  fullScreen?: boolean;
  imagePosition?: 'left' | 'right';
  className?: string;
  cardClassName?: string;
  imageClassName?: string;

  image?: string;
  imageAlt?: string;
  imageOverlay?: string | false;
  imageTitle?: React.ReactNode;
  imageDescription?: React.ReactNode;

  logo?: string;
  logoAlt?: string;
  logoClassName?: string;
  title?: string;
  subtitle?: string;

  titleColor?: string;
  subtitleColor?: string;
  errorColor?: string;
  checkboxColor?: string;
  checkboxBorderColor?: string;
  hintValidColor?: string;
  hintInvalidColor?: string;

  inputVariant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined';
  inputClassName?: string;
  firstNameLabel?: string;
  firstNamePlaceholder?: string;
  lastNameLabel?: string;
  lastNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;

  showNameFields?: boolean;
  showConfirmPassword?: boolean;
  showPasswordToggle?: boolean;
  showTerms?: boolean;
  showLoginLink?: boolean;

  showPasswordHints?: boolean;
  passwordRules?: PasswordRule[];
  hintsFloating?: boolean;
  hintsClassName?: string;

  termsPrefixText?: string;
  termsLinkText?: string;
  termsSuffixText?: string;
  termsHref?: string;
  termsTarget?: string;
  onTermsClick?: () => void;

  submitButtonText?: string;
  loadingButtonText?: string;
  submitButtonVariant?: 'primary' | 'secondary' | 'flat' | 'link' | 'success' | 'warning' | 'danger';
  submitFullWidth?: boolean;
  submitHelperText?: string;

  loginPromptText?: string;
  loginLinkText?: string;
  loginHref?: string;
  onLoginClick?: () => void;

  onSignup?: (values: SignupValues) => Promise<SignupResult | void> | SignupResult | void;
  onValuesChange?: (values: SignupValues & { confirmPassword: string; acceptedTerms: boolean }) => void;

  isLoading?: boolean;
  isDisabled?: boolean;

  firstNameError?: string;
  lastNameError?: string;
  emptyEmailError?: string;
  invalidEmailError?: string;
  emptyPasswordError?: string;
  weakPasswordError?: string;
  emptyConfirmPasswordError?: string;
  passwordMismatchError?: string;
  termsError?: string;
  genericError?: string;
}

type FieldErrors = Record<string, string>;

export const Signup: React.FC<SignupProps> = ({
  fullScreen = false,
  imagePosition = 'left',
  className = '',
  cardClassName = '',
  imageClassName = '',

  image,
  imageAlt = 'Signup',
  imageOverlay = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
  imageTitle,
  imageDescription,

  logo,
  logoAlt = 'Logo',
  logoClassName = 'w-[100px] mx-auto mb-3',
  title = 'Crear Cuenta',
  subtitle = 'Completa los datos para registrarte',

  titleColor,
  subtitleColor,
  errorColor = '#F04242',
  checkboxColor = '#22C55E',
  checkboxBorderColor = '#D1D5DB',
  hintValidColor = '#22C55E',
  hintInvalidColor = '#9CA3AF',

  inputVariant = 'secondary',
  inputClassName = '!p-0',
  firstNameLabel = 'Nombre',
  firstNamePlaceholder = 'Tu nombre',
  lastNameLabel = 'Apellido',
  lastNamePlaceholder = 'Tu apellido',
  emailLabel = 'Correo electrónico',
  emailPlaceholder = 'tu@email.com',
  passwordLabel = 'Contraseña',
  passwordPlaceholder = 'Crea una contraseña segura',
  confirmPasswordLabel = 'Confirmar Contraseña',
  confirmPasswordPlaceholder = 'Repite tu contraseña',

  showNameFields = true,
  showConfirmPassword = true,
  showPasswordToggle = true,
  showTerms = true,
  showLoginLink = true,

  showPasswordHints = true,
  passwordRules = DEFAULT_PASSWORD_RULES,
  hintsFloating = true,
  hintsClassName = '',

  termsPrefixText = 'Acepto los',
  termsLinkText = 'Términos y Condiciones',
  termsSuffixText = '.',
  termsHref,
  termsTarget = '_blank',
  onTermsClick,

  submitButtonText = 'Crear cuenta',
  loadingButtonText = 'Procesando...',
  submitButtonVariant = 'primary',
  submitFullWidth = true,
  submitHelperText,

  loginPromptText = '¿Ya tienes una cuenta?',
  loginLinkText = 'Inicia sesión',
  loginHref,
  onLoginClick,

  onSignup,
  onValuesChange,

  isLoading: isLoadingProp = false,
  isDisabled = false,

  firstNameError = 'El nombre es obligatorio',
  lastNameError = 'El apellido es obligatorio',
  emptyEmailError = 'El email es obligatorio',
  invalidEmailError = 'Ingresa un email válido',
  emptyPasswordError = 'La contraseña es obligatoria',
  weakPasswordError = 'La contraseña no cumple los requisitos indicados.',
  emptyConfirmPasswordError = 'Confirma tu contraseña',
  passwordMismatchError = 'Las contraseñas no coinciden',
  termsError = 'Debes aceptar los términos y condiciones',
  genericError = 'Ocurrió un error inesperado',
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isLoadingProp || isSubmitting;
  const isFormDisabled = isLoading || isDisabled;

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isPasswordValid = passwordRules.every((rule) => rule.test(password));

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev) && !('general' in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.general;
      return next;
    });
  };

  const notifyChange = (
    patch: Partial<SignupValues & { confirmPassword: string; acceptedTerms: boolean }>
  ) => {
    onValuesChange?.({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acceptedTerms,
      ...patch,
    });
  };

  const handleSubmit = async () => {
    const newErrors: FieldErrors = {};

    if (showNameFields) {
      if (!firstName.trim()) newErrors.firstName = firstNameError;
      if (!lastName.trim()) newErrors.lastName = lastNameError;
    }

    if (!email.trim()) {
      newErrors.email = emptyEmailError;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = invalidEmailError;
    }

    if (!password) {
      newErrors.password = emptyPasswordError;
    } else if (!isPasswordValid) {
      newErrors.password = weakPasswordError;
    }

    if (showConfirmPassword) {
      if (!confirmPassword) {
        newErrors.confirmPassword = emptyConfirmPasswordError;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = passwordMismatchError;
      }
    }

    if (showTerms && !acceptedTerms) {
      newErrors.terms = termsError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await onSignup?.({ firstName, lastName, email, password });
      if (result?.error) {
        setErrors({ general: result.message || genericError });
      }
    } catch (error) {
      setErrors({ general: genericError });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordToggle = (visible: boolean, toggle: () => void) =>
    showPasswordToggle ? (
      <Icon
        name={visible ? 'EyeOff' : 'Eye'}
        size={18}
        color="#66666666"
        className="cursor-pointer"
        onClick={toggle}
      />
    ) : undefined;

  const renderPasswordHints = (value: string, isOpen: boolean) => {
    if (!showPasswordHints || passwordRules.length === 0) return null;
    if (!isOpen) return null;

    const floatingClasses = hintsFloating
      ? 'absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg p-3'
      : 'mt-1 mb-1';

    return (
      <div role="status" className={`flex flex-col gap-0.5 ${floatingClasses} ${hintsClassName}`}>
        {passwordRules.map((rule) => {
          const passed = rule.test(value);
          return (
            <div key={rule.id} className="flex flex-row items-center gap-1.5">
              <Icon
                name={passed ? 'Check' : 'Circle'}
                size={12}
                color={passed ? hintValidColor : hintInvalidColor}
              />
              <Text variant="label" color={passed ? hintValidColor : hintInvalidColor}>
                {rule.label}
              </Text>
            </div>
          );
        })}
      </div>
    );
  };

  const renderImagePanel = () => {
    if (!image) return null;

    const roundedSide = imagePosition === 'left' ? 'rounded-l-2xl' : 'rounded-r-2xl';

    return (
      <div
        className={`hidden lg:block w-1/2 min-h-full overflow-hidden shrink-0 relative ${roundedSide} ${imageClassName}`}
      >
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
        {imageOverlay && <div className="absolute inset-0" style={{ background: imageOverlay }} />}
        {(imageTitle || imageDescription) && (
          <div className="absolute inset-0 flex flex-col justify-end p-10">
            {imageTitle && (
              <Text variant="title" textColor="color-white">
                {imageTitle}
              </Text>
            )}
            {imageDescription && (
              <Text variant="label" textColor="color-white" weight="light" className="mt-2">
                {imageDescription}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => (
    <div
      className={`p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg w-full ${
        image ? 'lg:w-1/2' : ''
      } ${image && imagePosition === 'left' ? 'lg:rounded-l-none' : ''} ${
        image && imagePosition === 'right' ? 'lg:rounded-r-none' : ''
      } ${cardClassName}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col text-center">
          {logo && <img className={logoClassName} src={logo} alt={logoAlt} />}
          <Text
            variant="subtitle"
            color={titleColor}
            textColor={titleColor ? undefined : 'color-secondary'}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              variant="label"
              color={subtitleColor}
              textColor={subtitleColor ? undefined : 'color-on-container'}
            >
              {subtitle}
            </Text>
          )}
        </div>

        <form
          className="flex flex-col gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {showNameFields && (
            <div className="flex flex-row gap-3">
              <Input
                type="text"
                label={firstNameLabel}
                placeholder={firstNamePlaceholder}
                value={firstName}
                onValueChange={(v: string) => {
                  setFirstName(v);
                  clearError('firstName');
                  notifyChange({ firstName: v });
                }}
                required
                disabled={isFormDisabled}
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName}
                className={inputClassName}
                variant={inputVariant}
              />
              <Input
                type="text"
                label={lastNameLabel}
                placeholder={lastNamePlaceholder}
                value={lastName}
                onValueChange={(v: string) => {
                  setLastName(v);
                  clearError('lastName');
                  notifyChange({ lastName: v });
                }}
                required
                disabled={isFormDisabled}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName}
                className={inputClassName}
                variant={inputVariant}
              />
            </div>
          )}

          <Input
            type="email"
            label={emailLabel}
            placeholder={emailPlaceholder}
            value={email}
            onValueChange={(v: string) => {
              setEmail(v);
              clearError('email');
              notifyChange({ email: v });
            }}
            required
            disabled={isFormDisabled}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            className={inputClassName}
            variant={inputVariant}
          />

          <div
            className="relative"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              value={password}
              onValueChange={(v: string) => {
                setPassword(v);
                clearError('password');
                notifyChange({ password: v });
              }}
              required
              disabled={isFormDisabled}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              className={inputClassName}
              variant={inputVariant}
              endContent={passwordToggle(showPassword, () => setShowPassword((p) => !p))}
            />
            {renderPasswordHints(password, passwordFocused)}
          </div>

          {showConfirmPassword && (
            <div
              className="relative"
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
            >
              <Input
                type={showConfirm ? 'text' : 'password'}
                label={confirmPasswordLabel}
                placeholder={confirmPasswordPlaceholder}
                value={confirmPassword}
                onValueChange={(v: string) => {
                  setConfirmPassword(v);
                  clearError('confirmPassword');
                  notifyChange({ confirmPassword: v });
                }}
                required
                disabled={isFormDisabled}
                isInvalid={!!errors.confirmPassword || passwordsMismatch}
                errorMessage={
                  errors.confirmPassword || (passwordsMismatch ? passwordMismatchError : undefined)
                }
                className={inputClassName}
                variant={inputVariant}
                endContent={passwordToggle(showConfirm, () => setShowConfirm((p) => !p))}
              />
              {renderPasswordHints(confirmPassword, confirmFocused)}
            </div>
          )}

          {showTerms && (
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 my-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={acceptedTerms}
                  aria-label={termsLinkText}
                  disabled={isFormDisabled}
                  onClick={() => {
                    const next = !acceptedTerms;
                    setAcceptedTerms(next);
                    clearError('terms');
                    notifyChange({ acceptedTerms: next });
                  }}
                  className="mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors disabled:opacity-50"
                  style={{
                    borderColor: acceptedTerms ? checkboxColor : checkboxBorderColor,
                    backgroundColor: acceptedTerms ? checkboxColor : 'transparent',
                  }}
                >
                  {acceptedTerms && <Icon name="Check" size={14} color="#FFFFFF" />}
                </button>

                <Text variant="label" textColor="color-black">
                  {termsPrefixText}{' '}
                  {termsHref ? (
                    <Text
                      as="a"
                      variant="label"
                      href={termsHref}
                      target={termsTarget}
                      textDecoration="underline"
                    >
                      {termsLinkText}
                    </Text>
                  ) : (
                    <Text
                      variant="label"
                      textDecoration="underline"
                      className="cursor-pointer"
                      onClick={onTermsClick}
                    >
                      {termsLinkText}
                    </Text>
                  )}
                  {termsSuffixText}
                </Text>
              </div>
              {errors.terms && (
                <Text variant="label" color={errorColor}>
                  {errors.terms}
                </Text>
              )}
            </div>
          )}

          <div
            className={`flex gap-3 mt-2 ${
              submitFullWidth
                ? 'flex-col items-stretch'
                : 'flex-col items-center sm:flex-row sm:items-center'
            }`}
          >
            <Button
              type="submit"
              label={isLoading ? loadingButtonText : submitButtonText}
              variant={submitButtonVariant}
              isDisabled={isFormDisabled}
              isLoading={isLoading}
              fullWidth={submitFullWidth}
              className={submitFullWidth ? '' : 'shrink-0'}
            />
            {submitHelperText && (
              <Text
                variant="label"
                textColor="color-on-container"
                className="flex-1 w-full text-center sm:w-auto sm:text-left"
              >
                {submitHelperText}
              </Text>
            )}
          </div>

          {errors.general && (
            <Text variant="label" color={errorColor} className="text-center mt-2">
              {errors.general}
            </Text>
          )}
        </form>

        {showLoginLink && (
          <div className="text-center">
            <Text variant="label" textColor="color-black">
              {loginPromptText}{' '}
            </Text>
            {loginHref ? (
              <Text as="a" variant="body" href={loginHref} weight="bold" textColor="color-secondary">
                {loginLinkText}
              </Text>
            ) : (
              <Text
                variant="body"
                weight="bold"
                textColor="color-secondary"
                className="cursor-pointer"
                onClick={onLoginClick}
              >
                {loginLinkText}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const content = (
    <div className={`w-full max-w-[960px] flex flex-row ${className}`}>
      {imagePosition === 'left' ? (
        <>
          {renderImagePanel()}
          {renderForm()}
        </>
      ) : (
        <>
          {renderForm()}
          {renderImagePanel()}
        </>
      )}
    </div>
  );

  if (!fullScreen) return content;

  return (
    <Container noPadding className="min-h-screen flex items-center justify-center !flex-nowrap">
      <Col cols={{ lg: 12, md: 8, sm: 4 }} className="relative z-10 flex justify-center">
        {content}
      </Col>
    </Container>
  );
};

export default Signup;
