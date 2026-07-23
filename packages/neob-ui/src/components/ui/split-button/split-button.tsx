import { CaretDownIcon } from '@phosphor-icons/react';
import { ButtonHTMLAttributes, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utilities';

export interface SplitButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
	readonly variant?: 'default' | 'accent' | 'danger';
	readonly size?: 'default' | 'sm' | 'lg';
	readonly menuContent: ReactNode;
}

export function SplitButton({
	children,
	variant = 'default',
	size = 'default',
	menuContent,
	className,
	onClick,
	disabled,
	...properties
}: SplitButtonProperties) {
	const containerReference = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const element = containerReference.current;

		if (!element) {
			return;
		}

		const updateWidth = () => {
			setWidth(element.offsetWidth);
		};

		updateWidth();

		const resizeObserver = new ResizeObserver(() => {
			updateWidth();
		});

		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div ref={containerReference} className={cn('flex items-stretch', className)}>
			<Button
				type="button"
				variant={variant}
				size={size}
				disabled={disabled}
				onClick={onClick}
				className="rounded-r-none focus:z-10"
				{...properties}
			>
				{children}
			</Button>
			<DropdownMenu modal={false}>
				<DropdownMenu.Trigger>
					<Button
						type="button"
						variant={variant}
						size={size}
						disabled={disabled}
						aria-label="more options"
						className={cn(
							'-ml-0.5 flex items-center justify-center rounded-l-none focus:z-10',
							size === 'sm' && 'px-1.5',
							size === 'default' && 'px-2.5',
							size === 'lg' && 'px-3.5',
						)}
					>
						<CaretDownIcon className={cn(size === 'sm' && 'size-3', size === 'default' && 'size-3.5', size === 'lg' && 'size-4')} />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" className="p-1" style={{ minWidth: width }}>
					{menuContent}
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	);
}

SplitButton.displayName = 'SplitButton';
