import * as React from 'react';

import { InputGroup } from './input-group';
import { NumericSlider } from './numeric-slider';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/NumericSlider',
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
				<InputGroup>
					<InputGroup.Input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
					<InputGroup.Addon align="end">
						<NumericSlider onChange={(delta) => setValue((previous) => Math.round((previous + delta) * 100) / 100)} />
					</InputGroup.Addon>
				</InputGroup>
			</div>
		);
	},
};
