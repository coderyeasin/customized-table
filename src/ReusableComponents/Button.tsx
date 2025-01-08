import React, { ReactNode } from "react";

interface IButton {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({ children, className, disabled, onClick }: IButton) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 mx-2 bg-gray-300 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
