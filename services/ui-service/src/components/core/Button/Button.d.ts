import React from "react";
import { buttonColorStyles } from "./variants";
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
export declare const Button: React.FC<ButtonProps>;
export {};
