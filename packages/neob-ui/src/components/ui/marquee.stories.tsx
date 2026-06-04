import { expect, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Marquee } from './marquee';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Marquee is a fast, performant infinite scrolling marquee element.
 *
 * ### Usage
 * ```tsx
 * import { Marquee } from '@timowilhelm/neob';
 *
 * <Marquee speed={30}>
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 * </Marquee>
 * ```
 */
const meta = {
	title: 'Data Display/Marquee',
	component: Marquee,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const Item = ({ text }: { text: string }) => (
	<div className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-orange font-sans font-bold text-black">
		{text}
	</div>
);

export const Horizontal: Story = {
	render: () => (
		<div className="w-[500px] overflow-hidden rounded-2xl border border-black/10 bg-muted/10 p-4">
			<Marquee duration="10s">
				<Item text="BRUTAL" />
				<Item text="STARK" />
				<Item text="REACT 19" />
				<Item text="BASE UI" />
				<Item text="MOTION" />
			</Marquee>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const items = canvas.getAllByText('BRUTAL');
		await expect(items.length).toBeGreaterThan(1);

		const animator = items[0].parentElement;
		await expect(animator).toHaveClass('animate-marquee');
		await expect(animator).not.toHaveClass('animate-marquee-vertical');
	}),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-muted/10 p-4">
			<Marquee vertical duration="12s">
				<Item text="VERTICAL" />
				<Item text="SCROLL" />
				<Item text="EFFECT" />
			</Marquee>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const items = canvas.getAllByText('VERTICAL');
		await expect(items.length).toBeGreaterThan(1);

		const animator = items[0].parentElement;
		await expect(animator).toHaveClass('animate-marquee-vertical');
	}),
};

export const PauseOnHover: Story = {
	render: () => (
		<div className="w-[500px] overflow-hidden rounded-2xl border border-black/10 bg-muted/10 p-4">
			<Marquee pauseOnHover duration="8s">
				<Item text="PAUSE" />
				<Item text="ON" />
				<Item text="HOVER" />
			</Marquee>
		</div>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const items = canvas.getAllByText('PAUSE');
		const animator = items[0].parentElement;

		await expect(animator).toHaveClass('group-hover:[animation-play-state:paused]');
	}),
};
