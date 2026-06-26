"use client";
import React from 'react';
import { Col, Container } from '../../atoms/Grid';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

export interface NavItem {
  title: string;
  href: string;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  /**
   * - `floating` / `split` / `basic`: cabeceras de marketing fijas que flotan
   *   sobre un hero.
   * - `standard`: navbar sólida en flujo normal (no fija), con tokens del
   *   sistema. Pensada para apps/portales: se puede envolver en un contenedor
   *   sticky (p. ej. junto a una barra de alerta) sin solaparse con el contenido.
   */
  variant?: 'floating' | 'split' | 'basic' | 'standard';
  className?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  navItems?: NavItem[];
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  variant = 'basic',
  className = '',
  showButton = false,
  buttonText = 'GET STARTED',
  onButtonClick,
  navItems = []
}) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  // Renderizar variante floating (como Matour)
  if (variant === 'floating') {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--color-secondary)] shadow-md backdrop-blur-md'
            : 'bg-transparent'
        } ${className}`}
      >
        <Container>
          <Col cols={{ lg: 12, md: 6, sm: 4 }} className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              {logo ? (
                logo
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-sm flex items-center justify-center">
                      <Text variant="label" color="var(--color-text-white)" weight="bold">M</Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="title" color="var(--color-text-white)" weight="bold">
                      Matour
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Centrada */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="bg-white/60 backdrop-blur-md rounded-full px-8 py-2">
                <div className="flex items-center space-x-8">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="transition-colors duration-200 hover:text-[var(--color-text-white)] text-white/90"
                    >
                      <Text variant="label" textColor="color-on-surface">
                        {item.title}
                      </Text>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {showButton && (
              <div className="hidden lg:block">
                <Button
                  onPress={onButtonClick || (() => scrollToSection('#contact'))}
                  variant="primary"
                  size="md"
                  label={buttonText}
                  className="bg-[var(--color-text-white)] text-[var(--color-text-black)] hover:opacity-90"
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex">
              <Button
                size="sm"
                variant="flat"
                onPress={() => setIsOpen(!isOpen)}
                className="p-2 !min-w-0"
              >
                <Icon name="Menu" size={24} color="var(--color-text-white)" />
              </Button>
            </div>
          </Col>
        </Container>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden flex absolute top-full left-0 right-0 bg-[var(--color-secondary)] backdrop-blur-md">
            <Container>
              <Col cols={{ sm: 4 }} className="py-6">
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left py-2 hover:text-gray-300 transition-colors text-white"
                    >
                      <Text variant="body" className="font-medium">
                        {item.title}
                      </Text>
                    </button>
                  ))}

                  {showButton && (
                    <div className="pt-2">
                      <Button
                        onPress={onButtonClick || (() => scrollToSection('#contact'))}
                        variant="primary"
                        fullWidth
                        size="md"
                        label={buttonText}
                        className="bg-[var(--color-text-white)] text-[var(--color-text-black)]"
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Container>
          </div>
        )}
      </nav>
    );
  }

  // Renderizar variante split (como Flowblox)
  if (variant === 'split') {
    const totalItems = navItems.length;
    const leftItemsCount = Math.ceil(totalItems / 2);
    const leftItems = navItems.slice(0, leftItemsCount);
    const rightItems = navItems.slice(leftItemsCount);

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--color-text-white)] shadow-md backdrop-blur-md'
            : 'bg-[var(--color-text-white)] backdrop-blur-sm'
        } ${className}`}
      >
        <Container>
          <Col cols={{ lg: 12, md: 6, sm: 4 }} className="flex justify-between items-center py-4">
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {leftItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="transition-colors duration-200 hover:text-[var(--color-primary)] text-[var(--color-on-surface-var)]"
                >
                  <Text variant="body" weight="bold" textColor="color-on-surface">
                    {item.title}
                  </Text>
                </button>
              ))}
            </div>

            {/* Logo Centrado */}
            <div className="flex items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              {logo ? (
                logo
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                      <Text variant="label" color="var(--color-text-white)" weight="bold">F</Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="title" weight="bold" textColor="color-on-surface">
                      Flowblox
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-8">
              {/* Right Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {rightItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    className="transition-colors duration-200 hover:text-[var(--color-primary)]"
                  >
                    <Text variant="body" weight="bold" textColor="color-on-surface">
                      {item.title}
                    </Text>
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              {showButton && (
                <Button
                  onPress={onButtonClick || (() => scrollToSection('#contact'))}
                  variant="primary"
                  size="md"
                  label={buttonText === 'GET STARTED' ? 'Get started' : buttonText}
                  className="bg-[var(--color-secondary)] text-[var(--color-text-white)] hover:bg-gray-800 rounded-full px-6"
                />
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => setIsOpen(!isOpen)}
                  className="p-2 !min-w-0"
                >
                  <Icon name="Menu" size={24} className="text-[var(--color-on-surface-var)]" />
                </Button>
              </div>
            </div>
          </Col>
        </Container>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden flex absolute top-full left-0 right-0 bg-[var(--color-text-white)] shadow-lg border-t">
            <Container>
              <Col cols={{ sm: 4 }} className="py-4">
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left py-2 hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-var)]"
                    >
                      <Text variant="body" className="font-medium">
                        {item.title}
                      </Text>
                    </button>
                  ))}

                  {showButton && (
                    <div className="pt-2">
                      <Button
                        onPress={onButtonClick || (() => scrollToSection('#contact'))}
                        variant="primary"
                        fullWidth
                        size="md"
                        label={buttonText === 'GET STARTED' ? 'Get started' : buttonText}
                        className="bg-[var(--color-secondary)] text-[var(--color-text-white)] rounded-full"
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Container>
          </div>
        )}
      </nav>
    );
  }

  // Renderizar variante basic (navegación completa)
  if (variant === 'basic') {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--color-text-white)] shadow-lg backdrop-blur-md'
            : 'bg-[var(--color-text-white)] backdrop-blur-sm'
        } ${className}`}
      >
        <Container>
          <Col cols={{ lg: 12, md: 6, sm: 4 }} className="flex justify-between items-center py-2">
            {/* Logo */}
            <a href="#home" className="flex items-center">
              {logo ? (
                logo
              ) : (
                <img
                  src="/img/logo-lienzo.svg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
              )}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="transition-colors duration-200 hover:text-[var(--color-primary)] text-[var(--color-on-surface)]"
                >
                  <Text variant="body" className="font-medium">
                    {item.title}
                  </Text>
                </button>
              ))}

              {showButton && (
                <Button
                  onPress={onButtonClick || (() => scrollToSection('#contact'))}
                  variant="primary"
                  size="md"
                  label={buttonText === 'GET STARTED' ? 'Reservar' : buttonText}
                  className="ml-4"
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex">
              <Button
                size="sm"
                variant="flat"
                onPress={() => setIsOpen(!isOpen)}
                className="p-2 !min-w-0"
              >
                <Icon name="Menu" size={24} className="text-[var(--color-on-surface)]" />
              </Button>
            </div>
          </Col>
        </Container>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex absolute top-full left-0 right-0 bg-[var(--color-text-white)] shadow-lg border-t">
            <Container>
              <Col cols={{ sm: 4 }} className="py-4">
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left py-2 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Text variant="body" className="font-medium">
                        {item.title}
                      </Text>
                    </button>
                  ))}

                  {showButton && (
                    <div className="pt-2">
                      <Button
                        onPress={onButtonClick || (() => scrollToSection('#contact'))}
                        variant="primary"
                        fullWidth
                        size="md"
                        label={buttonText === 'GET STARTED' ? 'Reservar Estudio' : buttonText}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Container>
          </div>
        )}
      </nav>
    );
  }

  // Renderizar variante standard (navbar sólida, en flujo, basada en tokens)
  if (variant === 'standard') {
    return (
      <nav
        aria-label="Navegación principal"
        className={`relative w-full bg-[var(--color-surface-container-lowest)] border-b transition-shadow duration-200 ${
          isScrolled
            ? 'shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-[var(--color-outline-variant)]'
            : 'border-[var(--color-outline-variant)]'
        } ${className}`}
      >
        <Container noPadding>
          <div className="flex items-center gap-4 px-6 lg:px-20 h-16">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              {logo ? (
                logo
              ) : (
                <Text variant="title" weight="bold" textColor="color-on-surface">
                  Citrica
                </Text>
              )}
            </div>

            {/* Navegación desktop + CTA */}
            <div className="ml-auto hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-2 rounded-lg transition-colors text-[var(--color-on-surface-var)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]"
                >
                  <Text as="span" variant="label" className="text-[14px] font-medium">
                    {item.title}
                  </Text>
                </button>
              ))}

              {showButton && (
                <Button
                  onPress={onButtonClick || (() => scrollToSection('#contact'))}
                  variant="primary"
                  size="sm"
                  label={buttonText === 'GET STARTED' ? 'Empezar' : buttonText}
                  className="ml-2"
                />
              )}
            </div>

            {/* Botón menú móvil */}
            <div className="ml-auto md:hidden flex">
              <Button
                size="sm"
                variant="flat"
                isIconOnly
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isOpen}
                onPress={() => setIsOpen(!isOpen)}
                className="!min-w-0 p-2"
              >
                <Icon name={isOpen ? 'X' : 'Menu'} size={24} />
              </Button>
            </div>
          </div>
        </Container>

        {/* Menú móvil */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Container noPadding>
              <div className="px-6 py-2 flex flex-col">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full text-left py-3 border-b border-[var(--color-outline-variant)] last:border-b-0 text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Text as="span" variant="body" className="font-medium">
                      {item.title}
                    </Text>
                  </button>
                ))}

                {showButton && (
                  <div className="py-3">
                    <Button
                      onPress={onButtonClick || (() => scrollToSection('#contact'))}
                      variant="primary"
                      fullWidth
                      size="md"
                      label={buttonText === 'GET STARTED' ? 'Empezar' : buttonText}
                    />
                  </div>
                )}
              </div>
            </Container>
          </div>
        )}
      </nav>
    );
  }

  // Fallback a la variante por defecto
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-text-white)] shadow-md backdrop-blur-md'
          : 'bg-[var(--color-text-white)] backdrop-blur-sm'
      } ${className}`}
    >
      <Container>
        <Col cols={{ lg: 12, md: 6, sm: 4 }} className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {logo ? (
              logo
            ) : (
              <>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-sm flex items-center justify-center">
                    <Text variant="label" color="var(--color-text-white)" weight="bold">L</Text>
                  </div>
                  <div className="w-2 h-8 bg-[var(--color-outline)] rounded-sm"></div>
                </div>
                <div>
                  <Text variant="subtitle" textColor="color-on-surface" weight="bold">
                    LIENZO
                  </Text>
                </div>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.href)}
                className="transition-colors duration-200 hover:text-[var(--color-primary)] text-[var(--color-on-surface)]"
              >
                <Text variant="body" className="font-medium">
                  {item.title}
                </Text>
              </button>
            ))}

            {showButton && (
              <Button
                onPress={onButtonClick || (() => scrollToSection('#contact'))}
                variant="primary"
                size="md"
                label={buttonText === 'GET STARTED' ? 'Reservar' : buttonText}
                className="ml-4"
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex">
            <Button
              size="sm"
              variant="flat"
              onPress={() => setIsOpen(!isOpen)}
              className="p-2 !min-w-0"
            >
              <Icon name="Menu" size={24} className="text-[var(--color-on-surface)]" />
            </Button>
          </div>
        </Col>
      </Container>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex absolute top-full left-0 right-0 bg-[var(--color-text-white)] shadow-lg border-t">
          <Container>
            <Col cols={{ sm: 4 }} className="py-4">
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full text-left py-2 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Text variant="body" className="font-medium">
                      {item.title}
                    </Text>
                  </button>
                ))}

                {showButton && (
                  <div className="pt-2">
                    <Button
                      onPress={onButtonClick || (() => scrollToSection('#contact'))}
                      variant="primary"
                      fullWidth
                      size="md"
                      label={buttonText === 'GET STARTED' ? 'Reservar Estudio' : buttonText}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Container>
        </div>
      )}
    </nav>
  );
};

export default Header;
