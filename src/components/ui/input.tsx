import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Info } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Tooltip, TooltipProvider } from './tooltip';

export interface InputWrapperProperties extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
	readonly label?: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: React.ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly children: React.ReactNode;
}

export interface FieldsetProperties extends React.ComponentPropsWithoutRef<typeof BaseFieldset.Root> {
	readonly legend?: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly error?: string;
	readonly children: React.ReactNode;
}

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

export function InputWrapper({
	label,
	description,
	error,
	required,
	labelTooltip,
	controlFirst = false,
	hideLabel = false,
	className,
	children,
	...properties
}: InputWrapperProperties) {
	const showOptional = required === false;

	return (
		<BaseField.Root className={cn('flex w-full flex-col gap-2', controlFirst && 'flex-col-reverse', className)} {...properties}>
			{!hideLabel && label && (
				<BaseField.Label className="m-0 flex items-center gap-1.5 p-0 text-sm font-bold text-black select-none dark:text-white">
					<span>
						{label}
						{showOptional && <span className="text-xs font-normal text-muted-foreground"> (optional)</span>}
					</span>
					{labelTooltip && (
						<TooltipProvider>
							<Tooltip content={labelTooltip} side="top">
								<button
									type="button"
									className="cursor-pointer text-muted-foreground transition-colors hover:text-black focus:outline-hidden dark:hover:text-white"
								>
									<Info className="size-4" />
									<span className="sr-only">Information</span>
								</button>
							</Tooltip>
						</TooltipProvider>
					)}
				</BaseField.Label>
			)}

			<div className="w-full">{children}</div>

			{error ? (
				<BaseField.Error className="text-xs/normal font-bold text-red dark:text-red" render={<span />}>
					{error}
				</BaseField.Error>
			) : (
				description && <BaseField.Description className="text-xs/normal text-muted-foreground">{description}</BaseField.Description>
			)}
		</BaseField.Root>
	);
}
InputWrapper.displayName = 'InputWrapper';

export function Fieldset({ legend, description, error, className, children, ...properties }: FieldsetProperties) {
	return (
		<BaseFieldset.Root className={cn('m-0 flex w-full flex-col gap-4 border-0 p-0', className)} {...properties}>
			{legend && (
				<BaseFieldset.Legend className="m-0 p-0 font-display text-lg font-bold text-black dark:text-white">{legend}</BaseFieldset.Legend>
			)}

			{description && <p className="-mt-2 text-xs text-muted-foreground">{description}</p>}

			<div className="flex flex-col gap-3">{children}</div>

			{error && <p className="text-xs font-bold text-red dark:text-red">{error}</p>}
		</BaseFieldset.Root>
	);
}
Fieldset.displayName = 'Fieldset';

export function Input({
	className,
	type = 'text',
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
				{rawInput}
			</InputWrapper>
		);
	}

	return rawInput;
}
Input.displayName = 'Input';

export type TextInputProperties = InputProperties;
export const TextInput = Input;
TextInput.displayName = 'TextInput';
