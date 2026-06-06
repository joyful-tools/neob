import { action } from 'storybook/actions';

import { Button } from '@/components/ui/button';

import { DropMenu, DropMenuItem } from './drop-menu';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * DropMenu renders an animated dropdown container with staggered children scale-in and scaleFly-out transitions.
 */
const meta = {
	title: 'Experiments/DropMenu',
	component: DropMenu,
	parameters: {
		layout: 'centered',
	},
	args: {
		trigger: () => <></>,
		children: null,
	},
} satisfies Meta<typeof DropMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const items = Array.from({ length: 6 });

		return (
			<div className="min-h-96 p-12">
				<DropMenu
					trigger={({ isOpen, setIsOpen, anchor }) => (
						<Button ref={anchor} onClick={() => setIsOpen(!isOpen)} variant="accent" size="lg" aria-expanded={isOpen}>
							Open Menu
						</Button>
					)}
				>
					{items.map((_, i) => (
						<DropMenuItem key={i} onClick={() => action(`item-click-${i}`)()}>
							Hello {i}
						</DropMenuItem>
					))}
				</DropMenu>
			</div>
		);
	},
};
