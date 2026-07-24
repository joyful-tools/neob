import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

type RgbColor = {
	red: number;
	green: number;
	blue: number;
};

type ContrastTextStyle = CSSProperties & {
	'--contrast-red': number;
	'--contrast-green': number;
	'--contrast-blue': number;
};

function hexToRgb(hex: string): RgbColor {
	return {
		red: Number.parseInt(hex.slice(1, 3), 16),
		green: Number.parseInt(hex.slice(3, 5), 16),
		blue: Number.parseInt(hex.slice(5, 7), 16),
	};
}

function ContrastTextExperiment() {
	const [color, setColor] = useState('#aabbcc');
	const { red, green, blue } = hexToRgb(color);
	const style: ContrastTextStyle = {
		'--contrast-red': red,
		'--contrast-green': green,
		'--contrast-blue': blue,
		backgroundColor: color,
	};

	return (
		<div className="relative">
			<input
				id="contrast-text-color"
				type="color"
				value={color}
				onChange={(event) => setColor(event.currentTarget.value)}
				className="peer sr-only"
			/>
			<label
				htmlFor="contrast-text-color"
				className="neo-focus-ring inline-flex button-physical cursor-pointer rounded-lg border-2 border-edge px-4 py-2 font-bold contrast-text select-none"
				style={style}
			>
				Contrast Text
			</label>
		</div>
	);
}

ContrastTextExperiment.displayName = 'ContrastTextExperiment';

const meta = {
	title: 'Experiments/ContrastText',
	parameters: {
		layout: 'centered',
		chromatic: { disableSnapshot: true },
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <ContrastTextExperiment />,
};
