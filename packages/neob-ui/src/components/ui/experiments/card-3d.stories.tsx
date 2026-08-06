import { ArrowUpRightIcon, CloudIcon, CubeIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

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
		<div className="flex h-full flex-col rounded-[inherit] border-4 border-black bg-coral p-6 text-black">
			<div className="flex items-center justify-between font-mono text-xs font-black tracking-widest">
				<span>Cloud study</span>
				<CloudIcon size={28} weight="fill" />
			</div>
			<div className="my-5 min-h-0 flex-1 overflow-hidden rounded-lg border-4 border-black bg-white/15 shadow-cel-inset-sm">
				<div className="flex size-full flex-col items-center justify-center gap-4">
					<CloudIcon size={112} weight="fill" />
					<span className="font-display text-2xl uppercase">Follow the light</span>
				</div>
			</div>
			<div className="flex items-center justify-between font-mono text-[10px] font-black uppercase">
				<span>Move to explore</span>
				<ArrowUpRightIcon size={20} weight="bold" />
			</div>
		</div>
	);
}

function HolographicCard() {
	return (
		<div className="relative flex h-full flex-col rounded-[inherit] border-4 border-black bg-zinc p-6 text-white">
			<div className="absolute inset-3 rounded-lg border border-white/20" />
			<div className="relative flex items-center justify-between font-mono text-xs font-black tracking-widest">
				<span>Prism</span>
				<CubeIcon size={28} weight="fill" />
			</div>
			<div className="relative my-5 min-h-0 flex-1 overflow-hidden rounded-lg border-4 border-white bg-white/5 shadow-cel-inset-sm">
				<div className="flex size-full flex-col items-center justify-center gap-4">
					<CubeIcon className="text-coral" size={112} weight="fill" />
					<span className="font-display text-4xl text-coral uppercase">N/3D</span>
				</div>
			</div>
			<div className="relative flex items-center justify-between font-mono text-[10px] font-black uppercase">
				<span>Move to reveal</span>
				<ArrowUpRightIcon size={20} weight="bold" />
			</div>
		</div>
	);
}

function OverlayCard() {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<button
			type="button"
			aria-label={showInfo ? 'Hide card details' : 'Show card details'}
			aria-pressed={showInfo}
			className="neo-focus-ring block size-full rounded-2xl text-left"
			onClick={() => setShowInfo((visible) => !visible)}
		>
			<Card3d
				className="h-full rounded-2xl"
				enableDeviceMotion
				enableTouch
				maxTilt={16}
				overlay={
					<AnimatePresence>
						{showInfo && (
							<div className="flex h-full items-center justify-center" style={{ transform: 'translate3d(0, 0, 60px)' }}>
								<motion.div
									className="flex size-3/5 flex-col items-center justify-center gap-4 rounded-lg border-2 border-edge bg-background/90 p-4 text-center text-foreground"
									initial={{ opacity: 0, scale: 1.2 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 1.2 }}
								>
									<div className="font-display text-xl uppercase">Cloud study</div>
									<div className="font-mono text-xs font-bold uppercase">A small cloud that shifts as you move.</div>
								</motion.div>
							</div>
						)}
					</AnimatePresence>
				}
			>
				<SpecimenCard />
			</Card3d>
		</button>
	);
}

export const SpringHover: Story = {
	render: () => (
		<div className="h-122.5 w-87.5">
			<OverlayCard />
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
							<span>Little world</span>
							<CubeIcon size={28} weight="fill" />
						</div>
						<div className="my-5 min-h-0 flex-1 overflow-hidden rounded-lg border-4 border-black bg-white/15 shadow-cel-inset-sm">
							<ThreeCardScene maxTilt={state.maxTilt} x={state.x} y={state.y} />
						</div>
						<div className="flex items-center justify-between font-mono text-[10px] font-black uppercase">
							<span>Move to look around</span>
							<ArrowUpRightIcon size={20} weight="bold" />
						</div>
					</div>
				)}
			</Card3d>
		</div>
	),
};
