import { ButtonHTMLAttributes } from 'react';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	type?: ButtonType;
	variant?: ButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	children: React.ReactNode;
}
