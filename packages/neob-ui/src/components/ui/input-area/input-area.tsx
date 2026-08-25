import { ComponentProps, ReactNode, Ref, useId } from 'react';

import { Input } from '@/components/ui/input';
import { useInputAreaAutoResize } from '@/hooks/use-input-area-auto-resize';
import { cn } from '@/lib/utilities';

import type { UseInputAreaAutoResizeOptions } from '@/hooks/use-input-area-auto-resize';

export interface InputAreaProperties extends Omit<ComponentProps<'textarea'>, 'required'> {
	readonly ref?: Ref<HTMLTextAreaElement>;
	/**
	 * Enable auto-resizing to fit content.
	 * Pass `true` for default behavior, or an options object
	 * with `maxRows` and/or `animate` for fine-grained control.
	 */
	readonly autoResize?: boolean | UseInputAreaAutoResizeOptions;
	readonly label?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly containerClassName?: string;
}

/**
 * InputArea (textarea) component with high-contrast styling.
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

	const generatedTextareaId = useId();
	const textareaId = properties.id ?? generatedTextareaId;
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);
	const isInvalid = hasError || properties['aria-invalid'] === true || properties['aria-invalid'] === 'true';

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const textarea = (
		<textarea
			id={textareaId}
			required={required}
			className={cn(
				`neo-focus-ring-focus isolate flex min-h-20 w-full rounded-lg border-2 border-edge bg-white px-4 py-2 text-base font-medium shadow-cel-inset-md outline-hidden transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] duration-(--duration-control) ease-spring placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-disabled dark:bg-zinc-dark dark:text-white`,
				autoResize && 'h-full min-h-0 resize-none',
				isInvalid && 'border-red [--color-ring:var(--ring-invalid)] dark:border-red',
				className,
			)}
			ref={ref}
			aria-describedby={describedBy}
			aria-invalid={isInvalid ? true : undefined}
			{...properties}
		/>
	);

	const control = autoResize ? (
		<div ref={autoResizeRef} className="relative flex min-h-20 w-full flex-col">
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
				controlId={textareaId}
				className={containerClassName}
			>
				{control}
			</Input.Wrapper>
		);
	}

	return control;
}
InputArea.displayName = 'InputArea';
