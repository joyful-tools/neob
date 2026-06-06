import { Radio } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Children, cloneElement, ComponentPropsWithoutRef, createContext, isValidElement, Ref, useContext, useMemo } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utilities';

interface InternalButtonGroupButtonProperties extends ButtonGroupButtonProperties {
	readonly _isFirst?: boolean;
	readonly _isLast?: boolean;
}

interface ButtonGroupContextProps {
	size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
}

const ButtonGroupContext = createContext<ButtonGroupContextProps>({});

export interface ButtonGroupProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly size?: ButtonGroupContextProps['size'];
}

/**
 * Root ButtonGroup component.
 * Flex container that provides radio-group keyboard navigation and accessibility semantics.
 */
function ButtonGroupRoot({ className, size, ref, children, ...properties }: ButtonGroupProps) {
	const contextValue = useMemo(() => ({ size }), [size]);

	const childrenArray = Children.toArray(children);
	const totalChildren = childrenArray.length;

	const modifiedChildren = Children.map(children, (child, index) => {
		if (isValidElement<InternalButtonGroupButtonProperties>(child)) {
			return cloneElement(child, {
				_isFirst: index === 0,
				_isLast: index === totalChildren - 1,
			});
		}
		return child;
	});

	return (
		<RadioGroupPrimitive ref={ref} className={cn('isolate inline-flex items-stretch', className)} {...properties}>
			<ButtonGroupContext.Provider value={contextValue}>{modifiedChildren}</ButtonGroupContext.Provider>
		</RadioGroupPrimitive>
	);
}
ButtonGroupRoot.displayName = 'ButtonGroup';

export interface ButtonGroupButtonProperties extends Omit<ComponentPropsWithoutRef<'button'>, 'value'> {
	readonly value: string;
	readonly ref?: Ref<HTMLButtonElement>;
	readonly size?: ButtonGroupContextProps['size'];
}

/**
 * ButtonGroup.Button component.
 * Individual option button within the group. Reuses `buttonVariants` styling.
 */
function ButtonGroupButton({ className, value, size, children, ref, ...properties }: InternalButtonGroupButtonProperties) {
	const context = useContext(ButtonGroupContext);
	const resolvedSize = size ?? context.size ?? 'default';

	const { _isFirst, _isLast, ...restProperties } = properties;

	let cornerClass = '';
	if (_isFirst && _isLast) {
		cornerClass = '';
	} else if (_isFirst) {
		cornerClass = 'rounded-r-none';
	} else if (_isLast) {
		cornerClass = 'rounded-l-none';
	} else {
		cornerClass = 'rounded-none';
	}

	const checkedClasses = {
		sm: 'translate-y-0.5 shadow-cel-inset-md after:translate-y-0 hover:translate-y-0.5 hover:shadow-cel-inset-md hover:after:translate-y-0',
		default:
			'translate-y-0.5 shadow-cel-inset-md after:translate-y-0 hover:translate-y-0.5 hover:shadow-cel-inset-md hover:after:translate-y-0',
		lg: 'translate-y-1 shadow-cel-inset-md after:translate-y-0 hover:translate-y-1 hover:shadow-cel-inset-md hover:after:translate-y-0',
		xl: 'translate-y-1 shadow-cel-inset-md after:translate-y-0 hover:translate-y-1 hover:shadow-cel-inset-md hover:after:translate-y-0',
		icon: 'translate-y-0.5 shadow-cel-inset-md after:translate-y-0 hover:translate-y-0.5 hover:shadow-cel-inset-md hover:after:translate-y-0',
	};
	const checkedClass = checkedClasses[resolvedSize] || checkedClasses.default;

	return (
		<Radio.Root
			ref={ref}
			value={value}
			nativeButton
			render={(radioProps, radioState) => {
				const checked = radioState.checked;

				const buttonProps = {
					id: radioProps.id,
					tabIndex: radioProps.tabIndex,
					role: radioProps.role,
					'aria-checked': radioProps['aria-checked'],
					'aria-disabled': radioProps['aria-disabled'],
					'aria-required': radioProps['aria-required'],
					onClick: radioProps.onClick,
					onKeyDown: radioProps.onKeyDown,
					onKeyUp: radioProps.onKeyUp,
					onFocus: radioProps.onFocus,
					onBlur: radioProps.onBlur,
					ref: radioProps.ref,
				};

				return (
					<button
						{...buttonProps}
						type="button"
						className={cn(
							buttonVariants({ variant: 'default', size: resolvedSize }),
							'relative ml-[-2px] shrink-0 first:ml-0 focus-visible:z-20',
							!checked && 'hover:z-20',
							cornerClass,
							checked && checkedClass,
							className,
						)}
						{...restProperties}
					>
						{children}
					</button>
				);
			}}
		/>
	);
}
ButtonGroupButton.displayName = 'ButtonGroup.Button';

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Button: ButtonGroupButton,
});
