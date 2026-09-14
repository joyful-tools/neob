import { useId, useRef, type ComponentProps, type MouseEvent, type ReactNode, type Ref } from 'react';

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
	/** Content rendered in a fixed row below the textarea, inside the control boundary. */
	readonly footer?: ReactNode;
}

function setTextareaRef(ref: Ref<HTMLTextAreaElement> | undefined, node: HTMLTextAreaElement | null): void {
	if (typeof ref === 'function') {
		ref(node);
		return;
	}
	if (ref) ref.current = node;
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
	footer,
	...properties
}: InputAreaProperties) {
	const autoResizeOptions: UseInputAreaAutoResizeOptions = typeof autoResize === 'object' ? autoResize : {};
	const autoResizeRef = useInputAreaAutoResize(autoResizeOptions);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const hasFooter = footer !== undefined && footer !== null;

	const generatedTextareaId = useId();
	const textareaId = properties.id ?? generatedTextareaId;
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);
	const isInvalid = hasError || properties['aria-invalid'] === true || properties['aria-invalid'] === 'true';

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;
	const setRef = (node: HTMLTextAreaElement | null) => {
		textareaRef.current = node;
		setTextareaRef(ref, node);
	};
	const focusTextarea = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target;
		if (!(target instanceof Element) || target.closest('button, a, input, select, [role="button"]')) return;
		textareaRef.current?.focus();
	};

	const textarea = (
		<textarea
			id={textareaId}
			required={required}
			className={cn(
				hasFooter
					? 'flex min-h-20 w-full resize-none border-0 bg-transparent px-4 py-2 text-base font-medium outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed dark:text-white'
					: 'neo-focus-ring-focus isolate flex min-h-20 w-full rounded-lg border-2 border-edge bg-white px-4 py-2 text-base font-medium shadow-cel-inset-md outline-hidden transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] duration-(--duration-control) ease-spring placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-disabled dark:bg-zinc-dark dark:text-white',
				autoResize && 'h-full min-h-0 resize-none',
				!hasFooter && isInvalid && 'border-red [--color-ring:var(--ring-invalid)] dark:border-red',
				className,
			)}
			ref={setRef}
			aria-describedby={describedBy}
			aria-invalid={isInvalid ? true : undefined}
			{...properties}
		/>
	);

	const textareaControl = autoResize ? (
		<div ref={autoResizeRef} className="relative flex min-h-20 w-full flex-col">
			{textarea}
		</div>
	) : (
		textarea
	);

	const control = hasFooter ? (
		<div
			className={cn(
				'neo-focus-ring-focus isolate w-full overflow-hidden rounded-lg border-2 border-edge bg-white shadow-cel-inset-md transition-[color,background-color,border-color,box-shadow] duration-(--duration-control) ease-spring dark:bg-zinc-dark',
				isInvalid && 'border-red [--color-ring:var(--ring-invalid)] dark:border-red',
				properties.disabled && 'cursor-not-allowed opacity-disabled',
			)}
			onClick={focusTextarea}
		>
			{textareaControl}
			<div data-slot="input-area-footer" className="flex min-h-10 items-center gap-3 px-4 pb-2">
				{footer}
			</div>
		</div>
	) : (
		textareaControl
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
