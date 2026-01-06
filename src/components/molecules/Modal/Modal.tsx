'use client';
import React, { useEffect } from 'react';
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Text } from '../../atoms/Text/Text';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  placement?: 'center' | 'top' | 'bottom' | 'top-center' | 'bottom-center';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  scrollBehavior?: 'normal' | 'inside' | 'outside';
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  className?: string;
  classNames?: {
    base?: string;
    backdrop?: string;
    header?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
  };
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  placement = 'center',
  backdrop = 'opaque',
  scrollBehavior = 'normal',
  hideCloseButton = false,
  isDismissable = true,
  className,
  classNames,
  header,
  footer
}: ModalProps) => {

  // Handle ESC key press for accessibility
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDismissable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isDismissable]);

  return (
    <HeroModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      placement={placement}
      backdrop={backdrop}
      scrollBehavior={scrollBehavior}
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      className={className}
      classNames={classNames}
    >
      <ModalContent>
        {header || title ? (
          <ModalHeader className="flex flex-col gap-1">
            {header || (title && <Text variant="headline">{title}</Text>)}
          </ModalHeader>
        ) : null}

        <ModalBody>
          {children}
        </ModalBody>

        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </HeroModal>
  );
};

export default Modal;
