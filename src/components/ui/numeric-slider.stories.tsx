import * as React from 'react';

import { Input } from './input';
import { NumericSlider } from './numeric-slider';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/NumericSlider',
	component: NumericSlider,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onChange: () => {},
	},
} satisfies Meta<typeof NumericSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = React.useState(42);

		return (
			<div className="flex w-48 flex-col gap-2">
				<span className="text-sm font-bold text-black dark:text-white">Numeric Slider (Drag Icon)</span>
				<div className="relative flex w-full items-center">
					<Input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="pr-10" />
					<NumericSlider
						onChange={(delta) => setValue((previous) => Math.round((previous + delta) * 100) / 100)}
						className="absolute top-1 right-2.5 flex size-8 items-center justify-center"
					/>
				</div>
			</div>
		);
	},
};
