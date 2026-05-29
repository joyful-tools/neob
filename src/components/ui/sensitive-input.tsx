import { Eye, EyeSlash } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Input } from './input';
import { InputGroup } from './input-group';

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
	type: _type,
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
	return (
		<InputGroup
			label={label}
			description={description}
			error={error}
			required={required}
			labelTooltip={labelTooltip}
			controlFirst={controlFirst}
			hideLabel={hideLabel}
			containerClassName={containerClassName}
			disabled={properties.disabled}
		>
			<InputGroup.Input
				type={isVisible ? 'text' : 'password'}
				className={cn('pr-2', className)}
				ref={ref}
				required={required}
				disabled={properties.disabled}
				{...properties}
			/>
			<InputGroup.Button
				onClick={() => {
					setIsVisible((prev) => !prev);
				}}
				disabled={properties.disabled}
				aria-label={isVisible ? 'Hide value' : 'Show value'}
				className="px-0"
			>
				{isVisible ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
				<span className="sr-only">{isVisible ? 'Hide value' : 'Show value'}</span>
			</InputGroup.Button>
		</InputGroup>
	);
}
SensitiveInput.displayName = 'SensitiveInput';
