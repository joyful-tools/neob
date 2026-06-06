import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { CheckIcon, MinusIcon } from '@phosphor-icons/react';
import { ComponentPropsWithoutRef, createContext, ReactNode, Ref, useContext, useId } from 'react';

import { cn } from '@/lib/utilities';

const CheckboxGroupContext = createContext<{ controlFirst?: boolean }>({ controlFirst: true });

const CHECKBOX_ROOT_CLASSES = `
	peer relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center
	rounded-xs border-2 border-black bg-white shadow-cel-sm transition-all
	duration-300 ease-spring
	outline-hidden neo-focus-ring isolate
	data-[checked]:bg-black data-[checked]:text-white
	data-[indeterminate]:bg-black data-[indeterminate]:text-white
	disabled:cursor-not-allowed disabled:opacity-50
	dark:bg-zinc dark:data-[checked]:bg-white
	dark:data-[checked]:text-black dark:data-[indeterminate]:bg-white
	dark:data-[indeterminate]:text-black
`;

export interface CheckboxProperties extends ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {
	readonly ref?: Ref<HTMLElement>;
	readonly label?: ReactNode;
	readonly description?: ReactNode;
	readonly controlFirst?: boolean;
	readonly error?: string;
}

export interface CheckboxItemProperties extends ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {
	readonly ref?: Ref<HTMLElement>;
	readonly label: ReactNode;
}

export interface CheckboxGroupProperties extends ComponentPropsWithoutRef<typeof BaseCheckboxGroup> {
	readonly legend?: ReactNode;
	readonly description?: ReactNode;
	readonly error?: string;
	readonly controlFirst?: boolean;
}

/**
 * Standard Checkbox component.
 * Can be used standalone or with a label and helper states.
 */
function CheckboxRoot({ label, description, controlFirst = true, error, className, ref, ...properties }: CheckboxProperties) {
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	const checkboxControl = (
		<BaseCheckbox.Root
			ref={ref}
			className={cn(CHECKBOX_ROOT_CLASSES, error && 'border-red dark:border-red', className)}
			aria-describedby={describedBy}
			aria-invalid={hasError ? true : undefined}
			{...properties}
		>
			<BaseCheckbox.Indicator
				className="flex items-center justify-center text-current data-indeterminate:[&>svg:first-child]:hidden data-unchecked:[&>svg:first-child]:hidden data-indeterminate:[&>svg:last-child]:block"
				keepMounted
			>
				<CheckIcon className="size-3.5 stroke-3" />
				<MinusIcon className="hidden size-3.5 stroke-3" />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);

	if (!label) {
		return checkboxControl;
	}

	return (
		<div className="flex flex-col gap-1.5">
			<label
				className={cn(
					'inline-flex items-start gap-3 select-none',
					properties.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
					!controlFirst && 'flex-row-reverse justify-end',
				)}
			>
				<span className="mt-0.5">{checkboxControl}</span>
				<div className="flex flex-col gap-0.5">
					<span className="text-base/tight font-bold text-black dark:text-white">{label}</span>
					{description && (
						<span id={descriptionId} className="text-xs/normal text-muted-foreground">
							{description}
						</span>
					)}
				</div>
			</label>
			{error && (
				<span id={errorId} className="pl-8 text-xs font-bold text-red-dark dark:text-red-light">
					{error}
				</span>
			)}
		</div>
	);
}
CheckboxRoot.displayName = 'Checkbox';

/**
 * CheckboxItem for use inside a CheckboxGroup.
 * Leverages the CheckboxGroup context to determine layouts.
 */
function CheckboxItem({ label, className, ref, ...properties }: CheckboxItemProperties) {
	const { controlFirst } = useContext(CheckboxGroupContext);

	return <CheckboxRoot ref={ref} label={label} controlFirst={controlFirst} className={className} {...properties} />;
}
CheckboxItem.displayName = 'Checkbox.Item';

/**
 * CheckboxGroup container.
 * Groups multiple CheckboxItems inside an accessible fieldset.
 */
function CheckboxGroup({ legend, description, error, controlFirst = true, className, children, ...properties }: CheckboxGroupProperties) {
	const descriptionId = useId();
	const errorId = useId();
	const hasDescription = Boolean(description);
	const hasError = Boolean(error);

	const describedBy = cn(hasDescription && descriptionId, hasError && errorId) || undefined;

	return (
		<CheckboxGroupContext.Provider value={{ controlFirst }}>
			<BaseCheckboxGroup {...properties} aria-describedby={describedBy} aria-invalid={hasError ? true : undefined}>
				<fieldset className={cn('m-0 flex flex-col gap-4 border-0 p-0', className)}>
					{legend && <legend className="font-display text-lg font-bold text-black dark:text-white">{legend}</legend>}
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
				</fieldset>
			</BaseCheckboxGroup>
		</CheckboxGroupContext.Provider>
	);
}
CheckboxGroup.displayName = 'Checkbox.Group';

export const Checkbox = Object.assign(CheckboxRoot, {
	Item: CheckboxItem,
	Group: CheckboxGroup,
});
