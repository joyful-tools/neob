import { useState } from 'react';

import { RollingDigits } from './rolling-digits';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * RollingDigits animates number values with rolling odometer-style numbers.
 */
const meta = {
	title: 'Experiments/RollingDigits',
	component: RollingDigits,
	parameters: {
		layout: 'centered',
	},
	args: {
		value: 0,
	},
} satisfies Meta<typeof RollingDigits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState(1234);

		return (
			<div className="flex flex-col items-center gap-6 p-6">
				<div className="rounded-xl border-4 border-edge bg-white p-6 shadow-cel-md dark:bg-zinc">
					<RollingDigits value={value} separator={true} className="text-5xl font-black" />
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					<button
						type="button"
						onClick={() => setValue((v) => v - 100)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-white px-3 py-1.5 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-muted active:translate-y-0.5 active:shadow-none"
					>
						-100
					</button>
					<button
						type="button"
						onClick={() => setValue((v) => v - 1)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-white px-3 py-1.5 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-muted active:translate-y-0.5 active:shadow-none"
					>
						-1
					</button>
					<button
						type="button"
						onClick={() => setValue(0)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-red px-3 py-1.5 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-red-dark active:translate-y-0.5 active:shadow-none"
					>
						Reset
					</button>
					<button
						type="button"
						onClick={() => setValue((v) => v + 1)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-white px-3 py-1.5 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-muted active:translate-y-0.5 active:shadow-none"
					>
						+1
					</button>
					<button
						type="button"
						onClick={() => setValue((v) => v + 100)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-white px-3 py-1.5 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-muted active:translate-y-0.5 active:shadow-none"
					>
						+100
					</button>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setValue(99_999)}
						className="cursor-pointer rounded-lg border-2 border-edge bg-yellow px-4 py-2 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-yellow-dark active:translate-y-0.5 active:shadow-none"
					>
						Set to 99,999
					</button>
					<button
						type="button"
						onClick={() => setValue(-42.75)} // check decimals / negative value
						className="cursor-pointer rounded-lg border-2 border-edge bg-coral px-4 py-2 font-mono text-sm font-black text-black shadow-cel-sm hover:bg-coral-dark active:translate-y-0.5 active:shadow-none"
					>
						Set to -42.75
					</button>
				</div>
			</div>
		);
	},
};
