import { CaretDown } from '@phosphor-icons/react';
import * as React from 'react';

import { cn } from '@/lib/utilities';

import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';

export interface SplitButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	readonly variant?: 'default' | 'accent' | 'danger' | 'subtle';
	readonly size?: 'default' | 'sm' | 'lg';
	readonly menuContent: React.ReactNode;
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
	const containerReference = React.useRef<HTMLDivElement>(null);
	const [width, setWidth] = React.useState(0);

	React.useLayoutEffect(() => {
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
						className="ml-[-2px] flex items-center justify-center rounded-l-none px-2.5 focus:z-10"
					>
						<CaretDown className="size-4" />
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
