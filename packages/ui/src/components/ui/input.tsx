import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Info } from '@phosphor-icons/react';
import { ComponentProps, ComponentPropsWithoutRef, ReactNode, Ref, useId } from 'react';

import { cn } from '@/lib/utilities';

import { Tooltip } from './tooltip';

export interface InputWrapperProperties extends ComponentPropsWithoutRef<typeof BaseField.Root> {
	readonly label?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly children: ReactNode;
	readonly descriptionId?: string;
	readonly errorId?: string;
}

export interface FieldsetProperties extends ComponentPropsWithoutRef<typeof BaseFieldset.Root> {
	readonly legend?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly children: ReactNode;
}

export interface InputProperties extends Omit<ComponentProps<'input'>, 'required'> {
	readonly ref?: Ref<HTMLInputElement>;
	readonly label?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly required?: boolean;
	readonly labelTooltip?: ReactNode;
	readonly controlFirst?: boolean;
	readonly hideLabel?: boolean;
	readonly containerClassName?: string;
}

function InputWrapper({
	label,
	description,
	error,
	required,
	labelTooltip,
	controlFirst = false,
	hideLabel = false,
	className,
	children,
	descriptionId,
	errorId,
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
						<Tooltip.Provider>
							<Tooltip content={labelTooltip} side="top">
								<button
									type="button"
									className="cursor-pointer text-muted-foreground transition-colors select-none hover:text-black focus:outline-hidden dark:hover:text-white"
								>
									<Info className="size-4" />
									<span className="sr-only">Information</span>
								</button>
							</Tooltip>
						</Tooltip.Provider>
					)}
				</BaseField.Label>
			)}

			<div className="w-full">{children}</div>

			{error ? (
				<BaseField.Error id={errorId} className="text-xs/normal font-bold text-red-dark dark:text-red-light" render={<span />}>
					{error}
				</BaseField.Error>
			) : (
				description && (
					<BaseField.Description id={descriptionId} className="text-xs/normal text-muted-foreground">
						{description}
					</BaseField.Description>
				)
			)}
		</BaseField.Root>
	);
}
InputWrapper.displayName = 'Input.Wrapper';

function Fieldset({ legend, description, error, className, children, ...properties }: FieldsetProperties) {
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	return (
		<BaseFieldset.Root
			className={cn('m-0 flex w-full flex-col gap-4 border-0 p-0', className)}
			aria-describedby={describedBy}
			aria-invalid={hasError ? true : undefined}
			{...properties}
		>
			{legend && (
				<BaseFieldset.Legend className="m-0 p-0 font-display text-lg font-bold text-black dark:text-white">{legend}</BaseFieldset.Legend>
			)}

			{description && (
				<p id={descriptionId} className="-mt-2 text-xs text-muted-foreground">
					{description}
				</p>
			)}

			<div className="flex flex-col gap-3">{children}</div>

			{error && (
				<p id={errorId} className="text-xs font-bold text-red-dark dark:text-red-light">
					{error}
				</p>
			)}
		</BaseFieldset.Root>
	);
}
Fieldset.displayName = 'Input.Fieldset';

function InputRoot({
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
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const rawInput = (
		<input
			type={type}
			required={required}
			onBlur={(event) => {
				event.target.scrollLeft = 0;
				onBlur?.(event);
			}}
			className={cn(
				`neo-focus-ring-focus isolate flex h-10 w-full overflow-hidden rounded-lg border-2 border-black bg-white px-4 py-2 text-base font-medium text-ellipsis text-black shadow-cel-inset-md outline-hidden transition-all duration-300 ease-spring file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-ellipsis placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-dark dark:text-white`,
				className,
			)}
			ref={ref}
			aria-describedby={describedBy}
			aria-invalid={hasError ? true : undefined}
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
				descriptionId={descriptionId}
				errorId={errorId}
				className={containerClassName}
			>
				{rawInput}
			</InputWrapper>
		);
	}

	return rawInput;
}
InputRoot.displayName = 'Input';

export type TextInputProperties = InputProperties;
const TextInput = InputRoot;

export const Input = Object.assign(InputRoot, {
	Wrapper: InputWrapper,
	Fieldset,
	Text: TextInput,
});
