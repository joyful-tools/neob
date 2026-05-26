import { Eye, EyeSlash } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Input, InputWrapper } from './input';

export interface SensitiveInputProperties extends React.ComponentProps<typeof Input> {
	readonly ref?: React.Ref<HTMLInputElement>;
}

/**
 * A secure input component (e.g. for passwords) with an integrated Phosphor toggle
 * button to show or hide the text. Supports optional Field wrapping.
 */
export function SensitiveInput({
	className,
	ref,
	label,
	description,
	error,
	required,
	labelTooltip,
	controlFirst,
	hideLabel,
	containerClassName,
	...properties
}: SensitiveInputProperties) {
	const [isVisible, setIsVisible] = React.useState(false);

	function toggleVisibility() {
		setIsVisible((prev) => !prev);
	}

	const rawControl = (
		<div className="relative w-full">
			<Input type={isVisible ? 'text' : 'password'} className={cn('pr-12', className)} ref={ref} {...properties} />
			<button
				type="button"
				className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-white dark:focus-visible:ring-white"
				onClick={toggleVisibility}
				disabled={properties.disabled}
			>
				{isVisible ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
				<span className="sr-only">{isVisible ? 'Hide value' : 'Show value'}</span>
			</button>
		</div>
	);

	if (label || description || error || labelTooltip) {
		return (
			<InputWrapper
				label={label}
				description={description}
				error={error}
				required={required}
				labelTooltip={labelTooltip}
				controlFirst={controlFirst}
				hideLabel={hideLabel}
				className={containerClassName}
			>
				{rawControl}
			</InputWrapper>
		);
	}

	return rawControl;
}
SensitiveInput.displayName = 'SensitiveInput';
