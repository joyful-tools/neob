import { Card } from './card';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Card is a brutalist content container with optional headers, titles, and body content.
 *
 * ### Usage
 * ```tsx
 * import { Card } from '@timowilhelm/neob';
 *
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Card Title</Card.Title>
 *   </Card.Header>
 *   <Card.Content>Card Body Content</Card.Content>
 * </Card>
 * ```
 */
const meta = {
	title: 'Surfaces/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		className: 'w-96',
		children: (
			<>
				<Card.Header>
					<Card.Title>Neo-Brutalist Card</Card.Title>
				</Card.Header>
				<Card.Content>
					<p className="text-sm">
						This is a premium card built with a bold black border and a thick drop shadow that defines the neo-brutalism design system.
					</p>
				</Card.Content>
			</>
		),
	},
};
