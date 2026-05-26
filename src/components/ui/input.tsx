import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Field } from './field';

export interface InputProperties extends Omit<React.ComponentProps<'input'>, 'required'> {
	readonly ref?: React.Ref<HTMLInputElement>;
	readonly label?: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: React.ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly containerClassName?: string;
}

export function Input({
	className,
	type,
	ref,
	onBlur,
	label,
	description,
	error,
	required,
	labelTooltip,
	controlFirst,
	hideLabel,
	containerClassName,
	...properties
}: InputProperties) {
	const rawInput = (
		<input
			type={type}
			required={required}
			onBlur={(event) => {
				event.target.scrollLeft = 0;
				onBlur?.(event);
			}}
			className={cn(
				`flex h-10 w-full overflow-hidden rounded-lg border-2 border-black bg-white px-4 py-2 text-base font-medium text-ellipsis text-black shadow-brutal-inset ring-0 ring-transparent ring-offset-0 transition-all duration-300 ease-spring file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-ellipsis placeholder:text-muted-foreground focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc dark:text-white dark:focus:ring-white`,
				className,
			)}
			ref={ref}
			{...properties}
		/>
	);

	if (label || description || error || labelTooltip) {
		return (
			<Field
				label={label}
				description={description}
				error={error}
				required={required}
				labelTooltip={labelTooltip}
				controlFirst={controlFirst}
				hideLabel={hideLabel}
				className={containerClassName}
			>
				{rawInput}
			</Field>
		);
	}

	return rawInput;
}
Input.displayName = 'Input';
