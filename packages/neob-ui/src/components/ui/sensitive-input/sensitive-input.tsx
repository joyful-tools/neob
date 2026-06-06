import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { ComponentProps, Ref, useState } from 'react';

import { Input } from '@/components/ui/input';
import { InputGroup } from '@/components/ui/input-group';
import { cn } from '@/lib/utilities';

export interface SensitiveInputProperties extends ComponentProps<typeof Input> {
	readonly ref?: Ref<HTMLInputElement>;
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
	const [isVisible, setIsVisible] = useState(false);
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
				{isVisible ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
				<span className="sr-only">{isVisible ? 'Hide value' : 'Show value'}</span>
			</InputGroup.Button>
		</InputGroup>
	);
}
SensitiveInput.displayName = 'SensitiveInput';
