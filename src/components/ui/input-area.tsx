import * as React from 'react';

import { useInputAreaAutoResize } from '@/hooks/use-input-area-auto-resize';
import { cn } from '@/lib/utilities';

import { Input } from './input';

import type { UseInputAreaAutoResizeOptions } from '@/hooks/use-input-area-auto-resize';

export interface InputAreaProperties extends Omit<React.ComponentProps<'textarea'>, 'required'> {
	readonly ref?: React.Ref<HTMLTextAreaElement>;
	/**
	 * Enable auto-resizing to fit content.
	 * Pass `true` for default behavior, or an options object
	 * with `maxRows` and/or `animate` for fine-grained control.
	 */
	readonly autoResize?: boolean | UseInputAreaAutoResizeOptions;
	readonly label?: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: React.ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly containerClassName?: string;
}

/**
 * InputArea (textarea) component styled with brutalist design principles.
 * Supports modern React 19 ref-as-prop pattern.
 * Supports auto-resizing via the `autoResize` prop.
 * Supports optional Field wrapping for labels, descriptions, and errors.
 */
export function InputArea({
	className,
	ref,
	autoResize,
	label,
	description,
	error,
	required,
	labelTooltip,
	controlFirst,
	hideLabel,
	containerClassName,
	...properties
}: InputAreaProperties) {
	const autoResizeOptions: UseInputAreaAutoResizeOptions = typeof autoResize === 'object' ? autoResize : {};

	const autoResizeRef = useInputAreaAutoResize(autoResizeOptions);

	const descriptionId = React.useId();
	const errorId = React.useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const textarea = (
		<textarea
			required={required}
			className={cn(
				`neo-focus-ring-focus isolate flex min-h-[80px] w-full rounded-lg border-2 border-black bg-white px-4 py-2 text-base font-medium shadow-cel-inset-md outline-hidden transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] duration-300 ease-spring placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc dark:text-white`,
				autoResize && 'h-full min-h-0 resize-none',
				className,
			)}
			ref={ref}
			aria-describedby={describedBy}
			aria-invalid={hasError ? true : undefined}
			{...properties}
		/>
	);

	const control = autoResize ? (
		<div ref={autoResizeRef} className="relative flex min-h-[80px] w-full flex-col">
			{textarea}
		</div>
	) : (
		textarea
	);

	if (label || description || error || labelTooltip) {
		return (
			<Input.Wrapper
				label={label}
				description={description}
				error={error}
				required={required}
				labelTooltip={labelTooltip}
				controlFirst={controlFirst}
				hideLabel={hideLabel}
				descriptionId={descriptionId}
				errorId={errorId}
				className={containerClassName}
			>
				{control}
			</Input.Wrapper>
		);
	}

	return control;
}
InputArea.displayName = 'InputArea';
