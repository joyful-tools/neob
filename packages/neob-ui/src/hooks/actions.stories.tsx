import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { useOptimisticAction } from '@/hooks/use-optimistic-action';
import { guardPlay } from '@/lib/storybook-interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

function delay(milliseconds: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function QueuedOptimisticHarness() {
	const [events, setEvents] = useState<string[]>([]);
	const { optimisticValue, runAction, isPending } = useOptimisticAction<string, []>({
		value: undefined,
		defaultValue: 'idle',
		action: async (nextValue) => {
			setEvents((currentEvents) => [...currentEvents, `start:${nextValue}`]);
			await delay(50);
			setEvents((currentEvents) => [...currentEvents, `end:${nextValue}`]);
		},
	});

	return (
		<div aria-busy={isPending || undefined}>
			<p>Value: {optimisticValue}</p>
			<p>Events: {events.join(',')}</p>
			<button type="button" onClick={() => runAction('first')}>
				First
			</button>
			<button type="button" onClick={() => runAction('second')}>
				Second
			</button>
		</div>
	);
}

const meta = {
	title: 'Internal/Actions',
	component: QueuedOptimisticHarness,
	parameters: { layout: 'centered' },
} satisfies Meta<typeof QueuedOptimisticHarness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrderedOptimisticSubmissions: Story = {
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'First' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Second' }));
		await expect(canvas.getByRole('button', { name: 'First' })).toBeEnabled();
		await expect(canvas.getByText('Value: second')).toBeInTheDocument();
		await waitFor(() => {
			expect(canvas.getByText('Events: start:first,end:first,start:second,end:second')).toBeInTheDocument();
		});
		await expect(canvas.getByText('Value: second')).toBeInTheDocument();
	}),
};
