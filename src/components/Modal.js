'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { IoClose } from 'react-icons/io5';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'md', // 'sm', 'md', 'lg'
  type = 'default', // 'default', 'success', 'warning', 'error', 'info'
  icon = null,
  actions = null, // Array of { label, onClick, variant }
}) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay for animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  // Type-based accent colors
  const typeAccents = {
    default: 'from-indigo-500 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-blue-500 to-cyan-600',
  };

  const typeGlows = {
    default: 'rgba(123, 200, 255, 0.45)',
    success: 'rgba(34, 197, 94, 0.45)',
    warning: 'rgba(251, 191, 36, 0.45)',
    error: 'rgba(239, 68, 68, 0.45)',
    info: 'rgba(59, 130, 246, 0.45)',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Floating Bubble Decorations */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} transition-all duration-200 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          filter: `drop-shadow(0 0 10px ${typeGlows[type]})`,
        }}
      >
        {/* Modal Content */}
        <div
          className={`relative rounded-2xl border p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.35)] overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-white/10'
              : 'bg-gradient-to-br from-white/95 to-indigo-50/95 border-indigo-200/50'
          }`}
        >
          {/* Subtle bubble glow effect inside */}
          <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full filter blur-2xl opacity-30 pointer-events-none bg-gradient-to-br ${typeAccents[type]}`} />
          <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full filter blur-2xl opacity-20 pointer-events-none bg-gradient-to-br ${typeAccents[type]}`} />

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === 'dark'
                  ? 'text-white/60 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Close modal"
            >
              <IoClose className="text-xl" />
            </button>
          )}

          {/* Icon */}
          {icon && (
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br ${typeAccents[type]} shadow-lg`}>
              <span className="text-3xl text-white">{icon}</span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h2
              id="modal-title"
              className={`text-xl md:text-2xl font-semibold tracking-tight text-center mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h2>
          )}

          {/* Body Content */}
          <div
            className={`text-sm leading-relaxed text-center ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-600'
            }`}
          >
            {children}
          </div>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className={`flex gap-3 mt-6 ${actions.length === 1 ? 'justify-center' : 'justify-end'}`}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'primary'}
                  className={`${actions.length === 1 ? 'min-w-[150px]' : ''} ${action.className || ''}`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Preset Modal Components for common use cases
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'warning',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      icon={type === 'warning' ? '⚠️' : type === 'error' ? '🚨' : '❓'}
      actions={[
        { label: cancelText, onClick: onClose, variant: 'outline' },
        { label: confirmText, onClick: onConfirm, variant: 'primary' },
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
}

export function SuccessModal({
  isOpen,
  onClose,
  title = 'Berhasil!',
  message = 'Operasi berhasil dilakukan.',
  buttonText = 'Tutup',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="success"
      icon="✅"
      actions={[{ label: buttonText, onClick: onClose, variant: 'primary' }]}
    >
      <p>{message}</p>
    </Modal>
  );
}

export function ErrorModal({
  isOpen,
  onClose,
  title = 'Terjadi Kesalahan',
  message = 'Maaf, terjadi kesalahan. Silakan coba lagi.',
  buttonText = 'Tutup',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="error"
      icon="❌"
      actions={[{ label: buttonText, onClick: onClose, variant: 'primary' }]}
    >
      <p>{message}</p>
    </Modal>
  );
}

export function InfoModal({
  isOpen,
  onClose,
  title = 'Informasi',
  message,
  buttonText = 'Mengerti',
  children,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="info"
      icon="ℹ️"
      actions={[{ label: buttonText, onClick: onClose, variant: 'primary' }]}
    >
      {children || <p>{message}</p>}
    </Modal>
  );
}
