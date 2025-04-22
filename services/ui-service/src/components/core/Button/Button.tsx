// Button.tsx

import React from "react";
import { buttonBaseStyles, buttonColorStyles } from "./variants";

type ButtonColor = keyof typeof buttonColorStyles;

interface ButtonProps {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
  color?: ButtonColor;
  className?: string;
  hint?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  isDisabled = false,
  isActive = false,
  color = "purple",
  className = "",
  hint,
  ariaLabel,
}) => {
  const colorStyle = isDisabled
    ? buttonColorStyles[color].inactive
    : isActive
      ? buttonColorStyles[color].active
      : buttonColorStyles[color].inactive;

  return (
    <button
      className={`${buttonBaseStyles} ${colorStyle} ${className} transition-colors duration-200`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel || label}
      aria-disabled={isDisabled}
      title={hint}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
    </button>
  );
};