import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Info } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Tooltip, TooltipProvider } from './tooltip';

// ============================================================================
// Types
// ============================================================================

export interface FieldProperties extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {
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

// ============================================================================
// Components
// ============================================================================

/**
 * Field component to wrap form inputs (Input, Textarea, Select).
 * Coordinates labels, validation errors, and descriptions.
 */
export function Field({
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
}: FieldProperties) {
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
Field.displayName = 'Field';

/**
 * Fieldset component to wrap groups of related controls (RadioGroup, CheckboxGroup).
 * Provides accessible grouping titles, descriptions, and error states.
 */
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
