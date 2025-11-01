import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b space-x-3">
            {React.Children.map(footer as React.ReactNode, child => {
              if (React.isValidElement(child) && typeof child.type === 'string' && child.type === 'button') {
                const button = child as React.ReactElement<{ className?: string }>; // casteo
                const className = button.props.className || '';
                const isPrimary = className.includes('primary');
                const isSecondary = className.includes('secondary');
                let newClassName = className;
                if (isPrimary) {
                  newClassName = `${className} bg-[#006D77] text-white hover:bg-[#005B63]`.trim();
                } else if (isSecondary) {
                  newClassName = `${className} bg-white text-[#006D77] border border-[#006D77] hover:bg-[#006D77] hover:text-white`.trim();
                }
                return React.cloneElement(button, { className: newClassName });
              }
              return child;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;