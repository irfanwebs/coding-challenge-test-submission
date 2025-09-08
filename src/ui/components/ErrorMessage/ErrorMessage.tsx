import React, { FunctionComponent } from 'react';

interface ErrorMessageProps {
	message?: string;
	className?: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
	message,
	className,
}) => {
	if (!message) return null;

	return (
		<div className={className} role="alert">
			{message}
		</div>
	);
};

export default ErrorMessage;
