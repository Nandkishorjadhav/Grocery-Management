import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = `modal-${size}`;

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-container">
        {/* Background overlay */}
        <div 
          className="modal-backdrop"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span className="modal-spacer" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className={`modal-content ${sizeClass} slide-up`}>
          {/* Header */}
          <div className="modal-header">
            <div className="modal-header-content">
              {title && (
                <h3 className="modal-title">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
