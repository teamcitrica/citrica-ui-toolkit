'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { DEFAULT_PASSWORD_RULES, type PasswordRule } from '../Signup/Signup';

export type LoginMode = 'login' | 'forgot-password' | 'new-password';

type LoginField = 'email' | 'password' | 'confirm';

// Deliberadamente simple: algo@dominio.ext, sin espacios. Solo atrapa erratas;
// la única verificación real de un correo es escribirle.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  // Container styling
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  bgContainerClassName?: string;
  bgContainerStyle?: React.CSSProperties;

  // Color customization
  titleColor?: string;
  subtitleColor?: string;
  labelColor?: string;
  inputBorderColor?: string;
  inputHoverColor?: string;
  inputPlaceholderColor?: string;
  inputTextColor?: string;
  /** Color de los enlaces secundarios ("¿Olvidaste tu contraseña?", "Regístrate aquí"). */
  linkColor?: string;
  /** El título hereda las mayúsculas del token `text-title`; por defecto se muestra en tipo oración. */
  titleUppercase?: boolean;
  /**
   * Variante del título en "Recupera tu contraseña", la confirmación y "Crea una
   * nueva contraseña". Por defecto `subtitle` (más liviana que la del login): el
   * título condensado de marca se reserva para el saludo corto del login.
   */
  secondaryTitleVariant?: 'title' | 'subtitle' | 'body';
  /** Color de la barrita decorativa bajo el título. `false` la oculta. */
  titleAccentColor?: string | false;

  // Divider
  showDivider?: boolean;
  dividerClassName?: string;

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
  /** Nota debajo del campo de correo. Con `""` no se muestra. */
  forgotPasswordHint?: string;
  sendLinkButtonText?: string;
  sendingLinkButtonText?: string;
  backToLoginText?: string;
  /** Título de la confirmación después de enviar el enlace. */
  resetSentTitle?: string;
  /**
   * Texto de la confirmación. Recibe el correo escrito. Por defecto no confirma
   * si el correo tiene cuenta (para no revelar qué correos están registrados).
   */
  resetSentDescription?: string | ((email: string) => string);
  /** Enlace para volver a enviar el correo desde la confirmación. */
  resendLinkText?: string;
  forgotPasswordLinkText?: string;
  forgotPasswordHref?: string;

  // Content - Signup link
  signupPromptText?: string;
  signupLinkText?: string;
  /** Si se pasa signupHref u onSignupClick, aparece "¿No tienes una cuenta? Regístrate aquí". */
  signupHref?: string;
  onSignupClick?: () => void;

  // Content - New Password mode
  newPasswordTitle?: string;
  newPasswordSubtitle?: string;
  newPasswordLabel?: string;
  newPasswordPlaceholder?: string;
  /** Segundo campo para repetir la nueva contraseña. */
  confirmNewPasswordLabel?: string;
  confirmNewPasswordPlaceholder?: string;
  /**
   * Requisitos de la nueva contraseña, que se muestran bajo el campo y se van
   * marcando al escribir. Por defecto, los mismos del Signup. Con `[]` no se piden.
   */
  newPasswordRules?: PasswordRule[];
  savePasswordButtonText?: string;
  savingPasswordButtonText?: string;
  cancelText?: string;

  // Actions - Login mode
  onLogin?: (
    email: string,
    password: string,
  ) => Promise<{ error?: boolean; message?: string }>;
  onForgotPasswordClick?: () => void;

  // Actions - Forgot Password mode
  onSendResetLink?: (
    email: string,
  ) => Promise<{ error?: boolean; message?: string }>;
  onBackToLogin?: () => void;

  // Actions - New Password mode
  onSaveNewPassword?: (
    password: string,
  ) => Promise<{ error?: boolean; message?: string }>;
  onCancel?: () => void;

  // Visibility toggles
  showForgotPassword?: boolean;
  /** Oculta el enlace de registro aunque haya signupHref/onSignupClick. */
  showSignupLink?: boolean;

  // Error messages
  emptyFieldsError?: string;
  loginError?: string;
  emptyEmailError?: string;
  /** Correo con formato inválido (sin @, sin dominio, con espacios…). */
  invalidEmailError?: string;
  resetLinkError?: string;
  emptyPasswordError?: string;
  savePasswordError?: string;
  /** La nueva contraseña no cumple los requisitos. */
  weakPasswordError?: string;
  /** El campo de confirmación está vacío. */
  emptyConfirmPasswordError?: string;
  /** Las dos contraseñas no coinciden. */
  passwordMismatchError?: string;
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

  // Container styling
  containerClassName = '',
  containerStyle,
  bgContainerClassName = '',
  bgContainerStyle,

  // Color customization
  // Solo tokens web (ninguno del admin), con un valor de respaldo por si el
  // proyecto no define el token. El color de marca sólido queda solo para el
  // botón principal (sus tokens --color-primary-btn-*), para que nada le compita:
  //  - Título y subtítulo: tintas neutras de la superficie.
  //  - Inputs: sus propios tokens --color-primary-input-*. El foco es el único
  //    momento en que el campo toma color, y solo mientras se escribe.
  //  - Enlaces: versión oscura del color de marca. Se reconocen como de la marca,
  //    pesan menos que el botón y tienen contraste AA como texto chico.
  titleColor = 'var(--color-on-surface, #33302C)',
  subtitleColor = 'var(--color-on-surface-var, #4A4A4A)',
  labelColor = 'var(--color-primary-input-label, #111111)',
  inputBorderColor = 'var(--color-primary-input-border, #CFC9C1)',
  inputHoverColor = 'var(--color-primary-input-border-hover, #E8622C)',
  inputPlaceholderColor = 'var(--color-primary-input-placeholder, #6E6A65)',
  inputTextColor = 'var(--color-primary-input-text, #33302C)',
  linkColor = 'var(--color-on-primary-fixed-variant, #A83E15)',
  titleUppercase = false,
  secondaryTitleVariant = 'subtitle',
  titleAccentColor = false,

  // Divider
  showDivider = true,
  dividerClassName = '',

  // Content - Login
  title = '¡Bienvenido!',
  subtitle = 'Ingresa tu correo electrónico y clave',
  emailLabel = 'Email',
  passwordLabel = 'Clave',
  emailPlaceholder = 'Correo electrónico',
  passwordPlaceholder = 'Ingresa tu clave de acceso',
  loginButtonText = 'Iniciar sesión',
  loadingButtonText = 'Accediendo...',

  // Content - Forgot Password
  forgotPasswordTitle = '¿No puedes iniciar sesión?',
  forgotPasswordSubtitle,
  forgotPasswordDescription = 'Escribe tu correo para recuperar el acceso.',
  forgotPasswordHint = 'Te enviaremos un enlace para restablecerla.',
  sendLinkButtonText = 'Enviar enlace',
  sendingLinkButtonText = 'Enviando...',
  backToLoginText = 'Volver al inicio de sesión',
  resetSentTitle = 'Revisa tu correo',
  resetSentDescription = (email: string) =>
    `Si ${email} tiene una cuenta, te enviamos un enlace para crear una nueva contraseña. Puede tardar unos minutos.`,
  resendLinkText = 'Reenviar enlace',
  forgotPasswordLinkText = '¿Olvidaste tu contraseña?',
  forgotPasswordHref,

  // Content - Signup link
  signupPromptText = '¿No tienes una cuenta?',
  signupLinkText = 'Regístrate aquí',
  signupHref,
  onSignupClick,

  // Content - New Password
  newPasswordTitle = 'Crea una nueva contraseña',
  newPasswordSubtitle,
  newPasswordLabel = 'Nueva contraseña',
  newPasswordPlaceholder = 'Nueva contraseña',
  confirmNewPasswordLabel = 'Confirmar contraseña',
  confirmNewPasswordPlaceholder = 'Confirma tu nueva contraseña',
  newPasswordRules = DEFAULT_PASSWORD_RULES,
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
  showSignupLink = true,

  // Error messages
  emptyFieldsError = 'Por favor ingresa tu correo y contraseña',
  loginError = 'Correo o contraseña incorrectos',
  emptyEmailError = 'Se requiere un correo electrónico',
  invalidEmailError = 'Revisa el correo, p. ej. nombre@empresa.com',
  resetLinkError = 'Ocurrió un error al enviar el correo',
  emptyPasswordError = 'Se requiere una contraseña',
  savePasswordError = 'Ocurrió un error al guardar la contraseña',
  weakPasswordError = 'La contraseña no cumple los requisitos.',
  emptyConfirmPasswordError = 'Confirma tu nueva contraseña',
  passwordMismatchError = 'Las contraseñas no coinciden',
}) => {
  // Common states
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  // Requisitos de la nueva contraseña: visibles mientras se está en el campo.
  // Al salir esperan 200 ms antes de ocultarse: si se ocultaran al
  // instante, el botón "Guardar" subiría justo durante el clic y se perdería.
  const [hintsOpen, setHintsOpen] = useState(false);
  const hintsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (hintsTimer.current) clearTimeout(hintsTimer.current);
    },
    [],
  );
  const showHints = () => {
    if (hintsTimer.current) clearTimeout(hintsTimer.current);
    setHintsOpen(true);
  };
  const hideHintsSoon = () => {
    if (hintsTimer.current) clearTimeout(hintsTimer.current);
    hintsTimer.current = setTimeout(() => setHintsOpen(false), 200);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Se intentó guardar con la confirmación tal como está: entonces el "no
  // coinciden" se muestra aunque vaya a medio escribir. Se reinicia al escribir.
  const [confirmSubmitted, setConfirmSubmitted] = useState(false);
  // Un campo muestra su error recién cuando el usuario sale de él (o al enviar),
  // no mientras escribe la primera vez.
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>(
    {},
  );
  // Error que devuelve onLogin / onSendResetLink / onSaveNewPassword. Se muestra
  // debajo del último campo del formulario y se borra al volver a escribir.
  const [serverError, setServerError] = useState<string | undefined>();
  // "Olvidé mi contraseña": después de enviar el enlace se muestra una
  // confirmación en la misma pantalla, para que el usuario sepa que salió.
  const [resetSent, setResetSent] = useState(false);

  // Al cambiar de pantalla se limpia lo de la anterior: los errores no aplican
  // y la contraseña no se arrastra (si no, "Nueva contraseña" abriría con la
  // clave del login ya escrita, y quizá visible). El correo se conserva: sirve
  // para recuperar la contraseña. Se ajusta durante el render, no en un efecto,
  // para que no se vean un instante los errores de la pantalla anterior.
  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setTouched({});
    setServerError(undefined);
    setPasswordValue('');
    setConfirmValue('');
    setConfirmSubmitted(false);
    setShowPassword(false);
    setShowConfirm(false);
    setResetSent(false);
  }

  const validate = (field: LoginField, value: string): string | undefined => {
    const v = value.trim();
    if (field === 'email') {
      if (!v) return emptyEmailError;
      if (v.length > 254 || !EMAIL_RE.test(v)) return invalidEmailError;
      return undefined;
    }
    if (field === 'confirm') {
      if (!value) return emptyConfirmPasswordError;
      return value === passwordValue ? undefined : passwordMismatchError;
    }
    if (!v) return emptyPasswordError;
    // Al crear una contraseña nueva, además, tiene que cumplir los requisitos.
    if (
      mode === 'new-password' &&
      !newPasswordRules.every((r) => r.test(value))
    )
      return weakPasswordError;
    return undefined;
  };

  const emailError = touched.email ? validate('email', emailValue) : undefined;
  const passwordError = touched.password
    ? validate('password', passwordValue)
    : undefined;
  const newPasswordOk = newPasswordRules.every((r) => r.test(passwordValue));
  const passwordsMatch =
    confirmValue.length > 0 && confirmValue === passwordValue;
  // Mientras la confirmación va siendo el comienzo de la nueva (se está
  // escribiendo bien), no se marca "no coinciden" en cada letra. Sí se marca si
  // ya se desvió, si se completó distinta o si se intentó guardar así.
  const confirmInProgress =
    confirmValue.length > 0 &&
    confirmValue.length < passwordValue.length &&
    passwordValue.startsWith(confirmValue);
  const confirmShownError =
    confirmValue.length === 0
      ? ((touched.confirm ? emptyConfirmPasswordError : undefined) ??
        serverError)
      : passwordsMatch || (confirmInProgress && !confirmSubmitted)
        ? serverError
        : passwordMismatchError;

  // Al salir de un campo se valida solo si el usuario escribió algo. Un campo
  // vacío muestra su error al enviar: si apareciera al salir, el mensaje
  // empujaría hacia abajo lo que está debajo justo mientras se hace clic (el
  // enlace "¿Olvidaste tu contraseña?", el botón) y ese clic se perdería.
  const touch =
    (field: LoginField) => (e: React.FocusEvent<HTMLInputElement>) => {
      if (!e.target.value.trim()) return;
      setTouched((t) => ({ ...t, [field]: true }));
    };

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    setServerError(undefined);
  };

  const handlePasswordChange = (value: string) => {
    setPasswordValue(value);
    setServerError(undefined);
  };

  // Marca los campos como tocados, valida y, si todo está bien, llama a la acción.
  const submit = async (
    fields: LoginField[],
    action: (() => Promise<{ error?: boolean; message?: string }>) | undefined,
    fallbackError: string,
  ): Promise<boolean> => {
    if (isLoading) return false;

    setTouched(
      fields.reduce(
        (t, f) => ({ ...t, [f]: true }),
        {} as Partial<Record<LoginField, boolean>>,
      ),
    );
    setServerError(undefined);

    const values: Record<LoginField, string> = {
      email: emailValue,
      password: passwordValue,
      confirm: confirmValue,
    };
    if (fields.some((f) => validate(f, values[f]))) return false;
    if (!action) return false;

    setIsLoading(true);
    try {
      const result = await action();
      if (result?.error) {
        setServerError(result.message || fallbackError);
        return false;
      }
      return true;
    } catch {
      setServerError(fallbackError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () =>
    submit(
      ['email', 'password'],
      onLogin && (() => onLogin(emailValue.trim(), passwordValue)),
      loginError,
    );

  const handleSendResetLink = async () => {
    const ok = await submit(
      ['email'],
      onSendResetLink && (() => onSendResetLink(emailValue.trim())),
      resetLinkError,
    );
    if (ok) setResetSent(true);
  };

  const handleSavePassword = () => {
    setConfirmSubmitted(true);
    return submit(
      ['password', 'confirm'],
      onSaveNewPassword && (() => onSaveNewPassword(passwordValue)),
      savePasswordError,
    );
  };

  const hasSignupLink = showSignupLink && !!(signupHref || onSignupClick);
  // El subrayado va en el Text (no en el <a>/<button>) para que tome el color
  // del texto: en el contenedor salía del color heredado, que no es el del enlace.
  // Sin subrayado en reposo; aparece al pasar el cursor o con el foco.
  const linkClassName =
    'group cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2';
  // Sin el naranja, el subrayado es lo que dice "esto es un enlace": va siempre,
  // fino y separado del texto; al pasar el cursor se marca más.
  const linkTextClassName =
    'underline underline-offset-4 decoration-1 group-hover:decoration-2 group-focus-visible:decoration-2';

  // Los colores llegan como variables CSS y las clases las leen. Interpolar el
  // color dentro de la clase (`!text-[${color}]`) no funciona: Tailwind solo
  // genera las clases que encuentra escritas tal cual en el código.
  const colorVars = {
    '--login-label': labelColor,
    '--login-input-border': inputBorderColor,
    '--login-input-border-hover': inputHoverColor,
    '--login-placeholder': inputPlaceholderColor,
    '--login-input-text': inputTextColor,
    '--login-input-bg': 'var(--color-primary-input-bg, #FFFFFF)',
    // Rojo de error del sistema (el "danger" de HeroUI es un fucsia).
    '--login-error': 'var(--color-error, #C63A2B)',
    '--login-hint': subtitleColor,
    // Requisito cumplido: verde de éxito del sistema.
    '--login-ok': 'var(--color-success, #1F7A4D)',
  } as React.CSSProperties;

  const inputClassNames = {
    // Esquinas y grosor del borde salen de los tokens de formulario
    // (_form.scss: --form-radius-input y --form-border-size-input), no de
    // valores fijos ni del borde de 2px que trae la variante `faded` de HeroUI.
    inputWrapper:
      '!bg-[var(--login-input-bg)] !border-[length:var(--form-border-size-input,1px)] !border-[color:var(--login-input-border)] !rounded-[var(--form-radius-input,10px)] data-[hover=true]:!border-[color:var(--login-input-border-hover)] group-data-[focus=true]:!border-[color:var(--login-input-border-hover)] group-data-[invalid=true]:!border-[color:var(--login-error)]',
    label: '!text-[var(--login-label)]',
    input:
      '!text-[var(--login-input-text)] placeholder:!text-[var(--login-placeholder)]',
    errorMessage: '!text-[var(--login-error)]',
  };

  // Cabecera común de las tres pantallas (login, olvidé, nueva contraseña):
  // logo, título con la tipografía de título y subtítulo. Así se leen como
  // parte del mismo flujo.
  const renderHeader = (
    headerTitle: React.ReactNode,
    headerSubtitle?: React.ReactNode,
    // El login usa el título de marca; las demás pantallas, uno más liviano.
    headerVariant: 'title' | 'subtitle' | 'body' = 'title',
  ) => (
    <>
      {logo && <img className={logoClassName} src={logo} alt={logoAlt} />}
      <h2 className="text-center mb-1">
        <Text
          color={titleColor}
          variant={headerVariant}
          weight={headerVariant === 'title' ? 'normal' : 'bold'}
          className={titleUppercase ? undefined : '!normal-case'}
        >
          {headerTitle}
        </Text>
      </h2>
      {titleAccentColor && (
        <span
          aria-hidden="true"
          className="block w-10 h-1 rounded-full mb-3"
          style={{ background: titleAccentColor }}
        />
      )}
      {headerSubtitle && (
        <p className="w-[312px] max-w-full text-center">
          <Text variant="label" color={subtitleColor}>
            {headerSubtitle}
          </Text>
        </p>
      )}
    </>
  );

  // Enlace del pie (Volver al inicio de sesión, Cancelar): mismo estilo que los
  // enlaces del login, con la línea divisoria si está activada.
  const renderFooterLink = (
    text: React.ReactNode,
    onClick?: () => void,
    withBackIcon = false,
  ) => (
    <div className="w-[312px] max-w-full mt-6 flex flex-col items-center">
      {showDivider && (
        <div
          className={`w-[210px] h-[1px] bg-[var(--color-outline-variant,#E5E7EB)] mb-3 ${dividerClassName}`}
        />
      )}
      <button
        type="button"
        onClick={onClick}
        className={`${linkClassName} inline-flex items-center gap-1`}
      >
        {withBackIcon && (
          <Icon
            aria-hidden
            name="ArrowLeft"
            size={14}
            style={{ color: linkColor }}
          />
        )}
        <Text variant="label" color={linkColor} className={linkTextClassName}>
          {text}
        </Text>
      </button>
    </div>
  );

  // Estilos inline basados en la referencia
  const containerInputsStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '484px',
    minHeight: '473px',
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid var(--color-outline-variant, #E9E8DD)',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    boxShadow: '8px 8px 24px rgba(102, 102, 102, 0.3)',
    background: 'var(--color-surface-container-lowest, #FFFFFF)',
    zIndex: 10,
    ...colorVars,
    ...containerStyle,
  };

  const bgLoginStyle: React.CSSProperties = {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100%',
    maxWidth: '484px',
    minHeight: '473px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    zIndex: 10,
    ...bgContainerStyle,
  };

  // Render Login Mode
  const renderLoginMode = () => (
    <>
      {renderHeader(title, subtitle)}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col justify-center mt-4 gap-4 w-[312px] max-w-full"
      >
        <Input
          onBlur={touch('email')}
          label={emailLabel}
          type="email"
          placeholder={emailPlaceholder}
          value={emailValue}
          onChange={(e) => handleEmailChange(e.target.value)}
          autoComplete="email"
          disabled={isLoading}
          variant="faded"
          isInvalid={!!emailError}
          errorMessage={emailError}
          className="!p-0"
          classNames={inputClassNames}
        />

        <Input
          onBlur={touch('password')}
          label={passwordLabel}
          type={showPassword ? 'text' : 'password'}
          placeholder={passwordPlaceholder}
          value={passwordValue}
          onChange={(e) => handlePasswordChange(e.target.value)}
          autoComplete="current-password"
          disabled={isLoading}
          variant="faded"
          isInvalid={!!(passwordError ?? serverError)}
          errorMessage={passwordError ?? serverError}
          className="!p-0"
          classNames={inputClassNames}
          endContent={
            <Icon
              name={showPassword ? 'EyeOff' : 'Eye'}
              // Sin robar el foco: el campo sigue activo (y la lista de
              // requisitos a la vista) al mostrar u ocultar la clave.
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              className="text-[var(--login-placeholder)] cursor-pointer w-5 h-5"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        {/* Junto al campo de contraseña, que es donde el usuario descubre que no
            la recuerda; antes del botón para no competir con la acción principal. */}
        {showForgotPassword && (
          <div className="-mt-3 flex justify-end">
            {forgotPasswordHref ? (
              <a href={forgotPasswordHref} className={linkClassName}>
                <Text
                  variant="label"
                  color={linkColor}
                  className={linkTextClassName}
                >
                  {forgotPasswordLinkText}
                </Text>
              </a>
            ) : (
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className={linkClassName}
              >
                <Text
                  variant="label"
                  color={linkColor}
                  className={linkTextClassName}
                >
                  {forgotPasswordLinkText}
                </Text>
              </button>
            )}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          label={isLoading ? loadingButtonText : loginButtonText}
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth={true}
          className="mt-2"
        />
      </form>

      {/* Acción secundaria al final: solo se muestra si hay a dónde llevar. */}
      {hasSignupLink && (
        <div className="w-[312px] max-w-full mt-6 flex flex-col items-center">
          {showDivider && (
            <div
              className={`w-[210px] h-[1px] bg-[var(--color-outline-variant,#E5E7EB)] mb-3 ${dividerClassName}`}
            />
          )}
          {/* flex en vez de <p>: un párrafo hereda el interlineado del body, más
              alto que el del label, y eso dejaba aire extra sobre el texto. */}
          <div className="flex flex-wrap items-baseline justify-center gap-x-1 text-center leading-none">
            <Text variant="label" color={subtitleColor}>
              {signupPromptText}
            </Text>
            {signupHref ? (
              <a href={signupHref} className={linkClassName}>
                <Text
                  variant="label"
                  weight="bold"
                  color={linkColor}
                  className={linkTextClassName}
                >
                  {signupLinkText}
                </Text>
              </a>
            ) : (
              <button
                type="button"
                onClick={onSignupClick}
                className={linkClassName}
              >
                <Text
                  variant="label"
                  weight="bold"
                  color={linkColor}
                  className={linkTextClassName}
                >
                  {signupLinkText}
                </Text>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );

  // Render Forgot Password Mode
  const renderForgotPasswordMode = () =>
    resetSent ? (
      // Confirmación: el enlace salió. Desde aquí se puede reenviar o volver.
      <>
        {renderHeader(
          resetSentTitle,
          typeof resetSentDescription === 'function'
            ? resetSentDescription(emailValue.trim())
            : resetSentDescription,
          secondaryTitleVariant,
        )}
        <div className="mt-6 flex w-[312px] max-w-full flex-col items-center gap-3">
          <Icon
            aria-hidden
            name="MailCheck"
            size={40}
            style={{ color: linkColor }}
          />
          {serverError && (
            <Text
              variant="label"
              color="var(--login-error)"
              className="text-center"
            >
              {serverError}
            </Text>
          )}
          <button
            type="button"
            onClick={handleSendResetLink}
            disabled={isLoading}
            className={linkClassName}
          >
            <Text
              variant="label"
              color={linkColor}
              className={linkTextClassName}
            >
              {isLoading ? sendingLinkButtonText : resendLinkText}
            </Text>
          </button>
        </div>
        {renderFooterLink(backToLoginText, onBackToLogin, true)}
      </>
    ) : (
      <>
        {renderHeader(
          forgotPasswordTitle,
          // Subtítulo y descripción juntos si vienen los dos (como antes).
          forgotPasswordSubtitle ? (
            <>
              {forgotPasswordSubtitle}
              {forgotPasswordDescription && (
                <>
                  <br />
                  {forgotPasswordDescription}
                </>
              )}
            </>
          ) : (
            forgotPasswordDescription
          ),
          secondaryTitleVariant,
        )}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSendResetLink();
          }}
          className="flex flex-col justify-center mt-4 gap-4 w-[312px] max-w-full"
        >
          <Input
            onBlur={touch('email')}
            // Solo placeholder (sin label visible); el label queda para lectores de
            // pantalla. Tamaño `lg`: sin label, el campo mediría 40px de alto;
            // así mide 48px, cómodo para tocar en celular.
            ariaLabel={emailLabel}
            size="lg"
            type="email"
            placeholder={emailPlaceholder}
            value={emailValue}
            onChange={(e) => handleEmailChange(e.target.value)}
            autoComplete="email"
            description={forgotPasswordHint || undefined}
            className="!p-0"
            disabled={isLoading}
            variant="faded"
            isInvalid={!!(emailError ?? serverError)}
            errorMessage={emailError ?? serverError}
            // La nota con el gris del placeholder: un tono más suave que el
            // subtítulo, pero legible (el gris claro de HeroUI casi no se leía).
            classNames={{
              ...inputClassNames,
              description: '!text-[var(--login-placeholder)]',
            }}
          />

          <Button
            type="submit"
            variant="primary"
            label={isLoading ? sendingLinkButtonText : sendLinkButtonText}
            disabled={isLoading}
            isLoading={isLoading}
            fullWidth={true}
            className="mt-2"
          />
        </form>

        {renderFooterLink(backToLoginText, onBackToLogin, true)}
      </>
    );

  // Render New Password Mode
  const renderNewPasswordMode = () => (
    <>
      {renderHeader(
        newPasswordTitle,
        newPasswordSubtitle,
        secondaryTitleVariant,
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSavePassword();
        }}
        className="flex flex-col justify-center mt-4 gap-4 w-[312px] max-w-full"
      >
        {/* Los dos campos juntos: la lista de requisitos aparece al entrar a
            cualquiera de ellos y se oculta al salir de ambos. */}
        <div
          className="flex flex-col gap-4"
          onFocus={showHints}
          onBlur={hideHintsSoon}
        >
          <div className="flex flex-col gap-2">
            <Input
              onBlur={touch('password')}
              ariaLabel={newPasswordLabel}
              size="lg"
              placeholder={newPasswordPlaceholder}
              type={showPassword ? 'text' : 'password'}
              value={passwordValue}
              onChange={(e) => handlePasswordChange(e.target.value)}
              autoComplete="new-password"
              className="!p-0"
              disabled={isLoading}
              variant="faded"
              isInvalid={!!passwordError}
              errorMessage={passwordError}
              classNames={inputClassNames}
              endContent={
                <span className="flex items-center gap-2">
                  {/* Check verde cuando cumple todos los requisitos. */}
                  {newPasswordOk && (
                    <>
                      <Icon
                        aria-hidden
                        name="CircleCheck"
                        size={18}
                        style={{ color: 'var(--login-ok)' }}
                      />
                      <span className="sr-only">Cumple los requisitos</span>
                    </>
                  )}
                  <Icon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    // Sin robar el foco: el campo sigue activo (y la lista de
                    // requisitos a la vista) al mostrar u ocultar la clave.
                    onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                    className="text-[var(--login-placeholder)] cursor-pointer w-5 h-5"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                </span>
              }
            />

            {/* Requisitos en dos columnas, marcados en verde al cumplirse. */}
            {hintsOpen && newPasswordRules.length > 0 && (
              <ul
                className="grid grid-cols-[auto_auto] justify-between gap-x-2 gap-y-1 px-1"
                aria-label="Requisitos de la contraseña"
              >
                {newPasswordRules.map((rule) => {
                  const passed = rule.test(passwordValue);
                  return (
                    <li key={rule.id} className="flex items-center gap-1.5">
                      <Icon
                        aria-hidden
                        name={passed ? 'CircleCheck' : 'Circle'}
                        size={12}
                        style={{
                          color: passed
                            ? 'var(--login-ok)'
                            : 'var(--login-hint)',
                        }}
                      />
                      <Text
                        variant="label"
                        color={passed ? 'var(--login-ok)' : 'var(--login-hint)'}
                        className="!text-xs whitespace-nowrap"
                      >
                        {rule.label}
                        <span className="sr-only">
                          {passed ? ' (cumplido)' : ' (pendiente)'}
                        </span>
                      </Text>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Input
            onBlur={touch('confirm')}
            ariaLabel={confirmNewPasswordLabel}
            size="lg"
            placeholder={confirmNewPasswordPlaceholder}
            type={showConfirm ? 'text' : 'password'}
            value={confirmValue}
            onChange={(e) => {
              setConfirmValue(e.target.value);
              setConfirmSubmitted(false);
              setServerError(undefined);
            }}
            autoComplete="new-password"
            className="!p-0"
            disabled={isLoading}
            variant="faded"
            isInvalid={!!confirmShownError}
            errorMessage={confirmShownError}
            classNames={inputClassNames}
            endContent={
              <span className="flex items-center gap-2">
                {/* Check verde cuando coincide con la nueva (y esta es válida). */}
                {newPasswordOk && passwordsMatch && (
                  <>
                    <Icon
                      aria-hidden
                      name="CircleCheck"
                      size={18}
                      style={{ color: 'var(--login-ok)' }}
                    />
                    <span className="sr-only">Las contraseñas coinciden</span>
                  </>
                )}
                {/* Su propio ojo: se puede revisar lo repetido sin mostrar la otra. */}
                <Icon
                  name={showConfirm ? 'EyeOff' : 'Eye'}
                  // Sin robar el foco: el campo sigue activo (y la lista de
                  // requisitos a la vista) al mostrar u ocultar la clave.
                  onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                  className="text-[var(--login-placeholder)] cursor-pointer w-5 h-5"
                  onClick={() => setShowConfirm((prev) => !prev)}
                />
              </span>
            }
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          label={isLoading ? savingPasswordButtonText : savePasswordButtonText}
          variant="primary"
          fullWidth={true}
          className="mt-2"
        />
      </form>

      {renderFooterLink(cancelText, onCancel)}
    </>
  );

  return (
    <div className={`w-[968px] flex justify-center flex-nowrap ${className}`}>
      {/* Form Section - Left */}
      <div className={containerClassName} style={containerInputsStyle}>
        {mode === 'login' && renderLoginMode()}
        {mode === 'forgot-password' && renderForgotPasswordMode()}
        {mode === 'new-password' && renderNewPasswordMode()}
      </div>

      {/* Background Image Section - Right - Hidden on mobile */}
      <div
        className={`hidden md:block ${bgContainerClassName}`}
        style={bgImageSrc ? bgContainerStyle : bgLoginStyle}
      >
        {bgImageSrc && (
          <img
            src={bgImageSrc}
            alt={bgImageAlt}
            className="w-full h-full object-cover rounded-r-lg"
            style={{
              maxWidth: '484px',
              minHeight: '473px',
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
