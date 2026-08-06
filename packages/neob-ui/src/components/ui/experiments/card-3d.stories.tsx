import { ArrowUpRightIcon, CloudIcon, CubeIcon } from '@phosphor-icons/react';

import { Card3d } from '../card';
import { ThreeCardScene } from './card-3d-three';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Experiments/Card3D',
	parameters: {
		layout: 'centered',
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SpecimenCard() {
	return (
		<div className="flex h-full flex-col justify-between rounded-[inherit] border-4 border-black bg-coral p-6 text-black">
			<div className="flex items-start justify-between font-mono text-xs font-black tracking-widest">
				<span>NEOB / 001</span>
				<CloudIcon size={30} weight="bold" />
			</div>
			<div>
				<div className="font-display text-4xl leading-[0.88] uppercase">Physical interface</div>
				<p className="mt-4 max-w-64 font-mono text-xs font-bold uppercase">Spring-driven perspective with local light response.</p>
			</div>
			<div className="flex items-end justify-between border-t-4 border-black pt-4 font-mono text-xs font-black">
				<span>MOVE TO INSPECT</span>
				<ArrowUpRightIcon size={24} weight="bold" />
			</div>
		</div>
	);
}

function HolographicCard() {
	return (
		<div className="relative flex h-full flex-col justify-between rounded-[inherit] border-4 border-black bg-zinc p-6 text-white">
			<div className="absolute inset-3 rounded-lg border border-white/20" />
			<div className="relative flex items-center justify-between font-mono text-xs font-black tracking-widest">
				<span>RARE / HOLO</span>
				<CubeIcon size={28} weight="fill" />
			</div>
			<div className="relative text-center">
				<div className="font-display text-5xl leading-none text-coral">N/3D</div>
				<div className="mt-3 font-mono text-xs font-black tracking-[0.28em]">IRIDESCENT OBJECT</div>
			</div>
			<div className="relative grid grid-cols-2 gap-3 border-t-2 border-white pt-4 font-mono text-[10px] font-bold uppercase">
				<span>Spring 0.002</span>
				<span className="text-right">Tilt 10°</span>
			</div>
		</div>
	);
}

export const SpringHover: Story = {
	render: () => (
		<div className="h-122.5 w-87.5">
			<Card3d className="h-full rounded-2xl" enableDeviceMotion enableTouch>
				<SpecimenCard />
			</Card3d>
		</div>
	),
};

export const ShinyHover: Story = {
	render: () => (
		<div className="h-122.5 w-87.5">
			<Card3d className="h-full rounded-2xl" enableDeviceMotion enableTouch shiny>
				<HolographicCard />
			</Card3d>
		</div>
	),
};

export const ThreeDimensional: Story = {
	render: () => (
		<div className="h-122.5 w-87.5">
			<Card3d className="h-full rounded-2xl" enableDeviceMotion enableTouch>
				{(state) => (
					<div className="flex h-full flex-col rounded-[inherit] border-4 border-black bg-coral p-6 text-black">
						<div className="flex items-center justify-between font-mono text-xs font-black tracking-widest">
							<span>NEOB / SCENE</span>
							<CubeIcon size={28} weight="fill" />
						</div>
						<div className="my-5 min-h-0 flex-1 overflow-hidden rounded-lg border-4 border-black bg-white/15 shadow-cel-inset-sm">
							<ThreeCardScene maxTilt={state.maxTilt} x={state.x} y={state.y} />
						</div>
						<div className="flex items-end justify-between font-mono text-[10px] font-black uppercase">
							<span>Perspective-correct viewport</span>
							<span>WebGL / 01</span>
						</div>
					</div>
				)}
			</Card3d>
		</div>
	),
};
