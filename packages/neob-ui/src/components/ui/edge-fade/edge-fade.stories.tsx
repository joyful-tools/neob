import { useCallback, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { guardPlay } from '@/lib/storybook-interactions';

import { EdgeFade, useEdgeFade } from './index';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Utility/EdgeFade',
	component: EdgeFade,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof EdgeFade>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		'aria-label': 'Custom scroll container',
		role: 'region',
		className: 'h-48 w-80',
		children: (
			<div className="flex flex-col gap-4 p-4">
				{Array.from({ length: 12 }, (_, index) => (
					<p key={index}>Custom content {index + 1}</p>
				))}
			</div>
		),
	},
};

function ResizableContent() {
	const [height, setHeight] = useState(320);
	const [enabled, setEnabled] = useState(true);
	const viewportRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				<Button action={() => setHeight((value) => (value === 320 ? 80 : 320))}>Resize content</Button>
				<Button action={() => setEnabled((value) => !value)}>Toggle fade</Button>
				<Button action={() => viewportRef.current?.scrollTo({ top: 80 })}>Scroll via ref</Button>
			</div>
			<EdgeFade ref={viewportRef} enabled={enabled} role="region" aria-label="Resizable content" tabIndex={0} className="h-40 w-64">
				<div style={{ height }} className="bg-cyan p-4 text-black">
					Resize the content to update the fades.
				</div>
			</EdgeFade>
		</div>
	);
}
ResizableContent.displayName = 'ResizableContent';

export const ContentAndViewportChanges: Story = {
	render: () => <ResizableContent />,
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const viewport = canvas.getByRole('region', { name: 'Resizable content' });
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-bottom'));
		await userEvent.click(canvas.getByRole('button', { name: 'Scroll via ref' }));
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-top'));
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle fade' }));
		await waitFor(() => {
			expect(viewport).not.toHaveAttribute('data-edge-fade-top');
			expect(viewport).not.toHaveAttribute('data-edge-fade-bottom');
			expect(getComputedStyle(viewport).maskImage).toBe('none');
		});
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle fade' }));
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-top'));
		await userEvent.click(canvas.getByRole('button', { name: 'Resize content' }));
		await waitFor(() => {
			expect(viewport).not.toHaveAttribute('data-edge-fade-top');
			expect(viewport).not.toHaveAttribute('data-edge-fade-bottom');
		});
		await userEvent.click(canvas.getByRole('button', { name: 'Resize content' }));
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-bottom'));
		viewport.style.height = '400px';
		await waitFor(() => expect(viewport).not.toHaveAttribute('data-edge-fade-bottom'));
	}),
};

export const RightToLeft: Story = {
	render: () => (
		<EdgeFade axis="x" dir="rtl" role="region" aria-label="RTL content" className="w-64">
			<div className="w-200 bg-gold p-4 text-black">Right to left scrolling</div>
		</EdgeFade>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const viewport = within(canvasElement).getByRole('region', { name: 'RTL content' });
		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-edge-fade-left');
			expect(viewport).not.toHaveAttribute('data-edge-fade-right');
		});
		viewport.scrollLeft = -80;
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-right'));
		viewport.scrollLeft = -viewport.scrollWidth;
		await waitFor(() => expect(viewport).not.toHaveAttribute('data-edge-fade-left'));
	}),
};

export const BothAxes: Story = {
	render: () => (
		<EdgeFade axis="both" size={40} className="h-40 w-64" role="region" aria-label="Two dimensional content">
			<div className="h-120 w-200 bg-gold p-4 text-black">Scroll in either direction.</div>
		</EdgeFade>
	),
	play: guardPlay(async ({ canvasElement }) => {
		const viewport = within(canvasElement).getByRole('region', { name: 'Two dimensional content' });
		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-edge-fade-bottom');
			expect(viewport).toHaveAttribute('data-edge-fade-right');
			expect(viewport).not.toHaveAttribute('data-edge-fade-top');
			expect(viewport).not.toHaveAttribute('data-edge-fade-left');
		});
		expect(getComputedStyle(viewport).getPropertyValue('--edge-fade-size')).toBe('40px');
		expect(getComputedStyle(viewport).maskComposite).toContain('intersect');
		viewport.scrollTop = 80;
		viewport.scrollLeft = 80;
		await waitFor(() => {
			for (const edge of ['top', 'bottom', 'left', 'right']) {
				expect(viewport).toHaveAttribute(`data-edge-fade-${edge}`);
			}
		});
		viewport.scrollTop = viewport.scrollHeight;
		viewport.scrollLeft = viewport.scrollWidth;
		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-edge-fade-top');
			expect(viewport).toHaveAttribute('data-edge-fade-left');
			expect(viewport).not.toHaveAttribute('data-edge-fade-bottom');
			expect(viewport).not.toHaveAttribute('data-edge-fade-right');
		});
	}),
};

export const ExistingElement: Story = {
	render: () => {
		const viewportRef = useRef<HTMLElement>(null);
		const [scrolled, setScrolled] = useState(false);
		return (
			<div className="flex flex-col gap-4">
				<Button action={() => viewportRef.current?.scrollTo({ top: 80 })}>Scroll custom viewport</Button>
				<EdgeFade
					ref={viewportRef}
					render={<section className="h-40 w-64" onScroll={() => setScrolled(true)} />}
					role="region"
					aria-label="Existing viewport"
					size="2rem"
				>
					<div className="h-80 bg-cyan p-4 text-black">The section itself scrolls and fades.</div>
				</EdgeFade>
				<p>{scrolled ? 'Scroll event received' : 'Waiting for scroll'}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const viewport = canvas.getByRole('region', { name: 'Existing viewport' });
		expect(viewport.tagName).toBe('SECTION');
		expect(viewport.children).toHaveLength(1);
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-bottom'));
		await userEvent.click(canvas.getByRole('button', { name: 'Scroll custom viewport' }));
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-top'));
		await expect(canvas.getByText('Scroll event received')).toBeInTheDocument();
	}),
};

export const CustomViewportHook: Story = {
	render: () => {
		const [visible, setVisible] = useState(true);
		const [released, setReleased] = useState(false);
		const viewportRef = useCallback((node: HTMLDivElement | null) => {
			if (!node) return;
			return () => setReleased(true);
		}, []);
		const edgeFadeRef = useEdgeFade({ ref: viewportRef });
		return (
			<div className="flex flex-col gap-4">
				<Button action={() => setVisible(false)}>Remove viewport</Button>
				{visible && (
					<div ref={edgeFadeRef} className="h-40 w-64 edge-fade-y overflow-y-auto" tabIndex={0} role="region" aria-label="Hook viewport">
						<div className="h-80 bg-cyan p-4 text-black">Attach the hook to a viewport you already own.</div>
					</div>
				)}
				<p>{released ? 'Ref released' : 'Ref attached'}</p>
			</div>
		);
	},
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const viewport = canvas.getByRole('region', { name: 'Hook viewport' });
		await waitFor(() => expect(viewport).toHaveAttribute('data-edge-fade-bottom'));
		await userEvent.click(canvas.getByRole('button', { name: 'Remove viewport' }));
		await expect(canvas.queryByRole('region', { name: 'Hook viewport' })).not.toBeInTheDocument();
		await expect(canvas.getByText('Ref released')).toBeInTheDocument();
	}),
};
