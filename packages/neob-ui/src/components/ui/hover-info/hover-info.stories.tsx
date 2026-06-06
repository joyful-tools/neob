import { WarningIcon } from '@phosphor-icons/react';

import { TextWave } from '@/components/ui/text-animations';

import { HoverInfo } from './hover-info';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * HoverInfo is an expandable information card designed to keep headers clean while providing rich details on hover/focus.
 */
const meta = {
	title: 'Component/HoverInfo',
	component: HoverInfo,
	parameters: {
		layout: 'centered',
	},
	args: {
		children: () => null,
	},
} satisfies Meta<typeof HoverInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-[50vw]">
			<HoverInfo height="2.25rem">
				{({ closed }) => (
					<div className="flex items-start bg-gold px-2.5 py-2 text-black select-none">
						<div className="flex h-5 shrink-0 items-center justify-center pr-2">
							<WarningIcon className="size-5" weight="bold" />
						</div>
						<div
							className="font-sans text-sm wrap-break-word"
							style={{
								display: closed ? '-webkit-box' : 'block',
								WebkitLineClamp: closed ? 1 : 'none',
								WebkitBoxOrient: closed ? 'vertical' : undefined,
								overflow: closed ? 'hidden' : 'visible',
							}}
						>
							We will be performing <TextWave text="scheduled maintenance" className="font-bold text-black" /> beginning on{' '}
							<time dateTime="2024-02-07T02:00:00.000Z" className="font-bold underline">
								Wednesday, 7 February, 03:00 (CET)
							</time>{' '}
							and we expect the service to be available again at approximately 04:00 (CET). During this time the service will be
							unavailable.
						</div>
					</div>
				)}
			</HoverInfo>
		</div>
	),
};
