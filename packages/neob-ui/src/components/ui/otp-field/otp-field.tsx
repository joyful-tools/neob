import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	ClipboardEvent,
	KeyboardEvent,
	PointerEvent,
	ReactNode,
	RefObject,
} from 'react';

import { cn } from '@/lib/utilities';

type ValidationMode = 'numeric' | 'alphanumeric';

interface OTPContextValue {
	readonly value: string[];
	readonly length: number;
	readonly disabled: boolean;
	readonly validationMode: ValidationMode;
	readonly name?: string;
	readonly activeInputIndex: number;
	readonly inputReferences: RefObject<(HTMLInputElement | null)[]>;
	readonly onFocus: (index: number) => void;
	readonly onBlur: () => void;
	readonly onPaste: (event: ClipboardEvent) => void;
	readonly onKeyDown: (index: number, event: KeyboardEvent) => void;
	readonly onChange: (index: number, char: string) => void;
	readonly registerInput: (index: number, element: HTMLInputElement | null) => void;
}

interface RootProperties {
	readonly children?: ReactNode;
	readonly length?: number;
	readonly name?: string;
	readonly defaultValue?: string;
	readonly value?: string;
	readonly onValueChange?: (value: string) => void;
	readonly onComplete?: (value: string) => void;
	readonly disabled?: boolean;
	readonly autoFocus?: boolean;
	readonly validationMode?: ValidationMode;
	readonly className?: string;
	readonly autoSubmit?: boolean;
}

interface InputProperties {
	readonly index: number;
	readonly className?: string;
}

const INPUT_CLASS_NAME = `
	aspect-square size-12 grow rounded-lg border-2 border-black bg-white
	dark:bg-zinc text-center font-mono text-xl font-bold uppercase text-black
	dark:text-white shadow-cel-inset transition-all duration-300 ease-spring
	neo-focus-ring-focus isolate outline-hidden
	placeholder:text-muted-foreground/50
	disabled:cursor-not-allowed disabled:opacity-50
	selection:bg-black selection:text-white
	dark:selection:bg-white dark:selection:text-black
`;

/** Validates a single character against the specified mode */
function validateChar(char: string, mode: ValidationMode): boolean {
	const pattern = mode === 'numeric' ? /^\d$/ : /^[\dA-Za-z]$/;
	return pattern.test(char);
}

/** Finds the index of the last non-empty character in a value array */
function findLastFilledIndex(valueArray: string[]): number {
	for (let index = valueArray.length - 1; index >= 0; index--) {
		if (valueArray[index] !== '') return index;
	}
	return -1;
}

/** Converts a value string to an array of characters, padded to the specified length */
function valueToArray(value: string, length: number): string[] {
	const characters = [...value].slice(0, length);
	while (characters.length < length) {
		characters.push('');
	}
	return characters;
}

/**
 * Manages controllable state that can be either controlled externally or uncontrolled internally.
 * Follows the React pattern for controlled/uncontrolled components.
 */
function useControllableState<T>({
	prop,
	defaultProp,
	onChange = () => {},
}: {
	prop?: T;
	defaultProp?: T;
	onChange?: (value: T) => void;
}): readonly [T | undefined, (value: T) => void] {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledValue;

	const setValue = useCallback(
		(nextValue: T) => {
			if (!isControlled) {
				setUncontrolledValue(nextValue);
			}
			onChange(nextValue);
		},
		[isControlled, onChange],
	);

	return [value, setValue] as const;
}

const OTPContext = createContext<OTPContextValue | undefined>(undefined);

function useOTPContext(): OTPContextValue {
	const context = useContext(OTPContext);
	if (!context) {
		throw new Error('OTP components must be used within OneTimePasswordField.Root');
	}
	return context;
}

/**
 * Root container for the OTP input field.
 * Manages state, validation, and focus coordination between individual inputs.
 */
function OTPFieldRoot({
	children,
	length = 6,
	name,
	defaultValue,
	value: valueProperty,
	onValueChange,
	onComplete,
	disabled = false,
	autoFocus = false,
	validationMode = 'alphanumeric',
	className,
	autoSubmit = false,
}: RootProperties) {
	const [value, setValue] = useControllableState({
		prop: valueProperty,
		defaultProp: defaultValue ?? '',
		onChange: onValueChange,
	});
	const [activeInputIndex, setActiveInputIndex] = useState(autoFocus ? 0 : -1);
	const [selectionTrigger, setSelectionTrigger] = useState(0);

	const inputReferences = useRef<(HTMLInputElement | null)[]>([]);
	const formReference = useRef<HTMLFormElement | null>(null);
	const pendingFocusIndex = useRef(-1);
	const previousValue = useRef(value ?? '');

	const valueArray = useMemo(() => valueToArray(value ?? '', length), [value, length]);

	const registerInput = useCallback((index: number, element: HTMLInputElement | null) => {
		inputReferences.current[index] = element;
	}, []);

	const updateValue = useCallback(
		(newValue: string) => {
			setValue(newValue);
			if (newValue.length === length) {
				onComplete?.(newValue);
			}
		},
		[length, setValue, onComplete],
	);

	const focusInput = useCallback(
		(index: number) => {
			const clampedIndex = Math.max(0, Math.min(index, length - 1));
			pendingFocusIndex.current = clampedIndex;
			setActiveInputIndex(clampedIndex);
			setSelectionTrigger((previous) => previous + 1);
		},
		[length],
	);

	const handleFocus = useCallback((index: number) => {
		setActiveInputIndex(index);
		setSelectionTrigger((previous) => previous + 1);
	}, []);

	const handleBlur = useCallback(() => {
		setActiveInputIndex(-1);
	}, []);

	const handleChange = useCallback(
		(index: number, char: string) => {
			// Extract single character (handle mobile keyboards that might send multiple)
			const targetChar = char.length > 1 ? char.slice(-1) : char;

			// Validate character (empty string means deletion)
			if (targetChar && !validateChar(targetChar, validationMode)) return;

			const newValueArray = [...valueArray];
			newValueArray[index] = targetChar ? (validationMode === 'alphanumeric' ? targetChar.toUpperCase() : targetChar) : '';

			updateValue(newValueArray.join(''));

			if (targetChar && index < length - 1) {
				focusInput(index + 1);
			}
		},
		[valueArray, length, validationMode, focusInput, updateValue],
	);

	const handleKeyDown = useCallback(
		(index: number, event: KeyboardEvent) => {
			const lastFilledIndex = findLastFilledIndex(valueArray);
			const boundary = Math.min(lastFilledIndex + 1, length - 1);

			switch (event.key) {
				case 'Backspace': {
					event.preventDefault();
					if (valueArray[index]) {
						handleChange(index, '');
						focusInput(index);
					} else if (index > 0) {
						focusInput(index - 1);
					}
					break;
				}
				case 'Delete': {
					event.preventDefault();
					if (valueArray[index]) {
						handleChange(index, '');
						focusInput(index);
					}
					break;
				}
				case 'ArrowLeft': {
					event.preventDefault();
					focusInput(index - 1);
					break;
				}
				case 'ArrowRight': {
					event.preventDefault();
					focusInput(Math.min(index + 1, boundary));
					break;
				}
				case 'Home': {
					event.preventDefault();
					focusInput(0);
					break;
				}
				case 'End': {
					event.preventDefault();
					focusInput(boundary);
					break;
				}
			}
		},
		[valueArray, length, handleChange, focusInput],
	);

	const handlePaste = useCallback(
		(event: ClipboardEvent) => {
			event.preventDefault();
			const pastedData = event.clipboardData.getData('text').trim();
			if (!pastedData) return;

			const validChars: string[] = [];
			for (const char of pastedData) {
				if (validateChar(char, validationMode) && validChars.length < length) {
					validChars.push(validationMode === 'alphanumeric' ? char.toUpperCase() : char);
				}
			}

			updateValue(validChars.join(''));
			focusInput(Math.min(validChars.length, length - 1));
		},
		[length, validationMode, updateValue, focusInput],
	);

	// Synchronize focus and selection after state updates
	useLayoutEffect(() => {
		if (pendingFocusIndex.current >= 0 && pendingFocusIndex.current < length) {
			const element = inputReferences.current[pendingFocusIndex.current];
			if (element) {
				element.focus();
				element.setSelectionRange(0, element.value.length);
			}
			pendingFocusIndex.current = -1;
		}
	}, [activeInputIndex, selectionTrigger, length]);

	useEffect(() => {
		const currentValue = value ?? '';
		if (currentValue !== previousValue.current) {
			previousValue.current = currentValue;

			if (autoSubmit && currentValue.length === length && formReference.current) {
				formReference.current.requestSubmit();
			}
		}
	}, [value, length, autoSubmit]);

	useEffect(() => {
		if (autoSubmit && inputReferences.current[0]) {
			formReference.current = inputReferences.current[0].closest('form');
		}
	}, [autoSubmit]);

	const contextValue = useMemo<OTPContextValue>(
		() => ({
			value: valueArray,
			length,
			disabled,
			validationMode,
			name,
			activeInputIndex,
			inputReferences,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onPaste: handlePaste,
			onKeyDown: handleKeyDown,
			onChange: handleChange,
			registerInput,
		}),
		[
			valueArray,
			length,
			disabled,
			validationMode,
			name,
			activeInputIndex,
			handleFocus,
			handleBlur,
			handlePaste,
			handleKeyDown,
			handleChange,
			registerInput,
		],
	);

	return (
		<OTPContext.Provider value={contextValue}>
			<div className={cn('flex items-center gap-2', className)} role="group">
				{children}
				<HiddenInput />
			</div>
		</OTPContext.Provider>
	);
}

/** Individual OTP input field. Must be used within a Root component. */
function OTPFieldInput({ index, className }: InputProperties) {
	const {
		value,
		length,
		disabled,
		validationMode,
		inputReferences,
		activeInputIndex,
		onFocus,
		onBlur,
		onPaste,
		onKeyDown,
		onChange,
		name,
		registerInput,
	} = useOTPContext();

	const char = value[index] ?? '';

	const handlePointerDown = useCallback(
		(event: PointerEvent<HTMLInputElement>) => {
			if (disabled) return;
			event.preventDefault();

			const lastFilledIndex = findLastFilledIndex(value);
			const firstEmptyIndex = lastFilledIndex + 1;
			const targetIndex = index > firstEmptyIndex ? Math.min(firstEmptyIndex, length - 1) : index;

			const targetInput = inputReferences.current[targetIndex];
			if (targetInput) {
				targetInput.focus();
				targetInput.setSelectionRange(0, targetInput.value.length);
			}
		},
		[disabled, value, index, length, inputReferences],
	);

	const isTabTarget = activeInputIndex === index || (activeInputIndex === -1 && index === 0);

	return (
		<input
			ref={(element) => registerInput(index, element)}
			className={cn(INPUT_CLASS_NAME, className)}
			type={validationMode === 'numeric' ? 'tel' : 'text'}
			inputMode={validationMode === 'numeric' ? 'numeric' : 'text'}
			pattern={validationMode === 'numeric' ? '[0-9]*' : undefined}
			maxLength={1}
			value={char}
			disabled={disabled}
			autoComplete={index === 0 ? 'one-time-code' : 'off'}
			tabIndex={isTabTarget ? 0 : -1}
			onFocus={() => onFocus(index)}
			onBlur={onBlur}
			onPaste={onPaste}
			onKeyDown={(event) => onKeyDown(index, event)}
			onChange={(event) => onChange(index, event.target.value)}
			onPointerDown={handlePointerDown}
			aria-label={name ? `${name} digit ${index + 1}` : `Digit ${index + 1} of ${length}`}
		/>
	);
}

/** Hidden input for native form submission. Rendered automatically by Root when name is provided. */
function HiddenInput() {
	const { value, name } = useOTPContext();
	if (!name) return;
	return <input type="hidden" name={name} value={value.join('')} />;
}

OTPFieldRoot.displayName = 'OTPField';
OTPFieldInput.displayName = 'OTPField.Input';

export const OTPField = Object.assign(OTPFieldRoot, {
	Input: OTPFieldInput,
});
