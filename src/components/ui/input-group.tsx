import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Button as BaseButton } from './button';
import { Field } from './field';
import { Tooltip } from './tooltip';

type InputGroupSize = 'sm' | 'default' | 'lg';

interface InputGroupContextValue {
	size: InputGroupSize;
	disabled?: boolean;
	error?: boolean;
	inputId: string;
	inputRef: React.RefObject<HTMLInputElement | null>;
}

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

function useInputGroup() {
	const context = React.useContext(InputGroupContext);
	if (!context) {
		throw new Error('InputGroup compound components must be rendered within an InputGroup provider.');
	}
	return context;
}

export interface InputGroupRootProps extends Omit<React.ComponentProps<'div'>, 'error'> {
	size?: InputGroupSize;
	disabled?: boolean;
	error?: boolean | string;
	label?: React.ReactNode;
	description?: React.ReactNode;
	required?: boolean;
	labelTooltip?: React.ReactNode;
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
	const generatedId = React.useId();
	const inputId = properties.id ?? generatedId;
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const hasError = !!error;
	const errorMessage = typeof error === 'string' ? error : undefined;

	const contextValue = React.useMemo(
		() => ({
			size,
			disabled,
			error: hasError,
			inputId,
			inputRef,
		}),
		[size, disabled, hasError, inputId],
	);

	const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
					`flex w-full items-center overflow-hidden rounded-lg border-2 border-black bg-white font-medium shadow-brutal-inset-sm transition-all duration-300 ease-spring focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 focus-within:outline-hidden dark:border-black dark:bg-zinc dark:focus-within:ring-white`,
					size === 'sm' && 'h-8 px-2 text-sm',
					size === 'default' && 'h-10 px-3.5 text-base',
					size === 'lg' && 'h-12 px-4.5 text-lg',
					hasError && 'border-red focus-within:ring-red dark:border-red dark:focus-within:ring-red',
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
			<Field
				label={label}
				description={description}
				error={errorMessage}
				required={required}
				labelTooltip={labelTooltip}
				controlFirst={controlFirst}
				hideLabel={hideLabel}
				className={containerClassName}
			>
				{rawControl}
			</Field>
		);
	}

	return rawControl;
}

export interface InputGroupInputProps extends Omit<React.ComponentProps<'input'>, 'size' | 'disabled'> {
	ref?: React.Ref<HTMLInputElement>;
}

function InputGroupInput({ className, type = 'text', ref, onBlur, ...properties }: InputGroupInputProps) {
	const { inputId, disabled, inputRef } = useInputGroup();

	const handleRef = React.useCallback(
		(node: HTMLInputElement | null) => {
			// Update local ref
			Object.assign(inputRef, { current: node });

			// Update forwarded ref
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
			disabled={disabled}
			ref={handleRef}
			onBlur={(event) => {
				event.target.scrollLeft = 0;
				onBlur?.(event);
			}}
			className={cn(
				`size-full flex-1 border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-hidden focus-visible:outline-hidden disabled:cursor-not-allowed`,
				className,
			)}
			{...properties}
		/>
	);
}

export interface InputGroupAddonProps extends React.ComponentProps<'div'> {
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

export interface InputGroupButtonProps extends React.ComponentProps<typeof BaseButton> {
	tooltip?: React.ReactNode;
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
				`h-7 w-auto min-w-7 cursor-pointer border-0 px-1.5 text-black/60 shadow-none hover:bg-zinc/10 hover:text-black dark:text-white/60 dark:hover:bg-zinc/80 dark:hover:text-white`,
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

export type InputGroupSuffixProps = React.ComponentProps<'span'>;

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

// Bind sub-components
InputGroup.Input = InputGroupInput;
InputGroup.Addon = InputGroupAddon;
InputGroup.Button = InputGroupButton;
InputGroup.Suffix = InputGroupSuffix;
