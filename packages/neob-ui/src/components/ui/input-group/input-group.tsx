import {
	ComponentProps,
	createContext,
	MouseEvent,
	ReactNode,
	Ref,
	RefObject,
	useCallback,
	useContext,
	useId,
	useMemo,
	useRef,
} from 'react';

import { Button as BaseButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utilities';

type InputGroupSize = 'sm' | 'default' | 'lg';

interface InputGroupContextValue {
	size: InputGroupSize;
	disabled?: boolean;
	error?: boolean;
	inputId: string;
	inputRef: RefObject<HTMLInputElement | null>;
	describedBy?: string;
	ariaInvalid?: boolean;
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

function useInputGroup() {
	const context = useContext(InputGroupContext);
	if (!context) {
		throw new Error('InputGroup compound components must be rendered within an InputGroup provider.');
	}
	return context;
}

export interface InputGroupRootProps extends Omit<ComponentProps<'div'>, 'error'> {
	size?: InputGroupSize;
	disabled?: boolean;
	error?: boolean | string;
	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
	labelTooltip?: ReactNode;
	controlFirst?: boolean;
	hideLabel?: boolean;
	containerClassName?: string;
}

export function InputGroup({
	children,
	className,
	size = 'default',
	disabled,
	error,
	label,
	description,
	required,
	labelTooltip,
	controlFirst,
	hideLabel,
	containerClassName,
	...properties
}: InputGroupRootProps) {
	const generatedId = useId();
	const inputId = properties.id ?? generatedId;
	const inputRef = useRef<HTMLInputElement | null>(null);

	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = !!error;
	const errorMessage = typeof error === 'string' ? error : undefined;

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const contextValue = useMemo(
		() => ({
			size,
			disabled,
			error: hasError,
			inputId,
			inputRef,
			describedBy,
			ariaInvalid: hasError,
		}),
		[size, disabled, hasError, inputId, describedBy],
	);

	const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target instanceof HTMLElement) {
			const target = event.target;
			const isInteractive = target.closest('button, a, input, select, textarea');
			if (!isInteractive && inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const rawControl = (
		<InputGroupContext.Provider value={contextValue}>
			<div
				onClick={handleContainerClick}
				className={cn(
					`neo-focus-ring-focus isolate flex w-full items-center overflow-hidden rounded-lg border-2 border-black bg-white font-medium shadow-cel-inset-sm outline-hidden transition-all duration-300 ease-spring dark:border-black dark:bg-zinc`,
					size === 'sm' && 'h-8 px-2 text-sm',
					size === 'default' && 'h-10 px-3.5 text-base',
					size === 'lg' && 'h-12 px-4.5 text-lg',
					hasError && 'border-red [--color-ring:var(--color-red)] dark:border-red',
					disabled && 'pointer-events-none cursor-not-allowed opacity-50 select-none',
					className,
				)}
				{...properties}
			>
				{children}
			</div>
		</InputGroupContext.Provider>
	);

	if (label || description || errorMessage || labelTooltip) {
		return (
			<Input.Wrapper
				label={label}
				description={description}
				error={errorMessage}
				required={required}
				labelTooltip={labelTooltip}
				controlFirst={controlFirst}
				hideLabel={hideLabel}
				descriptionId={descriptionId}
				errorId={errorId}
				controlId={inputId}
				className={containerClassName}
			>
				{rawControl}
			</Input.Wrapper>
		);
	}

	return rawControl;
}

export interface InputGroupInputProps extends Omit<ComponentProps<'input'>, 'size' | 'disabled'> {
	ref?: Ref<HTMLInputElement>;
}

function InputGroupInput({ className, type = 'text', ref, onBlur, ...properties }: InputGroupInputProps) {
	const { inputId, disabled, inputRef, describedBy, ariaInvalid } = useInputGroup();

	const handleRef = useCallback(
		(node: HTMLInputElement | null) => {
			Object.assign(inputRef, { current: node });

			if (typeof ref === 'function') {
				ref(node);
			} else if (ref) {
				Object.assign(ref, { current: node });
			}
		},
		[ref, inputRef],
	);

	return (
		<input
			id={inputId}
			type={type}
			data-neo-number-input={type === 'number' ? '' : undefined}
			disabled={disabled}
			ref={handleRef}
			aria-describedby={describedBy}
			aria-invalid={ariaInvalid ? true : undefined}
			onBlur={(event) => {
				event.target.scrollLeft = 0;
				onBlur?.(event);
			}}
			className={cn(
				`size-full flex-1 border-0 bg-transparent p-0 text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed`,
				className,
			)}
			{...properties}
		/>
	);
}

export interface InputGroupAddonProps extends ComponentProps<'div'> {
	align?: 'start' | 'end';
}

function InputGroupAddon({ children, className, align = 'start', ...properties }: InputGroupAddonProps) {
	const { size } = useInputGroup();

	return (
		<div
			className={cn(
				'flex shrink-0 items-center justify-center text-muted-foreground select-none',
				align === 'start' && (size === 'sm' ? 'mr-1.5' : size === 'default' ? 'mr-2' : 'mr-3'),
				align === 'end' && (size === 'sm' ? 'ml-1.5' : size === 'default' ? 'ml-2' : 'ml-3'),
				className,
			)}
			{...properties}
		>
			{children}
		</div>
	);
}

export interface InputGroupButtonProps extends ComponentProps<typeof BaseButton> {
	tooltip?: ReactNode;
}

function InputGroupButton({ children, className, tooltip, ...properties }: InputGroupButtonProps) {
	const { size, disabled } = useInputGroup();

	const buttonSize = size === 'sm' ? 'sm' : size === 'default' ? 'sm' : 'default';

	const button = (
		<BaseButton
			type="button"
			size={buttonSize}
			variant="ghost"
			disabled={disabled || properties.disabled}
			className={cn(
				`h-7 w-auto min-w-7 border px-1.5 text-black/60 [--focus-ring-inner-size:0] [--focus-ring-outer-size:2px] hover:text-black dark:text-white/60 dark:hover:text-white`,
				size === 'sm' && 'h-5 min-w-5 px-1 text-xs',
				size === 'lg' && 'h-9 min-w-9 px-2 text-base',
				className,
			)}
			{...properties}
		>
			{children}
		</BaseButton>
	);

	if (tooltip) {
		return (
			<Tooltip content={tooltip} side="top">
				{button}
			</Tooltip>
		);
	}

	return button;
}

export type InputGroupSuffixProps = ComponentProps<'span'>;

function InputGroupSuffix({ children, className, ...properties }: InputGroupSuffixProps) {
	const { size } = useInputGroup();

	return (
		<span
			className={cn(
				'ml-2 shrink-0 border-l-2 border-black/10 pl-2 font-semibold text-muted-foreground select-none',
				size === 'sm' && 'text-xs',
				size === 'lg' && 'text-lg',
				className,
			)}
			{...properties}
		>
			{children}
		</span>
	);
}

InputGroup.displayName = 'InputGroup';
InputGroupInput.displayName = 'InputGroup.Input';
InputGroupAddon.displayName = 'InputGroup.Addon';
InputGroupButton.displayName = 'InputGroup.Button';
InputGroupSuffix.displayName = 'InputGroup.Suffix';

InputGroup.Input = InputGroupInput;
InputGroup.Addon = InputGroupAddon;
InputGroup.Button = InputGroupButton;
InputGroup.Suffix = InputGroupSuffix;
