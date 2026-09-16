import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { guardPlay } from '@/lib/storybook-interactions';

import { Slider } from './slider';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Slider',
	component: Slider,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: 'inline-radio',
			options: ['continuous', 'ticks'],
		},
		orientation: {
			control: 'inline-radio',
			options: ['horizontal', 'vertical'],
		},
	},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Continuous: Story = {
	args: {
		label: 'Volume',
		'aria-label': 'Volume',
		defaultValue: 35,
		className: 'w-80',
		onInput: action('slider-value-change'),
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const slider = canvas.getByRole('slider', { name: 'Volume' });
		await expect(slider).toHaveValue('35');
		await userEvent.click(slider);
		await userEvent.keyboard('{ArrowRight}');
		await expect(slider).toHaveValue('36');
	}),
};

export const Ticks: Story = {
	args: {
		mode: 'ticks',
		label: 'Opacity',
		'aria-label': 'Opacity',
		defaultValue: 40,
		min: 0,
		max: 100,
		step: 10,
		largeStep: 20,
		className: 'w-80',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const slider = canvas.getByRole('slider', { name: 'Opacity' });
		await userEvent.click(slider);
		await userEvent.keyboard('{ArrowRight}');
		await expect(slider).toHaveValue('50');
	}),
};

export const Range: Story = {
	args: {
		mode: 'ticks',
		label: 'Price range',
		defaultValue: [20, 80],
		thumbLabels: ['Minimum price', 'Maximum price'],
		min: 0,
		max: 100,
		step: 10,
		className: 'w-80',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('slider', { name: 'Minimum price' })).toHaveValue('20');
		await expect(canvas.getByRole('slider', { name: 'Maximum price' })).toHaveValue('80');
	}),
};

export const Disabled: Story = {
	args: {
		label: 'Locked setting',
		'aria-label': 'Locked setting',
		defaultValue: 60,
		disabled: true,
		className: 'w-80',
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('slider', { name: 'Locked setting' })).toBeDisabled();
	}),
};
